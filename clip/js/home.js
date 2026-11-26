"use strict";
/* ===== interiors: stairwell, her apartment, the balcony ===== */
const FL = 620;                       // floor line of interior sets
const RX = { door: 200, fan: 400, lamp: 492, ch1: 655, table: 790, ch2: 925, ac: 800, side: 1200, fridge: 1455, hall: 1820 };

/* ---------- props ---------- */
function armchair(x, y, dir, col, part) { // part 0 = back/seat (behind the sitter), 1 = near armrest (in front)
  const dk = mixHex(col, '#000000', .28), lt = mixHex(col, '#ffffff', .14);
  g.save(); g.translate(x, y); g.scale(dir, 1);
  if (part === 0) {
    box(-52, -10, 8, 10, '#5a3a22', 2); box(44, -10, 8, 10, '#5a3a22', 2);
    g.save(); g.translate(-40, -40); g.rotate(-.1); box(-22, -116, 40, 122, dk, 16); box(-16, -112, 30, 100, col, 13); g.restore();
    box(-56, -40, 114, 32, dk, 10); box(-34, -60, 88, 26, col, 10); box(-34, -60, 88, 6, lt, 6);
  } else { box(-50, -94, 104, 20, lt, 10); box(-46, -80, 96, 46, col, 10); box(-46, -44, 96, 8, dk, 4); }
  g.restore();
}
function sideTable(x, y) { g.save(); g.translate(x, y); line([[0, -80], [-26, 0]], '#5a3a22', 5); line([[0, -80], [26, 0]], '#5a3a22', 5); line([[0, -80], [0, -4]], '#4a2e1a', 5); box(-52, -90, 104, 9, '#a87446', 4); box(-52, -83, 104, 3, 'rgba(0,0,0,.25)', 2); g.restore(); }
function wineGlass(x, y, s = 1, fill = 0, o = {}) {
  g.save(); g.translate(x, y); g.scale(s, s); if (o.rot) g.rotate(o.rot);
  if (fill > 0) { g.save(); g.beginPath(); g.moveTo(-12, -54); g.bezierCurveTo(-13, -30, -5, -26, 0, -26); g.bezierCurveTo(5, -26, 13, -30, 12, -54); g.closePath(); g.clip(); box(-14, -27 - 26 * cl(fill), 28, 30, 'rgba(250,238,150,.9)'); box(-14, -27 - 26 * cl(fill), 28, 2.5, 'rgba(255,252,220,.95)'); g.restore(); }
  g.strokeStyle = 'rgba(235,245,255,.9)'; g.lineWidth = 1.7; g.lineCap = 'round'; g.beginPath(); g.moveTo(-12, -56); g.bezierCurveTo(-13, -30, -5, -26, 0, -26); g.bezierCurveTo(5, -26, 13, -30, 12, -56); g.moveTo(0, -26); g.lineTo(0, -3); g.moveTo(-10, -1); g.lineTo(10, -1); g.stroke();
  g.strokeStyle = 'rgba(255,255,255,.5)'; g.lineWidth = 1.2; g.beginPath(); g.moveTo(-8, -50); g.quadraticCurveTo(-9, -38, -5, -32); g.stroke();
  g.restore();
}
function wineBottle(x, y, s = 1, rot = 0, o = {}) { // white wine
  const { cork = 1, level = .8 } = o;
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  g.fillStyle = '#6f9a4a'; g.beginPath(); g.moveTo(-11, 0); g.lineTo(-11, -52); g.quadraticCurveTo(-11, -66, -4.5, -74); g.lineTo(-4.5, -98); g.lineTo(4.5, -98); g.lineTo(4.5, -74); g.quadraticCurveTo(11, -66, 11, -52); g.lineTo(11, 0); g.closePath(); g.fill();
  g.save(); g.clip(); box(-11, -62 * level, 22, 62, 'rgba(250,240,160,.42)'); g.restore();
  box(-11, -46, 22, 28, '#f6f0dc'); box(-11, -46, 22, 4, '#c9a94e'); text('לבן', 0, -30, 9, '#6b5a2a', { weight: 700 });
  box(-5, -100, 10, 9, '#d9c36a', 2); if (cork > 0) box(-3.5, -108 + (1 - cork) * 2, 7, 9, '#c9a070', 2);
  g.fillStyle = 'rgba(255,255,255,.28)'; g.fillRect(-8, -60, 3, 50);
  g.restore();
}
function acUnit(t, x, y, on = 0, temp = 18) {
  box(x - 112, y - 34, 224, 68, '#eef1f5', 12); box(x - 112, y + 18, 224, 16, '#dfe4ec', [0, 0, 12, 12]); box(x - 100, y - 22, 200, 3, '#d3d9e2', 1); box(x - 100, y - 14, 200, 3, '#d3d9e2', 1);
  g.save(); g.translate(x, y + 30); g.rotate(0); box(-96, -2 + on * 3, 192, 5 + on * 5, on > .1 ? '#3a4a66' : '#c5ccd8', 2); g.restore();
  circ(x + 92, y + 6, 3.5, on > .1 ? '#35e08a' : '#b8404a'); if (on > .1) { glow(x + 92, y + 6, 16, 'rgba(53,224,138,.8)'); ltr(temp + '°', x + 66, y + 6, 13, '#5cc8ff'); }
}
function coldAir(t, x, y, on, o = {}) { // streams & snowflakes falling from the AC
  if (on <= 0) return; const { w = 190, h = 420, n = 14 } = o;
  glow(x, y + 40, 280, 'rgba(120,210,255,.5)', on * (.7 + .3 * A.pulse(t)));
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < n; i++) { const ph = (t * .45 + rnd(i + 20)) % 1, px = x - w / 2 + rnd(i) * w + (rnd(i + 3) - .5) * ph * 220, py = y + 34 + ph * h; g.strokeStyle = `rgba(200,240,255,${on * .55 * Math.sin(ph * Math.PI)})`; g.lineWidth = 3; g.beginPath(); g.moveTo(px, py); g.bezierCurveTo(px - 22, py + 26, px + 22, py + 52, px + Math.sin(t * 1.5 + i) * 16, py + 84); g.stroke(); }
  for (let i = 0; i < 26; i++) { const ph = (t * .28 + rnd(i + 90)) % 1, px = x - w / 2 - 60 + rnd(i + 5) * (w + 120) + Math.sin(t + i) * 22, py = y + 30 + ph * (h + 30), a = on * Math.sin(ph * Math.PI) * .9; snow(px, py, 5 + rnd(i) * 6, a, t * .6 + i); }
  g.restore();
}
function snow(x, y, r, a, rot = 0) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.strokeStyle = '#eaf8ff'; g.lineWidth = Math.max(1, r * .22); g.lineCap = 'round'; for (let i = 0; i < 3; i++) { g.rotate(Math.PI / 3); g.beginPath(); g.moveTo(-r, 0); g.lineTo(r, 0); g.moveTo(r * .55, 0); g.lineTo(r * .85, -r * .3); g.moveTo(r * .55, 0); g.lineTo(r * .85, r * .3); g.moveTo(-r * .55, 0); g.lineTo(-r * .85, -r * .3); g.moveTo(-r * .55, 0); g.lineTo(-r * .85, r * .3); g.stroke(); } g.restore(); }
function standFan(t, x, y, on = 1) { // turns slowly, moving hot air around
  line([[x - 26, y], [x + 26, y]], '#2a2e3c', 7); line([[x, y], [x, y - 150]], '#3a3f52', 6);
  const yaw = Math.sin(t * .7) * .8, rx = 34 * Math.abs(Math.cos(yaw * .6)) + 8;
  g.save(); g.translate(x + yaw * 6, y - 168); ell(0, 0, rx + 5, 39, '#2a2e3c'); ell(0, 0, rx, 34, '#b9c2d6');
  g.save(); g.rotate(t * 9 * on); for (let i = 0; i < 3; i++) { g.rotate(TAU / 3); g.fillStyle = 'rgba(70,80,110,.6)'; g.beginPath(); g.ellipse(rx * .45, 0, rx * .5, 10, 0, 0, TAU); g.fill(); } g.restore();
  g.strokeStyle = 'rgba(40,46,60,.7)'; g.lineWidth = 1; for (let i = 0; i < 8; i++) { const a = i / 8 * Math.PI; g.beginPath(); g.moveTo(Math.cos(a) * rx, Math.sin(a) * 34); g.lineTo(-Math.cos(a) * rx, -Math.sin(a) * 34); g.stroke(); } circ(0, 0, 5, '#2a2e3c'); g.restore();
}
function cityView(t, x, y, w, h, dawn = 0, o = {}) { // what you see through a window / from the balcony
  panel(x, y, w, h, 0, () => {
    const top = mix(mix([8, 12, 42], [36, 52, 104], seg(dawn, 0, .5)), [118, 168, 222], seg(dawn, .5, 1)), low = mix(mix([70, 40, 98], [226, 124, 112], seg(dawn, 0, .5)), [255, 216, 160], seg(dawn, .5, 1));
    g.fillStyle = grad(y, y + h, [rgb(top), rgb(low)]); g.fillRect(x, y, w, h);
    for (let i = 0; i < 24; i++) { g.globalAlpha = (1 - seg(dawn, .1, .6)) * (.3 + .5 * Math.sin(t * 2 + i * 3) ** 2); g.fillStyle = '#fff'; g.fillRect(x + rnd(i + 5) * w, y + rnd(i + 9) * h * .5, 1.6, 1.6); } g.globalAlpha = 1;
    if (o.moon !== 0) moon(x + w * (o.mx ?? .7), y + h * .2 + dawn * h * .35, o.mr ?? 13, .5, 1 - seg(dawn, .35, .8));
    if (dawn > .45) glow(x + w * (o.sx ?? .78), y + h * .86, w * .7, 'rgba(255,214,130,.9)', seg(dawn, .45, 1));
    for (let L = 0; L < 2; L++) { const n = Math.ceil(w / (L ? 26 : 34)) + 1; for (let i = 0; i < n; i++) { const bw = L ? 26 : 34, bh = (L ? .2 : .32) * h * (.5 + rnd(i * 3 + L * 50 + (o.seed || 0)) * .9), bx = x + i * bw - 6, by = y + h - bh; g.fillStyle = L ? mixHex('#0d1034', '#5a628f', dawn) : mixHex('#161a48', '#8a90b8', dawn); g.fillRect(bx, by, bw - 3, bh); if (L === 1 && rnd(i + 70) > .5) { g.fillRect(bx + 5, by - 7, 6, 7); } for (let yy = by + 5; yy < y + h - 4; yy += 9) for (let xx = bx + 4; xx < bx + bw - 8; xx += 7) { const k = rnd(i * 9.1 + yy * .7 + xx * .3 + L); if (k > .68) { g.globalAlpha = (1 - dawn) * .8; g.fillStyle = k > .93 ? '#9fdcff' : '#ffd98a'; g.fillRect(xx, yy, 3, 4); g.globalAlpha = 1; g.fillStyle = L ? mixHex('#0d1034', '#5a628f', dawn) : mixHex('#161a48', '#8a90b8', dawn); } } } }
  });
}

