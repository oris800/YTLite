"use strict";
/* ===== the long street: neighbourhood A · the café between the neighbourhoods · neighbourhood B · the corner of Derech HaShalom · her building =====
   Buildings/furniture positions are in street units (scaled by B); the café, its terrace and all people are in world units. */
const SU = { led: 900, flag: 372, laundry: 916, kiosk: 2600, bus: 2900, wall: 3440, sign: 3830, home: 3920, door: 4110 };
const X = { led: U(900), flag: U(380), laundry: U(916), cafe: 3080, terrace: 3480, t1: 3570, tHer: 3750, t3: 3930, pole: 4010, kiosk: U(2600), bus: U(2900), wall: U(3440), sign: U(3830), home: U(3920), door: U(4110), win: [U(4208), UY(254)] };
const SEAT = 62, TABLE = 98;

/* ---------- café furniture ---------- */
function bistroChair(x, y, dir = 1, o = {}) {
  g.save(); g.translate(x, y); g.scale(dir, 1); if (o.flip) { g.translate(0, o.flip); g.scale(1, -1); }
  const c = '#2f3558'; g.lineCap = 'round';
  line([[-20, 0], [-17, -SEAT], [-21, -138]], c, 4.5); line([[22, 0], [20, -SEAT]], c, 4.5); line([[-17, -SEAT], [20, -SEAT]], c, 6);
  line([[-20.5, -128], [-19, -84]], c, 9); box(-22, -SEAT - 4, 46, 6, '#3d446e', 3); g.restore();
}
function oldChair(x, y, dir = 1, rock = 0) { // the old wooden chair she sits on: worn wood, woven seat, a leg bound with string
  g.save(); g.translate(x, y); g.scale(dir, 1); g.rotate(rock * .02); g.lineCap = 'round';
  const w1 = '#8a5a34', w2 = '#6d4426', w3 = '#a87446';
  line([[-22, 0], [-18, -SEAT], [-24, -146]], w2, 7); line([[24, 0], [21, -SEAT]], w1, 7); line([[-5, -2], [-3, -SEAT]], w2, 5);
  line([[-20, -28], [22, -26]], w2, 4); line([[-18, -SEAT], [21, -SEAT]], w1, 4);
  // back rest: two curved slats
  g.strokeStyle = w1; g.lineWidth = 6; g.beginPath(); g.moveTo(-24, -142); g.quadraticCurveTo(-14, -146, -6, -140); g.stroke(); g.beginPath(); g.moveTo(-22.5, -112); g.quadraticCurveTo(-13, -116, -6, -110); g.stroke(); line([[-6, -142], [-5, -SEAT]], w1, 5);
  // woven straw seat
  box(-22, -SEAT - 6, 48, 9, '#d8b36a', 3); g.strokeStyle = '#a8843e'; g.lineWidth = 1; for (let i = 0; i < 9; i++) { g.beginPath(); g.moveTo(-20 + i * 5.4, -SEAT - 6); g.lineTo(-18 + i * 5.4, -SEAT + 3); g.stroke(); }
  // the mended leg + chipped paint
  g.strokeStyle = '#e9e2cf'; g.lineWidth = 1.6; for (let i = 0; i < 5; i++) { g.beginPath(); g.moveTo(20.5, -22 - i * 3.2); g.lineTo(27.5, -20.5 - i * 3.2); g.stroke(); }
  line([[-23.5, -134], [-23, -124]], w3, 2); line([[22.5, -50], [23, -40]], w3, 2); line([[-21, -80], [-20, -70]], w3, 2);
  g.restore();
}
function bistroTable(x, y, o = {}) {
  g.save(); g.translate(x, y);
  box(-4, -TABLE, 8, TABLE - 4, '#2f3558'); poly([[-30, 0], [0, -12], [30, 0], [26, 0], [0, -6], [-26, 0]], '#2f3558');
  box(-58, -TABLE - 7, 116, 8, o.col || '#c9b08a', 4); box(-58, -TABLE - 1, 116, 3, 'rgba(0,0,0,.25)', 2);
  g.restore();
}
function hafuch(x, y, s = 1, t = 0, steam = 1, level = 1) { // "hafuch" in a glass: coffee below, milk foam above
  g.save(); g.translate(x, y); g.scale(s, s);
  ell(0, 0, 21, 4, '#f1ede6'); ell(0, -1, 14, 2.5, '#d9d4cc');
  g.save(); g.beginPath(); g.moveTo(-10, -30); g.lineTo(10, -30); g.lineTo(8, -2); g.lineTo(-8, -2); g.closePath(); g.clip();
  box(-12, -32, 24, 32, 'rgba(220,235,255,.22)');
  if (level > 0) { const top = -2 - 26 * level; g.fillStyle = grad(top, -2, ['#fff6e6', '#e2b98a', '#b07a4a', '#7a4a2a']); g.fillRect(-12, top, 24, 30); box(-12, top, 24, 5, '#fffaf0'); }
  g.restore();
  g.strokeStyle = 'rgba(235,245,255,.75)'; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-10, -30); g.lineTo(-8, -2); g.lineTo(8, -2); g.lineTo(10, -30); g.stroke();
  g.beginPath(); g.arc(12, -17, 6, -Math.PI / 2, Math.PI / 2); g.stroke();
  if (steam > 0) { g.lineCap = 'round'; for (let i = 0; i < 3; i++) { const ph = (t * .5 + i / 3) % 1; g.strokeStyle = `rgba(255,255,255,${steam * .5 * Math.sin(ph * Math.PI)})`; g.lineWidth = 2; g.beginPath(); for (let k = 0; k <= 6; k++) { const yy = -34 - ph * 30 - k * 5, xx = (i - 1) * 6 + Math.sin(k * .9 + t * 2 + i * 2) * 4; k ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); } }
  g.restore();
}
function waterGlass(x, y, s = 1, t = 0) { g.save(); g.translate(x, y); g.scale(s, s); box(-8, -24, 16, 24, 'rgba(190,225,255,.35)', 2); box(-8, -16, 16, 16, 'rgba(160,210,255,.5)', 2); box(-5, -15 + Math.sin(t) * 1, 6, 6, 'rgba(240,250,255,.8)', 1); box(1, -12 - Math.sin(t) * 1, 5, 5, 'rgba(240,250,255,.7)', 1); ell(5, -24, 6, 2.5, '#f4d35e'); line([[-3, -30], [2, -8]], '#ff8a9a', 1.6); g.strokeStyle = 'rgba(235,245,255,.7)'; g.lineWidth = 1.2; g.strokeRect(-8, -24, 16, 24); g.restore(); }
function candleJar(x, y, t, s = 1) { g.save(); g.translate(x, y); g.scale(s, s); box(-7, -14, 14, 14, 'rgba(255,220,160,.35)', 3); box(-3, -8, 6, 8, '#fff3d6', 1); const f = 1 + .2 * Math.sin(t * 13) + .15 * Math.sin(t * 7.3); g.fillStyle = '#ffb347'; g.beginPath(); g.ellipse(0, -12, 2.2, 4.5 * f, 0, 0, TAU); g.fill(); g.restore(); glow(x, y - 12 * s, 46 * s, 'rgba(255,190,110,.5)', .8 + .2 * Math.sin(t * 9)); }
function stringLights(t, x0, y0, x1, y1, n, swing = 0, bright = 1) {
  const cx = (x0 + x1) / 2 + swing * 26, cy = (y0 + y1) / 2 + 46;
  g.strokeStyle = '#151830'; g.lineWidth = 2; g.beginPath(); g.moveTo(x0, y0); g.quadraticCurveTo(cx, cy, x1, y1); g.stroke();
  for (let i = 1; i < n; i++) {
    const q = i / n, x = (1 - q) * (1 - q) * x0 + 2 * (1 - q) * q * cx + q * q * x1, y = (1 - q) * (1 - q) * y0 + 2 * (1 - q) * q * cy + q * q * y1 + 5;
    const sw = swing * Math.sin(t * 5 + i) * 5, on = bright * (.72 + .28 * Math.sin(t * 1.7 + i * 2.1) + .5 * A.pulse(t) * ((i + Math.floor(A.beat(t))) % 2));
    glow(x + sw, y + 3, 30, ['rgba(255,214,130,.95)', 'rgba(255,150,170,.95)', 'rgba(150,225,255,.95)', 'rgba(190,255,170,.95)'][i % 4], cl(on) * .75);
    circ(x + sw, y + 3, 4, bright > .1 ? '#fff8e2' : '#4a4d6a'); box(x + sw - 2, y - 3, 4, 4, '#151830');
  }
}

