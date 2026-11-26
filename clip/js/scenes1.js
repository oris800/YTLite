"use strict";
/* ===== scenes, part 1: intro · verse 1 · chorus · the walk =====
   L = when each sung line starts in the recording (seconds), measured from the audio. */
const L = {
  v1a: 10.7, v1b: 14.1, v1c: 17.4, v1d: 21.3, v1e: 23.6, v1f: 27.1, v1g: 30.6, v1h: 33.4, v1h2: 37.3, v1i: 40.2, v1j: 42.8, v1k: 45.3,
  c1a: 50.7, c1hit: 52.7, c1b: 54.5, c1c: 58.2, c1d: 59.7, c1e: 61.9, c1f: 63.7, c1g: 67.7, c1h: 69.4, na: 72.2,
  v2a: 81.3, v2b: 83.6, v2c: 87.4, v2c2: 89.0, v2d: 90.5, v2e: 93.2, v2f: 97.0, v2g: 100.1, v2h: 102.9, v2i: 106.3, v2j: 110.0, v2k: 112.5, v2l: 114.9,
  c2a: 121.0, c2b: 124.1, c2c: 127.8, c2d: 129.3, c2e: 131.5, c2f: 133.4, c2g: 137.3,
  b1a: 140.1, b1b: 143.2, b1c: 146.9, b1d: 148.5, b1e: 150.6, b1f: 153.2, b1g: 156.6, b1h: 158.2,
  solo: 161.0, solo2: 168.0, solo3: 175.6,
  c3a: 178.8, c3b: 181.7, c3c: 184.9, c3d: 186.9, c3e: 188.9, c3f: 191.0, c3g: 194.3,
  b2a: 197.8, b2b: 200.9, b2c: 204.5, b2d: 206.1, b2e: 208.0, b2g: 214.1, b2h: 215.8, end1: 220.1, end2: 225.2,
};
const SHOTS = [];                                   // [start, fn(t, a, b)]
const S = (start, fn) => SHOTS.push([start, fn]);
const camG = (x, z, gy = 640) => setCam(x, WALKY - (gy - 360) / z, z);   // street camera keeping the pavement near the bottom
const stepPhase = x => x * Math.PI / 60;             // walk phase that keeps the feet from sliding (stride 30)

/* ---------- shared bits ---------- */
function cafeTable(t, o = {}) { // her table on the terrace
  const { cups = 0, cupLevel = 1, water = 1, bill = 0, rock = 0, push = 0 } = o, ty = WALKY - TABLE - 7;
  bistroChair(X.tHer - 86, WALKY, 1); oldChair(X.tHer + 86, WALKY, -1, rock); bistroTable(X.tHer, WALKY);
  if (water) waterGlass(X.tHer + 34, ty, 1, t); candleJar(X.tHer + 2, ty, t);
  if (cups > 0) { hafuch(X.tHer - 30, ty, 1, t, cups, cupLevel); hafuch(X.tHer + 16 + push * 10, ty, 1, t, cups, cupLevel); }
  if (bill > 0) { box(X.tHer - 14, ty - 3, 30, 3, '#2a2e3c', 1); box(X.tHer - 9, ty - 14 * bill, 20, 12, '#fff', 1); }
}
const herAt = (t, p = {}) => figure('her', X.tHer + 90, WALKY, 1, -1, poseSit(Object.assign({ t, hN: [46, -110], hF: [58, -110] }, p)));
const himAt = (t, p = {}) => figure('him', X.tHer - 90, WALKY, 1, 1, poseSit(Object.assign({ t, hN: [44, -110], hF: [52, -110] }, p)));

function bokeh(t, cols = ['255,214,130', '255,150,170', '150,225,255'], base = ['#0c1430', '#1c2a4a', '#3a2a4e']) { // soft out-of-focus café lights behind a close-up
  g.fillStyle = grad(0, H, base); g.fillRect(0, 0, W, H);
  for (let i = 0; i < 26; i++) { const x = rnd(i + 4) * W + Math.sin(t * .3 + i) * 10, y = 60 + rnd(i + 40) * 380, r = 26 + rnd(i + 9) * 46, a = .10 + .12 * rnd(i + 2) + .08 * A.pulse(t) * (i % 2); g.fillStyle = `rgba(${cols[i % cols.length]},${a})`; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); g.strokeStyle = `rgba(${cols[i % cols.length]},${a * .8})`; g.lineWidth = 2; g.stroke(); }
  glow(W * .5, H * .9, 600, 'rgba(255,170,90,.25)');
}
// "what heat": per-letter kinetic type. mode: 'melt' | 'freeze' | 'sun'
function hotWords(t, a, b, mode = 'melt', o = {}) {
  const k = seg(t, a, b), str = 'איזה חום', size = o.size || 150, cy = o.y || 330, kick = A.kick(t), inA = eBack(seg(t, a, a + .28)), outA = 1 - sg(t, b - .22, b);
  g.save(); g.globalAlpha = cl(inA) * outA; g.font = `800 ${size}px ${FONT}`; g.direction = 'rtl'; g.textBaseline = 'middle'; g.textAlign = 'right';
  const total = g.measureText(str).width; let x = W / 2 + total / 2; const fr = mode === 'freeze' ? sg(t, a + .2, a + 1.0) : 0;
  for (let i = 0; i < str.length; i++) {
    const ch = str[i], cw = g.measureText(ch).width;
    if (ch !== ' ') {
      const wob = Math.sin(t * 7 + i * 1.3) * (mode === 'freeze' ? 4 * (1 - fr) + 2 * fr * Math.sin(t * 40 + i) : 9), sc = (.9 + .1 * inA) * (1 + .1 * kick + (mode === 'sun' ? .05 * Math.sin(t * 3 + i) : 0));
      const hot = mixHex(['#ffd76a', '#ff9a3c', '#ff5a3c'][i % 3], '#bfeaff', fr), edge = mixHex('#c2361e', '#3d7fd0', fr);
      g.save(); g.translate(x - cw / 2, cy + wob + (1 - inA) * -60); g.scale(sc, sc * (mode === 'melt' ? 1 + .06 * Math.sin(t * 5 + i) : 1)); g.rotate(Math.sin(t * 3 + i * 2) * .04);
      g.textAlign = 'center'; g.lineJoin = 'round'; g.strokeStyle = edge; g.lineWidth = 14; g.strokeText(ch, 0, 0); g.fillStyle = hot; g.fillText(ch, 0, 0);
      g.restore();
      // drips of melting letters / icicles when frozen
      if (mode === 'melt') for (let d = 0; d < 2; d++) { const ph = (t * .9 + rnd(i * 3 + d)) % 1, dx = x - cw * (.25 + .5 * d); g.fillStyle = `rgba(255,140,60,${(1 - ph) * .9})`; g.beginPath(); g.ellipse(dx, cy + size * .42 + ph * 90, 5, 9 + ph * 6, 0, 0, TAU); g.fill(); }
      if (mode === 'freeze' && fr > 0) for (let d = 0; d < 3; d++) { const dx = x - cw * (.2 + .3 * d), len = (18 + rnd(i * 5 + d) * 34) * fr; g.fillStyle = 'rgba(220,245,255,.9)'; g.beginPath(); g.moveTo(dx - 6, cy + size * .34); g.lineTo(dx + 6, cy + size * .34); g.lineTo(dx, cy + size * .34 + len); g.fill(); }
    }
    x -= cw; g.textAlign = 'right';
  }
  g.restore();
  if (mode === 'freeze') for (let i = 0; i < 18; i++) snow(rnd(i + 1) * W, ((rnd(i + 30) + t * .25) % 1) * H, 6 + rnd(i) * 9, fr * .8 * outA, t + i);
}
function title(t, a = 1, y = 300, s = 1) { // the title card is the street sign itself
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(W / 2, y); g.scale(s, s);
  glow(0, 0, 520, 'rgba(70,150,255,.45)'); box(-330, -96, 660, 192, '#f6f8fc', 28); box(-316, -82, 632, 164, '#1556b8', 20);
  g.strokeStyle = 'rgba(255,255,255,.25)'; g.lineWidth = 3; rr(-304, -70, 608, 140, 14); g.stroke();
  text('דרך השלום', 0, -12, 104, '#fff', { weight: 800 }); ltr('DEREKH HASHALOM', 0, 52, 22, '#cfe0ff', { font: 'Arimo,"Liberation Sans",sans-serif' });
  circ(-290, -56, 5, '#cfd8ea'); circ(290, -56, 5, '#cfd8ea'); circ(-290, 56, 5, '#cfd8ea'); circ(290, 56, 5, '#cfd8ea');
  g.restore();
}

