// Build pipeline: timings from audio -> capture HTML scenes -> encode -> overlay b-roll -> audio mix -> final mp4 + srt + script.md
// usage: node build.mjs [--draft] [--only id,id] [--out name] [--workers 3]
import { scenes, CH } from './lesson.mjs';
import { execFileSync, spawn, spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { createRequire } from 'node:module';
const require = createRequire(import.meta.url);
const { chromium } = require('playwright');

const SRC = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(SRC, '..');
const B = path.join(ROOT, 'build');
const AUD = path.join(B, 'audio'), SC = path.join(B, 'scenes'), CLIPS = path.join(B, 'media', 'clips');
for (const d of [AUD, SC]) fs.mkdirSync(d, { recursive: true });
const args = process.argv.slice(2);
const flag = (n) => args.includes('--' + n);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const DRAFT = flag('draft'), ONLY = opt('only', '') ? opt('only').split(',') : null, OUT = opt('out', 'lesson01'), WORKERS = +opt('workers', 3);
const FPS = 25, LEAD = 0.5, GAP = 0.4, TAIL = 0.7;
const ff = (a, o = {}) => execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', ...a], { stdio: ['ignore', 'pipe', 'inherit'], maxBuffer: 1 << 28, ...o });

export const disp = (s) => s.replace(/\{([^|}]*)\|([^}]*)\}/g, '$1');
export const say = (s) => s.replace(/\{([^|}]*)\|([^}]*)\}/g, '$2').replace(/\s+/g, ' ').trim();

function readWav(file) {
  const b = fs.readFileSync(file); let p = 12;
  while (p < b.length) { const id = b.toString('ascii', p, p + 4), n = b.readUInt32LE(p + 4); if (id === 'data') return new Int16Array(b.buffer.slice(b.byteOffset + p + 8, b.byteOffset + p + 8 + Math.min(n, b.length - p - 8) - (Math.min(n, b.length - p - 8) % 2))); p += 8 + n + (n % 2); }
  throw new Error('no data chunk ' + file);
}
function writeWav(file, pcm, sr = 24000) {
  const h = Buffer.alloc(44); h.write('RIFF', 0); h.writeUInt32LE(36 + pcm.length * 2, 4); h.write('WAVEfmt ', 8); h.writeUInt32LE(16, 16); h.writeUInt16LE(1, 20); h.writeUInt16LE(1, 22);
  h.writeUInt32LE(sr, 24); h.writeUInt32LE(sr * 2, 28); h.writeUInt16LE(2, 32); h.writeUInt16LE(16, 34); h.write('data', 36); h.writeUInt32LE(pcm.length * 2, 40);
  fs.writeFileSync(file, Buffer.concat([h, Buffer.from(pcm.buffer, pcm.byteOffset, pcm.length * 2)]));
}

function splitSubs(text) {
  const MAX = 74;
  let parts = text.split(/(?<=[.?!:])\s+/).flatMap(s => {
    if (s.length <= MAX) return [s];
    const cs = s.split(/(?<=,)\s+/), out = []; let cur = '';
    for (const c of cs) { if (cur && (cur + ' ' + c).length > MAX) { out.push(cur); cur = c; } else cur = cur ? cur + ' ' + c : c; }
    if (cur) out.push(cur); return out;
  });
  const out = [];
  for (const p of parts) { if (out.length && (out[out.length - 1] + ' ' + p).length <= 46) out[out.length - 1] += ' ' + p; else out.push(p); }
  return out;
}

// offsets in lesson.mjs ("k+sec") are authored for an assumed pace of 13.5 chars/s and scaled to the real audio
const est = (seg) => say(seg).replace(/[\u0591-\u05C7]/g, '').length / 13.5;
// ---------- timings ----------
function plan() {
  let g = 0; const P = [];
  for (const s of scenes) {
    let t = LEAD; const T = [], subs = [], aud = [], K = [];
    s.segs.forEach((seg, k) => {
      T.push(t);
      if (typeof seg === 'object') { aud.push({ silence: seg.silence, at: t, tick: /data-count/.test(s.html) }); K.push(1); t += seg.silence + GAP; return; }
      const f = path.join(AUD, `${s.id}_${k}.wav`); let d;
      if (fs.existsSync(f)) d = readWav(f).length / 24000;
      else if (DRAFT) d = est(seg);
      else throw new Error('missing audio ' + f);
      aud.push({ file: fs.existsSync(f) ? f : null, at: t, d }); K.push(d / est(seg));
      const chunks = splitSubs(disp(seg)), tot = chunks.reduce((a, c) => a + c.length, 0); let a = t;
      for (const c of chunks) { const dd = d * c.length / tot; subs.push({ a, b: a + dd, text: c }); a += dd; }
      t += d + GAP;
    });
    const dur = Math.ceil((t - GAP + TAIL) * FPS) / FPS;
    P.push({ ...s, T, K, subs, aud, dur, start: g, frames: Math.round(dur * FPS) }); g += dur;
  }
  for (const p of P) { p.total = g; p.progress = p.start / g; p.chapLabel = p.ch ? `<b>פרק ${p.ch}</b> · ${CH[p.ch]}` : ''; }
  return P;
}

