"use strict";
/* ===== world: sky, sea, Tel Aviv buildings and street furniture ===== */
const GY = 600;            // pavement level of the street set
const WALKY = 630;         // where people walk
const B = 2;               // buildings & street furniture are drawn in 'street units' and scaled by B around the pavement line
const FY = GY + 17;        // furniture base line (street units)
const U = x => x * B;      // street units -> world x
const UY = y => GY + (y - GY) * B;

/* ---------- sky ---------- */
function nightSky(t, dawn = 0, glowA = 1) {
  const top = mix(mix([6, 10, 36], [28, 44, 92], seg(dawn, 0, .5)), [96, 150, 214], seg(dawn, .5, 1));
  const mid = mix(mix([26, 22, 72], [96, 62, 118], seg(dawn, 0, .5)), [246, 178, 150], seg(dawn, .5, 1));
  const low = mix(mix([92, 44, 96], [222, 120, 110], seg(dawn, 0, .5)), [255, 222, 170], seg(dawn, .5, 1));
  g.fillStyle = grad(0, H, [rgb(top), rgb(mid), rgb(low)]); g.fillRect(0, 0, W, H);
  const sa = 1 - seg(dawn, .1, .6);
  if (sa > 0) for (let i = 0; i < 130; i++) {
    const x = rnd(i) * W, y = Math.pow(rnd(i + 500), 1.6) * H * .6, tw = .5 + .5 * Math.sin(t * (1 + rnd(i) * 2) + i * 7);
    g.globalAlpha = sa * (.18 + .55 * tw * rnd(i + 9)); g.fillStyle = i % 9 ? '#fff' : '#ffe3b0'; const s = 1 + rnd(i + 3) * 1.4; g.fillRect(x, y, s, s);
  }
  g.globalAlpha = 1;
  glow(W / 2, H + 60, 760, 'rgba(255,140,90,.38)', glowA * (1 - dawn * .6));   // humid city glow on the horizon
}
function moon(x, y, r = 36, halo = 1, a = 1) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a;
  glow(x, y, r * 5.5, 'rgba(255,236,190,.30)', 1);
  if (halo > 0) { g.strokeStyle = `rgba(255,240,210,${.05 * halo})`; g.lineWidth = r * .5; g.beginPath(); g.arc(x, y, r * 2.4, 0, TAU); g.stroke(); g.strokeStyle = `rgba(255,220,200,${.03 * halo})`; g.lineWidth = r * .35; g.beginPath(); g.arc(x, y, r * 3.5, 0, TAU); g.stroke(); }
  circ(x, y, r, '#fff4d2');
  g.fillStyle = 'rgba(206,186,146,.42)';[[-.32, -.22, .2], [.26, .3, .14], [.34, -.36, .1], [-.1, .42, .09], [-.5, .22, .07]].forEach(([a2, b, c]) => { g.beginPath(); g.arc(x + a2 * r, y + b * r, c * r, 0, TAU); g.fill(); });
  g.restore();
}
function clouds(t, a = .5, y0 = 150) { // thin humid cloud streaks that barely move
  for (let i = 0; i < 5; i++) { const x = ((rnd(i + 60) * 1700 + t * (1.5 + i * .4)) % 1700) - 200, y = y0 + rnd(i + 70) * 150, w = 220 + rnd(i) * 260; g.fillStyle = `rgba(200,170,220,${.05 * a})`; for (let k = 0; k < 4; k++) { g.beginPath(); g.ellipse(x + k * w * .2, y + Math.sin(k + i) * 8, w * .3, 12 + k * 3, 0, 0, TAU); g.fill(); } }
}

/* ---------- sea ---------- */
function sea(t, x0, x1, y0, y1, moonX, wind = 0, dawn = 0) {
  g.fillStyle = grad(y0, y1, [mixHex('#141a52', '#6f8fc8', dawn), mixHex('#0a1038', '#3d6aa8', dawn)]); g.fillRect(x0, y0, x1 - x0, y1 - y0);
  // moon glitter
  for (let i = 0; i < 46; i++) { const k = i / 46, y = y0 + 4 + k * (y1 - y0 - 6), w = (8 + k * 60) * (.5 + rnd(i + Math.floor(t * 3 + i * .37)) * .9), fl = .35 + .65 * Math.sin(t * 2.6 + i * 1.9); g.fillStyle = mixHex('#ffeec4', '#ffd9a0', dawn, .32 * fl * (1 - k * .5)); g.fillRect(moonX - w / 2 + Math.sin(t * .8 + i) * 6 * k, y, w, 1.6 + k * 2); }
  // swell lines
  g.lineCap = 'round';
  for (let i = 0; i < 9; i++) { const k = i / 9, y = y0 + 10 + k * k * (y1 - y0 - 20); g.strokeStyle = `rgba(190,210,255,${.07 + .1 * k + wind * .08})`; g.lineWidth = 1 + k * 2.5; g.beginPath(); for (let x = x0; x <= x1; x += 24) { const yy = y + Math.sin(x * .012 * (1.6 - k) + t * (.7 + wind) + i * 2) * (2 + k * 5 + wind * 4); x === x0 ? g.moveTo(x, yy) : g.lineTo(x, yy); } g.stroke(); }
}
function shoreWave(t, x0, x1, y, wind = 0) { // foam line rolling on the beach
  const ph = (t * (.22 + wind * .15)) % 1, reach = Math.sin(ph * Math.PI) * (26 + wind * 26);
  g.fillStyle = 'rgba(232,240,255,.85)'; g.beginPath(); g.moveTo(x0, y - 6);
  for (let x = x0; x <= x1; x += 20) g.lineTo(x, y + reach * (.7 + .3 * Math.sin(x * .02 + t)) + Math.sin(x * .07 + t * 2) * 3);
  g.lineTo(x1, y - 6); g.fill();
  g.fillStyle = 'rgba(160,190,240,.35)'; g.beginPath(); g.moveTo(x0, y - 6); for (let x = x0; x <= x1; x += 20) g.lineTo(x, y + reach * .5 * (.7 + .3 * Math.sin(x * .02 + t + 1))); g.lineTo(x1, y - 6); g.fill();
}

