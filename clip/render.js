// Renders clip/index.html to an MP4 (video only – add the song's audio yourself).
// Usage: node clip/render.js [out.mp4] [fps]
//   or:  node clip/render.js --shots dir t1 t2 ...   (still frames for checking)
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');
const fs = require('fs');

(async () => {
  const args = process.argv.slice(2);
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 720 } });
  page.on('pageerror', e => { console.error('PAGE ERROR', e.message); process.exitCode = 1; });
  await page.goto('file://' + path.join(__dirname, 'index.html') + '?render=1');
  await page.evaluate(() => document.fonts.ready);
  const frame = t => page.evaluate(t => { drawAt(t); return document.getElementById('c').toDataURL('image/jpeg', 0.92).split(',')[1]; }, t);

  if (args[0] === '--shots') {
    fs.mkdirSync(args[1], { recursive: true });
    for (const t of args.slice(2)) fs.writeFileSync(path.join(args[1], `t${String(t).padStart(3, '0')}.jpg`), Buffer.from(await frame(+t), 'base64'));
  } else {
    const out = args[0] || path.join(__dirname, 'derech-hashalom.mp4'), fps = +(args[1] || 24);
    const dur = await page.evaluate(() => DUR), n = Math.round(dur * fps);
    const ff = spawn('ffmpeg', ['-y', '-loglevel', 'error', '-f', 'image2pipe', '-framerate', String(fps), '-c:v', 'mjpeg', '-i', '-',
      '-c:v', 'libx264', '-preset', 'medium', '-crf', '23', '-pix_fmt', 'yuv420p', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
    for (let i = 0; i < n; i++) {
      const buf = Buffer.from(await frame(i / fps), 'base64');
      if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
      if (i % 480 === 0) console.log(`frame ${i}/${n}`);
    }
    ff.stdin.end();
    await new Promise(r => ff.on('close', r));
    console.log('wrote', out);
  }
  await browser.close();
})();