/* ---------- the café ---------- */
function cafe(t, st = {}) {
  const { lights = 1, wind = 0 } = st, x = X.cafe, w = 400, top = GY - 262;
  // building
  box(x, top, w, 262, '#1c4750'); box(x, top, w, 14, '#2a6570'); box(x + w - 12, top, 12, 262, 'rgba(0,10,30,.35)'); box(x, GY - 34, w, 34, '#143840');
  // roof: plants, a little AC, fairy lights on the edge
  for (let i = 0; i < 4; i++) { const px = x + 30 + i * 70; box(px, top - 14, 30, 14, '#7a4a3a', 2); g.fillStyle = '#1f5a3c'; for (let k = 0; k < 6; k++) { g.beginPath(); g.ellipse(px + 15 + (k - 2.5) * 6 + wind * 3 * Math.sin(t * 4 + k), top - 22 - (k % 2) * 8, 6, 12, (k - 2.5) * .3 + wind * .2, 0, TAU); g.fill(); } }
  box(x + 320, top - 26, 44, 26, '#aeb4c8', 3);
  // big window with the interior
  const wx = x + 28, wy = GY - 206, ww = 268, wh = 158;
  box(wx - 6, wy - 6, ww + 12, wh + 12, '#0f2c33', 4);
  panel(wx, wy, ww, wh, 2, () => {
    g.fillStyle = grad(wy, wy + wh, [mixHex('#30251f', '#f0b060', lights), mixHex('#241a16', '#c97f40', lights)]); g.fillRect(wx, wy, ww, wh);
    // shelves with jars & bottles
    for (let r = 0; r < 2; r++) { box(wx + 12, wy + 40 + r * 34, 150, 4, '#5a3620'); for (let i = 0; i < 9; i++) { const k = rnd(i + r * 20), bh = 12 + k * 14; box(wx + 16 + i * 16, wy + 40 + r * 34 - bh, 9, bh, ['#7a2f2f', '#2f6a4a', '#d8b65a', '#e9e2cf', '#3a5a8a'][Math.floor(k * 5)], 2); } }
    // chalkboard menu
    box(wx + 182, wy + 14, 72, 86, '#1a2a26', 3); g.strokeStyle = '#8a5a34'; g.lineWidth = 3; g.strokeRect(wx + 182, wy + 14, 72, 86);
    text('תפריט', wx + 218, wy + 28, 11, '#f4f1e6', { weight: 600 }); for (let i = 0; i < 5; i++) { line([[wx + 190, wy + 44 + i * 11], [wx + 228 - (i % 2) * 8, wy + 44 + i * 11]], 'rgba(244,241,230,.7)', 1.5); line([[wx + 236, wy + 44 + i * 11], [wx + 246, wy + 44 + i * 11]], 'rgba(255,214,130,.8)', 1.5); }
    // counter + espresso machine + cup stacks
    box(wx, wy + 118, ww, 40, '#3a2416'); box(wx, wy + 114, ww, 6, '#6d4426');
    box(wx + 30, wy + 76, 78, 40, '#c9ced8', 5); box(wx + 30, wy + 76, 78, 9, '#e9edf4', 4); box(wx + 40, wy + 92, 12, 12, '#2a2e3c', 2); box(wx + 62, wy + 92, 12, 12, '#2a2e3c', 2); box(wx + 86, wy + 90, 14, 5, '#ff5a3c', 2); circ(wx + 100, wy + 106, 3, '#2a2e3c');
    if (lights > .3) for (let i = 0; i < 2; i++) { const ph = (t * .4 + i * .5) % 1; g.strokeStyle = `rgba(255,255,255,${.35 * Math.sin(ph * Math.PI)})`; g.lineWidth = 3; g.beginPath(); g.moveTo(wx + 46 + i * 22, wy + 74 - ph * 26); g.quadraticCurveTo(wx + 52 + i * 22, wy + 62 - ph * 26, wx + 44 + i * 22, wy + 52 - ph * 26); g.stroke(); }
    for (let i = 0; i < 4; i++) box(wx + 124 + (i % 2) * 14, wy + 104 - Math.floor(i / 2) * 9, 11, 9, '#f4f1e6', 2);
    // pendant lamps
    for (let i = 0; i < 3; i++) { const lx = wx + 50 + i * 84; line([[lx, wy], [lx, wy + 20]], '#1a1210', 1.5); poly([[lx - 12, wy + 32], [lx - 5, wy + 20], [lx + 5, wy + 20], [lx + 12, wy + 32]], '#1a1210'); glow(lx, wy + 34, 60, 'rgba(255,214,140,.8)', lights); }
  });
  g.strokeStyle = '#0f2c33'; g.lineWidth = 4; line([[wx + ww / 2, wy], [wx + ww / 2, wy + wh]], '#0f2c33', 4);
  g.save(); g.globalAlpha = .12; poly([[wx + 20, wy], [wx + 60, wy], [wx + 10, wy + wh], [wx - 30, wy + wh]], '#fff'); g.restore();
  // door with an "open" sign
  const dx = x + 318; box(dx - 5, GY - 184, 70, 184, '#0f2c33', 3); box(dx, GY - 179, 60, 176, mixHex('#2b221d', '#d99a55', lights), 2); line([[dx + 50, GY - 96], [dx + 50, GY - 76]], '#e7c765', 4);
  g.save(); g.translate(dx + 28, GY - 140); g.rotate(Math.sin(t * 1.3) * .03 + wind * .12 * Math.sin(t * 5)); line([[0, -14], [-12, 0]], '#f4f1e6', 1); line([[0, -14], [12, 0]], '#f4f1e6', 1); box(-19, 0, 38, 18, '#f4f1e6', 3); text(st.closed ? 'סגור' : 'פתוח', 0, 9.5, 11, st.closed ? '#3a3f64' : '#c9414f'); g.restore();
  // striped awning
  const ay = GY - 232; for (let i = 0; i < 12; i++) { const ax = x + 12 + i * 31.5; poly([[ax, ay], [ax + 31.5, ay], [ax + 33.5, ay + 26], [ax - 2, ay + 26]], i % 2 ? '#f3e7d3' : '#c9584a'); g.fillStyle = i % 2 ? '#f3e7d3' : '#c9584a'; g.beginPath(); g.arc(ax + 15.7, ay + 26 + wind * Math.sin(t * 6 + i) * 1.5, 16.8, 0, Math.PI); g.fill(); }
  box(x + 10, ay - 4, 382, 6, '#8f3a30', 2);
  // neon sign: flickers with the music
  const nb = lights * (.75 + .25 * A.bass(t)) * (Math.sin(t * 31) > -.96 ? 1 : .5), nx = x + 200, ny = top + 2;
  box(nx - 86, ny - 60, 172, 52, '#122e35', 8);
  glow(nx - 14, ny - 34, 120, 'rgba(255,80,150,.55)', nb);
  text('קפה', nx - 18, ny - 34, 40, mixHex('#5a2a40', '#ffd3e4', nb), { weight: 800, stroke: mixHex('#3a1a2a', '#ff4f9a', nb), sw: 5 });
  g.strokeStyle = mixHex('#2a3a4a', '#8fe8ff', nb); g.lineWidth = 3.5; g.lineCap = 'round'; g.beginPath(); g.moveTo(nx + 44, ny - 40); g.lineTo(nx + 47, ny - 24); g.lineTo(nx + 65, ny - 24); g.lineTo(nx + 68, ny - 40); g.closePath(); g.stroke(); g.beginPath(); g.arc(nx + 71, ny - 33, 6, -1.2, 1.2); g.stroke();
  g.beginPath(); g.moveTo(nx + 52, ny - 46); g.quadraticCurveTo(nx + 48, ny - 51, nx + 53, ny - 55); g.moveTo(nx + 61, ny - 46); g.quadraticCurveTo(nx + 57, ny - 51, nx + 62, ny - 55); g.stroke(); glow(nx + 58, ny - 34, 44, 'rgba(120,230,255,.5)', nb);
  // light spilling on the pavement
  g.fillStyle = `rgba(255,190,110,${.20 * lights})`; g.beginPath(); g.ellipse(x + 190, GY + 22, 300, 22, 0, 0, TAU); g.fill();
  glow(x + 170, GY - 120, 380, 'rgba(255,170,90,.30)', lights);
  // sandwich board
  g.save(); g.translate(x - 34, WALKY + 2); poly([[-22, 0], [-14, -70], [14, -70], [22, 0]], '#2a1a14'); box(-13, -64, 26, 46, '#1a2a26'); text('☕', 0, -48, 15, '#f4f1e6', { weight: 400 }); line([[-8, -34], [8, -34]], '#f4f1e6', 1.5); line([[-8, -27], [5, -27]], '#f4f1e6', 1.5); g.restore();
}
function terrace(t, st = {}) {
  const { wind = 0, lights = 1 } = st, x0 = X.terrace, x1 = X.pole + 20;
  // deck
  box(x0 - 4, GY + 2, x1 - x0 + 8, 36, '#5a3f2e'); for (let i = 0; i < 18; i++) box(x0 + i * 30, GY + 2, 2, 36, 'rgba(0,0,0,.18)'); box(x0 - 4, GY + 36, x1 - x0 + 8, 5, '#3a281c');
  // planter boxes at the back with shrubs
  for (let k = 0; k < 3; k++) { const px = x0 + 40 + k * 190; box(px, GY - 34, 120, 36, '#3a2a22', 3); g.fillStyle = '#184a34'; for (let i = 0; i < 9; i++) { g.beginPath(); g.ellipse(px + 10 + i * 12.5 + wind * 4 * Math.sin(t * 4 + i), GY - 44 - (i % 3) * 7, 10, 17, wind * .25, 0, TAU); g.fill(); } }
  // pole for the string lights
  box(X.pole - 3, GY - 250, 6, 290, '#272b4a', 2);
  stringLights(t, X.cafe + 400, GY - 250, X.pole, GY - 246, 13, wind * Math.sin(t * 2.4), lights);
  stringLights(t, X.cafe + 400, GY - 200, X.pole, GY - 246, 11, wind * Math.sin(t * 2.4 + 1), lights);
  glow((x0 + x1) / 2, GY - 120, 420, 'rgba(255,190,120,.22)', lights);
  // the two tables that were already cleared: chairs upside-down on top
  const up = [2, st.t3up ?? 2], fl = [0, st.t3floor ?? 0];
  [X.t1, X.t3].forEach((tx, i) => {
    bistroTable(tx, WALKY);
    [-1, 1].forEach((d, k) => { if (k < up[i]) { g.save(); g.translate(tx + d * 40, WALKY - TABLE - 7 - SEAT); g.scale(1, -1); bistroChair(0, 0, -d); g.restore(); } });
    if (fl[i] > 0) bistroChair(tx + 78, WALKY, -1); if (fl[i] > 1) bistroChair(tx - 78, WALKY, 1);
  });
}

