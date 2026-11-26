"use strict";
/* ===== core: canvas, math, audio-sync helpers, drawing primitives ===== */
const W = 1280, H = 720, TAU = Math.PI * 2;
const cv = document.getElementById('c');
const RS = cv.width / W;                       // render scale (canvas may be 1920x1080)
const g = cv.getContext('2d');
const DUR = AUD.dur;

const cl = (x, a = 0, b = 1) => Math.max(a, Math.min(b, x));
const lerp = (a, b, k) => a + (b - a) * k;
const seg = (t, a, b) => cl((t - a) / (b - a));
const ez = k => k * k * (3 - 2 * k);
const sg = (t, a, b) => ez(seg(t, a, b));
const eOut = k => 1 - Math.pow(1 - cl(k), 3);
const eIn = k => Math.pow(cl(k), 3);
const eBack = k => { k = cl(k); const c = 1.9; return 1 + (c + 1) * Math.pow(k - 1, 3) + c * Math.pow(k - 1, 2); };
const rnd = i => { const x = Math.sin(i * 127.1 + 311.7) * 43758.5453; return x - Math.floor(x); };
const mix = (a, b, k) => a.map((v, i) => lerp(v, b[i], k));
const rgb = (c, a = 1) => `rgba(${c[0] | 0},${c[1] | 0},${c[2] | 0},${a})`;
const hex = h => [parseInt(h.slice(1, 3), 16), parseInt(h.slice(3, 5), 16), parseInt(h.slice(5, 7), 16)];
const mixHex = (a, b, k, al = 1) => { const c = mix(hex(a), hex(b), cl(k)); return al === 1 ? '#' + c.map(v => (v | 0).toString(16).padStart(2, '0')).join('') : rgb(c, al); };
const pulseIn = (t, a, len = .35) => t < a ? 0 : Math.exp(-(t - a) / len);       // decaying hit at time a
const bell = (t, a, b, f = .25) => Math.min(sg(t, a, a + f), 1 - sg(t, b - f, b)); // fade in/out window

/* ---- audio features ---- */
const feat = (arr, t) => { const x = cl(t, 0, DUR - .04) * AUD.fps, i = Math.floor(x), k = x - i; return lerp(arr[i] || 0, arr[i + 1] || 0, k); };
const A = {
  rms: t => feat(AUD.rms, t), bass: t => feat(AUD.bass, t), high: t => feat(AUD.high, t), kick: t => feat(AUD.kick, t),
  // beat position as a float: integer part = beat index (index % 4 == 0 is a downbeat)
  beat(t) {
    const b = AUD.beats, n = b.length, d0 = b[1] - b[0];
    if (t <= b[0]) return (t - b[0]) / d0;
    if (t >= b[n - 1]) return n - 1 + (t - b[n - 1]) / (b[n - 1] - b[n - 2]);
    let lo = 0, hi = n - 1; while (hi - lo > 1) { const m = (lo + hi) >> 1; if (b[m] <= t) lo = m; else hi = m; }
    return lo + (t - b[lo]) / (b[hi] - b[lo]);
  },
  pulse(t, sharp = 3) { const p = A.beat(t); return Math.pow(1 - (p - Math.floor(p)), sharp); },        // 1 on each beat, decays
  bar(t) { const p = A.beat(t) / 4; return Math.pow(1 - (p - Math.floor(p)), 4); },                    // 1 on each downbeat
  bounce(t) { const p = A.beat(t); return Math.abs(Math.sin(p * Math.PI)); },                            // 0 on beat, 1 between
};