/* ---------- far & mid skyline (parallax layers; world coords repeat every `span`) ---------- */
function farSkyline(t, base, o = {}) {
  const { col = '#141a48', lit = .8, seed = 0, dawn = 0, scale = 1 } = o; const [vx0, vx1] = viewX(o.par ?? .12, 120);
  const bw = 46 * scale;
  for (let i = Math.floor(vx0 / bw); i < vx1 / bw; i++) {
    const r = rnd(i + seed), tall = rnd(i * 3 + seed) > .86, h = (tall ? 190 + r * 150 : 40 + r * 110) * scale, w = bw * (tall ? .9 : .6 + rnd(i + seed + 3) * .5), x = i * bw;
    g.fillStyle = col; g.fillRect(x, base - h, w, h + 4);
    if (tall && r > .5) { g.beginPath(); g.moveTo(x + w * .5, base - h - 34 * scale); g.lineTo(x + w * .5 - 2, base - h); g.lineTo(x + w * .5 + 2, base - h); g.fill(); if (Math.sin(t * 2.2 + i) > .4) glow(x + w * .5, base - h - 34 * scale, 9, 'rgba(255,60,60,.95)', 1 - dawn); }
    if (lit > 0) for (let yy = base - h + 6; yy < base - 8; yy += 9 * scale) for (let xx = x + 4; xx < x + w - 5; xx += 8 * scale) { const k = rnd(i * 13.7 + yy * .31 + xx * .17 + seed); if (k > .7) { g.globalAlpha = lit * (1 - dawn) * (.4 + .5 * rnd(k * 99)) * (k > .97 ? .6 + .4 * Math.sin(t * 6 + k * 50) : 1); g.fillStyle = k > .93 ? '#a8e4ff' : '#ffd98a'; g.fillRect(xx, yy, 3 * scale, 4 * scale); } }
    g.globalAlpha = 1;
  }
}
function threeTowers(x, base, s, t, dawn = 0) { // plain round / triangular / square towers on the horizon
  g.fillStyle = '#10163f';
  g.fillRect(x, base - 300 * s, 62 * s, 300 * s);
  g.beginPath(); g.ellipse(x + 116 * s, base - 330 * s, 34 * s, 8 * s, 0, 0, TAU); g.fill(); g.fillRect(x + 82 * s, base - 330 * s, 68 * s, 330 * s);
  poly([[x + 168 * s, base], [x + 168 * s, base - 268 * s], [x + 200 * s, base - 286 * s], [x + 232 * s, base - 268 * s], [x + 232 * s, base]], '#10163f');
  for (let r = 0; r < 24; r++) for (let c = 0; c < 20; c++) { const k = rnd(r * 17.3 + c * 5.1 + 3); const cx = x + 5 * s + c * 11.5 * s, cy = base - 262 * s + r * 10.5 * s; if (k > .5 && cx < x + 228 * s && !(cx > x + 62 * s && cx < x + 84 * s) && !(cx > x + 150 * s && cx < x + 170 * s)) { g.globalAlpha = .5 * (1 - dawn); g.fillStyle = k > .92 ? '#a8e4ff' : '#ffd98a'; g.fillRect(cx, cy, 4 * s, 5 * s); } }
  g.globalAlpha = 1;
}
function midBlocks(t, base, o = {}) {
  const { seed = 0, dawn = 0, sleep = 0, col = '#1e2352' } = o; const [vx0, vx1] = viewX(o.par ?? .45, 160); const bw = 150;
  for (let i = Math.floor(vx0 / bw); i < vx1 / bw; i++) {
    const r = rnd(i + seed + 40), h = 150 + r * 170, w = 96 + rnd(i + seed + 41) * 46, x = i * bw + rnd(i + seed + 42) * 20;
    g.fillStyle = col; g.fillRect(x, base - h, w, h + 6);
    g.fillStyle = mixHex(col, '#000000', .25); g.fillRect(x + w - 10, base - h, 10, h + 6);
    // roof clutter: water tanks, solar panel, antenna
    g.fillStyle = mixHex(col, '#000000', .15); const n = 1 + Math.floor(rnd(i + seed) * 3);
    for (let k = 0; k < n; k++) { const tx = x + 10 + k * 28 + rnd(i * 3 + k) * 8; rr(tx, base - h - 15, 13, 15, 3); g.fill(); g.fillRect(tx - 3, base - h - 2, 20, 2); poly([[tx + 15, base - h], [tx + 27, base - h - 9], [tx + 27, base - h]], '#283066'); }
    if (r > .4) { g.strokeStyle = mixHex(col, '#000000', .1); g.lineWidth = 1.5; g.beginPath(); g.moveTo(x + w - 20, base - h); g.lineTo(x + w - 20, base - h - 34); g.moveTo(x + w - 28, base - h - 28); g.lineTo(x + w - 12, base - h - 28); g.moveTo(x + w - 26, base - h - 22); g.lineTo(x + w - 14, base - h - 22); g.stroke(); }
    for (let yy = base - h + 14; yy < base - 22; yy += 26) for (let xx = x + 9; xx < x + w - 26; xx += 21) {
      const k = rnd(i * 7.7 + yy * .13 + xx * .29 + seed);
      g.fillStyle = '#141838'; g.fillRect(xx, yy, 12, 15);
      if (k > .55 && (k - .55) / .45 > sleep * 1.05) { g.globalAlpha = (1 - dawn) * (k > .9 ? .55 + .3 * Math.sin(t * 5 + k * 70) : .78); g.fillStyle = k > .9 ? '#9fdcff' : (k > .75 ? '#ffc37a' : '#ffdf9c'); g.fillRect(xx, yy, 12, 15); g.globalAlpha = 1; }
    }
  }
}