/* ---------- pavement & road ---------- */
function ground(t, o = {}) {
  const [vx0, vx1] = viewX(1, 100), dawn = o.dawn || 0;
  box(vx0, GY, vx1 - vx0, 40, mixHex('#3a3654', '#b9a9a4', dawn)); for (let x = Math.floor(vx0 / 64) * 64; x < vx1; x += 64) { box(x, GY, 2, 36, 'rgba(0,0,0,.16)'); }
  box(vx0, GY + 17, vx1 - vx0, 1.5, 'rgba(0,0,0,.14)');
  box(vx0, GY + 36, vx1 - vx0, 8, mixHex('#55506e', '#d8cabf', dawn)); for (let x = Math.floor(vx0 / 90) * 90; x < vx1; x += 90) box(x, GY + 36, 45, 8, mixHex('#c9414f', '#d9606a', dawn) + '55');
  box(vx0, GY + 44, vx1 - vx0, 300, mixHex('#17182c', '#6b6a7c', dawn));
  for (let x = Math.floor(vx0 / 180) * 180; x < vx1; x += 180) box(x, GY + 86, 90, 5, 'rgba(255,225,160,.22)');
}

/* ---------- the whole street. `actors(depth)` is called at depth 0 (behind the front furniture) and 1 (in front of it), in world units ---------- */
function street(t, st = {}, actors = null) {
  const { wind = 0, sleep = 0, dawn = 0, clock = '23:47', temp = '31°C', hum = '89%', cafeLights = 1, humid = 1, homeWin = 0, homeCol = '#ffc98a', signGlow = .5, stairs = 0, catLook = 0, lobby = 0, hazeA = 1, lamps = 1 } = st;
  nightSky(t, dawn); clouds(t, 1 - dawn);
  if (st.moon !== 0) moon(st.moonX ?? 1010, st.moonY ?? 120, st.moonR ?? 34, humid, 1 - seg(dawn, .3, .8));
  layer(.12, () => { farSkyline(t, 566, { dawn, col: mixHex('#141a48', '#7a86b8', dawn) }); threeTowers(520, 566, .78, t, dawn); threeTowers(1500, 566, .5, t, dawn); });
  layer(.45, () => midBlocks(t, GY + 6, { sleep, dawn, col: mixHex('#1e2352', '#8d8fb4', dawn) }));
  layer(1, () => {
    const [wx0, wx1] = viewX(1, 300), vis = (x, w = 0) => (x + w) * B > wx0 - 300 && x * B < wx1 + 300, visW = (x, w = 0) => x + w > wx0 && x < wx1;
    const SC = fn => { g.save(); g.translate(0, GY); g.scale(B, B); g.translate(0, -GY); fn(); g.restore(); };
    ground(t, { dawn });
    SC(() => {
      // ---- neighbourhood A
      if (vis(40, 380)) { const b = bauhaus(t, 40, 380, 3, 1, { sleep, dawn }); flag(t, SU.flag, b.floors[1] + 58, wind, .8); windChime(t, 300, b.floors[1] + 12, wind); }
      if (vis(520, 330)) bauhaus(t, 520, 330, 4, 2, { sleep, dawn, ground: 'shutter', curve: -1 });
      if (vis(980, 300)) { const b3 = bauhaus(t, 980, 300, 3, 3, { sleep, dawn }); pinwheel(t, 1004, b3.floors[1] + 52, wind, .8); }
      if (vis(840, 150)) laundry(t, 850, 982, GY - 96 - 2 * 84 - 22, wind);
      if (vis(SU.led - 80, 160)) ledSign(t, SU.led, GY - 150, clock, temp, hum);
      if (vis(1320, 100)) tree(1350, 1, wind, t);
      // ---- neighbourhood B
      if (vis(2110, 340)) bauhaus(t, 2110, 340, 4, 4, { sleep, dawn, ground: 'shutter' });
      if (vis(SU.kiosk - 160, 340)) kiosk(t, SU.kiosk);
      if (vis(SU.bus - 100, 200)) busStop(t, SU.bus, st.busClock || null);
      if (vis(3020, 360)) bauhaus(t, 3020, 360, 3, 5, { sleep, dawn, curve: -1 });
      if (vis(SU.wall - 40, 260)) { box(SU.wall - 20, GY - 46, 200, 46, mixHex('#4a4f7a', '#cfc6c0', dawn), 3); box(SU.wall - 24, GY - 52, 208, 8, mixHex('#5f66a0', '#efe6dc', dawn), 3); for (let i = 0; i < 6; i++) box(SU.wall - 12 + i * 33, GY - 40, 2, 36, 'rgba(0,0,30,.2)'); cat(t, SU.wall + 60, GY - 52, { look: catLook, s: .8 }); }
      if (vis(3640, 100)) tree(3680, 1.05, wind, t);
      // ---- her building on the corner of Derech HaShalom
      if (vis(SU.home, 420)) {
        const home = bauhaus(t, SU.home, 420, 4, 6, { sleep, dawn, ground: 'door', gh: 130, special: { f: 1, c: 3, lit: homeWin, col: homeCol } });
        // stairwell: a column of glass blocks above the entrance, lit while the timer switch is on
        const sx = SU.door - 30; for (let f = 0; f < 4; f++) { const fy = home.top + f * FLOOR_H; box(sx, fy + 8, 60, 78, mixHex('#141838', '#7c84ac', dawn)); g.globalAlpha = stairs * (1 - dawn); box(sx + 4, fy + 10, 52, 74, '#ffe2a0'); g.globalAlpha = 1; for (let i = 1; i < 4; i++) line([[sx + i * 15, fy + 8], [sx + i * 15, fy + 86]], 'rgba(20,24,56,.7)', 2); for (let i = 1; i < 5; i++) line([[sx, fy + 8 + i * 16], [sx + 60, fy + 8 + i * 16]], 'rgba(20,24,56,.7)', 2); }
        if (stairs > 0) glow(SU.door, home.top + 170, 200, 'rgba(255,220,150,.3)', stairs);
        // entrance: door, intercom, house number, a small light
        box(SU.door - 46, GY - 124, 92, 124, '#10132e'); box(SU.door - 38, GY - 116, 76, 116, mixHex('#1c2046', '#ffd9a0', Math.max(lobby, stairs * .6)), 2); line([[SU.door, GY - 116], [SU.door, GY]], '#10132e', 3); line([[SU.door - 8, GY - 66], [SU.door - 8, GY - 46]], '#e7c765', 3);
        box(SU.door + 56, GY - 84, 14, 24, '#aeb4c8', 2); for (let i = 0; i < 4; i++) circ(SU.door + 63, GY - 79 + i * 5, 1.2, '#3a3f64');
        box(SU.door - 84, GY - 96, 28, 18, '#1556b8', 3); ltr('12', SU.door - 70, GY - 86, 12, '#fff'); circ(SU.door, GY - 130, 4, '#fff3d6'); glow(SU.door, GY - 126, 70, 'rgba(255,220,160,.5)', .8);
        // her balcony: plants and the AC condenser
        const wx = home.windows.find(w => w.f === 1 && w.c === 3);
        if (wx) { box(wx.x + 56, wx.y + 22, 22, 17, '#c9cee0', 2); g.strokeStyle = '#6d7390'; g.lineWidth = 1; g.beginPath(); g.arc(wx.x + 67, wx.y + 30.5, 6, 0, TAU); g.stroke(); }
      }
      if (vis(4380, 500)) { palm(4400, FY, 1.1, wind * .7, t); bauhaus(t, 4470, 360, 3, 7, { sleep, dawn }); }
    });
    // ---- the café between the neighbourhoods (world units)
    if (visW(X.cafe - 100, 1100)) { cafe(t, { lights: cafeLights, wind, closed: st.closed }); terrace(t, { wind, lights: cafeLights, t3up: st.t3up, t3floor: st.t3floor }); }
    SC(() => { if (vis(2030, 60)) palm(2052, FY, 1.05, wind * .7, t); });
    if (actors) actors(0);
    SC(() => {
      [470, 1440, 2480, 3360, 3760].forEach(x => { if (vis(x - 160, 320)) lamp(t, x, { humid, a: lamps * (1 - seg(dawn, .5, .9)) }); });
      if (vis(1090, 240)) car(1130, '#3d4a7a');
      if (vis(2300, 240)) car(2350, '#7a3d4a');
      if (vis(1405, 40)) bin(1405);
      if (vis(2800, 200)) bench(2790);
      if (vis(3540, 120)) scooter(3570);
      if (vis(3600, 120)) bike(3620);
      if (vis(SU.sign - 100, 300)) streetSign(SU.sign, { glowA: signGlow });
    });
    if (actors) actors(1);
  });
  haze(t, humid * 1.6 * hazeA * (1 - dawn * .6));
}