/* ---------- the sea (seen from the beach): still at first, later the breeze comes from here ---------- */
function seaShot(t, wind = 0, push = 0) {
  setCam(W / 2, H / 2, 1);
  g.save(); g.translate(W / 2, H / 2); g.scale(1 + push * .1, 1 + push * .1); g.translate(-W / 2 - push * 24, -H / 2 - push * 8);
  nightSky(t, 0, .5); clouds(t, 1, 120); moon(360, 150, 54, 1);
  // the city across the bay
  g.save(); g.beginPath(); g.rect(600, 0, 760, 432); g.clip(); g.translate(600, 0); farSkyline(t, 432, { par: 1, seed: 9, lit: .9, scale: .8 }); threeTowers(330, 432, .5, t); g.restore();
  for (let i = 0; i < 22; i++) { const q = i / 22, x = 640 + q * 640; glow(x, 430, 10 + q * 4, 'rgba(255,214,150,.9)', .6 + .3 * Math.sin(t * 2 + i)); }
  sea(t, -100, W + 100, 430, H, 360, wind);
  // breakwater & a blinking lighthouse
  poly([[560, 446], [760, 438], [770, 448], [560, 456]], '#0a0d28'); box(566, 414, 10, 34, '#d7dcee'); box(563, 408, 16, 8, '#c9414f', 2); if (Math.sin(t * 2.6) > .2) glow(571, 410, 60, 'rgba(255,240,200,.9)');
  // sand, foam, lifeguard hut with a pennant, closed parasols
  g.fillStyle = grad(560, H, ['#3a3350', '#5a4a5e']); g.beginPath(); g.moveTo(1280, 520); g.bezierCurveTo(1080, 560, 900, 640, 700, 740); g.lineTo(1280, 740); g.fill();
  g.strokeStyle = `rgba(235,242,255,${.75 + wind * .2})`; g.lineWidth = 7 + wind * 5; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i <= 24; i++) { const q = i / 24, bx = 1280 - q * 580, by = 520 + q * q * 220 + (1 - q) * 20 * q, off = Math.sin(t * (1.1 + wind) + i * .9) * (6 + wind * 9) + Math.sin(t * .5) * 8; i ? g.lineTo(bx - off - 14, by - off * .4) : g.moveTo(bx - off - 14, by - off * .4); } g.stroke();
  const hx = 1040, hy = 640; line([[hx - 34, hy], [hx - 26, hy - 70]], '#1a1630', 6); line([[hx + 34, hy], [hx + 26, hy - 70]], '#1a1630', 6); line([[hx - 30, hy - 30], [hx + 30, hy - 44]], '#1a1630', 3);
  box(hx - 50, hy - 76, 100, 8, '#231d3c'); box(hx - 38, hy - 128, 76, 52, '#3a3160'); poly([[hx - 50, hy - 126], [hx, hy - 152], [hx + 50, hy - 126]], '#c9414f'); box(hx - 10, hy - 110, 20, 22, '#ffd98a'); glow(hx, hy - 100, 60, 'rgba(255,210,140,.5)');
  line([[hx + 44, hy - 126], [hx + 44, hy - 210]], '#d7dcee', 3);
  g.fillStyle = '#1a1a1a'; g.beginPath(); const n = 8; for (let i = 0; i <= n; i++) { const q = i / n, ang = lerp(Math.PI / 2 - .1, -.05, wind), px = hx + 44 + Math.cos(ang) * q * 54, py = hy - 208 + Math.sin(ang) * q * 54 + Math.sin(t * 8 - q * 5) * 4 * wind * q; i ? g.lineTo(px, py) : g.moveTo(px, py); } for (let i = n; i >= 0; i--) { const q = i / n, ang = lerp(Math.PI / 2 - .1, -.05, wind), px = hx + 44 + Math.cos(ang) * q * 54 - Math.sin(ang) * 22 * (1 - q * .3) * lerp(.35, 1, wind), py = hy - 208 + Math.sin(ang) * q * 54 + Math.cos(ang) * 22 * (1 - q * .3) + Math.sin(t * 8 - q * 5) * 4 * wind * q; g.lineTo(px, py); } g.fill();
  for (let i = 0; i < 3; i++) { const px = 860 + i * 56, py = 690 + i * 6; line([[px, py], [px, py - 70]], '#2a2440', 3); poly([[px - 7, py - 20], [px, py - 78 - wind * 3], [px + 7, py - 20]], ['#c9414f', '#f4d35e', '#2a7fb8'][i]); }
  palm(1215, 640, 1.25, wind * .9, t, '#0c241e');
  g.restore();
  haze(t, 1.2 * (1 - wind * .6), [200, 190, 240], 330);
  windLines(t, wind, { y0: 140, y1: 640, n: 24, speed: .8 });
}

/* =================== INTRO =================== */
S(0, (t) => { // the sea, flat and windless
  seaShot(t, 0, seg(t, 0, 4.6)); tint('#02030c', 1 - sg(t, 0, 2.2));
});
S(AUD.beats[0], (t, a, b) => { // the first beat: the city, and the title as a street sign
  const k = seg(t, a, b); setCam(lerp(1500, 2300, k), 60, .5);
  street(t, { clock: '23:46', moonX: 300, moonY: 110, signGlow: 0 });
  const drop = eBack(seg(t, a + .05, a + .7)), out = 1 - sg(t, 9.6, 10.5);
  title(t, cl(seg(t, a, a + .2)) * out, 310 - (1 - drop) * 420, 1 + .035 * A.pulse(t));
});

