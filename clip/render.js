// Renders clip/index.html to an MP4 (video only). Add the song afterwards:
//   ffmpeg -i video.mp4 -i song.mp3 -c:v copy -c:a aac -b:a 192k -shortest out.mp4
// Usage: node clip/render.js [out.mp4] [fps] [workers]
//   or:  node clip/render.js --shots dir t1 t2 ...   (still frames for checking)
const { chromium } = require('playwright');
const { spawn, execFileSync } = require('child_process');
const path = require('path');
const fs = require('fs');

async function open(browser) {
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  page.on('console', m => { if (m.type() === 'error') console.error('CONSOLE', m.text()); });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?render=1');
  await page.evaluate(() => document.fonts.ready);
  return page;
}
const frame = (page, t, q = 0.93) => page.evaluate(([t, q]) => { drawAt(t); return document.getElementById('c').toDataURL('image/jpeg', q).split(',')[1]; }, [t, q]);

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  if (args[0] === '--shots') {
    const page = await open(browser);
    fs.mkdirSync(args[1], { recursive: true });
    for (const t of args.slice(2)) fs.writeFileSync(path.join(args[1], `t${(+t).toFixed(1).padStart(6, '0')}.jpg`), Buffer.from(await frame(page, +t, 0.85), 'base64'));
  } else {
    const out = args[0] || path.join(__dirname, 'derech-hashalom.mp4'), fps = +(args[1] || 30), workers = +(args[2] || 4);
    const probe = await open(browser); const dur = await probe.evaluate(() => DUR); await probe.close();
    const n = Math.ceil(dur * fps), per = Math.ceil(n / workers), parts = [];
    await Promise.all([...Array(workers)].map(async (_, w) => {
      const page = await open(browser), part = `${out}.part${w}.mp4`; parts[w] = part;
      const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
        '-c:v', 'libx264', '-preset', 'medium', '-crf', '19', '-pix_fmt', 'yuv420p', part], { stdio: ['pipe', 'inherit', 'inherit'] });
      for (let i = w * per; i < Math.min(n, (w + 1) * per); i++) {
        const buf = Buffer.from(await frame(page, i / fps), 'base64');
        if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
        if (w === 0 && i % 300 === 0) console.log(`worker 0: frame ${i}/${per}`);
      }
      ff.stdin.end(); await new Promise(r => ff.on('close', r));
    }));
    const list = out + '.txt'; fs.writeFileSync(list, parts.map(p => `file '${p}'`).join('\n'));
    execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'concat', '-safe', '0', '-i', list, '-c', 'copy', '-movflags', '+faststart', out]);
    parts.forEach(p => fs.unlinkSync(p)); fs.unlinkSync(list);
    console.log('wrote', out);
  }
  await browser.close();
})();