/* ---------- her living room. actors(0) sits between the armchair backs and armrests, actors(1) is in front of everything ---------- */
function room(t, st = {}, actors = null) {
  const { lamp = 1, cool = 0, ac = 0, acTemp = 18, curtain = 0, fridge = 0, bed = 0, dawn = 0, music = 0, hall = 0, fairy = lamp, chairs = 0 } = st;
  const lit = cl(lamp), day = seg(dawn, .3, 1) * .7, L = Math.max(lit, day);
  const wall = mix(mix(mix([38, 36, 70], [178, 112, 92], lit), [214, 190, 170], day * (1 - lit * .5)), [78, 110, 156], cool * .72), wallC = rgb(wall), wallD = rgb(mix(wall, [10, 10, 30], .35));
  const floor = mix(mix(mix([24, 22, 44], [124, 84, 56], lit), [150, 120, 96], day * (1 - lit * .5)), [58, 76, 108], cool * .6);
  layer(1, () => {
    g.fillStyle = grad(-200, FL, [wallD, wallC, wallC]); g.fillRect(-300, -300, 2600, FL + 300);
    // floor boards
    box(-300, FL, 2600, 300, rgb(floor)); for (let i = 0; i < 30; i++) box(-300 + i * 88, FL, 2, 300, 'rgba(0,0,0,.14)'); box(-300, FL + 46, 2600, 2, 'rgba(0,0,0,.12)'); box(-300, FL - 14, 2600, 14, rgb(mix(wall, [255, 255, 255], .25)));
    // ---- balcony door with the night outside
    cityView(t, 66, 150, 268, FL - 150, dawn, { seed: 3 });
    for (let i = 0; i < 12; i++) box(72 + i * 23, FL - 96, 3, 96, 'rgba(20,24,50,.8)'); box(66, FL - 100, 268, 5, 'rgba(20,24,50,.9)');          // balcony rail
    g.save(); g.globalAlpha = .1; poly([[90, 150], [150, 150], [90, FL], [30, FL]], '#fff'); poly([[230, 150], [260, 150], [200, FL], [170, FL]], '#fff'); g.restore();
    g.strokeStyle = rgb(mix(wall, [255, 255, 255], .55)); g.lineWidth = 10; g.strokeRect(66, 150, 268, FL - 150); line([[200, 150], [200, FL]], rgb(mix(wall, [255, 255, 255], .55)), 7);
    // sheer curtains
    box(30, 126, 340, 7, '#5a3a22', 3);
    [[40, 1], [362, -1]].forEach(([cx, d], ci) => { g.fillStyle = `rgba(255,244,230,${.55 + .2 * L})`; g.beginPath(); g.moveTo(cx, 132); g.lineTo(cx + d * 64, 132); for (let k = 0; k <= 12; k++) { const q = k / 12, yy = 132 + q * (FL - 140), sw = curtain * q * (26 + 12 * Math.sin(t * 3 + k * .7 + ci)) + Math.sin(t * .8 + k + ci) * 2 * q; g.lineTo(cx + d * (64 + 8 * Math.sin(k * 1.6)) + sw, yy); } for (let k = 12; k >= 0; k--) { const q = k / 12, yy = 132 + q * (FL - 140), sw = curtain * q * 14 * Math.sin(t * 3 + k * .5 + ci); g.lineTo(cx + sw, yy); } g.fill(); g.strokeStyle = 'rgba(180,150,130,.25)'; g.lineWidth = 1.5; for (let k = 1; k < 4; k++) { g.beginPath(); g.moveTo(cx + d * k * 16, 134); g.lineTo(cx + d * k * 17 + curtain * 18 * Math.sin(t * 3 + k), FL - 12); g.stroke(); } });
    // ---- wall: pictures, fairy lights, shelf
    const frame = (x, y, w, h, fn) => { box(x - 6, y - 6, w + 12, h + 12, '#2a1c18', 3); box(x, y, w, h, '#f3ecdf'); panel(x + 6, y + 6, w - 12, h - 12, 0, fn); };
    frame(566, 214, 110, 140, () => { box(566, 214, 110, 140, '#2a7fb8'); box(566, 214, 110, 70, '#ffb86a'); circ(621, 282, 24, '#fff0c4'); for (let i = 0; i < 4; i++) line([[576, 298 + i * 12], [606, 294 + i * 12], [636, 298 + i * 12], [670, 294 + i * 12]], 'rgba(255,255,255,.5)', 2); });
    frame(1010, 236, 90, 90, () => { box(1010, 236, 90, 90, '#e9e2cf'); circ(1040, 268, 22, '#ff5a6e'); circ(1068, 292, 26, 'rgba(42,89,200,.85)'); box(1022, 300, 60, 6, '#f4d35e'); });
    frame(1128, 196, 64, 84, () => { box(1128, 196, 64, 84, '#1f5a3c'); for (let i = 0; i < 5; i++) { g.fillStyle = '#7fd08f'; g.beginPath(); g.ellipse(1160, 250 - i * 6, 20 - i * 3, 7, (i % 2 ? 1 : -1) * .5, 0, TAU); g.fill(); } });
    g.strokeStyle = 'rgba(30,20,20,.6)'; g.lineWidth = 1.5; g.beginPath(); g.moveTo(390, 150); for (let i = 0; i <= 12; i++) g.quadraticCurveTo(390 + i * 56 + 28, 172, 390 + (i + 1) * 56, 150); g.stroke();
    for (let i = 0; i < 26; i++) { const q = (i + .5) / 26, fx = 390 + q * 728, fy = 150 + Math.sin((q * 13) % 1 * Math.PI) * 11 + 2, on = fairy * (.55 + .45 * Math.sin(t * 2.4 + i * 1.9)) * (.75 + .5 * A.pulse(t) * ((i + Math.floor(A.beat(t))) % 2)); glow(fx, fy, 16, 'rgba(255,220,150,.9)', cl(on) * .8); circ(fx, fy, 2.3, fairy > .1 ? '#fff6dc' : '#6a6a80'); }
    box(1088, 400, 224, 8, '#5a3a22', 2); const bk = ['#c9414f', '#f4d35e', '#2a7fb8', '#e9e2cf', '#1f6a4a', '#b9a0ff', '#ff8a6a', '#3a3f64']; let bx = 1096; for (let i = 0; i < 11; i++) { const bw = 8 + rnd(i + 5) * 8, bh = 40 + rnd(i + 8) * 26; box(bx, 400 - bh, bw, bh, bk[i % 8], 1); bx += bw + 1; } box(1258, 372, 22, 28, '#d8b08a', 3); g.fillStyle = '#2f8a5a'; g.beginPath(); g.ellipse(1269, 358, 9, 16, 0, 0, TAU); g.fill(); line([[1262, 356], [1258, 352]], '#e9e2cf', 1); line([[1276, 350], [1280, 346]], '#e9e2cf', 1);
    // ---- AC
    acUnit(t, RX.ac, 112, ac, acTemp);
    // ---- sideboard with a record player and a plant
    box(1090, FL - 104, 230, 96, '#7a4e2e', 6); box(1090, FL - 104, 230, 8, '#96643c', 4); box(1100, FL - 86, 100, 70, '#6a4226', 4); box(1210, FL - 86, 100, 70, '#6a4226', 4); circ(1192, FL - 52, 3, '#d8b65a'); circ(1218, FL - 52, 3, '#d8b65a'); box(1098, FL - 8, 8, 8, '#4a2e1a'); box(1304, FL - 8, 8, 8, '#4a2e1a');
    box(1104, FL - 124, 110, 20, '#2a2e3c', 4); g.save(); g.translate(1150, FL - 126); g.scale(1, .28); g.rotate(t * 3.4 * (music > 0 ? 1 : 0)); circ(0, 0, 38, '#101018'); circ(0, 0, 13, '#ff5a6e'); box(-1, -36, 2, 20, 'rgba(255,255,255,.25)'); g.restore(); line([[1204, FL - 138], [1176, FL - 128]], '#c9ced8', 3); circ(1204, FL - 138, 4, '#8a90a8');
    if (music > 0) for (let i = 0; i < 4; i++) { const ph = (t * .3 + i / 4) % 1; note(1160 + Math.sin(t * 2 + i * 2) * 26 + ph * 40, FL - 150 - ph * 170, 1 + .4 * A.pulse(t), ['#ffd98a', '#ff9ab5', '#9fdcff'][i % 3], music * Math.sin(ph * Math.PI), Math.sin(t + i) * .3); }
    box(1258, FL - 142, 40, 38, '#c97a5a', [3, 3, 8, 8]); g.fillStyle = '#1f6a4a'; for (let i = 0; i < 6; i++) { g.save(); g.translate(1278, FL - 142); g.rotate((i - 2.5) * .42 + Math.sin(t * 1.2 + i) * .02 + curtain * .06 * Math.sin(t * 4 + i)); g.beginPath(); g.ellipse(0, -44, 13, 34, 0, 0, TAU); g.fill(); g.strokeStyle = 'rgba(0,0,0,.2)'; g.lineWidth = 1; g.beginPath(); g.moveTo(0, -12); g.lineTo(0, -74); g.stroke(); g.restore(); }
    // ---- kitchenette: cabinets, tiles, counter, fridge
    box(1380, 196, 330, 96, '#e6dccb', 4); for (let i = 0; i < 3; i++) { g.strokeStyle = 'rgba(0,0,0,.14)'; g.lineWidth = 2; g.strokeRect(1386 + i * 108, 202, 102, 84); circ(1396 + i * 108, 276, 3, '#8a6a4a'); }
    for (let r = 0; r < 5; r++) for (let c = 0; c < 6; c++) box(1522 + c * 31, 304 + r * 31, 29, 29, (r + c) % 2 ? '#dfeef0' : '#cfe4e8', 2);
    box(1516, FL - 162, 200, 12, '#d9d2c4', 2); box(1520, FL - 150, 196, 150, '#5d7f86', 3); for (let i = 0; i < 2; i++) { g.strokeStyle = 'rgba(0,0,0,.18)'; g.lineWidth = 2; g.strokeRect(1528 + i * 94, FL - 142, 86, 134); }
    box(1560, FL - 196, 34, 34, '#c9ced8', [10, 10, 3, 3]); line([[1594, FL - 186], [1606, FL - 180]], '#c9ced8', 4); for (let i = 0; i < 3; i++) box(1630 + i * 14, FL - 162 - 26 - i * 5, 9, 26 + i * 5, ['#6f9a4a', '#d8b65a', '#7a2f2f'][i], 2);
    box(RX.fridge - 56, FL - 300, 112, 300, '#dfe4ec', 8); box(RX.fridge - 56, FL - 206, 112, 3, '#b9c0cc');
    for (let i = 0; i < 4; i++) box(RX.fridge - 40 + (i % 2) * 44 + (i > 1 ? 10 : 0), FL - 270 + Math.floor(i / 2) * 26, 26, 18, ['#ff8a6a', '#f4d35e', '#9fdcff', '#b9a0ff'][i], 2); // magnets & notes
    if (fridge > 0) { // door swung open: shelves with white wine
      const fx = RX.fridge - 56, fw = 112; box(fx + 4, FL - 296, fw - 8, 196, '#f8fbff', 4); glow(fx + fw / 2, FL - 200, 230, 'rgba(210,235,255,.75)', fridge);
      for (let s2 = 0; s2 < 3; s2++) { box(fx + 6, FL - 240 + s2 * 48, fw - 12, 3, '#b9c8d8'); for (let k = 0; k < 4; k++) { const kk = rnd(s2 * 5 + k); if (s2 === 0) wineBottle(fx + 20 + k * 24, FL - 240, .45, 0, {}); else box(fx + 12 + k * 24, FL - 240 + s2 * 48 - 14 - kk * 14, 16, 14 + kk * 14, ['#f4d35e', '#ff8a6a', '#e9e2cf', '#7fd08f'][k], 3); } }
      g.save(); g.translate(fx, FL - 300); box(-lerp(0, 96, fridge), 0, lerp(8, 96, fridge) + 8, 200, '#cfd6e0', 6); g.restore();
    } else line([[RX.fridge - 44, FL - 250], [RX.fridge - 44, FL - 220]], '#8a90a8', 4);
    // ---- hallway to the bedroom
    box(RX.hall - 80, 150, 180, FL - 150, 'rgba(8,8,26,.75)'); g.strokeStyle = rgb(mix(wall, [255, 255, 255], .45)); g.lineWidth = 8; g.strokeRect(RX.hall - 80, 150, 180, FL - 150);
    if (bed > 0) { g.save(); g.globalAlpha = bed; g.fillStyle = gradX(RX.hall - 20, RX.hall + 90, ['rgba(255,190,130,0)', 'rgba(255,200,140,.95)']); g.fillRect(RX.hall + 10, 170, 80, FL - 170); g.restore(); glow(RX.hall + 60, FL - 200, 260, 'rgba(255,180,120,.55)', bed); box(RX.hall + 6, 164, 10, FL - 164, '#7a4e2e'); poly([[RX.hall - 70, FL], [RX.hall + 16, FL], [RX.hall - 160, FL + 110], [RX.hall - 330, FL + 110]], `rgba(255,200,140,${.22 * bed})`); }
    // ---- rug, fan, floor lamp
    ell(RX.table, FL + 22, 330, 26, rgb(mix(floor, [200, 80, 90], .45))); g.strokeStyle = 'rgba(255,230,200,.25)'; g.lineWidth = 3; g.beginPath(); g.ellipse(RX.table, FL + 22, 300, 20, 0, 0, TAU); g.stroke(); g.beginPath(); g.ellipse(RX.table, FL + 22, 220, 13, 0, 0, TAU); g.stroke();
    standFan(t, RX.fan, FL, 1 - ac * .7);
    line([[RX.lamp - 24, FL], [RX.lamp + 24, FL]], '#2a1c18', 7); line([[RX.lamp, FL], [RX.lamp, FL - 290]], '#2a1c18', 5); poly([[RX.lamp - 44, FL - 280], [RX.lamp + 44, FL - 280], [RX.lamp + 28, FL - 350], [RX.lamp - 28, FL - 350]], mixHex('#6a5a50', '#ffd9a0', lit));
    glow(RX.lamp, FL - 300, 520, 'rgba(255,196,120,.55)', lit * (.92 + .08 * A.pulse(t)) * (1 - cool * .45)); glow(RX.lamp, FL - 300, 150, 'rgba(255,230,180,.7)', lit);
    // ---- seating
    const cx1 = RX.ch1 + chairs * 60, cx2 = RX.ch2 - chairs * 60;
    armchair(cx1, FL, 1, '#d9a441', 0); armchair(cx2, FL, -1, '#3f8f8a', 0); sideTable(RX.table, FL);
    if (actors) actors(0);
    armchair(cx1, FL, 1, '#d9a441', 1); armchair(cx2, FL, -1, '#3f8f8a', 1);
    if (actors) actors(1);
  });
  // room tone
  if (lit < 1) tint('#060818', (1 - L) * .45);
  if (cool > 0) tint('#3a78c8', cool * .13);
}