// ---------- capture ----------
async function capture(P) {
  const browser = await chromium.launch();
  const queue = [...P]; const warn = [];
  async function worker() {
    const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
    page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
    await page.goto(pathToFileURL(path.join(SRC, 'player.html')).href);
    for (let s; (s = queue.shift());) {
      const info = await page.evaluate((sc) => window.setScene(sc), { id: s.id, html: s.html, T: s.T, K: s.K, subs: s.subs, dur: s.dur, progress: s.progress, chapLabel: s.chapLabel, bare: !!s.bare });
      if (info.over.length) warn.push(`${s.id}: overflow ${info.over.join(' ')}`);
      const wins = await page.evaluate(() => window.windows());
      const need = new Uint8Array(s.frames); need[0] = 1;
      for (const [a, b] of wins) for (let f = Math.max(0, Math.floor(a * FPS)); f <= Math.min(s.frames - 1, Math.ceil(b * FPS) + 1); f++) need[f] = 1;
      const raw = path.join(SC, s.id + (s.vids ? '.raw.mp4' : '.mp4'));
      const enc = spawn('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', String(FPS), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '17', '-pix_fmt', 'yuv420p', '-g', '50', '-r', String(FPS), raw], { stdio: ['pipe', 'inherit', 'inherit'] });
      const done = new Promise((res, rej) => enc.on('close', c => c ? rej(new Error('ffmpeg ' + c)) : res()));
      let buf = null, n = 0;
      for (let f = 0; f < s.frames; f++) {
        if (need[f]) { await page.evaluate((t) => window.renderAt(t), f / FPS); buf = await page.screenshot({ type: 'jpeg', quality: 96 }); n++; }
        if (!enc.stdin.write(buf)) await new Promise(r => enc.stdin.once('drain', r));
      }
      enc.stdin.end(); await done;
      if (s.vids) overlay(s, info.rects, raw);
      console.log(`scene ${s.id} ${s.dur.toFixed(2)}s shots=${n}/${s.frames}`);
    }
    await page.close();
  }
  await Promise.all(Array.from({ length: WORKERS }, worker));
  await browser.close();
  if (warn.length) console.log('WARNINGS:\n' + warn.join('\n'));
}
function overlay(s, rects, raw) {
  const inputs = ['-i', raw], f = []; let last = '0:v';
  rects.forEach((r, i) => {
    inputs.push('-i', path.join(CLIPS, r.id + '.mp4')); const a = (r.a + 0.5).toFixed(3);
    f.push(`[${i + 1}:v]scale=${r.w}:${r.h}:force_original_aspect_ratio=increase,crop=${r.w}:${r.h},fps=${FPS},tpad=stop_mode=clone:stop_duration=300,setpts=PTS+${a}/TB[v${i}]`);
    f.push(`[${last}][v${i}]overlay=${r.x}:${r.y}:enable='gte(t,${a})':eof_action=pass[o${i}]`); last = `o${i}`;
  });
  ff([...inputs, '-filter_complex', f.join(';'), '-map', `[${last}]`, '-t', s.dur.toFixed(3), '-c:v', 'libx264', '-preset', 'veryfast', '-crf', '19', '-pix_fmt', 'yuv420p', '-g', '50', '-r', String(FPS), path.join(SC, s.id + '.mp4')]);
  fs.unlinkSync(raw);
}