/* ---------- a Bauhaus-style Tel Aviv building ----------
   returns { x, w, top, floors:[y of each floor top], windows:[{x,y,w,h,lit}] } */
const FLOOR_H = 84;
function bauhaus(t, x, w, floors, seed, o = {}) {
  const { sleep = 0, dawn = 0, ground = 'pilotis', curve = 1, roof = true, shade = 0, special = null, gh = 96 } = o;
  const  h = floors * FLOOR_H + gh, top = GY - h;
  const wall = mixHex(mixHex('#474d7c', '#c9c2c4', dawn * .8), '#1b1d3c', shade), band = mixHex(mixHex('#5f66a0', '#efe6dc', dawn * .8), '#1b1d3c', shade), rec = mixHex('#1c2046', '#4b4f72', dawn * .6);
  const res = { x, w, top, floors: [], windows: [] };
  // side shadow + body
  box(x, top, w, h, wall); box(x + w - 14, top, 14, h, 'rgba(8,10,34,.35)');
  // roof clutter
  if (roof) {
    box(x - 4, top - 8, w + 8, 10, band, 2);
    for (let k = 0; k < Math.floor(w / 130); k++) {
      const tx = x + 26 + k * 128 + rnd(seed + k) * 30;
      poly([[tx, top - 8], [tx + 44, top - 34], [tx + 48, top - 30], [tx + 8, top - 8]], '#232a5c'); line([[tx + 8, top - 12], [tx + 44, top - 32]], 'rgba(150,190,255,.35)', 1.5);   // solar panel
      rr(tx + 40, top - 56, 20, 34, 6); g.fillStyle = mixHex('#c9cee0', '#ffffff', dawn); g.fill(); box(tx + 38, top - 22, 24, 3, '#3a3f66');                                      // boiler tank ("dud shemesh")
    }
    const ax = x + w - 46; line([[ax, top - 8], [ax, top - 70]], '#2a2e58', 2); for (let k = 0; k < 4; k++) line([[ax - 14 + k * 2, top - 64 + k * 9], [ax + 14 - k * 2, top - 64 + k * 9]], '#2a2e58', 1.5);
    if (rnd(seed + 5) > .4) { const dx = x + w * .55; g.fillStyle = '#b9bfd6'; g.beginPath(); g.ellipse(dx, top - 20, 13, 9, -.5, 0, TAU); g.fill(); line([[dx, top - 8], [dx, top - 18]], '#2a2e58', 2); }
  }
  // floors
  const nW = Math.max(2, Math.floor((w - 30) / 78)), gap = (w - 30) / nW;
  for (let f = 0; f < floors; f++) {
    const fy = top + f * FLOOR_H; res.floors.push(fy);
    box(x + 8, fy + 10, w - 16, 50, rec);                                   // recessed window band
    for (let c = 0; c < nW; c++) {
      const wx = x + 15 + c * gap + (gap - 50) / 2, wy = fy + 14, id = seed * 31 + f * 7 + c * 3, k = rnd(id);
      let lit = k > .5 && (k - .5) / .5 > sleep, tv = k > .88, isSp = special && special.f === f && special.c === c;
      if (isSp) lit = special.lit > 0;
      box(wx, wy, 50, 44, '#10132e');
      if (lit) {
        const a = isSp ? special.lit : 1;
        g.globalAlpha = a * (1 - dawn * .7); box(wx, wy, 50, 44, isSp ? (special.col || '#ffc98a') : tv ? mixHex('#7fc8ff', '#b9a0ff', .5 + .5 * Math.sin(t * 4 + k * 60)) : (k > .7 ? '#ffc37a' : '#ffdf9c'));
        if (!isSp && !tv && k > .6) { g.fillStyle = 'rgba(60,30,40,.55)'; g.beginPath(); g.arc(wx + 14 + rnd(id + 1) * 22, wy + 30, 7, 0, TAU); g.fill(); g.fillRect(wx + 7 + rnd(id + 1) * 22, wy + 36, 14, 10); } // someone at home
        g.globalAlpha = 1; glow(wx + 25, wy + 22, 70, isSp ? 'rgba(255,170,120,.35)' : 'rgba(255,200,120,.22)', a * (1 - dawn));
      } else if (rnd(id + 2) > .45) { g.fillStyle = '#252a55'; for (let s = 0; s < 6; s++) g.fillRect(wx + 2, wy + 3 + s * 7, 46, 4); } // closed shutters
      g.strokeStyle = wall; g.lineWidth = 3; g.strokeRect(wx, wy, 50, 44); line([[wx + 25, wy], [wx + 25, wy + 44]], wall, 2);
      res.windows.push({ x: wx, y: wy, w: 50, h: 44, f, c, lit });
      if (rnd(id + 4) > .72) { box(wx + 54, wy + 26, 20, 15, '#aeb4c8', 2); g.strokeStyle = '#6d7390'; g.lineWidth = 1; g.beginPath(); g.arc(wx + 64, wy + 33.5, 5, 0, TAU); g.stroke(); } // AC condenser
    }
    // curved balcony parapet
    g.fillStyle = band; const bx = x - (curve > 0 ? 10 : 0), bw = w + (curve ? 10 : 0);
    g.beginPath(); g.roundRect(bx, fy + 58, bw, 28, curve > 0 ? [14, 3, 3, 14] : curve < 0 ? [3, 14, 14, 3] : 3); g.fill();
    box(bx, fy + 58, bw, 4, 'rgba(255,255,255,.10)'); box(bx + 4, fy + 82, bw - 8, 4, 'rgba(0,0,20,.25)');
    // plants on the parapet
    for (let c = 0; c < nW; c++) if (rnd(seed * 3 + f * 11 + c) > .66) { const px = x + 30 + c * gap; box(px, fy + 50, 16, 9, '#7a4a3a', 2); g.fillStyle = '#1f5a3c'; for (let k = 0; k < 5; k++) { g.beginPath(); g.ellipse(px + 8 + (k - 2) * 5, fy + 46 - (k % 2) * 6, 5, 9, (k - 2) * .35, 0, TAU); g.fill(); } }
  }
  // ground floor
  const gy = GY - gh;
  if (ground === 'pilotis') { box(x, gy, w, gh, '#14173a'); for (let k = 0; k <= Math.floor(w / 110); k++) box(x + 12 + k * ((w - 44) / Math.max(1, Math.floor(w / 110))), gy, 20, gh, wall); box(x, gy, w, 10, band); }
  else if (ground === 'shutter') { box(x, gy, w, gh, wall); for (let k = 0; k < Math.floor(w / 150); k++) { const sx = x + 20 + k * 150; box(sx, gy + 16, 120, 80, '#2c315c'); for (let s = 0; s < 10; s++) box(sx, gy + 18 + s * 8, 120, 2, '#1f2348'); } box(x, gy, w, 10, band); }
  else { box(x, gy, w, gh, wall); box(x, gy, w, 10, band); }
  return res;
}