/* ---------- stairwell (side cut-away). k = floor index for floor y. actors('B') is behind the front flight, actors('A') in front ---------- */
const ST = { fh: 340, x0: 520, x1: 1000 };
const stairY = k => FL - k * ST.fh;
function stairPos(u) { // u in floors: integer = apartment landing; .0-.5 front flight (to the right), .5-1 back flight (to the left)
  const k = Math.floor(u), f = u - k, y0 = stairY(k);
  if (f < .5) { const q = f / .5; return { x: ST.x0 + q * (ST.x1 - ST.x0), y: y0 - q * ST.fh / 2, dir: 1, part: 'A' }; }
  const q = (f - .5) / .5; return { x: ST.x1 - q * (ST.x1 - ST.x0), y: y0 - ST.fh / 2 - q * ST.fh / 2, dir: -1, part: 'B' };
}
function stairwell(t, st = {}, actors = null) {
  const { light = 1 } = st, wall = mixHex('#23264a', '#cbb894', light), wallD = mixHex('#191b38', '#a8946f', light), stepC = mixHex('#2f3358', '#8c8a96', light), stepD = mixHex('#23264a', '#6d6b78', light);
  layer(1, () => {
    box(-200, -1400, 1900, 2400, wall);
    const [, ,] = [0, 0, 0];
    for (let k = -1; k < 5; k++) {
      const y = stairY(k), ym = y - ST.fh / 2;
      // mid-landing window
      if (k >= 0) { cityView(t, 1090, ym - 230, 130, 150, 0, { seed: k * 7, mx: .6, mr: 15 }); g.strokeStyle = wallD; g.lineWidth = 8; g.strokeRect(1090, ym - 230, 130, 150); line([[1155, ym - 230], [1155, ym - 80]], wallD, 4); }
      // back flight (B): mid-landing (right) up to the next floor (left)
      const n = 8, sw = (ST.x1 - ST.x0) / n, sh = ST.fh / 2 / n;
      g.fillStyle = stepD; g.beginPath(); g.moveTo(ST.x1, ym); for (let i = 0; i < n; i++) { g.lineTo(ST.x1 - i * sw, ym - (i + 1) * sh); g.lineTo(ST.x1 - (i + 1) * sw, ym - (i + 1) * sh); } g.lineTo(ST.x0, ym - ST.fh / 2 + 30); g.lineTo(ST.x1, ym + 30); g.closePath(); g.fill();
      line([[ST.x1, ym - 96], [ST.x0, ym - ST.fh / 2 - 96]], mixHex('#15172e', '#5a4a3a', light), 5);
    }
    if (actors) actors('B');
    for (let k = -1; k < 5; k++) {
      const y = stairY(k), ym = y - ST.fh / 2, n = 8, sw = (ST.x1 - ST.x0) / n, sh = ST.fh / 2 / n;
      // landing slab (apartment side) + mid landing
      box(-200, y, ST.x0 + 200, 26, stepC); box(-200, y + 26, ST.x0 + 200, 6, 'rgba(0,0,0,.25)'); box(ST.x1, ym, 700, 26, stepC); box(ST.x1, ym + 26, 700, 6, 'rgba(0,0,0,.25)');
      // apartment door, name plate, doormat, peephole
      box(196, y - 262, 128, 262, wallD, 3); box(204, y - 254, 112, 254, k === 2 ? '#7a4e2e' : mixHex('#3a2a2a', '#6a5040', light), 3); box(216, y - 240, 88, 100, 'rgba(0,0,0,.12)', 3); box(216, y - 124, 88, 104, 'rgba(0,0,0,.12)', 3); circ(260, y - 168, 3.5, '#d8b65a'); circ(302, y - 128, 6, '#d8b65a'); box(238, y - 196, 44, 14, '#e9e2cf', 2);
      box(204, y - 6, 112, 6, k === 2 ? '#c9414f' : '#5a6a4a', 2);
      if (k % 2 === 0) { box(120, y - 60, 40, 60, '#c97a5a', [3, 3, 8, 8]); g.fillStyle = '#1f6a4a'; for (let i = 0; i < 5; i++) { g.beginPath(); g.ellipse(140 + (i - 2) * 12, y - 86 - (i % 2) * 14, 9, 26, (i - 2) * .3, 0, TAU); g.fill(); } }
      // timer light switch (glows orange in the dark) and the ceiling lamp
      box(372, y - 150, 22, 30, '#e9e2cf', 4); circ(383, y - 135, 5, mixHex('#ff8a2a', '#c9b8a0', light)); glow(383, y - 135, 26, 'rgba(255,140,40,.9)', 1 - light);
      ell(430, y - ST.fh + 34, 26, 9, '#e9e2cf'); glow(430, y - ST.fh + 44, 300, 'rgba(255,226,170,.5)', light); circ(430, y - ST.fh + 40, 9, mixHex('#4a4a60', '#fff6dc', light));
      // front flight (A): floor landing up to the mid-landing on the right
      g.fillStyle = stepC; g.beginPath(); g.moveTo(ST.x0, y); for (let i = 0; i < n; i++) { g.lineTo(ST.x0 + i * sw, y - (i + 1) * sh); g.lineTo(ST.x0 + (i + 1) * sw, y - (i + 1) * sh); } g.lineTo(ST.x1, ym + 32); g.lineTo(ST.x0, y + 32); g.closePath(); g.fill();
      for (let i = 0; i < n; i++) box(ST.x0 + i * sw, y - (i + 1) * sh, sw, 4, 'rgba(255,255,255,.14)');
      if (k === 0) { // ground floor: mailboxes, a bicycle
        for (let r = 0; r < 3; r++) for (let c = 0; c < 4; c++) { const mx = -60 + c * 44, my = y - 220 + r * 34; box(mx, my, 40, 30, '#8a90a8', 2); box(mx + 5, my + 6, 30, 3, '#3a3f52'); box(mx + 8, my + 16, 22, 8, '#e9e2cf', 1); if (rnd(r * 4 + c) > .6) poly([[mx + 6, my + 4], [mx + 30, my], [mx + 34, my + 8], [mx + 10, my + 10]], '#f4f1e6'); }
      }
    }
    if (actors) actors('A');
    // front railing
    for (let k = -1; k < 5; k++) { const y = stairY(k), ym = y - ST.fh / 2; line([[ST.x0, y - 100], [ST.x1, ym - 100]], mixHex('#15172e', '#4a3a2e', light), 7); for (let i = 0; i <= 8; i++) { const q = i / 8; line([[ST.x0 + q * 480, y - q * 170 - 100], [ST.x0 + q * 480, y - q * 170 - (i < 8 ? 20 : 0)]], mixHex('#15172e', '#4a3a2e', light), 3); } }
  });
  tint('#05061a', (1 - light) * .5);
}