/* =================== VERSE 1 =================== */
S(L.v1a, (t, a, b) => { // Tel Aviv, before midnight
  const hx = lerp(1330, 1600, seg(t, a - .2, b)); setCam(hx + 190, 320, .92);
  street(t, { clock: '23:47', moonX: 1090, moonY: 96 }, d => { if (d === 0) { const wipe = bell(t, a + 1.6, a + 3.2, .4); figure('him', hx, WALKY, 1, 1, poseWalk(stepPhase(hx), { t, sweat: .8, brow: -.4, hN: wipe > 0 ? [lerp(6, 16, wipe), lerp(-108, -214, wipe)] : undefined })); } });
});
S(L.v1b, (t, a, b) => { // the wind doesn't feel like blowing: flag, wind chime, washing line, pinwheel – all dead still
  const cut = 15.75;
  if (t < cut) { const k = seg(t, a, cut); setCam(lerp(670, 700, k), 150, 1.95); }
  else { const k = seg(t, cut, b); setCam(lerp(1850, 1880, k), 80, 1.6); }
  street(t, { clock: '23:47', moon: 0, hazeA: .7 });
  // "0 km/h": a tiny hand-drawn zero next to the things that should be moving
  const mark = (wx, wy, a2) => { const [sx, sy] = toScreen(wx, wy); g.save(); g.globalAlpha = a2; g.strokeStyle = 'rgba(210,235,255,.8)'; g.lineWidth = 2.5; g.lineCap = 'round'; g.setLineDash([3, 9]); for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(sx - 70, sy + i * 16); g.lineTo(sx - 20, sy + i * 16); g.stroke(); } g.setLineDash([]); g.strokeStyle = '#ff6a5a'; g.lineWidth = 4; g.beginPath(); g.moveTo(sx - 76, sy + 34); g.lineTo(sx - 14, sy - 6); g.stroke(); g.restore(); };
  if (t < cut) mark(X.flag + 20, 110, bell(t, a + .4, cut, .3)); else mark(1700, 40, bell(t, cut + .3, b, .3));
});
S(L.v1c, (t, a, b) => { // the humidity won't let go – it's choking him
  const hx = 1640, k = seg(t, a, b); setCam(hx + 70 + k * 14, 396, 1.9 + k * .12);
  const hum = ['89%', '91%', '93%', '95%'][Math.min(3, Math.floor(k * 4))];
  let P;
  street(t, { clock: '23:48', hum, temp: '32°C', moon: 0, humid: 1.6, hazeA: 1.5 }, d => {
    if (d !== 0) return;
    const tug = .5 + .5 * Math.sin(t * 7);
    P = figure('him', hx, WALKY, 1, 1, poseStand({ t, sweat: 1, brow: -.9, blush: .55, open: .22 + .12 * Math.sin(t * 3), look: [.2, -.3], hN: [15 + tug * 5, -172 - tug * 3], tilt: -.08, lean: .02 }));
    // ribbons of damp air coiling round his neck
    g.save(); g.lineCap = 'round';
    for (let i = 0; i < 4; i++) { const ph = t * (.9 + i * .15) + i * 1.7, cx = P.head[0] - 2, cy = P.head[1] + 34 + i * 7; g.strokeStyle = `rgba(215,235,255,${.16 + .06 * Math.sin(ph)})`; g.lineWidth = 7 - i; g.beginPath(); for (let q = 0; q <= 20; q++) { const an = ph + q / 20 * Math.PI * 1.5, x = cx + Math.cos(an) * (30 + i * 5), y = cy + Math.sin(an) * 7 + q * .5; q ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
    g.restore();
  });
  // droplets condensing on the "lens"
  for (let i = 0; i < 16; i++) { const ap = seg(t, a + rnd(i) * 2.6, a + rnd(i) * 2.6 + .5), x = rnd(i + 10) * W, y0 = rnd(i + 20) * H * .8, sl = Math.max(0, t - a - 1.5 - rnd(i) * 2) * 26 * rnd(i + 5); if (ap > 0) { g.fillStyle = `rgba(210,232,255,${.16 * ap})`; g.beginPath(); g.ellipse(x, y0 + sl, 9 + rnd(i) * 10, 11 + rnd(i) * 12, 0, 0, TAU); g.fill(); g.fillStyle = `rgba(255,255,255,${.25 * ap})`; g.beginPath(); g.arc(x - 3, y0 + sl - 4, 2.5, 0, TAU); g.fill(); } }
});
S(L.v1d, (t, a, b) => { // a café between the neighbourhoods
  const k = seg(t, a, b); setCam(lerp(3440, 3560, k), 60, .5);
  const hx = lerp(2480, 2680, k);
  street(t, { clock: '23:50', moonX: 880, moonY: 100, t3up: 1, t3floor: 1 }, d => { if (d === 0) { cafeTable(t); herAt(t, { hN: [20, -150], elbow: -1, look: [0, .7] }); figure('waiter', X.t3 - 104, WALKY, 1, 1, poseStand({ t, hN: [30, -120] })); figure('him', hx, WALKY, 1, 1, poseWalk(stepPhase(hx), { t, sweat: .6 })); } });
});
S(L.v1e, (t, a, b) => { // they haven't turned the lights off yet (everyone else has)
  const k = seg(t, a, b); camKeys(t, [[a, 3560, 60, .5], [b, 3640, 270, .82]]);
  const lift = sg(t, 24.2, 25.4), placed = t >= 25.4, hx = lerp(2680, 2900, k);
  street(t, { clock: '23:52', moonX: 880, moonY: 100, sleep: sg(t, a, b - .4) * .9, t3up: placed ? 2 : 1, t3floor: t < 24.2 ? 1 : 0 }, d => {
    if (d !== 0) return;
    cafeTable(t); herAt(t, { hN: [20, -150], elbow: -1, look: [0, .7] });
    const wx = X.t3 - 104 + (placed ? sg(t, 25.6, 26.6) * -70 : 0);
    if (!placed && t >= 24.2) { g.save(); g.translate(X.t3 - 40 - (1 - lift) * 20, lerp(WALKY - 30, WALKY - TABLE - 7 - SEAT, lift)); g.rotate((1 - lift) * .4); g.scale(1, lerp(1, -1, sg(t, 24.2, 25.0))); bistroChair(0, 0, 1); g.restore(); }
    figure('waiter', wx, WALKY, 1, 1, placed ? poseStand({ t, hN: [26, -150 + Math.sin(t * 9) * 4], hF: [20, -146], look: [1, 0], tilt: .05 }) : poseStand({ t, hN: [44, lerp(-96, -196, lift)], hF: [36, lerp(-96, -190, lift)], lean: .1 * (1 - lift) }));
    figure('him', hx, WALKY, 1, 1, poseWalk(stepPhase(hx), { t, sweat: .6 }));
  });
  // one by one the windows around go dark; the café keeps glowing
  glow(...toScreen(3700, 430), 520 * CAM.z, 'rgba(255,190,110,.22)', k);
});
S(L.v1f, (t, a, b) => { // on an old chair, alone, she sits
  camKeys(t, [[a, X.tHer + 92, 590, 3.3], [28.2, X.tHer + 90, 572, 3.3], [29.5, X.tHer + 44, 468, 2.0], [b, X.tHer + 38, 460, 2.2]]);
  const sw = Math.sin(t * 2.4);
  street(t, { clock: '23:53', moon: 0, sleep: .9, t3up: 2, hazeA: .6 }, d => {
    if (d !== 0) return;
    cafeTable(t, { rock: sw });
    herAt(t, { hN: [22, -150], hF: [48, -112], elbow: -1, look: [0, .8], brow: -.35, smile: -.15, tilt: .1, fN: [46 + sw * 5, -4 - sw * 3], fF: [38, 0] });
    // a little creak from the chair
    const cr = Math.max(0, Math.sin(t * 2.4 + 1.2)); g.strokeStyle = `rgba(255,236,200,${cr * .7})`; g.lineWidth = 1.5; g.lineCap = 'round'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(X.tHer + 62, WALKY - 8, 12 + i * 7, Math.PI * .9, Math.PI * 1.3); g.stroke(); }
  });
});
S(L.v1g, (t, a, b) => { // he isn't sure what to say
  const hx = 3410, k = seg(t, a, b); setCam(hx + 110, 426, 1.8);
  let P;
  street(t, { clock: '23:54', moon: 0, sleep: .9, hazeA: .7 }, d => { if (d === 0) { cafeTable(t); herAt(t, { hN: [22, -150], elbow: -1, look: [0, .8], tilt: .1 }); P = figure('him', hx, WALKY, 1, 1, poseStand({ t, sweat: .7, brow: -.8, look: [.9, .1], hN: [-12 + Math.sin(t * 8) * 3, -212], open: .12 * (Math.sin(t * 6) > .3 ? 1 : 0) })); } });
  const drafts = [['היי...', 30.7], ['אפשר להצטרף?', 31.5], ['חם היום, אה?', 32.35]];
  const [hx2, hy2] = toScreen(P.head[0], P.head[1]);
  drafts.forEach(([s, t0], i) => {
    const ap = eBack(seg(t, t0, t0 + .22)), x = hx2 + 210 + i * 26, y = hy2 - 150 + i * 74, fade = i < 2 ? 1 - sg(t, t0 + .75, t0 + .95) * .55 : 1; if (ap <= 0) return;
    g.save(); g.translate(x, y); g.scale(ap, ap); g.translate(-x, -y); bubble(x, y, 250, 62, hx2 + 30, hy2 - 20, fade, true); text(s, x, y + 1, 27, '#27304f', { a: fade, weight: 600 });
    const st = seg(t, t0 + .5, t0 + .68); if (st > 0) { g.strokeStyle = '#e0483a'; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(x + 104, y + 4); g.lineTo(x + 104 - st * 208, y - 3); g.stroke(); }
    g.restore();
  });
});
S(L.v1h, (t, a, b) => { // go over … or back off
  if (t < 38.55) { // his feet decide: two steps forward, then back again
    const fwd = sg(t, 33.7, 35.2) * 62 + sg(t, 35.5, 36.6) * 28, back = sg(t, 37.3, 38.4) * 74, hx = 3400 + fwd - back;
    setCam(3445, 588, 3.1);
    street(t, { moon: 0, sleep: .9, hazeA: .3 }, d => {
      if (d !== 0) return;
      // chalk arrows on the pavement
      const arrow = (x, dir, a2, col) => { if (a2 <= 0) return; g.save(); g.globalAlpha = a2; g.translate(x, WALKY + 16); g.scale(dir, .5); g.strokeStyle = col; g.lineWidth = 6; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(-26, 0); g.lineTo(22, 0); g.moveTo(8, -14); g.lineTo(24, 0); g.lineTo(8, 14); g.stroke(); g.restore(); };
      arrow(3520, 1, bell(t, 33.5, 37.2, .3), '#8dffb0'); arrow(3350, -1, bell(t, 37.2, 38.55, .2), '#ff8a7a');
      glow(3620, WALKY, 240, 'rgba(255,190,110,.35)');
      figure('him', hx, WALKY, 1, 1, poseWalk(stepPhase(hx) + (t > 37.3 ? .0 : 0), { t, stride: 30, shadow: .4 }));
    });
    // heartbeat thump at the edges of the frame
    const hb = Math.pow(Math.max(0, Math.sin(t * 5.2)), 6); g.strokeStyle = `rgba(255,90,120,${hb * .35})`; g.lineWidth = 26; g.strokeRect(0, 0, W, H);
  } else { // frozen: he stands at the edge of the light, nothing moves
    setCam(3640, 448, 1.5);
    street(t, { clock: '23:55', moon: 0, sleep: .9, hazeA: 1 }, d => { if (d === 0) { cafeTable(t); herAt(t, { hN: [22, -150], elbow: -1, look: [0, .8], tilt: .1 }); figure('him', 3414, WALKY, 1, 1, poseStand({ t, sweat: .8, brow: -.7, look: [1, 0] })); } });
  }
});
S(L.v1i - .25, (t, a, b) => { // and a wind comes from the sea
  const cut = 41.45;
  if (t < cut) { seaShot(t, sg(t, a, a + .7), .4 + seg(t, a, cut) * .3); return; }
  const k = eOut(seg(t, cut, b)), w = 1; setCam(lerp(1500, 3660, k), lerp(230, 330, k), lerp(.72, .95, k));
  street(t, { wind: w, clock: '23:55', moonX: 1000, moonY: 100, sleep: .9, humid: .5, t3up: 2 }, d => { if (d === 0) { cafeTable(t); herAt(t, { hN: [22, -150], elbow: -1, hairWind: .9 * sg(t, 42.2, 42.7) }); figure('him', 3414, WALKY, 1, 1, poseStand({ t, look: [1, 0] })); } });
  windLines(t, 1, { y0: 60, y1: 620, n: 30, speed: 1.1 });
});
S(L.v1j, (t, a, b) => { // she throws him a small glance
  const k = seg(t, a, b), gust = 1 - sg(t, a, b + 1.5) * .7;
  bokeh(t);
  const glance = sg(t, 43.75, 44.0) * (1 - sg(t, 44.85, 45.15)), sm = sg(t, 44.4, 44.9), tuck = bell(t, 43.0, 43.9, .3);
  g.save(); g.translate(W / 2, H / 2); g.scale(1 + k * .06, 1 + k * .06); g.translate(-W / 2, -H / 2);
  const P = figure('her', 733, 1570, 7, -1, poseSit({ t, shadow: 0, hairWind: gust * (.75 + .25 * Math.sin(t * 6)), look: [lerp(-.1, 1, glance), lerp(.85, -.05, glance)], smile: sm * .7, blush: sm * .5, brow: glance * .5, tilt: .08 - glance * .06, hN: tuck > 0 ? [lerp(46, -8, tuck), lerp(-110, -170, tuck)] : [46, -110], blink: (t > 43.55 && t < 43.72) ? 1 : 0 }));
  g.restore();
  // the glance itself: a little spark that leaves her eye and travels across the terrace
  const gl = seg(t, 43.95, 44.9); if (gl > 0 && gl < 1) { const ex = P.head[0] - 96, ey = P.head[1] - 12; for (let i = 0; i < 9; i++) { const q = cl(gl * 1.25 - i * .03), x = ex - q * 620, y = ey + Math.sin(q * Math.PI) * -90 + q * 60; star4(x, y, 16 - i * 1.4, i ? '#ffe9b0' : '#fff', (1 - gl) * (1 - i * .1), t * 3 + i); } }
  if (glance > .5) star4(P.head[0] - 150, P.head[1] - 40, 20 * glance, '#fff', .9 * (1 - seg(t, 44.0, 44.5)), t * 2);
  windLines(t, gust * .7, { y0: 60, y1: 660, n: 12, speed: .7 });
  vignette(.7);
});
S(L.v1k, (t, a, b) => { // she invites him to sit
  const k = seg(t, a, b); setCam(X.tHer - 30 + k * 26, lerp(452, 458, k), lerp(1.42, 1.6, k));
  const inv = bell(t, a + .1, a + 2.6, .3), walk = sg(t, 46.2, 48.2), hx = lerp(3414, X.tHer - 90, walk), sit = t > 48.25, look = sit ? 1 : 0, br = sg(t, 48.3, 50.4);
  street(t, { clock: '23:56', moon: 0, sleep: .9, wind: .18 + .1 * Math.sin(t * 2), humid: .7, cafeLights: 1 + br * .25, t3up: 2 }, d => {
    if (d !== 0) return;
    cafeTable(t);
    herAt(t, { hN: inv > 0 ? [lerp(46, 92, inv), lerp(-110, -128 + Math.sin(t * 6) * 4, inv)] : [46, -110], hairWind: .25 + .1 * Math.sin(t * 3), smile: .45 + sit * .35, look: [1, sit ? 0 : .1], brow: inv * .6, blush: sit * .4 });
    if (sit) himAt(t, { smile: .5 * sg(t, 48.4, 49.2), sweat: .5, look: [1, 0], brow: .3, hN: bell(t, 49.2, 50.4, .3) > 0 ? [lerp(44, 12, bell(t, 49.2, 50.4, .3)), lerp(-110, -208, bell(t, 49.2, 50.4, .3))] : [44, -110], blush: .4 });
    else figure('him', hx, WALKY, 1, 1, walk > 0 && walk < 1 ? poseWalk(stepPhase(hx), { t, look: [1, 0], smile: .3 }) : poseStand({ t, look: [1, 0], brow: .8 * inv, open: inv * .2, hN: inv > .2 ? [14, -190] : undefined }));
  });
  if (inv > .3 && !sit) { const [sx, sy] = toScreen(X.tHer - 86, WALKY - 150); g.save(); g.globalAlpha = inv * (.6 + .4 * Math.sin(t * 9)); g.strokeStyle = '#ffe9b0'; g.lineWidth = 5; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(sx - 16, sy - 30 + Math.sin(t * 6) * 6); g.lineTo(sx, sy - 12 + Math.sin(t * 6) * 6); g.lineTo(sx + 16, sy - 30 + Math.sin(t * 6) * 6); g.stroke(); g.restore(); }
});

/* =================== CHORUS (1) =================== */
function tableTop(t, o = {}) { // looking straight down at the café table
  const { c1 = 1, c2 = 1, level = 1, bill = 0, hands = 0, touch = 0, spin = 0 } = o, cx = 640, cy = 372;
  g.fillStyle = '#3a281c'; g.fillRect(0, 0, W, H); for (let i = 0; i < 12; i++) { box(i * 112 - 20, 0, 108, H, i % 2 ? '#4a3424' : '#553c2a'); }
  glow(cx, cy, 700, 'rgba(255,190,110,.35)'); circ(cx + 14, cy + 22, 318, 'rgba(0,0,0,.35)');
  g.save(); g.translate(cx, cy); g.rotate(spin);
  circ(0, 0, 310, '#c9a878'); circ(0, 0, 310, 'rgba(0,0,0,0)'); g.strokeStyle = '#8a6a44'; g.lineWidth = 10; g.beginPath(); g.arc(0, 0, 305, 0, TAU); g.stroke();
  g.strokeStyle = 'rgba(120,84,48,.25)'; g.lineWidth = 2; for (let i = 0; i < 7; i++) { g.beginPath(); g.arc(-80 + i * 14, 60, 120 + i * 36, 0, TAU); g.stroke(); }
  // candle, water with ice & lemon, sugar, phone
  circ(0, -196, 30, 'rgba(255,220,160,.5)'); circ(0, -196, 18, '#fff3d6'); circ(0, -196, 6 + Math.sin(t * 13) * 1.2, '#ffb347'); glow(0, -196, 120, 'rgba(255,190,110,.6)', .8 + .2 * Math.sin(t * 9));
  circ(176, -150, 40, 'rgba(190,225,255,.5)'); circ(176, -150, 32, 'rgba(150,205,255,.6)'); box(160, -168, 18, 18, 'rgba(245,252,255,.85)', 3); box(182, -152, 16, 16, 'rgba(245,252,255,.8)', 3); g.fillStyle = '#f4d35e'; g.beginPath(); g.arc(166, -134, 15, 0, Math.PI); g.fill();
  box(-216, -174, 46, 66, '#e9e2cf', 5); for (let i = 0; i < 4; i++) box(-210 + i * 10, -182, 7, 60, ['#fff', '#c98a5a', '#fff', '#ffd3e4'][i], 2);
  g.save(); g.translate(200, 150); g.rotate(.5); box(-30, -56, 60, 112, '#15182c', 10); box(-24, -50, 48, 100, '#22264a', 7); circ(0, -40, 5, '#0c0e1c'); g.restore();
  const cup = (x, y, k, id) => {
    if (k <= 0) return; g.save(); g.translate(x, y - (1 - eBack(k)) * 520);
    circ(6, 9, 74, 'rgba(0,0,0,.22)'); circ(0, 0, 72, '#f6f2ea'); circ(0, 0, 58, '#e6e0d6'); circ(0, 0, 46, 'rgba(235,245,255,.9)');
    if (level > 0) {
      circ(0, 0, 41, level > .5 ? '#fff6e6' : '#d9b48a');
      if (level > .5) { g.save(); g.rotate(id ? .5 : -.4); const s = 1 + .08 * A.pulse(t); heart(0, 3, 1.25 * s, '#b07a4a'); g.strokeStyle = '#c9905e'; g.lineWidth = 3; g.beginPath(); g.arc(0, 0, 30, .3, 2.2); g.stroke(); g.beginPath(); g.arc(0, 0, 30, 3.5, 5.3); g.stroke(); g.restore(); }
    } else { circ(0, 0, 41, '#e9dcc8'); g.strokeStyle = '#c9a57a'; g.lineWidth = 4; g.beginPath(); g.arc(0, 0, 34, 0, TAU); g.stroke(); }
    g.save(); g.rotate(id ? -.7 : .9); box(50, -4, 60, 8, '#d7dcee', 4); ell(112, 0, 12, 8, '#d7dcee'); g.restore(); box(-66, 34, 22, 12, '#c98a5a', 3);
    if (level > .5) for (let i = 0; i < 3; i++) { const ph = (t * .45 + i / 3 + id * .2) % 1; g.strokeStyle = `rgba(255,255,255,${.4 * Math.sin(ph * Math.PI) * k})`; g.lineWidth = 6; g.lineCap = 'round'; g.beginPath(); const r = 14 + ph * 40; g.arc(Math.sin(t + i) * 8, -ph * 20, r, t * 1.5 + i * 2, t * 1.5 + i * 2 + 2.2); g.stroke(); }
    g.restore();
  };
  cup(-128, 44, c1, 0); cup(96, -20, c2, 1);
  if (bill > 0) { g.save(); g.translate(-10, 196 - (1 - eBack(bill)) * -420); g.rotate(-.12); box(-78, -52, 156, 104, '#1c1e30', 12); box(-56, -64, 112, 110, '#fffdf6', 3); text('קפה', 0, -46, 16, '#27304f'); for (let i = 0; i < 2; i++) { line([[40, -24 + i * 16], [-6, -24 + i * 16]], '#6d7390', 2.5); line([[-30, -24 + i * 16], [-44, -24 + i * 16]], '#6d7390', 2.5); } line([[44, 12], [-46, 12]], '#27304f', 2); line([[40, 26], [10, 26]], '#27304f', 4); line([[-22, 26], [-44, 26]], '#c9414f', 4); circ(70, 30, 15, '#d8b65a'); circ(88, 8, 12, '#c9c9d2'); g.restore(); }
  g.restore();
  // hands reaching in from both sides
  if (hands > 0) {
    const hx1 = lerp(1400, 930 - touch * 190, eOut(hands)), hy1 = 470 + touch * 80, hx2 = lerp(-120, 330 + touch * 210, eOut(hands)), hy2 = 520 + touch * 30;
    g.lineCap = 'round'; g.strokeStyle = LOOKS.her.skin; g.lineWidth = 46; g.beginPath(); g.moveTo(1400, hy1 + 50); g.lineTo(hx1, hy1); g.stroke(); circ(hx1, hy1, 30, LOOKS.her.skin); g.strokeStyle = '#e7c765'; g.lineWidth = 5; g.beginPath(); g.moveTo(hx1 + 96, hy1 - 14); g.lineTo(hx1 + 90, hy1 + 34); g.stroke(); for (let i = 0; i < 4; i++) { line([[hx1 - 16, hy1 - 18 + i * 12], [hx1 - 50, hy1 - 22 + i * 13]], LOOKS.her.skin, 11); circ(hx1 - 52, hy1 - 22 + i * 13, 4.5, '#ff5a6e'); }
    g.strokeStyle = LOOKS.him.skin; g.lineWidth = 54; g.beginPath(); g.moveTo(-120, hy2 + 40); g.lineTo(hx2, hy2); g.stroke(); circ(hx2, hy2, 34, LOOKS.him.skin); g.strokeStyle = LOOKS.him.top; g.lineWidth = 62; g.beginPath(); g.moveTo(-140, hy2 + 44); g.lineTo(hx2 - 150, hy2 + 16); g.stroke(); box(hx2 - 124, hy2 - 20, 22, 54, '#27304f', 5); for (let i = 0; i < 4; i++) line([[hx2 + 18, hy2 - 20 + i * 13], [hx2 + 56, hy2 - 24 + i * 14]], LOOKS.him.skin, 13);
    if (touch > .8) { const [sx, sy] = [(hx1 + hx2) / 2 + 8, (hy1 + hy2) / 2]; for (let i = 0; i < 8; i++) star4(sx + Math.cos(i / 8 * TAU + t * 3) * (30 + 20 * A.pulse(t)), sy + Math.sin(i / 8 * TAU + t * 3) * (30 + 20 * A.pulse(t)), 9, '#fff3c4', .9); heart(sx, sy - 70 - Math.sin(t * 4) * 6, 1.6, '#ff4d7d', touch); }
  }
  vignette(.55);
}
S(L.c1a, (t, a, b) => { // she orders a "hafuch" for both of them
  setCam(X.tHer - 20, 440, 1.5); const up = eBack(seg(t, a + .1, a + .5)), wk = sg(t, a + 1.0, b);
  let P;
  street(t, { clock: '23:57', moon: 0, sleep: .9, wind: .12, humid: .7, cafeLights: 1.2, t3up: 2 }, d => {
    if (d !== 0) return;
    figure('waiter', lerp(3470, 3520, wk), WALKY, 1, 1, poseStand({ t, hN: [30, -150 + Math.sin(t * 16) * 3], hF: [22, -146], look: [1, 0], smile: .4, tilt: Math.sin(t * 7) * .05 }));
    cafeTable(t); himAt(t, { smile: .5, look: [1, 0], blush: .3, sweat: .4 });
    P = herAt(t, { hN: [lerp(46, 6, up), lerp(-110, -232, up)], elbow: 1, smile: .7, open: .3 * (Math.sin(t * 9) > 0 ? 1 : 0), look: [.4, -.4], tilt: -.08, hairWind: .15 });
    // two fingers
    const hx = P.handN[0], hy = P.handN[1]; line([[hx, hy], [hx - 5, hy - 17]], LOOKS.her.skin, 5); line([[hx, hy], [hx + 6, hy - 17]], LOOKS.her.skin, 5);
  });
  const [bx, by] = toScreen(P.head[0] + 96, P.head[1] - 96), ap = eBack(seg(t, a + .5, a + .8));
  if (ap > 0) { g.save(); g.translate(bx, by); g.scale(ap, ap); g.translate(-bx, -by); bubble(bx, by, 200, 110, bx - 150, by + 150); hafuch(bx - 44, by + 34, 1.9, t, 1); hafuch(bx + 40, by + 34, 1.9, t, 1); g.restore(); }
});
S(L.c1hit, (t, a, b) => { // two glasses land on the table as the band comes in
  tableTop(t, { c1: seg(t, a - .12, a + .3), c2: seg(t, a + .5, a + .9), spin: -.08 + seg(t, a, b) * .1, hands: seg(t, a + 1.1, b), level: 1 });
  const fl = pulseIn(t, a, .18); tint('#fff3d6', fl * .5);
});
S(L.c1b, (t, a, b) => { // and all she does is complain about the heat
  const k = seg(t, a, b); setCam(X.tHer + 30 - k * 10, 446, 1.72);
  const fan = Math.sin(t * 13), push = sg(t, 56.1, 56.6);
  let P;
  street(t, { clock: '23:58', temp: '33°C', moon: 0, sleep: .9, humid: 1.4, cafeLights: 1.15, t3up: 2 }, d => {
    if (d !== 0) return;
    cafeTable(t, { cups: 1, push });
    himAt(t, { smile: .9, open: .45 * Math.max(0, Math.sin(t * 8)), look: [1, 0], blush: .4, sweat: .6, hN: [36, -116], tilt: Math.sin(t * 8) * .03 });
    P = herAt(t, { hN: [8 + fan * 7, -176 + fan * 5], hF: push > 0 ? [lerp(58, 72, push), -112] : [58, -110], elbow: 1, brow: -.7, open: .32 + .1 * Math.sin(t * 5), look: [.6, -.5], sweat: .9, blush: .5, tilt: -.1, hairWind: fan * .12 });
    // the menu she fans herself with
    g.save(); g.translate(P.handN[0], P.handN[1]); g.rotate(-.5 + fan * .55); box(-12, -64, 44, 62, '#f3e7d3', 4); box(-8, -58, 36, 8, '#c9584a', 2); for (let i = 0; i < 4; i++) box(-6, -44 + i * 9, 30 - (i % 2) * 8, 3, '#b9a98f', 1); g.restore();
    g.strokeStyle = 'rgba(255,255,255,.45)'; g.lineWidth = 2; g.lineCap = 'round'; for (let i = 0; i < 3; i++) { g.beginPath(); g.arc(P.head[0] + 40, P.head[1] - 6 + i * 12, 14 + i * 3, -.5 + fan * .3, .5 + fan * .3); g.stroke(); }
  });
  heatShimmer(t, 0, H, W, 520, .9);
  // a thermometer creeping up beside her
  const tx = 1130, ty = 300, lv = .55 + k * .4; g.save(); g.globalAlpha = bell(t, a + .2, b, .3); box(tx - 13, ty - 150, 26, 190, 'rgba(255,255,255,.9)', 13); circ(tx, ty + 46, 26, 'rgba(255,255,255,.9)'); circ(tx, ty + 46, 19, '#ff4a3c'); box(tx - 6, ty + 30 - 160 * lv, 12, 160 * lv + 10, '#ff4a3c', 6); for (let i = 0; i < 6; i++) box(tx + 15, ty - 130 + i * 28, 12, 3, '#fff'); if (lv > .9) for (let i = 0; i < 6; i++) star4(tx + Math.cos(i + t * 5) * 44, ty - 150 + Math.sin(i + t * 5) * 22, 8, '#ffd76a', .9); g.restore();
});
S(L.c1c, (t, a, b) => { // "what heat"
  setCam(X.tHer + 10, 446, 1.6 + .04 * A.kick(t));
  street(t, { clock: '23:58', temp: '34°C', moon: 0, sleep: .9, humid: 1.6, cafeLights: 1.2, t3up: 2 }, d => { if (d === 0) { cafeTable(t, { cups: 1, push: 1 }); himAt(t, { smile: .8, open: .3, look: [1, 0], sweat: .8, hN: [14 + Math.sin(t * 12) * 6, -170], blush: .5 }); herAt(t, { hN: [8 + Math.sin(t * 13) * 7, -176], elbow: 1, brow: -.6, open: .5, sweat: 1, blush: .6, look: [.5, -.6], tilt: -.14 }); } });
  tint('#ff5a1e', .28); heatShimmer(t, 0, H, W, 600, 1.2, '255,220,160');
  hotWords(t, a, b, 'melt', { y: 250, size: 164 });
});
S(L.c1d, (t, a, b) => { // "maybe we should get going?" she asks
  const k = seg(t, a, b); bokeh(t, ['255,180,110', '255,140,150', '255,220,150'], ['#1c1430', '#3a2444', '#5a3040']);
  g.save(); g.translate(W / 2, H / 2); g.scale(1 + k * .05, 1 + k * .05); g.translate(-W / 2, -H / 2);
  const nod = eBack(seg(t, a + .35, a + .7));
  figure('her', 690, 1560, 7, -1, poseSit({ t, shadow: 0, lean: .14, brow: .9, smile: .55, open: .35 * Math.max(0, Math.sin((t - a) * 14)) * (t < a + 1.5 ? 1 : 0), look: [1, 0], tilt: -.14 * nod, hairWind: .12, blush: .4, sweat: .5 }));
  g.restore();
  const ap = eBack(seg(t, a + .5, a + .85)); if (ap > 0) { // the question: shall we walk?
    const bx = 1030, by = 200; g.save(); g.translate(bx, by); g.scale(ap, ap); g.translate(-bx, -by); bubble(bx, by, 300, 150, 840, 330);
    const st = Math.sin(t * 9) * .6; [[-92, '#27304f'], [-44, '#ff5a6e']].forEach(([ox, col], i) => { const x = bx + ox, y = by + 4, ph = st * (i ? -1 : 1); circ(x, y - 38, 10, col); line([[x, y - 28], [x, y + 6]], col, 6); line([[x, y + 6], [x - 12 * ph, y + 34]], col, 6); line([[x, y + 6], [x + 12 * ph, y + 34]], col, 6); line([[x, y - 18], [x + 12 * ph, y - 2]], col, 5); });
    const ax = bx + 14 + ((t * 60) % 22); line([[ax, by], [ax + 44, by]], '#27304f', 6); line([[ax + 30, by - 13], [ax + 46, by], [ax + 30, by + 13]], '#27304f', 6);
    text('?', bx + 112, by + 2, 70, '#ff5a6e', { weight: 800 }); g.restore();
  }
  heatShimmer(t, 0, H, W, 500, .5); vignette(.7);
});
/* her napkin map: a rented flat, really close, on Derech HaShalom */
function penPath(pts, k, col, w) { if (k <= 0) return null; let tot = 0; const d = []; for (let i = 1; i < pts.length; i++) { const l = Math.hypot(pts[i][0] - pts[i - 1][0], pts[i][1] - pts[i - 1][1]); d.push(l); tot += l; } let left = tot * cl(k), tip = pts[0]; g.strokeStyle = col; g.lineWidth = w; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(pts[0][0], pts[0][1]); for (let i = 1; i < pts.length; i++) { if (left >= d[i - 1]) { g.lineTo(pts[i][0], pts[i][1]); left -= d[i - 1]; tip = pts[i]; } else { const q = left / d[i - 1]; tip = [lerp(pts[i - 1][0], pts[i][0], q), lerp(pts[i - 1][1], pts[i][1], q)]; g.lineTo(tip[0], tip[1]); break; } } g.stroke(); return k < 1 ? tip : null; }
function napkinMap(t, a) {
  g.fillStyle = '#c9a878'; g.fillRect(0, 0, W, H); for (let i = 0; i < 9; i++) { g.strokeStyle = 'rgba(120,84,48,.22)'; g.lineWidth = 3; g.beginPath(); g.arc(-200, 900, 300 + i * 150, 0, TAU); g.stroke(); }
  glow(300, 100, 600, 'rgba(255,200,130,.25)', 1, false); const z = 1 + seg(t, a, a + 5.8) * .06;
  g.save(); g.translate(W / 2, H / 2); g.scale(z, z); g.rotate(-.045); g.translate(-W / 2, -H / 2);
  box(156, 96, 1000, 560, 'rgba(0,0,0,.2)', 6); box(140, 80, 1000, 560, '#fffdf6', 6); g.strokeStyle = 'rgba(180,170,150,.35)'; g.lineWidth = 2; g.setLineDash([2, 7]); g.strokeRect(160, 100, 960, 520); g.setLineDash([]);
  g.strokeStyle = 'rgba(160,110,60,.35)'; g.lineWidth = 9; g.beginPath(); g.arc(250, 560, 60, .4, 5.6); g.stroke();   // coffee ring
  const ink = '#2449b8', T0 = a; let tip = null; const P = (pts, t0, t1, w = 5) => { const r = penPath(pts, seg(t, t0, t1), ink, w); if (r) tip = r; };
  // the house (her rented flat) + key
  P([[820, 470], [820, 330], [900, 262], [980, 330], [980, 470], [820, 470]], T0, T0 + .7); P([[880, 470], [880, 404], [920, 404], [920, 470]], T0 + .7, T0 + .95); P([[838, 350], [870, 350], [870, 382], [838, 382], [838, 350]], T0 + .95, T0 + 1.15); P([[930, 350], [962, 350], [962, 382], [930, 382], [930, 350]], T0 + 1.15, T0 + 1.3);
  const key = seg(t, T0 + 1.3, T0 + 1.75); if (key > 0) { g.strokeStyle = ink; g.lineWidth = 5; g.beginPath(); g.arc(1040, 320, 16, 0, TAU * key); g.stroke(); P([[1040, 336], [1040, 392], [1056, 392], [1040, 378], [1054, 378]], T0 + 1.5, T0 + 1.75); }
  // the café cup and the (very short) way between them
  P([[300, 440], [310, 500], [372, 500], [382, 440], [300, 440]], L.c1f, L.c1f + .45); P([[382, 452], [404, 458], [400, 480], [378, 484]], L.c1f + .45, L.c1f + .6); P([[322, 424], [314, 408], [326, 392]], L.c1f + .6, L.c1f + .7, 4); P([[352, 424], [344, 408], [356, 392]], L.c1f + .7, L.c1f + .8, 4);
  const route = seg(t, L.c1f + .8, L.c1f + 1.7); if (route > 0) { g.strokeStyle = '#e0483a'; g.lineWidth = 6; g.setLineDash([14, 12]); g.beginPath(); for (let i = 0; i <= 40 * route; i++) { const q = i / 40, x = 410 + q * 400, y = 470 + Math.sin(q * Math.PI * 2) * 22 + 20 * q; i ? g.lineTo(x, y) : g.moveTo(x, y); tip = [x, y]; } g.stroke(); g.setLineDash([]); }
  text("2 דק'", 610, 430, 34, '#e0483a', { a: sg(t, L.c1f + 1.5, L.c1f + 1.8), weight: 600, rot: -.08 });
  // the street and its name
  P([[230, 540], [1090, 540]], 65.0, 65.6, 7); P([[230, 566], [1090, 566]], 65.3, 65.9, 3);
  const wr = seg(t, 65.1, 66.35); if (wr > 0) { g.save(); g.beginPath(); g.rect(880 - wr * 520, 150, wr * 520 + 10, 110); g.clip(); text('דרך השלום', 640, 205, 78, ink, { weight: 700, rot: -.02 }); g.restore(); tip = [880 - wr * 500, 230]; }
  P([[390, 250], [880, 244]], 66.35, 66.6, 5);
  const pin = eBack(seg(t, 66.5, 66.9)); if (pin > 0) { heart(900, 236 - (1 - pin) * 240, 2.6 * (1 + .12 * A.pulse(t)), '#ff4d7d', cl(pin)); if (t > 66.8) for (let i = 0; i < 6; i++) star4(900 + Math.cos(i + 1) * (52 + pulseIn(t, 66.8, .3) * 30), 228 + Math.sin(i + 1) * (40 + pulseIn(t, 66.8, .3) * 30), 8, '#ffb0c8', pulseIn(t, 66.8, .5)); }
  // pen + her hand (she pulls it away at the end so the map can be read)
  if (tip) { const away = sg(t, 66.75, 67.3); tip = [lerp(tip[0], 1500, away), lerp(tip[1], 900, away)];
    g.save(); g.translate(tip[0], tip[1]); g.rotate(.75 + Math.sin(t * 20) * .03); poly([[0, 0], [7, -16], [-7, -16]], '#d7dcee'); box(-8, -170, 16, 156, '#2a59c8', 5); box(-8, -64, 16, 9, '#15182c'); circ(0, -175, 8, '#15182c'); g.restore();
    const hx = tip[0] + 64, hy = tip[1] - 44; g.strokeStyle = LOOKS.her.skin; g.lineWidth = 46; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx + 16, hy + 14); g.lineTo(hx + 330, hy + 330); g.stroke(); circ(hx, hy, 34, LOOKS.her.skin);
    for (let i = 0; i < 3; i++) { line([[hx - 20, hy - 14 + i * 14], [hx - 42, hy - 2 + i * 14]], LOOKS.her.skin, 13); circ(hx - 44, hy - 1 + i * 14, 4, '#ff5a6e'); }
    g.strokeStyle = '#e7c765'; g.lineWidth = 5; g.beginPath(); g.moveTo(hx + 92, hy + 58); g.lineTo(hx + 58, hy + 92); g.stroke(); }
  g.restore(); vignette(.22);
}
S(L.c1e, (t) => napkinMap(t, L.c1e));
S(L.c1g, (t, a, b) => { // "let's get the bill"
  if (t < 68.5) {
    setCam(X.tHer - 60, 440, 1.5); const up = eBack(seg(t, a, a + .3)), wk = sg(t, a + .1, 68.5);
    let P;
    street(t, { clock: '23:59', moon: 0, sleep: .95, humid: 1.2, cafeLights: 1.15, t3up: 2 }, d => {
      if (d !== 0) return;
      const wx = lerp(3440, X.tHer - 190, wk); const WP = figure('waiter', wx, WALKY, 1, 1, poseWalk(stepPhase(wx), { t, hN: [44, -150], smile: .4, look: [1, 0] })); box(WP.handN[0] - 20, WP.handN[1] - 6, 44, 4, '#2a2e3c', 2); box(WP.handN[0] - 8, WP.handN[1] - 20, 20, 14, '#fffdf6', 1);
      cafeTable(t, { cups: .3, cupLevel: .25, push: 1 }); herAt(t, { smile: .8, look: [1, 0], blush: .4, hairWind: .1 });
      P = himAt(t, { hN: [lerp(44, 20, up), lerp(-110, -236, up) + Math.sin(t * 22) * 5], smile: .6, look: [-.6, -.3], tilt: .06 });
    });
    // the scribble-in-the-air gesture
    const [sx, sy] = toScreen(P.handN[0], P.handN[1] - 16); g.strokeStyle = 'rgba(255,240,190,.9)'; g.lineWidth = 3; g.lineCap = 'round'; g.beginPath(); for (let i = 0; i < 24 * seg(t, a + .25, a + .8); i++) { const x = sx - 30 + i * 3, y = sy - 20 + Math.sin(i * 1.3) * 9; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke();
  } else tableTop(t, { level: 0, bill: seg(t, 68.5, 68.85), hands: seg(t, 68.7, 69.1), touch: sg(t, 68.85, 69.3), spin: .03 });
});
S(L.c1h, (t, a, b) => { // tonight nobody's going to sleep
  const k = seg(t, a, b); setCam(lerp(3900, 4180, k), 70, .56);
  const up = sg(t, a, a + .5), hx = lerp(X.tHer - 60, 4260, sg(t, a + .5, b + .4)), off = sg(t, 71.3, 71.6);
  street(t, { clock: '23:59', moonX: 300, moonY: 110, sleep: lerp(.95, 1.2, k), cafeLights: lerp(1.1, .12, off), closed: off > .5, t3up: 2, humid: 1 }, d => {
    if (d !== 0) return;
    cafeTable(t, { cups: .1, cupLevel: .15, bill: 1, water: 1 });
    figure('waiter', 3520, WALKY, 1, 1, poseStand({ t, hN: [30, -140], look: [1, 0], smile: .5 }));
    if (up < 1) { himAt(t, { smile: .8, look: [1, 0] }); herAt(t, { smile: .8, look: [1, 0] }); }
    else { figure('him', hx - 44, WALKY, 1, 1, poseWalk(stepPhase(hx), { t, smile: .8, look: [.6, 0] })); figure('her', hx + 44, WALKY, 1, 1, poseWalk(stepPhase(hx) + 1.4, { t, smile: .8, skirt: Math.sin(stepPhase(hx)) * .6, hairWind: -.2, look: [-.5, 0], tilt: -.05 })); }
  });
  // the rest of the city is asleep: little z's drift up from the dark windows
  for (let i = 0; i < 10; i++) { const ph = (t * .28 + rnd(i + 3)) % 1, x = 140 + rnd(i + 11) * 1000, y = 250 - rnd(i + 5) * 150 - ph * 70; if (Math.abs(x - 560) < 240) continue; text('z', x + Math.sin(t * 2 + i) * 6, y, 16 + ph * 14, '#b9bdf0', { a: Math.sin(ph * Math.PI) * .75 * k, weight: 700, rot: -.2 }); }
});

/* =================== "na na na": the walk to her place =================== */
const BAR = n => AUD.beats[Math.min(AUD.beats.length - 1, 80 + n * 4)];     // beat 80 (0:52.7) is a downbeat
function walkers(t, x, o = {}) {
  const ph = A.beat(t) * Math.PI, bob = Math.abs(Math.sin(ph)) * 3, sing = Math.max(0, Math.sin(A.beat(t) * TAU)) * .5;
  const a = figure('him', x - 46, WALKY - bob, 1, 1, poseWalk(ph, { t, stride: 34, swing: 26, smile: .8, open: sing, look: [.7, 0], tilt: Math.sin(ph) * .04, ...o.him }));
  const tw = o.twirl || 0, dir = Math.cos(tw * TAU) >= 0 ? 1 : -1;
  g.save(); const c = figure('her', x + 46, WALKY - bob, 1, dir, poseWalk(ph + 1.5, { t, stride: 34, swing: 24 + tw * 20, smile: .9, open: sing, skirt: Math.sin(ph) * .7 + Math.sin(tw * Math.PI) * 1.5, hairWind: -.25 - Math.sin(tw * Math.PI) * .6, look: [-.6, 0], tilt: -Math.sin(ph) * .05, ...o.her })); g.restore();
  // they hum along: notes pop out on the beat
  for (let i = 0; i < 5; i++) { const ph2 = ((A.beat(t) / 2 + i / 5) % 1), who = i % 2 ? a : c; note(who.head[0] + 30 + ph2 * 40 + Math.sin(i * 3) * 20, who.head[1] - 30 - ph2 * 120, .9 + .3 * A.pulse(t), ['#ffd98a', '#ff9ab5', '#9fdcff'][i % 3], Math.sin(ph2 * Math.PI) * .95, Math.sin(t * 2 + i) * .3); }
  return [a, c];
}
S(L.na, (t, a, b) => { // past the shuttered shops
  const x = 4380 + (A.beat(t) - A.beat(a)) * 68; camG(x + 150, 1.0);
  street(t, { busClock: '23:59', moonX: 1060, moonY: 90, sleep: 1.1, cafeLights: .12, closed: 1, t3up: 2, humid: .8 }, d => { if (d === 0) walkers(t, x); });
});
S(BAR(9), (t, a, b) => { // the kiosk: she spins, he applauds
  const x = 4960 + (A.beat(t) - A.beat(a)) * 68; camG(x + 170, .95);
  const tw = sg(t, a + .9, a + 1.75);
  street(t, { busClock: '23:59', moonX: 1060, moonY: 90, sleep: 1.1, humid: .8 }, d => { if (d === 0) walkers(t, x, { twirl: tw < 1 ? tw : 0, him: tw > 0 && tw < 1 ? { hN: [30, -170 + Math.sin(t * 20) * 6], hF: [24, -166 - Math.sin(t * 20) * 6] } : {} }); });
});
S(BAR(10), (t, a, b) => { // the bus stop: its clock turns midnight
  const x = 5560 + (A.beat(t) - A.beat(a)) * 68; camG(5760, 1.0);
  const mid = 78.0, fl = pulseIn(t, mid, .25);
  street(t, { busClock: t < mid ? '23:59' : '00:00', moonX: 1060, moonY: 90, sleep: 1.1, humid: .8 }, d => { if (d === 0) walkers(t, x, { him: t > mid && t < mid + .7 ? { hN: [40, -230], look: [.2, -1] } : {} }); });
  const [sx, sy] = toScreen(U(SU.bus), UY(FY - 164)); glow(sx, sy, 300, 'rgba(255,120,80,.8)', fl); for (let i = 0; i < 10; i++) star4(sx + Math.cos(i * .63) * (60 + (t - mid) * 220), sy + Math.sin(i * .63) * (40 + (t - mid) * 160), 12, '#ffd9a0', t > mid ? pulseIn(t, mid, .5) : 0, i);
});
S(BAR(11), (t, a, b) => { // the cat on the wall watches them reach the corner: Derech HaShalom
  const x = 6960 + (A.beat(t) - A.beat(a)) * 76, k = seg(t, a, b); setCam(lerp(7360, 7440, k), lerp(340, 300, k), lerp(.9, 1.0, k));
  const pt = sg(t, 80.3, 80.7);
  street(t, { moonX: 1090, moonY: 90, sleep: 1.1, humid: .8, signGlow: .5 + .5 * A.pulse(t), catLook: cl((x - 6950) / 220, -1, 1) }, d => { if (d === 0) walkers(t, x, { her: pt > 0 ? { hN: [lerp(4, 46, pt), lerp(-108, -236, pt)], look: [.5, -.8] } : {}, him: pt > 0 ? { look: [.5, -.9], tilt: -.1 } : {} }); });
});
