// Narration via Gemini TTS (Interactions API). Key is read from env GEMINI_API_KEY only; never written anywhere.
// usage: node tts.mjs [--only id,id] [--force] [--check] [--voice Name] [--model m]
import { scenes } from './lesson.mjs';
import { execFileSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SRC = path.dirname(fileURLToPath(import.meta.url));
const AUD = path.resolve(SRC, '..', 'build', 'audio'); fs.mkdirSync(AUD, { recursive: true });
const args = process.argv.slice(2);
const flag = (n) => args.includes('--' + n);
const opt = (n, d) => { const i = args.indexOf('--' + n); return i >= 0 ? args[i + 1] : d; };
const KEY = process.env.GEMINI_API_KEY;
if (!KEY) { console.error('GEMINI_API_KEY is missing'); process.exit(2); }
const MODEL = opt('model', 'gemini-3.8-flash-tts'), VOICE = opt('voice', 'Charon'), CHECK_MODEL = opt('check-model', 'gemini-3.5-flash');
const STYLE = 'Calm, clear and steady educational narration in Hebrew for a young adult. Direct and matter-of-fact, no hype. Moderate pace with clean articulation; read numbers carefully.';
const ONLY = opt('only', '') ? opt('only').split(',') : null;
const say = (s) => s.replace(/\{([^|}]*)\|([^}]*)\}/g, '$2').replace(/\s+/g, ' ').trim();
const H = { 'x-goog-api-key': KEY, 'Content-Type': 'application/json' };

async function post(url, body, tries = 5) {
  for (let i = 0; ; i++) {
    try {
      const r = await fetch(url, { method: 'POST', headers: H, body: JSON.stringify(body) });
      const t = await r.text();
      if (!r.ok) throw new Error(`HTTP ${r.status}: ${t.slice(0, 400)}`);
      return JSON.parse(t);
    } catch (e) { if (i >= tries - 1) throw e; console.error('retry:', String(e.message).slice(0, 160)); await new Promise(r => setTimeout(r, 4000 * (i + 1))); }
  }
}
async function synth(text, out) {
  const j = await post('https://generativelanguage.googleapis.com/v1beta/interactions', {
    model: MODEL,
    input: [{ type: 'user_input', content: [{ type: 'text', text, annotations: [{ type: 'speech_metadata', style: STYLE }] }] }],
    response_format: { type: 'audio' },
    generation_config: { speech_config: [{ voice: VOICE }] },
  });
  const auds = (j.steps || []).filter(s => s.type === 'model_output').flatMap(s => s.content || []).filter(c => c.type === 'audio');
  if (!auds.length) throw new Error('no audio in response: ' + JSON.stringify(j).slice(0, 300));
  const raw = out + '.raw.wav'; fs.writeFileSync(raw, Buffer.from(auds[auds.length - 1].data, 'base64'));
  // trim leading/trailing silence, keep 24 kHz mono s16
  const trim = 'silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.05,areverse,silenceremove=start_periods=1:start_threshold=-45dB:start_silence=0.08,areverse';
  execFileSync('ffmpeg', ['-hide_banner', '-loglevel', 'error', '-y', '-i', raw, '-af', trim, '-ar', '24000', '-ac', '1', '-c:a', 'pcm_s16le', out]);
  fs.unlinkSync(raw);
}
const strip = (s) => s.replace(/[֑-ׇ]/g, '').replace(/[^א-תa-zA-Z0-9 ]/g, ' ').replace(/\s+/g, ' ').trim();
function sim(a, b) { // word-level LCS ratio
  const A = strip(a).split(' '), Bw = strip(b).split(' '); const dp = Array.from({ length: A.length + 1 }, () => new Uint16Array(Bw.length + 1));
  for (let i = 1; i <= A.length; i++) for (let j = 1; j <= Bw.length; j++) dp[i][j] = A[i - 1] === Bw[j - 1] ? dp[i - 1][j - 1] + 1 : Math.max(dp[i - 1][j], dp[i][j - 1]);
  return 2 * dp[A.length][Bw.length] / (A.length + Bw.length);
}
async function transcribe(file) {
  const j = await post(`https://generativelanguage.googleapis.com/v1beta/models/${CHECK_MODEL}:generateContent`, {
    contents: [{ parts: [{ text: 'Transcribe this Hebrew audio verbatim. Write numbers as Hebrew words exactly as spoken. Output only the transcript, no niqqud.' }, { inline_data: { mime_type: 'audio/wav', data: fs.readFileSync(file).toString('base64') } }] }],
  });
  return (j.candidates?.[0]?.content?.parts || []).map(p => p.text || '').join('').trim();
}

const jobs = [];
for (const s of scenes) s.segs.forEach((seg, k) => { if (typeof seg === 'string' && (!ONLY || ONLY.includes(s.id) || ONLY.includes(`${s.id}_${k}`) || ONLY.includes('c' + s.ch))) jobs.push({ id: `${s.id}_${k}`, text: say(seg) }); });
const metaF = path.join(AUD, 'meta.json'); const meta = fs.existsSync(metaF) ? JSON.parse(fs.readFileSync(metaF, 'utf8')) : {};
let i = 0, made = 0; const report = [];
async function worker() {
  for (let j; (j = jobs[i++]);) {
    const out = path.join(AUD, j.id + '.wav');
    if (!flag('check')) {
      if (fs.existsSync(out) && meta[j.id]?.text === j.text && !flag('force')) continue;
      await synth(j.text, out); meta[j.id] = { text: j.text, voice: VOICE, model: MODEL }; made++;
      fs.writeFileSync(metaF, JSON.stringify(meta, null, 1)); console.log('tts', j.id);
    } else {
      const t = await transcribe(out), r = sim(j.text, t); report.push({ id: j.id, score: +r.toFixed(3), expected: strip(j.text), heard: t });
      console.log(r.toFixed(2), j.id);
    }
  }
}
await Promise.all(Array.from({ length: +opt('workers', 3) }, worker));
if (flag('check')) { report.sort((a, b) => a.score - b.score); fs.writeFileSync(path.join(AUD, 'check.json'), JSON.stringify(report, null, 1)); console.log('lowest:', report.slice(0, 8).map(r => `${r.id}=${r.score}`).join(' ')); }
else console.log(`done, generated ${made} of ${jobs.length}`);