/* ---- primitives ---- */
function grad(y0, y1, stops) { const gr = g.createLinearGradient(0, y0, 0, y1); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function gradX(x0, x1, stops) { const gr = g.createLinearGradient(x0, 0, x1, 0); stops.forEach((c, i) => gr.addColorStop(i / (stops.length - 1), c)); return gr; }
function rr(x, y, w, h, r) { g.beginPath(); g.roundRect(x, y, w, h, r); }
function box(x, y, w, h, col, r = 0) { g.fillStyle = col; if (r) { rr(x, y, w, h, r); g.fill(); } else g.fillRect(x, y, w, h); }
function circ(x, y, r, col) { g.fillStyle = col; g.beginPath(); g.arc(x, y, r, 0, TAU); g.fill(); }
function ell(x, y, rx, ry, col, rot = 0) { g.fillStyle = col; g.beginPath(); g.ellipse(x, y, rx, ry, rot, 0, TAU); g.fill(); }
function poly(pts, col, close = true) { g.fillStyle = col; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); if (close) g.closePath(); g.fill(); }
function line(pts, col, w = 2, cap = 'round') { g.strokeStyle = col; g.lineWidth = w; g.lineCap = cap; g.lineJoin = 'round'; g.beginPath(); pts.forEach((p, i) => i ? g.lineTo(p[0], p[1]) : g.moveTo(p[0], p[1])); g.stroke(); }
function glow(x, y, r, col, a = 1, add = true) {
  if (a <= 0.003 || r <= 0) return;
  const gr = g.createRadialGradient(x, y, 0, x, y, r); gr.addColorStop(0, col); gr.addColorStop(1, 'rgba(0,0,0,0)');
  g.save(); g.globalAlpha *= cl(a); if (add) g.globalCompositeOperation = 'lighter'; g.fillStyle = gr; g.fillRect(x - r, y - r, r * 2, r * 2); g.restore();
}
const FONT = '"Noto Sans Hebrew","Rubik","Heebo","Arimo","Liberation Sans","DejaVu Sans",Arial,sans-serif';
function text(s, x, y, size, col, o = {}) {
  const { a = 1, weight = 700, align = 'center', stroke = null, sw = 4, rot = 0, font = FONT, base = 'middle' } = o;
  if (a <= 0) return;
  g.save(); g.globalAlpha *= a; g.translate(x, y); if (rot) g.rotate(rot);
  g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = base; g.direction = 'rtl';
  if (stroke) { g.strokeStyle = stroke; g.lineWidth = sw; g.lineJoin = 'round'; g.strokeText(s, 0, 0); }
  g.fillStyle = col; g.fillText(s, 0, 0); g.restore();
}
function ltr(s, x, y, size, col, o = {}) { g.save(); g.direction = 'ltr'; const { a = 1, weight = 700, align = 'center', font = '"DejaVu Sans Mono","Liberation Mono",monospace' } = o; g.globalAlpha *= a; g.font = `${weight} ${size}px ${font}`; g.textAlign = align; g.textBaseline = 'middle'; g.fillStyle = col; g.fillText(s, x, y); g.restore(); }
function heart(x, y, s, col = '#ff4d7d', a = 1, rot = 0) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = col; g.beginPath();
  g.moveTo(0, 9); g.bezierCurveTo(-24, -9, -11, -27, 0, -12); g.bezierCurveTo(11, -27, 24, -9, 0, 9); g.fill(); g.restore();
}
function star4(x, y, r, col, a = 1, rot = 0) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.fillStyle = col; g.beginPath(); for (let i = 0; i < 8; i++) { const rr2 = i % 2 ? r * .28 : r, an = i / 8 * TAU; g.lineTo(Math.cos(an) * rr2, Math.sin(an) * rr2); } g.fill(); g.restore(); }
function note(x, y, s, col, a = 1, rot = 0) { if (a <= 0) return; g.save(); g.globalAlpha *= a; g.translate(x, y); g.rotate(rot); g.scale(s, s); g.fillStyle = col; g.beginPath(); g.ellipse(0, 0, 7, 5, -.4, 0, TAU); g.fill(); g.fillRect(5, -24, 2.4, 24); g.beginPath(); g.moveTo(7, -24); g.quadraticCurveTo(18, -20, 15, -9); g.quadraticCurveTo(15, -16, 7, -17); g.fill(); g.restore(); }