// ---------- audio ----------
function mixAudio(P, file) {
  const SR = 24000, total = P.reduce((a, p) => a + p.dur, 0), out = new Int16Array(Math.round(total * SR));
  let off = 0;
  for (const p of P) {
    for (const a of p.aud) {
      const at = Math.round((off + a.at) * SR);
      if (a.file) { const pcm = readWav(a.file); out.set(pcm.subarray(0, Math.max(0, Math.min(pcm.length, out.length - at))), at); }
      else if (a.tick) for (let k = 0; k <= a.silence; k++) {
        const last = k === a.silence, n = Math.round((last ? 0.35 : 0.06) * SR), hz = last ? 1320 : 880;
        for (let i = 0; i < n && at + k * SR + i < out.length; i++) out[at + k * SR + i] = Math.round(Math.sin(2 * Math.PI * hz * i / SR) * 2600 * Math.min(1, i / 100, (n - i) / (n * 0.6)));
      }
    }
    off += p.dur;
  }
  writeWav(file, out);
}
const ts = (t) => { const ms = Math.round(t * 1000); const p = (n, l = 2) => String(n).padStart(l, '0'); return `${p(Math.floor(ms / 3600000))}:${p(Math.floor(ms / 60000) % 60)}:${p(Math.floor(ms / 1000) % 60)},${p(ms % 1000, 3)}`; };

// ---------- main ----------
if (process.argv[1] === fileURLToPath(import.meta.url)) {
  for (const f of fs.existsSync(CLIPS) ? fs.readdirSync(CLIPS).filter(f => f.endsWith('.mp4')) : []) {
    const j = path.join(CLIPS, f.replace('.mp4', '_first.jpg'));
    if (!fs.existsSync(j)) try { ff(['-i', path.join(CLIPS, f), '-frames:v', '1', '-q:v', '2', j]); } catch { console.log('clip not ready:', f); }
  }
  const all = plan(); const P = ONLY ? all.filter(p => ONLY.includes(p.id) || ONLY.includes('c' + p.ch)) : all;
  const total = P.reduce((a, p) => a + p.dur, 0);
  console.log(`scenes=${P.length} total=${(total / 60).toFixed(2)} min (full lesson ${(all[0].total / 60).toFixed(2)} min)`);
  if (flag('plan')) process.exit(0);
  if (!flag('nocapture')) await capture(P);
  const wav = path.join(B, OUT + '.narration.wav'); mixAudio(P, wav);
  const list = path.join(B, OUT + '.concat.txt'); fs.writeFileSync(list, P.map(p => `file '${path.join(SC, p.id + '.mp4')}'`).join('\n'));
  let af = 'anull';
  // two-pass loudnorm (measure via stderr)
  try {
    const r = spawnSyncErr(['-hide_banner', '-i', wav, '-af', 'loudnorm=I=-16:TP=-1.5:LRA=11:print_format=json', '-f', 'null', '-']);
    const j = JSON.parse(r.slice(r.lastIndexOf('{')));
    if (isFinite(+j.input_i)) af = `loudnorm=I=-16:TP=-1.5:LRA=11:measured_I=${j.input_i}:measured_TP=${j.input_tp}:measured_LRA=${j.input_lra}:measured_thresh=${j.input_thresh}:offset=${j.target_offset}:linear=true`;
    console.log('loudness in:', j.input_i, 'LUFS');
  } catch (e) { console.log('loudnorm measure skipped:', e.message); }
  const mp4 = path.join(ONLY || DRAFT ? B : ROOT, OUT + '.mp4');
  ff(['-f', 'concat', '-safe', '0', '-i', list, '-i', wav, '-map', '0:v', '-map', '1:a', '-c:v', 'copy', '-af', af, '-ar', '48000', '-c:a', 'aac', '-b:a', '160k', '-t', total.toFixed(3), '-movflags', '+faststart', mp4]);
  let off = 0, n = 1, srt = '';
  for (const p of P) { for (const s of p.subs) srt += `${n++}\n${ts(off + s.a)} --> ${ts(off + s.b)}\n${s.text}\n\n`; off += p.dur; }
  fs.writeFileSync(mp4.replace(/\.mp4$/, '.srt'), srt);
  fs.writeFileSync(path.join(B, OUT + '.plan.json'), JSON.stringify(P.map((p, i) => ({ id: p.id, ch: p.ch, start: +P.slice(0, i).reduce((a, q) => a + q.dur, 0).toFixed(2), dur: p.dur })), null, 1));
  console.log('wrote', mp4);
}
function spawnSyncErr(a) { return spawnSync('ffmpeg', a, { encoding: 'utf8', maxBuffer: 1 << 26 }).stderr || ''; }
export { plan, scenes };