/* ---------- the balcony at dawn (side view; the apartment is on the left) ---------- */
function balcony(t, st = {}, actors = null) {
  const { dawn = 0, wind = 0, inside = 1, acDrip = 0 } = st;
  nightSky(t, dawn); clouds(t, .8);
  moon(lerp(880, 1040, dawn), lerp(120, 330, dawn), 30, .6, 1 - seg(dawn, .45, .85));
  if (dawn > .4) { const s = seg(dawn, .4, 1); glow(1010, 560 - s * 70, 520, 'rgba(255,200,120,.9)', s); circ(1010, 590 - s * 120, 46, mixHex('#ff9a5a', '#fff0b8', s)); }
  layer(.15, () => { box(-400, 640, 2400, 300, mixHex('#141a48', '#8e7fa8', dawn)); farSkyline(t, 650, { dawn, col: mixHex('#141a48', '#8e7fa8', dawn), lit: .8 }); threeTowers(760, 650, .6, t, dawn); });
  layer(.4, () => { box(-400, 800, 2600, 300, mixHex('#1e2352', '#9a86a8', dawn)); midBlocks(t, 810, { dawn, sleep: .5, col: mixHex('#1e2352', '#9a86a8', dawn), par: .4 }); });
  layer(1, () => {
    // apartment wall with the sliding door, light from inside
    box(-300, -400, 660, 1100, mixHex('#3f4470', '#d8ccc4', dawn)); box(330, -400, 30, 1100, 'rgba(0,0,30,.2)');
    box(60, 140, 240, FL - 140, mixHex('#1a1c3a', '#ffd9a0', inside)); glow(180, 400, 420, 'rgba(255,196,120,.45)', inside * (1 - dawn * .6)); g.save(); g.globalAlpha = .5 * inside; poly([[92, 330], [150, 330], [140, 270], [102, 270]], '#e9a25a'); box(118, 330, 5, FL - 330, '#8a5a34'); box(170, FL - 150, 90, 150, '#c98a4a', 14); g.restore();
    g.strokeStyle = mixHex('#8a90b8', '#f6f0e8', dawn); g.lineWidth = 10; g.strokeRect(60, 140, 240, FL - 140);
    g.fillStyle = 'rgba(255,244,230,.5)'; g.beginPath(); g.moveTo(240, 146); for (let k = 0; k <= 10; k++) { const q = k / 10; g.lineTo(300 + wind * q * (40 + 16 * Math.sin(t * 3 + k)) + 6 * Math.sin(k * 1.7), 146 + q * (FL - 160)); } g.lineTo(236, FL - 14); g.closePath(); g.fill();
    // AC condenser on the wall, dripping
    box(170, 20, 130, 84, '#c9cee0', 6); box(178, 28, 114, 68, '#aeb4c8', 4); g.save(); g.translate(235, 62); g.strokeStyle = '#6d7390'; g.lineWidth = 2; g.beginPath(); g.arc(0, 0, 28, 0, TAU); g.stroke(); g.rotate(t * 10); for (let i = 0; i < 3; i++) { g.rotate(TAU / 3); g.fillStyle = 'rgba(70,80,110,.7)'; g.beginPath(); g.ellipse(13, 0, 13, 5, 0, 0, TAU); g.fill(); } g.restore();
    line([[290, 104], [316, 150], [316, FL - 120]], '#8a90a8', 3);
    for (let i = 0; i < 3; i++) { const ph = (t * .8 + i / 3) % 1; circ(316, FL - 118 + ph * 100, 3 * (1 - ph * .4), `rgba(170,225,255,${(1 - ph) * .9})`); }
    // slab, floor tiles, railing, plants
    box(-300, FL, 1010, 30, mixHex('#565c8c', '#e6dcd2', dawn)); box(-300, FL + 30, 1010, 10, 'rgba(0,0,30,.3)'); for (let i = 0; i < 12; i++) box(-300 + i * 86, FL, 2, 30, 'rgba(0,0,30,.2)');
    box(296, FL - 46, 44, 46, '#c97a5a', [3, 3, 8, 8]); g.fillStyle = '#1f6a4a'; for (let i = 0; i < 6; i++) { g.save(); g.translate(318, FL - 46); g.rotate((i - 2.5) * .36 + wind * .12 * Math.sin(t * 4 + i)); g.beginPath(); g.ellipse(0, -40, 11, 32, 0, 0, TAU); g.fill(); g.restore(); }
    for (let i = 0; i < 3; i++) { box(388 + i * 46, FL - 20, 30, 20, '#7a4a3a', 3); g.fillStyle = ['#ff8a9a', '#f4d35e', '#b9a0ff'][i]; for (let k = 0; k < 4; k++) circ(396 + i * 46 + k * 5 + wind * 2 * Math.sin(t * 5 + k), FL - 30 - (k % 2) * 7, 5, g.fillStyle); g.fillStyle = '#1f6a4a'; }
    if (actors) actors(0);
    for (let i = 0; i < 12; i++) box(366 + i * 30, FL - 122, 5, 122, mixHex('#22264c', '#4a4a66', dawn)); box(356, FL - 128, 354, 9, mixHex('#2c315c', '#5a5a7a', dawn), 3); box(700, FL - 128, 9, 128, mixHex('#22264c', '#4a4a66', dawn));
    if (actors) actors(1);
  });
  haze(t, .9 * (1 - dawn * .5));
}