/* ---- camera: world point (cx,cy) at screen centre with zoom z; par = parallax factor of the layer ---- */
let CAM = { x: W / 2, y: H / 2, z: 1 };
function setCam(x, y, z = 1) { CAM = { x, y, z }; }
function layerT(par, parY = par) { const zl = lerp(1, CAM.z, .4 + .6 * par); return { zl, cx: W / 2 + (CAM.x - W / 2) * par, cy: H / 2 + (CAM.y - H / 2) * parY }; }
function layer(par, fn, parY = par) {
  const L = layerT(par, parY);
  g.save(); g.translate(W / 2, H / 2); g.scale(L.zl, L.zl); g.translate(-L.cx, -L.cy); fn(); g.restore();
}
// visible world x-range for a layer (for culling)
function viewX(par = 1, pad = 220) { const L = layerT(par), hw = W / 2 / L.zl; return [L.cx - hw - pad, L.cx + hw + pad]; }
// world -> screen for the main (par 1) layer
function toScreen(x, y) { return [W / 2 + (x - CAM.x) * CAM.z, H / 2 + (y - CAM.y) * CAM.z]; }
// camera interpolation helper: array of [time,x,y,z] keys, smooth
function camKeys(t, keys) {
  if (t <= keys[0][0]) return setCam(keys[0][1], keys[0][2], keys[0][3]);
  for (let i = 0; i < keys.length - 1; i++) { const a = keys[i], b = keys[i + 1]; if (t <= b[0]) { const k = ez(seg(t, a[0], b[0])); return setCam(lerp(a[1], b[1], k), lerp(a[2], b[2], k), lerp(a[3], b[3], k)); } }
  const l = keys[keys.length - 1]; setCam(l[1], l[2], l[3]);
}

/* ---- two-bone IK: returns the joint position ---- */
function ik(ax, ay, bx, by, l1, l2, bend = 1) {
  let dx = bx - ax, dy = by - ay, d = Math.hypot(dx, dy); const m = l1 + l2 - .01;
  if (d > m) { dx *= m / d; dy *= m / d; d = m; }
  if (d < Math.abs(l1 - l2) + .01) d = Math.abs(l1 - l2) + .01;
  const a = Math.acos(cl((l1 * l1 + d * d - l2 * l2) / (2 * l1 * d), -1, 1)), base = Math.atan2(dy, dx);
  return [ax + Math.cos(base + a * bend) * l1, ay + Math.sin(base + a * bend) * l1, ax + dx, ay + dy];
}

/* ---- screen-space finishing ---- */
function vignette(a = .6) { const v = g.createRadialGradient(W / 2, H / 2, H * .42, W / 2, H / 2, H * .98); v.addColorStop(0, 'rgba(0,0,0,0)'); v.addColorStop(1, `rgba(3,3,12,${a})`); g.fillStyle = v; g.fillRect(0, 0, W, H); }
function tint(col, a) { if (a <= 0) return; g.save(); g.globalAlpha = a; g.fillStyle = col; g.fillRect(0, 0, W, H); g.restore(); }
function grain(t, a = .05) { g.save(); const f = Math.floor(t * 24); for (let i = 0; i < 260; i++) { const x = rnd(i + f * 7.3) * W, y = rnd(i * 3.1 + f) * H; g.fillStyle = `rgba(255,255,255,${a * rnd(i + f)})`; g.fillRect(x, y, 2, 2); } g.restore(); }
function letterbox(k, h = 76) { if (k <= 0) return; g.fillStyle = '#000'; g.fillRect(0, 0, W, h * k); g.fillRect(0, H - h * k, W, h * k); }
// clip drawing to a rounded panel (for inserts / polaroids)
function panel(x, y, w, h, r, fn) { g.save(); rr(x, y, w, h, r); g.clip(); fn(); g.restore(); }
