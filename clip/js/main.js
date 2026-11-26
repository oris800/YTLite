"use strict";
/* ===== player ===== */
window.drawAt = drawAt; window.DUR = DUR;
(function () {
  const $ = id => document.getElementById(id), audio = $('audio');
  let playing = false, t0 = 0, cur = 0;
  const fmt = s => Math.floor(s / 60) + ':' + String(Math.floor(s % 60)).padStart(2, '0');
  function show(t) { cur = t; drawAt(t); $('seek').value = t; $('time').textContent = fmt(t); }
  function loop() { if (!playing) return; const t = audio.src ? audio.currentTime : (performance.now() - t0) / 1000; if (t >= DUR) { playing = false; $('play').textContent = '▶ נגן'; show(DUR); return; } show(t); requestAnimationFrame(loop); }
  $('play').onclick = () => { playing = !playing; $('play').textContent = playing ? '⏸ עצור' : '▶ נגן'; if (playing) { if (cur >= DUR) cur = 0; t0 = performance.now() - cur * 1000; if (audio.src) { audio.currentTime = cur; audio.play(); } loop(); } else audio.pause(); };
  $('seek').oninput = e => { const t = +e.target.value; t0 = performance.now() - t * 1000; if (audio.src) audio.currentTime = t; show(t); };
  $('file').onchange = e => { const f = e.target.files[0]; if (f) { audio.src = URL.createObjectURL(f); show(0); } };
  const q = new URLSearchParams(location.search);
  if (q.has('render')) document.body.classList.add('render');
  show(+(q.get('t') || 0));
})();