/* ---------- street furniture ---------- */
function lamp(t, x, o = {}) {
  const { h = 250, dir = 1, a = 1, humid = 1 } = o, y = FY, lx = x + dir * 44, ly = y - h + 6;
  line([[x, y], [x, y - h], [x + dir * 12, y - h - 6], [lx, y - h]], '#272b4a', 6); box(x - 6, y - 30, 12, 30, '#272b4a', 2);
  g.fillStyle = '#3a3f64'; g.beginPath(); g.ellipse(lx, ly - 2, 17, 6, 0, 0, TAU); g.fill();
  if (a <= 0) return;
  // light cone, bulb, humid halo rings, moths
  g.save(); g.globalAlpha *= .22 * a; g.globalCompositeOperation = 'lighter'; const gr = g.createLinearGradient(0, ly, 0, y + 30); gr.addColorStop(0, 'rgba(255,214,150,1)'); gr.addColorStop(1, 'rgba(255,214,150,0)'); g.fillStyle = gr; g.beginPath(); g.moveTo(lx - 12, ly); g.lineTo(lx + 12, ly); g.lineTo(lx + 150, y + 30); g.lineTo(lx - 150, y + 30); g.fill(); g.restore();
  glow(lx, ly + 4, 150, 'rgba(255,205,140,.55)', a); circ(lx, ly + 2, 6, '#fff3d6');
  g.strokeStyle = `rgba(255,220,170,${.07 * humid * a})`; g.lineWidth = 10; g.beginPath(); g.arc(lx, ly + 2, 52, 0, TAU); g.stroke(); g.lineWidth = 7; g.strokeStyle = `rgba(255,200,170,${.05 * humid * a})`; g.beginPath(); g.arc(lx, ly + 2, 84, 0, TAU); g.stroke();
  g.fillStyle = `rgba(255,214,150,${.16 * a})`; g.beginPath(); g.ellipse(lx, y + 4, 150, 16, 0, 0, TAU); g.fill();
  for (let i = 0; i < 5; i++) { const an = t * (2.2 + i * .7) + i * 2, r2 = 16 + 12 * Math.sin(t * 1.3 + i * 4); circ(lx + Math.cos(an) * r2 * 1.5, ly + 6 + Math.sin(an * 1.3) * r2 * .8, 1.6, `rgba(255,245,220,${.8 * a})`); }
}
function palm(x, y, s, wind = 0, t = 0, col = '#0f2d24') {
  const sway = wind * (.5 + .5 * Math.sin(t * 2.3 + x)) + Math.sin(t * .5 + x) * .008;
  g.save(); g.translate(x, y); g.scale(s, s);
  g.lineCap = 'round'; g.strokeStyle = '#2a211c'; g.lineWidth = 15; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(8 + sway * 22, -130, sway * 50, -250); g.stroke();
  g.strokeStyle = 'rgba(0,0,0,.25)'; g.lineWidth = 2; for (let k = 1; k < 12; k++) { const yy = -k * 20, xx = sway * 50 * Math.pow(k / 12.5, 1.6) + 4 * Math.sin(k / 12 * Math.PI); g.beginPath(); g.moveTo(xx - 7, yy); g.lineTo(xx + 7, yy - 3); g.stroke(); }
  g.translate(sway * 50, -250);
  for (let i = 0; i < 11; i++) {
    const a = -Math.PI / 2 + (i - 5) * .36 + sway * .5 + Math.sin(t * 3 + i) * wind * .08, L = 120 + (i % 3) * 14, droop = 50 + Math.abs(i - 5) * 9 - wind * 20;
    const ex = Math.cos(a) * L + wind * 30, ey = Math.sin(a) * L + droop;
    g.strokeStyle = col; g.lineWidth = 5; g.beginPath(); g.moveTo(0, 0); g.quadraticCurveTo(Math.cos(a) * L * .6, Math.sin(a) * L * .6 - 30, ex, ey); g.stroke();
    g.lineWidth = 2; for (let k = 2; k < 9; k++) { const q = k / 9, px = (1 - q) * (1 - q) * 0 + 2 * (1 - q) * q * Math.cos(a) * L * .6 + q * q * ex, py = 2 * (1 - q) * q * (Math.sin(a) * L * .6 - 30) + q * q * ey; g.beginPath(); g.moveTo(px, py); g.lineTo(px + (ex > 0 ? -4 : 4) + wind * 8, py + 20 - q * 6); g.stroke(); }
  }
  circ(0, 4, 9, '#3a2a1c');
  g.restore();
}
function tree(x, s = 1, wind = 0, t = 0) { // street ficus in a planter
  g.save(); g.translate(x, FY); g.scale(s, s);
  box(-22, -6, 44, 8, '#2a2d4c', 2); line([[0, -4], [-2, -90], [3, -140]], '#2a211c', 10); line([[-1, -96], [-30, -130]], '#2a211c', 6); line([[1, -110], [30, -150]], '#2a211c', 6);
  for (let i = 0; i < 9; i++) { const a = i / 9 * TAU, r = 46 + rnd(i + x) * 16, sw = wind * 8 * Math.sin(t * 3 + i); g.fillStyle = i % 2 ? '#143a2c' : '#0f2d24'; g.beginPath(); g.arc(Math.cos(a) * 44 + sw, -168 + Math.sin(a) * 30, r * .7, 0, TAU); g.fill(); }
  ell(0 + wind * 6, -170, 64, 46, '#123426');
  g.restore();
}
function flag(t, x, y, wind = 0, s = 1) { // balcony flag: hangs limp with no wind, flies in the breeze
  g.save(); g.translate(x, y); g.scale(s, s);
  line([[0, 0], [34, -64]], '#b9bfd6', 3);
  const n = 10, L = 62, hgt = 40, pts = [], pts2 = [], lift = cl(wind);
  for (let i = 0; i <= n; i++) {
    const q = i / n, ang = lerp(Math.PI / 2 - .12, -.08, lift) + Math.sin(t * 6 - q * 5) * .16 * lift * q, len = q * L;
    const px = 34 + Math.cos(ang) * len + Math.sin(t * .8) * 1.2 * q * (1 - lift), py = -64 + Math.sin(ang) * len + Math.sin(t * 7 - q * 6) * 4 * lift * q;
    const nx = -Math.sin(ang), ny = Math.cos(ang), hh = hgt * lerp(.55, 1, lift);
    pts.push([px, py]); pts2.push([px + nx * hh * lerp(.4, 1, lift) + lerp(-6, 0, lift) * q, py + ny * hh]);
  }
  g.fillStyle = '#eef1f8'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); pts2.reverse().forEach(p => g.lineTo(p[0], p[1])); g.closePath(); g.fill(); pts2.reverse();
  const band = (q0, q1) => { g.fillStyle = '#2a59c8'; g.beginPath(); pts.forEach((p, i) => { const b = pts2[i], xx = lerp(p[0], b[0], q0), yy = lerp(p[1], b[1], q0); i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); }); for (let i = n; i >= 0; i--) { const p = pts[i], b = pts2[i]; g.lineTo(lerp(p[0], b[0], q1), lerp(p[1], b[1], q1)); } g.fill(); };
  band(.12, .24); band(.76, .88);
  const m = pts[5], mb = pts2[5]; g.strokeStyle = '#2a59c8'; g.lineWidth = 2; const cx = lerp(m[0], mb[0], .5), cy = lerp(m[1], mb[1], .5), r = 6 * lerp(.6, 1, lift);
  for (let k = 0; k < 2; k++) { g.beginPath(); for (let i = 0; i < 3; i++) { const a = k * Math.PI + i / 3 * TAU - Math.PI / 2; i ? g.lineTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r) : g.moveTo(cx + Math.cos(a) * r, cy + Math.sin(a) * r); } g.closePath(); g.stroke(); }
  g.restore();
}
function laundry(t, x0, x1, y, wind = 0) { // washing line: dead still, then flapping
  line([[x0, y], [(x0 + x1) / 2, y + 7], [x1, y]], '#aeb4c8', 1.5);
  const items = ['shirt', 'towel', 'sock', 'sock', 'dress', 'shirt', 'towel'], cols = ['#e9eef7', '#ff8a6a', '#f4d35e', '#f4d35e', '#ff5a6e', '#7fc8ff', '#b9a0ff'];
  const n = Math.floor((x1 - x0) / 34);
  for (let i = 0; i < n; i++) {
    const q = (i + .5) / n, px = lerp(x0, x1, q), py = y + 7 * 4 * q * (1 - q) + 1, kind = items[i % items.length], sw = wind * (.5 + .35 * Math.sin(t * 5 + i * 1.7)) + Math.sin(t * .6 + i) * .01;
    g.save(); g.translate(px, py); g.rotate(-sw * .9); g.fillStyle = cols[i % cols.length];
    if (kind === 'shirt') { g.beginPath(); g.moveTo(-10, 0); g.lineTo(10, 0); g.lineTo(17, 8); g.lineTo(11, 12); g.lineTo(10, 30); g.lineTo(-10, 30); g.lineTo(-11, 12); g.lineTo(-17, 8); g.closePath(); g.fill(); }
    else if (kind === 'towel') { g.fillRect(-9, 0, 18, 34); g.fillStyle = 'rgba(0,0,0,.15)'; g.fillRect(-9, 26, 18, 3); }
    else if (kind === 'sock') { g.fillRect(-3, 0, 7, 16); g.fillRect(-3, 12, 12, 6); }
    else { g.beginPath(); g.moveTo(-6, 0); g.lineTo(6, 0); g.lineTo(5, 12); g.lineTo(14, 36); g.lineTo(-14, 36); g.lineTo(-5, 12); g.closePath(); g.fill(); }
    circ(-5, 0, 1.6, '#6b4a2e'); circ(5, 0, 1.6, '#6b4a2e'); g.restore();
  }
}
function pinwheel(t, x, y, wind = 0, s = 1) { // a child's pinwheel stuck in a planter: still, then spinning
  g.save(); g.translate(x, y); g.scale(s, s); line([[0, 0], [0, -34]], '#d8dcea', 2); g.translate(0, -36); g.rotate(wind > .05 ? t * 16 * wind : .4); const cs = ['#ff5a6e', '#f4d35e', '#5cc8ff', '#7fd08f']; for (let i = 0; i < 4; i++) { g.rotate(TAU / 4); g.fillStyle = cs[i]; g.beginPath(); g.moveTo(0, 0); g.lineTo(13, -3); g.lineTo(13, -13); g.closePath(); g.fill(); } circ(0, 0, 2.2, '#fff'); g.restore();
}
function windChime(t, x, y, wind = 0) { line([[x, y], [x, y + 8]], '#aeb4c8', 1); box(x - 12, y + 8, 24, 3, '#8a6a4a', 1); for (let i = 0; i < 5; i++) { const a = wind * .5 * Math.sin(t * 7 + i * 1.3); g.save(); g.translate(x - 10 + i * 5, y + 11); g.rotate(a); box(-1, 0, 2, 16 + (i % 3) * 5, '#d7dcee'); g.restore(); } if (wind > .3) for (let i = 0; i < 3; i++) star4(x + Math.sin(t * 9 + i * 2) * 18, y + 30 + Math.cos(t * 7 + i) * 10, 4, '#fff', .6 * wind * (.5 + .5 * Math.sin(t * 12 + i))); }
function ledSign(t, x, y, clock, temp, hum, o = {}) { // pharmacy-style clock / thermometer
  const { s = 1 } = o; g.save(); g.translate(x, y); g.scale(s, s);
  box(-4, 0, 8, 46, '#272b4a'); box(-70, -92, 140, 96, '#0c0f24', 8); g.strokeStyle = '#3a3f64'; g.lineWidth = 3; rr(-70, -92, 140, 96, 8); g.stroke();
  const on = .85 + .15 * Math.sin(t * 30);
  g.fillStyle = '#19d36b'; g.globalAlpha = on; g.fillRect(-58, -78, 9, 27); g.fillRect(-67, -69, 27, 9); g.globalAlpha = 1; glow(-53, -65, 30, 'rgba(25,211,107,.6)');
  const blink = Math.floor(t * 2) % 2 ? ':' : ' ';
  ltr(clock.replace(':', blink), 16, -64, 30, '#ff5a3c', { align: 'center' }); glow(16, -64, 60, 'rgba(255,90,60,.25)');
  ltr(temp, -30, -22, 22, '#ffb03c'); ltr(hum, 34, -22, 16, '#5cc8ff');
  g.restore();
}
function streetSign(x, o = {}) { // "דרך השלום"
  const { glowA = 0, s = 1, y = FY } = o;
  g.save(); g.translate(x, y); g.scale(s, s);
  box(-4, -250, 8, 250, '#3b4062', 2); circ(0, -252, 6, '#3b4062');
  if (glowA > 0) glow(60, -216, 230, 'rgba(90,170,255,.5)', glowA);
  box(-12, -246, 190, 60, '#f4f6fb', 8); box(-7, -241, 180, 50, '#1556b8', 5);
  text('דרך השלום', 83, -222, 27, '#fff'); ltr('DEREKH HASHALOM', 83, -200, 9, '#cfe0ff', { font: 'Arimo,"Liberation Sans",sans-serif' });
  g.save(); g.translate(0, -182); box(-74, 0, 70, 22, '#f4f6fb', 5); box(-71, 3, 64, 16, '#1556b8', 3); g.restore();
  g.restore();
}
function cat(t, x, y, o = {}) { // sits on a wall; tail swishes, head turns to follow lookX
  const { s = 1, dir = 1, look = 0, col = '#1a1830', asleep = 0 } = o;
  g.save(); g.translate(x, y); g.scale(s * dir, s);
  const tail = Math.sin(t * 2.2) * .5; g.strokeStyle = col; g.lineWidth = 5; g.lineCap = 'round'; g.beginPath(); g.moveTo(-16, -6); g.quadraticCurveTo(-36, -8 + tail * 8, -34 + tail * 6, -30 - tail * 6); g.stroke();
  ell(0, -14, 19, 14, col); g.save(); g.translate(14, -30); g.rotate(look * .25); ell(0, 0, 11, 10, col); poly([[-9, -5], [-7, -17], [-1, -8]], col); poly([[9, -5], [8, -17], [2, -8]], col);
  if (!asleep) { const bl = Math.sin(t * .9 + x) > .96 ? .15 : 1; ell(-4 + look * 2, -1, 2.2, 2.6 * bl, '#d7f06a'); ell(5 + look * 2, -1, 2.2, 2.6 * bl, '#d7f06a'); } else { line([[-6, 0], [-2, 0]], '#d7f06a', 1.2); line([[3, 0], [7, 0]], '#d7f06a', 1.2); }
  g.restore(); g.restore();
}
function scooter(x, col = '#c9414f') {
  g.save(); g.translate(x, FY); circ(-30, -13, 13, '#14162c'); circ(34, -13, 13, '#14162c'); circ(-30, -13, 5, '#555a7a'); circ(34, -13, 5, '#555a7a');
  poly([[-44, -22], [-10, -22], [0, -44], [16, -44], [30, -24], [-4, -14], [-40, -14]], col); box(-46, -34, 34, 9, '#1c1e36', 4); line([[22, -30], [14, -70], [6, -72]], '#2b2f52', 5); box(-2, -78, 16, 5, '#14162c', 2); circ(16, -62, 5, '#ffe9a8'); box(-52, -42, 18, 12, '#2b2f52', 3); g.restore();
}
function bike(x) { g.save(); g.translate(x, FY); g.strokeStyle = '#8f96b8'; g.lineWidth = 2.5; [-30, 30].forEach(k => { g.beginPath(); g.arc(k, -20, 20, 0, TAU); g.stroke(); }); line([[-30, -20], [-8, -50], [20, -50], [30, -20]], '#5cc8ff', 3); line([[-8, -50], [2, -20], [20, -50]], '#5cc8ff', 3); line([[-30, -20], [2, -20]], '#5cc8ff', 3); line([[-12, -56], [-2, -56]], '#1c1e36', 4); line([[20, -50], [16, -62], [26, -64]], '#8f96b8', 3); g.restore(); }
function car(x, col = '#3d4a7a', t = 0) { g.save(); g.translate(x, GY + 44); g.fillStyle = 'rgba(0,0,0,.3)'; g.beginPath(); g.ellipse(0, 2, 96, 8, 0, 0, TAU); g.fill(); g.fillStyle = col; g.beginPath(); g.moveTo(-92, -8); g.lineTo(-90, -34); g.quadraticCurveTo(-60, -40, -46, -62); g.lineTo(34, -62); g.quadraticCurveTo(54, -40, 88, -34); g.lineTo(92, -8); g.closePath(); g.fill(); g.fillStyle = '#141838'; g.beginPath(); g.moveTo(-52, -40); g.lineTo(-40, -56); g.lineTo(-6, -56); g.lineTo(-6, -40); g.closePath(); g.fill(); g.beginPath(); g.moveTo(0, -40); g.lineTo(0, -56); g.lineTo(30, -56); g.lineTo(46, -40); g.closePath(); g.fill(); circ(-54, -8, 15, '#101226'); circ(54, -8, 15, '#101226'); circ(-54, -8, 6, '#6d7390'); circ(54, -8, 6, '#6d7390'); box(84, -30, 8, 6, '#ffe9a8', 2); box(-93, -30, 6, 6, '#ff5a5a', 2); g.restore(); }
function busStop(t, x, clk = null) {
  g.save(); g.translate(x, FY);
  if (clk) { box(-44, -178, 88, 26, '#0c0f24', 5); ltr(clk.replace(':', Math.floor(t * 2) % 2 ? ':' : ' '), 0, -164, 17, '#ff5a3c'); glow(0, -164, 50, 'rgba(255,90,60,.3)'); } box(-70, -150, 140, 8, '#2f345c', 3); box(-66, -144, 5, 144, '#2f345c'); box(61, -144, 5, 144, '#2f345c');
  box(-60, -132, 62, 96, '#151a3c', 3); g.save(); g.globalAlpha = .9; box(-56, -128, 54, 88, '#27306a', 2); glow(-29, -84, 60, 'rgba(120,160,255,.25)'); g.restore(); // lit ad panel: a sea-and-sun poster
  circ(-29, -98, 13, '#ffcf6a'); box(-56, -72, 54, 32, '#2a7fb8'); line([[-52, -62], [-38, -66], [-24, -62], [-10, -66]], '#bfe6ff', 2);
  box(10, -44, 46, 5, '#5a6090', 2); box(14, -40, 4, 40, '#3a3f64'); box(48, -40, 4, 40, '#3a3f64');
  box(60, -200, 4, 56, '#2f345c'); box(48, -214, 28, 20, '#ffcf3c', 3); ltr('5', 62, -203, 14, '#1a1a1a');
  g.restore();
}
function kiosk(t, x) { // closed for the night
  g.save(); g.translate(x, GY); box(-90, -150, 180, 150, '#2a2f5a'); box(-98, -168, 196, 22, '#c9414f', 4); text('קיוסק', 0, -157, 16, '#fff');
  box(-76, -128, 152, 100, '#39407a'); for (let s = 0; s < 12; s++) box(-76, -126 + s * 8, 152, 2, '#252a58');
  heart(-30, -70, 1.1, 'rgba(255,90,140,.7)', 1, -.2); line([[20, -90], [34, -60], [48, -92], [60, -62]], 'rgba(120,220,255,.6)', 3);
  box(60, -30, 8, 6, '#d8b65a', 2); box(-90, -26, 180, 26, '#22264c');
  // crates & an ice-cream fridge humming outside
  box(100, -60, 54, 60, '#e9eef7', 4); box(104, -56, 46, 22, '#7fc8ff', 3); glow(127, -44, 50, 'rgba(127,200,255,.35)', .7 + .3 * Math.sin(t * 20) * .2); box(-140, -28, 40, 28, '#8a5a3a', 2); box(-136, -52, 40, 26, '#7a4a2e', 2);
  g.restore();
}
function bin(x) { g.save(); g.translate(x, FY); box(-16, -44, 32, 44, '#1f6a4a', 5); box(-18, -50, 36, 9, '#18543a', 4); box(-8, -32, 16, 3, '#0f3a28'); g.restore(); }
function bench(x) { g.save(); g.translate(x, FY); box(-50, -30, 100, 6, '#7a5a3e', 2); box(-50, -52, 100, 5, '#7a5a3e', 2); box(-50, -42, 100, 5, '#7a5a3e', 2); box(-44, -30, 5, 30, '#2f345c'); box(39, -30, 5, 30, '#2f345c'); box(-44, -56, 4, 28, '#2f345c'); box(40, -56, 4, 28, '#2f345c'); g.restore(); }

/* ---------- atmosphere ---------- */
function haze(t, amt, col = [255, 176, 140], y0 = 300) { // heavy, slow humidity: soft fog banks + hanging droplets
  if (amt <= 0) return;
  const gr = g.createLinearGradient(0, y0 - 120, 0, H); gr.addColorStop(0, rgb(col, 0)); gr.addColorStop(1, rgb(col, cl(.11 * amt, 0, .5))); g.fillStyle = gr; g.fillRect(0, y0 - 120, W, H - y0 + 120);
  for (let i = 0; i < 5; i++) {
    const y = y0 + i * 70 + Math.sin(t * .17 + i * 2) * 14, hh = 90 + i * 14, bg = g.createLinearGradient(0, y - hh, 0, y + hh); bg.addColorStop(0, rgb(col, 0)); bg.addColorStop(.5, rgb(col, cl(.05 * amt, 0, .3))); bg.addColorStop(1, rgb(col, 0));
    g.fillStyle = bg; g.beginPath(); g.moveTo(0, y - hh); for (let x = 0; x <= W; x += 40) g.lineTo(x, y - hh + Math.sin(x * .006 + t * .22 + i * 1.7) * 22); for (let x = W; x >= 0; x -= 40) g.lineTo(x, y + hh + Math.sin(x * .005 - t * .18 + i) * 22); g.fill();
  }
  for (let i = 0; i < 46; i++) { const x = (rnd(i + 200) * W + Math.sin(t * .2 + i) * 14), y = 140 + rnd(i + 300) * 500 + Math.sin(t * .35 + i * 2) * 7; circ(x, y, 1.5 + rnd(i) * 2.8, `rgba(220,235,255,${cl(amt, 0, 2) * (.05 + .05 * Math.sin(t * .8 + i))})`); }
}
function heatShimmer(t, x, y, w, h, amt, col = '255,170,110') {
  if (amt <= 0) return; g.save(); g.lineWidth = 3; g.lineCap = 'round';
  const n = Math.max(3, Math.round(w / 70));
  for (let i = 0; i < n; i++) { const px = x + (i + .5) * w / n + rnd(i) * 20, ph = ((t * .32 + rnd(i + 5)) % 1); g.strokeStyle = `rgba(${col},${amt * Math.sin(ph * Math.PI) * .5})`; g.beginPath(); for (let k = 0; k <= 9; k++) { const yy = y - ph * h - k * 9, xx = px + Math.sin(k * .9 + t * 3 + i) * 7; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); }
  g.restore();
}
function windLines(t, amt, o = {}) { // the sea breeze: long curling streaks moving left -> right
  if (amt <= 0) return; const { y0 = 90, y1 = 600, n = 18, col = '205,235,255', speed = .55 } = o;
  g.save(); g.lineCap = 'round';
  for (let i = 0; i < n; i++) {
    const ph = (t * speed * (.8 + rnd(i) * .5) + rnd(i + 11)) % 1, y = y0 + rnd(i + 40) * (y1 - y0), x = -320 + ph * (W + 640), L = 150 + rnd(i + 7) * 190;
    g.strokeStyle = `rgba(${col},${amt * .55 * Math.sin(ph * Math.PI)})`; g.lineWidth = 1.5 + rnd(i + 2) * 2.5; g.beginPath(); g.moveTo(x - L, y);
    g.bezierCurveTo(x - L * .6, y - 16, x - L * .3, y + 14, x, y + Math.sin(t * 2 + i) * 6);
    if (i % 3 === 0) g.bezierCurveTo(x + 26, y - 4, x + 30, y - 30, x + 8, y - 28); // little curl at the tip
    g.stroke();
  }
  // leaves / dust carried along
  for (let i = 0; i < 12; i++) { const ph = (t * speed * 1.2 + rnd(i + 80)) % 1, x = -40 + ph * (W + 80), y = y1 - 30 - rnd(i + 90) * 220 + Math.sin(ph * 12 + i) * 24; g.save(); g.translate(x, y); g.rotate(t * 5 + i); g.fillStyle = `rgba(190,220,150,${amt * .7})`; g.beginPath(); g.ellipse(0, 0, 5, 2.2, 0, 0, TAU); g.fill(); g.restore(); }
  g.restore();
}
function floatingHearts(t, x, y, n, amt, spread = 120, rise = 240) {
  if (amt <= 0) return; for (let i = 0; i < n; i++) { const ph = (t * .2 + rnd(i + 70)) % 1; heart(x + (rnd(i + 3) - .5) * spread + Math.sin(t * 1.4 + i) * 14, y - ph * rise, .5 + rnd(i) * .8 + .2 * A.pulse(t), i % 3 ? '#ff4d7d' : '#ff9ab5', amt * Math.sin(ph * Math.PI), Math.sin(t + i) * .3); }
}
