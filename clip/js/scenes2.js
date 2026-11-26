"use strict";
/* ===== scenes, part 2: verse 2 · chorus (retold) · the air-conditioner chorus ===== */
const camR = (x, z, fy = 640) => setCam(x, FL - (fy - 360) / z, z);       // interior camera keeping the floor near the bottom
const CH = { hip: [-6, -66], fN: [52, 0], fF: [44, 0] };                    // sitting in an armchair
const himChair = (t, p = {}, cx = RX.ch1) => figure('him', cx - 2, FL, 1, 1, poseSit(Object.assign({ t, lean: -.1, hN: [26, -112], hF: [30, -108] }, CH, p)));
const herChair = (t, p = {}, cx = RX.ch2) => figure('her', cx + 2, FL, 1, -1, poseSit(Object.assign({ t, lean: -.06, hN: [26, -112], hF: [30, -108] }, CH, p)));
function inRect(x, y, w, h, fn) { g.save(); g.beginPath(); g.rect(x, y, w, h); g.clip(); g.translate(x, y); g.scale(w / W, h / H); fn(); g.restore(); }
function closeUp(kind, dir, p, cx = 690, cy = 330, s = 7) { return figure(kind, cx + dir * -3.3 * s, cy + 175 * s, s, dir, poseSit(Object.assign({ shadow: 0 }, p))); }
function warmBokeh(t, cool = 0) { bokeh(t, cool > .5 ? ['150,210,255', '200,230,255', '255,214,150'] : ['255,200,130', '255,160,140', '255,226,170'], cool > .5 ? ['#16233f', '#2c4468', '#3a5a86'] : ['#2a1a22', '#5a3430', '#8a5440']); }
function sparkle(wx, wy, t0, t, n = 7, r = 60, col = '#fff3c4') { const k = seg(t, t0, t0 + .55); if (k <= 0 || k >= 1) return; for (let i = 0; i < n; i++) { const an = i / n * TAU + t0; star4(wx + Math.cos(an) * r * eOut(k), wy + Math.sin(an) * r * eOut(k), 11 * (1 - k) + 3, col, 1 - k, an); } }

/* =================== VERSE 2 =================== */
S(L.v2a, (t, a, b) => { // Tel Aviv, after midnight: her building on the corner
  const k = seg(t, a, b); setCam(lerp(8040, 8160, k), lerp(150, 100, k), lerp(.66, .6, k));
  const walk = sg(t, a - .6, 82.75), x = lerp(7930, X.door - 6, walk), inside = sg(t, 82.75, 83.0), stairs = sg(t, 83.1, 83.25);
  street(t, { moonX: 250, moonY: 110, sleep: 1.15, humid: .8, signGlow: .6, lobby: sg(t, 82.5, 82.8), stairs, catLook: 1 }, d => {
    if (d !== 0 || inside >= 1) return; g.save(); g.globalAlpha = 1 - inside;
    figure('her', x + 40, WALKY, 1, 1, walk < 1 ? poseWalk(stepPhase(x), { t, smile: .7, hN: walk > .8 ? [44, -128] : undefined }) : poseStand({ t, hN: [44, -128] }));
    figure('him', x - 44, WALKY, 1, 1, walk < 1 ? poseWalk(stepPhase(x) + 1.4, { t, smile: .6, look: [.6, -.5] }) : poseStand({ t, look: [.5, -.6] }));
    g.restore();
  });
});
S(L.v2b, (t, a, b) => { // up the stairwell – and the timer light runs out just as they arrive
  const climb = seg(t, a - .1, 86.6), u = lerp(.22, 2, climb), land = sg(t, 86.6, 87.0), off = sg(t, 86.25, 86.4) * (1 - sg(t, 87.02, 87.1));
  const hp = stairPos(Math.min(u + .1, 2)), mp = stairPos(u);
  setCam(lerp(790, 620, sg(t, 86.2, 87.2)), lerp(mp.y, hp.y, .5) - 140, .98);
  stairwell(t, { light: 1 - off }, part => {
    const step = t * 9.5;
    if (u < 2) { if (hp.part === part) figure('her', hp.x, hp.y, 1, hp.dir, poseWalk(step, { t, stride: 22, smile: .6, shadow: 0, hN: [34, -150] })); if (mp.part === part) figure('him', mp.x, mp.y, 1, mp.dir, poseWalk(step + 1.6, { t, stride: 22, shadow: 0, hN: [34, -150], open: .2, sweat: .5 })); }
    else if (part === 'A') { const hx = lerp(ST.x0 - 30, 420, land), press = bell(t, 86.9, 87.25, .1); figure('her', hx, stairY(2), 1, -1, land < 1 ? poseWalk(stepPhase(hx), { t }) : poseStand({ t, hN: [lerp(8, 38, press), lerp(-108, -138, press)], smile: .5 })); figure('him', lerp(ST.x0 + 30, 500, land), stairY(2), 1, -1, poseStand({ t, look: [.3, off > .5 ? -.8 : 0], brow: off, open: off * .3 })); }
  });
  if (off > .5) text('?', W / 2 + 140, 250, 60, '#ffb86a', { a: off * (.6 + .4 * Math.sin(t * 14)) });
  tint('#fff3d6', pulseIn(t, 87.05, .12) * .35);
});
function doorCU(t, o = {}) { // her front door, close. fx,fy = the point of the door kept at the centre of the frame
  const { open = 0, z = 1, fx = W / 2, fy = H / 2 } = o;
  g.fillStyle = '#b9a480'; g.fillRect(0, 0, W, H);
  g.save(); g.translate(W / 2, H / 2); g.scale(z, z); g.translate(-fx, -fy);
  box(180, -400, 920, 1600, '#5a3a22');
  box(210, -400, 860, 1600, '#0c0a14'); glow(640, 380, 620, 'rgba(255,190,120,.35)', open * .4);
  g.save(); g.translate(210, 0); g.scale(1 - open * .86, 1);
  box(0, -400, 860, 1600, '#7a4e2e'); box(0, -400, 860, 1600, 'rgba(0,0,0,' + (open * .35) + ')');
  box(70, 40, 300, 280, '#6a4226', 8); box(70, 380, 300, 300, '#6a4226', 8); box(490, 40, 300, 280, '#6a4226', 8); box(490, 380, 300, 300, '#6a4226', 8);
  for (let i = 0; i < 9; i++) line([[20 + i * 100, -400], [26 + i * 100, 1200]], 'rgba(40,20,10,.12)', 3);
  circ(430, 150, 15, '#d8b65a'); circ(430, 150, 8, '#1a1210');                                 // peephole
  box(350, 214, 160, 54, '#e9e2cf', 6); heart(380, 242, .9, '#ff5a6e'); line([[404, 236], [490, 236]], '#8a8478', 4); line([[404, 250], [468, 250]], '#8a8478', 4); // name plate
  box(700, 300, 96, 250, '#c9a94e', 12); box(706, 306, 84, 238, '#d8bc66', 10); circ(748, 470, 26, '#b08f3a'); box(742, 452, 12, 36, '#3a2a12', 4);
  g.save(); g.translate(748, 366); box(-16, -16, 120, 32, '#b08f3a', 14); circ(0, 0, 26, '#c9a94e'); g.restore();
  g.restore();
  box(330, 676, 620, 60, '#c9414f', 8); for (let i = 0; i < 16; i++) box(338 + i * 38, 676, 6, 60, 'rgba(0,0,0,.14)'); text('ברוכים הבאים', 640, 708, 26, '#ffe9d0', { weight: 700 });
  g.restore();
}
function keyRing(t, x, y, s, jingle, sel = 0) {
  g.save(); g.translate(x, y); g.scale(s, s);
  g.strokeStyle = '#d7dcee'; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 30, 0, TAU); g.stroke();
  const key = (rot, col, len) => { g.save(); g.rotate(rot); g.translate(0, 30); g.fillStyle = col; g.beginPath(); g.arc(0, 16, 17, 0, TAU); g.fill(); circ(0, 12, 5, '#7a4e2e'); g.fillStyle = col; g.fillRect(-5, 28, 10, len); g.fillRect(5, 28 + len - 26, 9, 7); g.fillRect(5, 28 + len - 12, 12, 7); g.restore(); };
  key(-.5 + Math.sin(t * 17) * .22 * jingle, '#c9a94e', 60); key(.5 + Math.sin(t * 19 + 1) * .25 * jingle, '#aeb4c8', 52); key(Math.sin(t * 15 + 2) * .18 * jingle * (1 - sel), '#e7c765', 66);
  // the charm: a blue eye bead and a little heart
  g.save(); g.rotate(1.9 + Math.sin(t * 13) * .3 * jingle); line([[0, 30], [0, 66]], '#d7dcee', 2.5); circ(0, 82, 18, '#1556b8'); circ(0, 82, 11, '#fff'); circ(0, 82, 6, '#5cc8ff'); circ(0, 82, 2.6, '#0c0e1c'); heart(0, 118, .9, '#ff5a6e'); g.restore();
  g.restore();
}
S(L.v2c, (t, a, b) => { // she takes out her keys
  const k = seg(t, a, b), up = eOut(seg(t, a, a + .5)), jing = 1 - sg(t, a + .6, b) * .7;
  doorCU(t, { z: 1.25 + k * .05, fx: 700, fy: 400 });
  const hx = lerp(260, 470, up) + k * 60, hy = lerp(900, 380, up);
  g.strokeStyle = LOOKS.her.skin; g.lineWidth = 78; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx - 300, hy + 420); g.lineTo(hx, hy); g.stroke(); circ(hx + 10, hy - 14, 54, LOOKS.her.skin); g.strokeStyle = '#e7c765'; g.lineWidth = 8; g.beginPath(); g.moveTo(hx - 92, hy + 70); g.lineTo(hx - 20, hy + 112); g.stroke();
  keyRing(t, hx + 44, hy + 30, 1.6, jing, sg(t, a + .8, b));
  for (let i = 0; i < 4; i++) circ(hx + 4 - i * 4, hy - 46 + i * 26, 11, '#ff5a6e');
  for (let i = 0; i < 5; i++) star4(hx + 90 + Math.cos(i * 1.7 + t * 4) * 110, hy + 110 + Math.sin(i * 2.1 + t * 5) * 90, 10 + 6 * A.pulse(t), '#fff3c4', jing * (.4 + .6 * Math.abs(Math.sin(t * 6 + i))), t + i);
  tint('#1a1020', .18);
});
S(L.v2c2, (t, a, b) => { // and opens the door
  const ins = eOut(seg(t, a, a + .4)), turn = sg(t, a + .45, a + .8), open = eIn(seg(t, a + .85, b)), z = 2.2 - open * 1.0, fx = lerp(860, 640, open), fy = lerp(450, 360, open);
  doorCU(t, { z, open, fx, fy });
  if (open < .6) { // the key slides into the lock and turns
    const lx = W / 2 + (210 + 748 * (1 - open * .86) - fx) * z, ly = H / 2 + (470 - fy) * z, out = (1 - ins) * 260, a2 = 1 - sg(open, .2, .6);
    g.save(); g.globalAlpha = a2; g.translate(lx, ly);
    box(-out - 190, -11, 190, 22, '#e7c765', 4); for (let i = 0; i < 4; i++) box(-out - 60 - i * 30, 8, 14, 9 + (i % 2) * 6, '#e7c765', 2);
    g.save(); g.translate(-out - 226, 0); g.scale(1, lerp(1, .3, Math.sin(turn * Math.PI / 2))); circ(0, 0, 50, '#e7c765'); circ(-14, 0, 14, '#7a4e2e'); g.restore();
    // her fingers on the key, the ring dangling below
    circ(-out - 250, 40, 42, LOOKS.her.skin); g.strokeStyle = LOOKS.her.skin; g.lineWidth = 64; g.lineCap = 'round'; g.beginPath(); g.moveTo(-out - 262, 60); g.lineTo(-out - 560, 420); g.stroke(); circ(-out - 222, 10, 22, LOOKS.her.skin); circ(-out - 214, -4, 9, '#ff5a6e');
    g.save(); g.translate(-out - 250, 60); g.rotate(Math.sin(t * 15) * .12 * (1 - turn)); line([[0, 0], [0, 80]], '#d7dcee', 4); circ(0, 104, 24, '#1556b8'); circ(0, 104, 15, '#fff'); circ(0, 104, 8, '#5cc8ff'); circ(0, 104, 3.4, '#0c0e1c'); g.restore();
    if (turn > 0 && turn < 1) for (let i = 0; i < 3; i++) { g.strokeStyle = `rgba(255,243,196,${1 - turn})`; g.lineWidth = 6; g.beginPath(); g.arc(0, 0, 70 + i * 30 + turn * 50, -.7, .7); g.stroke(); }
    g.restore(); }
  tint('#1a1020', .18 * (1 - open)); tint('#05040c', open * .35);
});
function roomIn(t, st, actors) { room(t, Object.assign({ lamp: 1, fairy: 1 }, st), actors); }
S(L.v2d, (t, a, b) => { // a small table, two armchairs
  camKeys(t, [[a, 930, 360, .84], [91.2, 900, 372, .9], [b, 800, 430, 1.34]]);
  const lit = Math.min(1, sg(t, a, a + .12) * (.6 + .4 * (Math.sin(t * 60) > 0 ? 1 : .4)) + sg(t, a + .3, a + .45)), fairy = sg(t, a + .5, a + 1.2);
  const hx = lerp(1640, 1330, sg(t, a, b)), mx = lerp(1760, 1500, sg(t, a + .3, b));
  room(t, { lamp: lit, fairy }, d => { if (d === 1) { figure('her', hx, FL, 1, -1, poseWalk(stepPhase(hx), { t, smile: .6, hN: [40, -140] })); figure('him', mx, FL, 1, -1, poseWalk(stepPhase(mx), { t, look: [.4, -.5], brow: .6 })); } });
  // the three things the line names light up one after the other
  layer(1, () => { sparkle(RX.table, FL - 110, 91.25, t, 8, 80); sparkle(RX.ch1, FL - 110, 92.05, t, 8, 96, '#ffe1a0'); sparkle(RX.ch2, FL - 110, 92.5, t, 8, 96, '#b8f0ea'); const gl = (x, t0, c) => glow(x, FL - 80, 190, c, bell(t, t0, t0 + .8, .2) * .7); gl(RX.table, 91.2, 'rgba(255,230,170,.8)'); gl(RX.ch1, 92.0, 'rgba(255,200,90,.8)'); gl(RX.ch2, 92.45, 'rgba(90,220,210,.8)'); });
});
function drinkIcon(kind, x, y, s) { g.save(); g.translate(x, y); g.scale(s, s); if (kind === 0) { box(-11, -30, 22, 34, 'rgba(160,210,255,.6)', 3); g.strokeStyle = '#6aa8d8'; g.lineWidth = 2.5; g.strokeRect(-11, -30, 22, 34); box(-9, -14, 18, 16, '#7fc8ff', 2); } else if (kind === 1) { box(-9, -24, 18, 28, '#8a5a2a', 3); box(-4, -40, 8, 18, '#8a5a2a', 2); box(-9, -12, 18, 9, '#f4d35e'); box(-5, -44, 10, 5, '#d8b65a', 2); } else { g.restore(); wineGlass(x, y + 6 * s, s * .8, .6); return; } g.restore(); }
S(L.v2e, (t, a, b) => { // "what would you like to drink?"
  const k = seg(t, a, b); setCam(lerp(1090, 1060, k), 372, .96);
  const fr = sg(t, a + .15, a + .7), turn = t > 94.15, mx = lerp(1500, RX.ch1 + 30, sg(t, a, 95.3)), sit = t > 95.35, ans = eBack(seg(t, 96.0, 96.3));
  let HP;
  room(t, { fridge: fr }, d => {
    if (d === 0 && sit) himChair(t, { smile: .7, look: [1, -.2], hN: ans > 0 ? [lerp(26, 40, ans), lerp(-112, -190, ans)] : [26, -112], lean: -.04, brow: .4 });
    if (d === 1) { if (!sit) figure('him', mx, FL, 1, -1, poseWalk(stepPhase(mx), { t, look: [.2, -.2] })); HP = figure('her', 1368, FL, 1, turn ? -1 : 1, poseStand({ t, hN: turn ? [-30, -150] : [56, -170], hF: [40, -140], smile: .6, brow: turn ? .8 : 0, open: turn && t < 96 ? .3 * Math.max(0, Math.sin(t * 13)) : 0, look: [1, 0], tilt: turn ? -.08 : 0 })); }
  });
  const [bx, by] = toScreen(HP.head[0] - 130, HP.head[1] - 150), ap = eBack(seg(t, 93.6, 93.9)) * (1 - sg(t, 96.5, 96.9));
  if (ap > 0) { g.save(); g.translate(bx, by); g.scale(ap, ap); g.translate(-bx, -by); bubble(bx, by, 300, 124, bx + 120, by + 150);
    const beat = Math.floor(A.beat(t)), pick = t > 96.1 ? 2 : beat % 3; for (let i = 0; i < 3; i++) { const on = pick === i; g.save(); g.globalAlpha = on ? 1 : .32; drinkIcon(i, bx - 92 + i * 74, by + 20, on ? 1.5 + .2 * A.pulse(t) : 1.2); g.restore(); } text('?', bx + 118, by, 56, '#ff5a6e', { weight: 800, a: t > 96.1 ? 0 : 1 }); if (t > 96.1) { g.strokeStyle = '#3aa35a'; g.lineWidth = 8; g.lineCap = 'round'; g.lineJoin = 'round'; g.beginPath(); g.moveTo(bx + 96, by + 2); g.lineTo(bx + 112, by + 20); g.lineTo(bx + 140, by - 22); g.stroke(); } g.restore(); }
});
function movieShot(t, k) { // him, feeling like a character in a film
  camR(RX.ch1 + 40 - k * 16, 1.75 + k * .5, 640);
  roomIn(t, {}, d => { if (d === 0) { himChair(t, { lean: -.2, smile: .5, brow: .9, look: [.8 * Math.sin(t * 1.2), 0], hN: [52, -100], hF: [40, -96], tilt: .06, blush: .2, fN: [58, -30], fF: [50, 0] }); } });
  tint('#ffb040', .16); tint('#201000', .12);
  const sp = g.createRadialGradient(560, 300, 120, 560, 300, 700); sp.addColorStop(0, 'rgba(0,0,0,0)'); sp.addColorStop(1, 'rgba(0,0,0,.6)'); g.fillStyle = sp; g.fillRect(0, 0, W, H);
  grain(t, .09); for (let i = 0; i < 3; i++) { const x = rnd(Math.floor(t * 14) + i * 9) * W; box(x, 0, 1.5, H, 'rgba(255,255,255,.16)'); }
}
S(L.v2f, (t, a, b) => { // "I feel just like a character from a movie"
  const cut = 98.5;
  if (t < cut) {
    const k = seg(t, a, cut); movieShot(t, k); letterbox(eOut(seg(t, a, a + .5)));
    // clapperboard
    const cin = eBack(seg(t, a, a + .25)) * (1 - sg(t, a + .85, a + 1.1)), clap = sg(t, a + .42, a + .5); if (cin > 0) { g.save(); g.translate(940, 420 + (1 - cin) * 500); g.rotate(-.08); box(-190, -90, 380, 230, '#15161c', 10); box(-178, -30, 356, 158, '#f1eee6', 4);
      g.save(); g.translate(-190, -92); g.rotate(-.5 * (1 - clap)); box(0, -44, 380, 46, '#15161c', 6); for (let i = 0; i < 6; i++) poly([[14 + i * 64, -44], [44 + i * 64, -44], [24 + i * 64, 2], [-6 + i * 64, 2]], '#f1eee6'); g.restore(); for (let i = 0; i < 6; i++) poly([[-176 + i * 64, -88], [-146 + i * 64, -88], [-166 + i * 64, -42], [-196 + i * 64, -42]], '#f1eee6');
      text('דמות ראשית', 0, 0, 28, '#15161c'); line([[-170, 26], [170, 26]], '#15161c', 3); text('סצנה 1', 80, 60, 26, '#15161c', { weight: 600 }); text('טייק 1', -84, 60, 26, '#15161c', { weight: 600 }); line([[0, 30], [0, 124]], '#15161c', 3); text('תל אביב · אחרי חצות', 0, 104, 20, '#555', { weight: 600 }); g.restore();
      tint('#fff', pulseIn(t, a + .5, .08) * .4); }
  } else { // …and we are in the cinema, watching him
    const k = seg(t, cut, b), z = 1 - eOut(seg(t, cut, cut + .9)) * .38, sw = W * z, sh = H * z, sx = (W - sw) / 2, sy = 46 + (1 - z) * 20;
    g.fillStyle = '#07060c'; g.fillRect(0, 0, W, H);
    inRect(sx, sy, sw, sh, () => { movieShot(t, 1 + k * .3); letterbox(1); });
    g.strokeStyle = '#1a1420'; g.lineWidth = 10; g.strokeRect(sx, sy, sw, sh); glow(W / 2, sy + sh / 2, 700, 'rgba(255,200,140,.18)');
    // curtains, projector beam, the audience
    const cur = (x0, dir) => { for (let i = 0; i < 6; i++) { g.fillStyle = i % 2 ? '#6a1420' : '#8a1c2a'; g.beginPath(); g.moveTo(x0 + dir * i * 34, 0); g.lineTo(x0 + dir * (i + 1) * 34, 0); g.lineTo(x0 + dir * ((i + 1) * 34 - 8 + Math.sin(i) * 6), H); g.lineTo(x0 + dir * (i * 34 - 8 + Math.sin(i + 1) * 6), H); g.fill(); } }; const cw = Math.max(0, sx - 20); g.save(); g.globalAlpha = seg(k, 0, .4); cur(-30, cw / 200 + .2); cur(W + 30, -(cw / 200 + .2)); g.restore();
    g.save(); g.globalCompositeOperation = 'lighter'; g.globalAlpha = (.10 + .05 * rnd(Math.floor(t * 24))) * seg(k, .1, .5); const bm = g.createLinearGradient(0, H, 0, sy + sh / 2); bm.addColorStop(0, 'rgba(255,240,210,1)'); bm.addColorStop(1, 'rgba(255,240,210,.1)'); g.fillStyle = bm; g.beginPath(); g.moveTo(W / 2 - 16, H + 40); g.lineTo(sx + 30, sy + 20); g.lineTo(sx + sw - 30, sy + 20); g.lineTo(W / 2 + 16, H + 40); g.fill(); g.restore();
    const rise = eOut(seg(k, .05, .6));
    for (let r = 0; r < 2; r++) for (let i = 0; i < 9 + r; i++) { const hx = 60 + i * (140 - r * 12) + r * 50 + rnd(i + r * 20) * 20, hy = H - 40 + r * 44 + (1 - rise) * 200 + Math.sin(t * 2 + i) * 2, rr2 = 44 + r * 8; g.fillStyle = r ? '#05040a' : '#0d0b14'; g.beginPath(); g.arc(hx, hy - 20, rr2, 0, TAU); g.fill(); g.beginPath(); g.ellipse(hx, hy + 70, rr2 * 1.7, 70, 0, 0, TAU); g.fill(); if (rnd(i * 7 + r) > .7) { g.beginPath(); g.arc(hx - 30, hy - 40, 22, 0, TAU); g.arc(hx + 30, hy - 40, 22, 0, TAU); g.fill(); } }
    // someone's popcorn
    const px = 960, py = H - 30 + (1 - rise) * 200; poly([[px - 40, py - 80], [px + 40, py - 80], [px + 30, py + 40], [px - 30, py + 40]], '#c9414f'); for (let i = 0; i < 4; i++) box(px - 32 + i * 18, py - 80, 9, 120, '#f6f2ea'); for (let i = 0; i < 9; i++) circ(px - 34 + i * 9 + rnd(i) * 6, py - 86 - rnd(i + 3) * 18, 10, '#fff3c4');
  }
});
function tableCU(t, o = {}) { // the little table up close
  const { z = 2.5, g1 = 0, g2 = 0, f1 = 0, f2 = 0 } = o;
  camR(RX.table + (o.dx || 0), z, o.fy || 590);
  roomIn(t, { chairs: 1 }, d => {
    if (d !== 1) return; const ty = FL - 90;
    // a bowl of olives, a coaster
    ell(RX.table - 34, ty - 1, 15, 3, '#e9e2cf'); g.fillStyle = '#e9e2cf'; g.beginPath(); g.arc(RX.table - 34, ty - 3, 14, 0, Math.PI); g.fill(); for (let i = 0; i < 5; i++) circ(RX.table - 43 + i * 4.5, ty - 5 - (i % 2) * 3, 3.4, i % 2 ? '#5a7a2a' : '#3a2a3a');
    const drop = (k) => (1 - eOut(k)) * -120 + Math.sin(cl(k) * Math.PI) * 0;
    if (g1 > 0) { wineGlass(RX.table + 4, ty + drop(g1), 1, f1); }
    if (g2 > 0) { wineGlass(RX.table + 30, ty + drop(g2), 1, f2); }
    if (o.extra) o.extra(ty);
  });
}
S(L.v2g, (t, a, b) => { // two glasses on the table
  const t1 = 100.75, t2 = 101.45, k = seg(t, a, b);
  tableCU(t, { z: 2.7 + k * .2, g1: seg(t, t1 - .3, t1), g2: seg(t, t2 - .3, t2), extra: ty => {
    const hand = (x, t0) => { const k2 = seg(t, t0 - .3, t0), away = sg(t, t0 + .1, t0 + .45); if (k2 <= 0 || away >= 1) return; const hy = ty - 40 + (1 - eOut(k2)) * -120 - away * 60, hx = x + 12 + away * 80; g.strokeStyle = LOOKS.her.skin; g.lineWidth = 11; g.lineCap = 'round'; g.beginPath(); g.moveTo(hx + 90, hy - 50); g.lineTo(hx + 4, hy); g.stroke(); circ(hx + 2, hy, 7, LOOKS.her.skin); };
    hand(RX.table + 4, t1); hand(RX.table + 30, t2);
    sparkle(RX.table + 4, ty - 4, t1, t, 6, 22); sparkle(RX.table + 30, ty - 4, t2, t, 6, 22);
  } });
  tint('#fff3d6', (pulseIn(t, t1, .08) + pulseIn(t, t2, .08)) * .18);
});
S(L.v2h, (t, a, b) => { // and she pours, and pours
  const p1 = seg(t, a + .15, 104.45), p2 = seg(t, 104.75, 106.15), which = t < 104.6 ? 0 : 1, pouring = (which === 0 && p1 > 0 && p1 < 1) || (which === 1 && p2 > 0 && p2 < 1);
  tableCU(t, { z: 2.3, fy: 560, dx: 8, g1: 1, g2: 1, f1: p1 * .82, f2: p2 * .82, extra: ty => {
    const move = sg(t, 104.4, 104.75), gx = lerp(RX.table + 4, RX.table + 30, move), tilt = pouring ? -1.95 - Math.sin(t * 9) * .02 : -1.35, bx = gx + 91, by = ty - 114 - (pouring ? 0 : 14);
    // her arm, then the bottle
    g.strokeStyle = LOOKS.her.skin; g.lineWidth = 11; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - 22, by + 12); g.lineTo(bx + 130, by - 44); g.stroke();
    wineBottle(bx, by, 1, tilt, { cork: 0, level: .8 - (p1 + p2) * .3 }); circ(bx - 26, by + 12, 8, LOOKS.her.skin); circ(bx - 34, by + 20, 5, LOOKS.her.skin);
    if (pouring) { const nx = bx + 98 * Math.sin(tilt), ny = by - 98 * Math.cos(tilt); g.strokeStyle = 'rgba(250,238,150,.95)'; g.lineWidth = 3.2; g.beginPath(); g.moveTo(nx, ny); g.quadraticCurveTo(gx - 2, ny + 6, gx + Math.sin(t * 30) * .6, ty - 30); g.stroke(); for (let i = 0; i < 5; i++) { const ph = (t * 3 + i / 5) % 1; circ(gx + (rnd(i + Math.floor(t * 3)) - .5) * 16, ty - 34 - ph * 16, 1.4, `rgba(255,250,200,${1 - ph})`); } }
  } });
});
S(L.v2i, (t, a, b) => { // she's finishing him off
  const k = seg(t, a, b), bt = A.beat(t), cyc = (bt / 2) % 1, refills = Math.floor((bt - A.beat(a)) / 2), lvl = cyc < .25 ? lerp(.15, .9, cyc / .25) : lerp(.9, .15, (cyc - .25) / .75), drink = cyc > .45;
  camR(RX.ch1 + 60, 1.9 + k * .15 + .03 * A.pulse(t), 632);
  let P;
  roomIn(t, { chairs: 1, music: 1 }, d => {
    if (d !== 0) return;
    P = himChair(t, { lean: -.14 - k * .1, hip: [-6 - k * 8, -66 + k * 5], smile: .8, blush: .3 + k * .7, open: .2, brow: .3, look: [Math.sin(t * 2.2) * .7, Math.cos(t * 1.7) * .4], tilt: Math.sin(t * 1.6) * .1 * (.3 + k), hN: drink ? [30, -150] : [44, -116], hF: [34, -96], blink: Math.sin(t * 2.6) > .6 && k > .5 ? 1 : 0 }, RX.ch1 + 60);
    wineGlass(P.handN[0] + 6, P.handN[1] + 18, 1, lvl, { rot: drink ? -.5 : 0 });
    // the bottle keeps arriving from her side
    if (cyc < .3) { const inn = Math.sin(cyc / .3 * Math.PI); wineBottle(P.handN[0] + 70 - inn * 10, P.handN[1] - 46 - inn * 10, 1, -1.9, { cork: 0, level: .5 }); circ(P.handN[0] + 88, P.handN[1] - 28, 8, LOOKS.her.skin); line([[P.handN[0] + 92, P.handN[1] - 26], [P.handN[0] + 180, P.handN[1] - 50]], LOOKS.her.skin, 10); line([[P.handN[0] + 6, P.handN[1] - 30], [P.handN[0] + 6, P.handN[1] - 8]], 'rgba(250,238,150,.95)', 3); }
    // dizzy little stars & hearts circling his head
    for (let i = 0; i < 5; i++) { const an = t * 3.2 + i / 5 * TAU, x = P.head[0] + Math.cos(an) * 46, y = P.head[1] - 44 + Math.sin(an) * 12; if (Math.sin(an) > -.2) (i % 2 ? star4(x, y, 7, '#ffe27a', k) : heart(x, y, .4, '#ff7a9a', k)); }
  });
  // tally of refills, chalked in the corner
  g.save(); g.translate(1010, 120); g.rotate(-.04); for (let i = 0; i < Math.min(9, refills + 1); i++) { const grp = Math.floor(i / 5), j = i % 5; if (j < 4) line([[grp * 110 + j * 22, 0], [grp * 110 + j * 22 + 4, 56]], 'rgba(255,255,255,.9)', 6); else line([[grp * 110 - 12, 46], [grp * 110 + 82, 8]], 'rgba(255,255,255,.9)', 6); } g.save(); g.translate(-66, 28); wineGlass(0, 28, 1.1, .6); g.restore(); g.restore();
  tint('#ffd070', pulseIn(t, AUD.beats[Math.floor(bt / 2) * 2] || 0, .1) * .12);
});
S(L.v2j, (t, a, b) => { // she opens another white
  const pop = 111.5, tw = seg(t, a, pop - .15), k = seg(t, a, b), after = t >= pop;
  warmBokeh(t); glow(640, 760, 700, 'rgba(255,200,130,.4)');
  const shake = after ? pulseIn(t, pop, .15) * 8 * Math.sin(t * 90) : 0;
  g.save(); g.translate(600 + shake, 720); g.rotate(.06);
  wineBottle(0, 150, 5.2, 0, { cork: after ? 0 : 1, level: .95 });
  // her hands: one holding the neck, one turning the corkscrew
  g.strokeStyle = LOOKS.her.skin; g.lineCap = 'round'; g.lineWidth = 70; g.beginPath(); g.moveTo(-330, 190); g.lineTo(-60, -80); g.stroke(); circ(-40, -90, 52, LOOKS.her.skin); for (let i = 0; i < 4; i++) { line([[-30, -124 + i * 24], [44, -128 + i * 24]], LOOKS.her.skin, 21); circ(48, -128 + i * 24, 7, '#ff5a6e'); }
  if (!after) { g.save(); g.translate(0, -400 + tw * 26); const w = Math.cos(tw * 16) * 60; line([[0, 0], [0, -70]], '#aeb4c8', 9); g.strokeStyle = '#aeb4c8'; g.lineWidth = 6; g.beginPath(); for (let i = 0; i <= 20; i++) { const yy = i * 2.4, xx = Math.sin(i * .9 + tw * 16) * 8; i ? g.lineTo(xx, yy) : g.moveTo(xx, yy); } g.stroke(); box(-Math.abs(w) - 14, -92, Math.abs(w) * 2 + 28, 24, '#c9414f', 12); g.strokeStyle = LOOKS.her.skin; g.lineWidth = 44; g.lineCap = 'round'; g.beginPath(); g.moveTo(10, -112); g.lineTo(150, -330); g.stroke(); circ(0, -96, 34, LOOKS.her.skin); for (let i = 0; i < 4; i++) circ(-30 + i * 20, -74, 11, LOOKS.her.skin); g.restore(); }
  g.restore();
  if (after) { const q = t - pop, cx = 600 + q * 520, cy = 190 - q * 900 + q * q * 900; // the cork flies
    g.save(); g.translate(cx, cy); g.rotate(q * 14); box(-20, -28, 40, 56, '#c9a070', 8); box(-20, -28, 40, 12, '#b08a5a', 6); line([[0, 28], [0, 60]], '#aeb4c8', 7); g.restore();
    const bk = pulseIn(t, pop, .3); for (let i = 0; i < 14; i++) { const an = -Math.PI / 2 + (i - 6.5) * .22, r0 = 60 + q * 500, r1 = r0 + 70 * bk; g.strokeStyle = `rgba(255,243,196,${bk})`; g.lineWidth = 8; g.lineCap = 'round'; g.beginPath(); g.moveTo(600 + Math.cos(an) * r0, 210 + Math.sin(an) * r0); g.lineTo(600 + Math.cos(an) * r1, 210 + Math.sin(an) * r1); g.stroke(); }
    for (let i = 0; i < 12; i++) { const ph = cl(q * 1.4 - rnd(i) * .3); circ(600 + (rnd(i + 4) - .5) * 200 * ph, 220 - ph * (150 + rnd(i + 8) * 200), 22 * (1 - ph) + 6, `rgba(255,255,255,${.25 * (1 - ph)})`); }
    text('פּוֹפּ!', 930, 190, 110 * eBack(seg(t, pop, pop + .2)), '#fff3c4', { rot: .14, stroke: '#c9414f', sw: 12, a: 1 - sg(t, pop + .6, b) });
    tint('#fff', bk * .25); }
  vignette(.6);
});
S(L.v2k, (t, a, b) => { // she throws him a small smile
  const k = seg(t, a, b), sm = sg(t, 113.3, 113.9), fly = seg(t, 114.15, 114.9);
  warmBokeh(t);
  g.save(); g.translate(W / 2, H / 2); g.scale(1 + k * .07, 1 + k * .07); g.translate(-W / 2, -H / 2);
  const P = closeUp('her', -1, { t, smile: sm * .75 * (1 - fly * .5), blush: sm * .8, look: [1, 0], brow: .3 * sm, tilt: .06 * sm, hairWind: .05 }, 700, 330, 7);
  g.restore();
  // the smile leaves her face and sails across the room
  if (fly > 0) { const sx = P.head[0] - 70 - eIn(fly) * 900, sy = P.head[1] + 84 - Math.sin(fly * Math.PI) * 120; for (let i = 0; i < 8; i++) star4(sx + i * 34 + rnd(i) * 10, sy + Math.sin(i + t * 9) * 12, 10 - i, '#ffd3e0', (1 - i / 8) * .9, t * 4 + i); g.strokeStyle = '#ff5a8a'; g.lineWidth = 15; g.lineCap = 'round'; g.beginPath(); g.arc(sx, sy - 34, 50, .25 * Math.PI, .75 * Math.PI); g.stroke(); glow(sx, sy, 130, 'rgba(255,110,160,.6)'); }
  vignette(.6);
});
function heartRoom(t, k, beatA = 0) { // a look inside his chest
  const s = 1 + .08 * A.pulse(t, 2) * beatA; g.save(); g.scale(s, s);
  circ(0, 0, 150, '#3a0f22'); glow(0, 0, 150, 'rgba(255,60,110,.6)', .5 + .5 * beatA * A.pulse(t), false);
  heart(0, 26, 5.4, '#ff3d70'); heart(-22, 6, 2.2, 'rgba(255,255,255,.18)');
  // a little door in the heart
  const open = sg(k, .08, .22) * (1 - sg(k, .86, .97));
  box(-30, -12, 60, 96, '#2a0a18', [30, 30, 3, 3]); glow(0, 40, 70, 'rgba(255,220,150,.9)', open, false);
  g.save(); g.translate(-30, -12); g.scale(1 - open * .8, 1); box(0, 0, 60, 96, '#c9414f', [30, 30, 3, 3]); circ(48, 54, 5, '#ffd98a'); g.restore();
  g.restore();
}
S(L.v2l, (t, a, b) => { // slowly, she walks into his heart
  const k = seg(t, a, b), arr = seg(t, a, 116.4), inH = seg(t, 116.3, 119.0), beatA = sg(t, 118.6, 119.2);
  camR(RX.ch1 + 76 + k * 10, 1.95 + k * .25, 636);
  let P;
  roomIn(t, { chairs: 1, music: 1 }, d => { if (d === 0) P = himChair(t, { lean: -.2, hip: [-12, -62], smile: .3 + .7 * sg(t, 116.3, 117.4), blush: 1, brow: .8 * (1 - sg(t, 117, 118)), open: .25 * (1 - sg(t, 116.6, 117.4)), look: [.9, .1], hN: [40, -112], hF: [34, -96], tilt: .04 }, RX.ch1 + 60); });
  const [cx, cy] = toScreen(P.chest[0] + 4, P.chest[1] + 4);
  // the smile drifting in, slow
  if (arr < 1) { const sx = lerp(W + 80, cx, eOut(arr)), sy = cy - 30 - Math.sin(arr * Math.PI) * 90; g.strokeStyle = '#ff5a8a'; g.lineWidth = 12; g.lineCap = 'round'; g.beginPath(); g.arc(sx, sy - 26, 40 * (1 - arr * .4), .25 * Math.PI, .75 * Math.PI); g.stroke(); glow(sx, sy, 110, 'rgba(255,110,160,.6)'); for (let i = 0; i < 6; i++) star4(sx + 30 + i * 30, sy + Math.sin(i + t * 6) * 10, 8 - i, '#ffd3e0', .8 - i * .12, t * 3 + i); }
  else { const rr2 = eBack(seg(t, 116.3, 116.8)), ox = cx + 300, oy = cy - 50;
    glow(cx, cy, 70, 'rgba(255,90,140,.8)', .6 + .4 * A.pulse(t)); g.strokeStyle = 'rgba(255,243,214,.9)'; g.lineWidth = 4; g.setLineDash([4, 10]); g.lineCap = 'round'; g.beginPath(); g.moveTo(cx + 14, cy - 4); g.lineTo(ox - 150 * rr2, oy + 20); g.stroke(); g.setLineDash([]);
    g.save(); g.translate(ox, oy); g.scale(rr2 * 1.25, rr2 * 1.25); g.strokeStyle = '#fff3d6'; g.lineWidth = 8; g.beginPath(); g.arc(0, 0, 154, 0, TAU); g.stroke(); g.save(); g.beginPath(); g.arc(0, 0, 150, 0, TAU); g.clip(); heartRoom(t, inH, beatA);
    // tiny her, taking her time
    const walk = seg(inH, .12, .86), hx = lerp(150, 2, eOut(walk) * .5 + walk * .5), vis = 1 - sg(inH, .8, .9); if (walk > 0 && vis > 0) { g.globalAlpha = vis; figure('her', hx, 84, .4, -1, walk < 1 ? poseWalk((t - 116.3) * 3.2, { t, stride: 20, shadow: 0 }) : poseStand({ t, shadow: 0 })); g.globalAlpha = 1; }
    g.restore(); g.restore();
    floatingHearts(t, ox, oy - 170, 7, beatA, 260, 200); }
  tint('#ff4d7d', beatA * .08 * A.pulse(t)); tint('#fff', sg(t, b - .18, b) * .5);
});

/* =================== CHORUS (2): the evening retold, snapshot by snapshot =================== */
const SNAPS = [
  [L.c2a, t => { box(0, 0, 120, 104, '#c9a878'); [[40, 58], [84, 44]].forEach(([x, y], i) => { circ(x, y, 26, '#f6f2ea'); circ(x, y, 17, '#fff6e6'); heart(x, y + 2, .5, '#b07a4a', 1, i ? .4 : -.3); }); }],
  [L.c2b, t => { box(0, 0, 120, 104, '#ff9a5a'); circ(92, 26, 16, '#ffe27a'); for (let i = 0; i < 8; i++) line([[92 + Math.cos(i * .785) * 21, 26 + Math.sin(i * .785) * 21], [92 + Math.cos(i * .785) * 28, 26 + Math.sin(i * .785) * 28]], '#ffe27a', 3); box(24, 20, 12, 60, '#fff', 6); circ(30, 84, 11, '#fff'); circ(30, 84, 7, '#ff3c3c'); box(27, 34, 6, 50, '#ff3c3c', 3); g.save(); g.translate(66, 70); g.rotate(-.4 + Math.sin(t * 9) * .2); box(-12, -22, 26, 34, '#f3e7d3', 3); g.restore(); }],
  [L.c2d, t => { box(0, 0, 120, 104, '#3a3654'); for (let i = 0; i < 6; i++) { g.save(); g.translate(18 + i * 17, 70 - i * 6 + (i % 2) * 12); g.rotate(-.5); ell(0, 0, 7, 4, i % 2 ? '#ff8a9a' : '#e9eef7'); g.restore(); } line([[76, 28], [104, 22]], '#ffe27a', 4); line([[94, 14], [105, 22], [96, 32]], '#ffe27a', 4); }],
  [L.c2e, t => { box(0, 0, 120, 104, '#2a3a6a'); poly([[30, 86], [30, 46], [56, 24], [82, 46], [82, 86]], '#f3e7d3'); box(48, 60, 16, 26, '#c9414f'); box(36, 50, 10, 10, '#ffd98a'); box(66, 50, 10, 10, '#ffd98a'); g.strokeStyle = '#e7c765'; g.lineWidth = 4; g.beginPath(); g.arc(98, 40, 8, 0, TAU); g.stroke(); line([[98, 48], [98, 72], [105, 72]], '#e7c765', 4); }],
  [L.c2f, t => { box(0, 0, 120, 104, '#141a48'); box(57, 40, 5, 64, '#6d7390'); box(10, 18, 100, 40, '#f4f6fb', 6); box(13, 21, 94, 34, '#1556b8', 4); text('דרך השלום', 60, 38, 16, '#fff'); circ(98, 82, 3, '#ffd98a'); circ(20, 76, 2, '#fff'); circ(34, 90, 2, '#fff'); }],
  [L.c2g, t => { box(0, 0, 120, 104, '#c9a878'); g.save(); g.translate(60, 52); g.rotate(-.12); box(-30, -40, 60, 80, '#fffdf6', 2); for (let i = 0; i < 4; i++) line([[20, -26 + i * 12], [-6 - (i % 2) * 8, -26 + i * 12]], '#6d7390', 2.5); line([[22, 26], [-22, 26]], '#c9414f', 3); g.restore(); circ(98, 82, 10, '#d8b65a'); }],
];
function snapshots(t) { // polaroids pegged to a string across the top of the frame
  const out = sg(t, 139.3, 140.0); if (t < L.c2a - .05) return;
  g.save(); g.translate(0, -out * 300);
  g.strokeStyle = 'rgba(255,255,255,.55)'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-20, 30); g.quadraticCurveTo(W / 2, 70, W + 20, 30); g.stroke();
  SNAPS.forEach(([t0, fn], i) => {
    const k = eBack(seg(t, t0 - .05, t0 + .3)); if (k <= 0) return;
    const x = 140 + i * 200, q = x / W, y = 30 + 40 * 4 * q * (1 - q) * .5 + 4, rot = (rnd(i + 3) - .5) * .16 + Math.sin(t * 1.6 + i) * .03 + pulseIn(t, t0, .4) * .25 * Math.sin((t - t0) * 20);
    g.save(); g.translate(x, y); g.rotate(rot); g.scale(k, k);
    box(-73, 6, 150, 182, 'rgba(0,0,0,.3)', 4); box(-76, 2, 150, 182, '#fffdf6', 4); g.save(); g.translate(-61, 16); g.scale(1, 1); g.beginPath(); g.rect(0, 0, 120, 104); g.clip(); fn(t); g.restore();
    line([[-40, 146], [34, 146]], 'rgba(60,60,80,.35)', 3); line([[-40, 160], [10, 160]], 'rgba(60,60,80,.25)', 3);
    box(-7, -12, 14, 30, '#d8b08a', 3); box(-7, 0, 14, 4, '#a8845a');
    g.restore(); glow(x, y + 90, 150, 'rgba(255,240,200,.5)', pulseIn(t, t0, .25));
  });
  g.restore();
}
S(L.c2a, (t, a, b) => { // a toast – and the story of the night so far
  camR(RX.table, 1.18, 664); const clink = pulseIn(t, 121.7, .25), up = sg(t, a, 121.7) * (1 - sg(t, 122.1, 122.7));
  roomIn(t, { chairs: 1, music: 1 }, d => {
    if (d !== 0) return;
    const P = himChair(t, { lean: lerp(-.1, .28, up), smile: .9, look: [1, 0], blush: .8, hN: [lerp(30, 74, up), lerp(-116, -138, up)], open: .3 }, RX.ch1 + 60), Q = herChair(t, { lean: lerp(-.06, .28, up), smile: .9, look: [1, 0], blush: .5, hN: [lerp(30, 72, up), lerp(-116, -138, up)], open: .3 * Math.max(0, Math.sin(t * 11)) }, RX.ch2 - 60);
    wineGlass(P.handN[0] + 4, P.handN[1] + 18, 1, .6, { rot: up * .25 }); wineGlass(Q.handN[0] - 4, Q.handN[1] + 18, 1, .6, { rot: -up * .25 });
    if (clink > 0) for (let i = 0; i < 8; i++) star4(RX.table + Math.cos(i * .785) * (20 + (1 - clink) * 60), FL - 190 + Math.sin(i * .785) * (20 + (1 - clink) * 60), 9, '#fff3c4', clink, i);
    wineBottle(RX.table - 30, FL - 90, 1, 0, { cork: 0, level: .2 }); wineBottle(RX.table + 26, FL - 90, 1, 0, { cork: 0, level: .7 });
  });
  snapshots(t); tint('#fff', (1 - sg(t, a, a + .25)) * .5);
});
S(L.c2b, (t, a, b) => { // …"and all she did was complain about the heat"
  const k = seg(t, a, b); camR(RX.ch2 - 90 + k * 10, 1.62, 650); const fan = Math.sin(t * 13);
  roomIn(t, { chairs: 1, music: 1 }, d => {
    if (d !== 0) return;
    const P = himChair(t, { smile: 1, open: .4 * Math.max(0, Math.sin(t * 8)), look: [1, 0], blush: .8, hN: [36, -120] }, RX.ch1 + 60); wineGlass(P.handN[0] + 4, P.handN[1] + 18, 1, .4);
    const Q = herChair(t, { lean: 0, hN: [10 + fan * 7, -178 + fan * 4], hF: [34, -150], brow: -.5, open: .35, look: [.5, -.5], sweat: .9, blush: .6, tilt: -.1, hairWind: fan * .14, smile: .3 }, RX.ch2 - 60);
    // she fans herself with a record sleeve
    g.save(); g.translate(Q.handN[0], Q.handN[1]); g.rotate(.4 - fan * .5); box(-34, -70, 68, 68, '#2a3a6a', 4); circ(0, -36, 22, '#ffb86a'); circ(0, -36, 9, '#2a3a6a'); g.restore();
    wineBottle(RX.table - 30, FL - 90, 1, 0, { cork: 0, level: .2 }); wineBottle(RX.table + 26, FL - 90, 1, 0, { cork: 0, level: .7 });
  });
  heatShimmer(t, 0, H, W, 480, .8); snapshots(t);
});
S(L.c2c, (t, a, b) => { // "what heat"
  camR(RX.table, 1.18 + .03 * A.kick(t), 664);
  roomIn(t, { chairs: 1, music: 1 }, d => { if (d === 0) { himChair(t, { smile: .8, open: .4, sweat: 1, blush: .9, hN: [14 + Math.sin(t * 12) * 6, -172], look: [.3, -.6] }, RX.ch1 + 60); herChair(t, { hN: [10 + Math.sin(t * 13) * 7, -178], brow: -.6, open: .5, sweat: 1, blush: .7, look: [.3, -.8], tilt: -.14 }, RX.ch2 - 60); } });
  tint('#ff5a1e', .26); heatShimmer(t, 0, H, W, 620, 1.2, '255,220,160'); hotWords(t, a, b, 'melt', { y: 372, size: 150 }); snapshots(t);
});
function dancers(t, x, o = {}) { // slow dance; the sway comes from the beat. close 0 = apart, 1 = cheek to cheek
  const bt = A.beat(t), sw = Math.sin(bt * Math.PI) * (o.amp ?? 14), bob = Math.abs(Math.sin(bt * Math.PI)) * 3, close = o.close ?? 1, gap = lerp(70, 27, close), turn = o.turn || 0;
  const hd = Math.cos(turn * TAU) >= 0 ? 1 : -1, hold = close > .5 && hd > 0;
  const B1 = figure('her', x + gap + sw, FL - bob, 1, -hd, poseStand({ t, smile: .9, blush: .6, look: [1, o.lookY ?? 0], fN: [9 - sw * .25, 0], fF: [-7 + sw * .25, 0], hN: [gap, -156], hF: hold ? [2 * gap - 2, -174] : [40, -130], skirt: sw * .05 + Math.sin(turn * Math.PI) * 1.4, hairWind: sw * .012 + Math.sin(turn * Math.PI) * .7, tilt: -sw * .004, lean: .05, ...o.her }));
  const A1 = figure('him', x - gap + sw, FL - bob, 1, 1, poseStand({ t, smile: .9, blush: .7, look: [1, 0], fN: [9 + sw * .25, 0], fF: [-7 - sw * .25, 0], hN: [gap, -156], hF: hold ? [2 * gap - 14, -116] : [40, -120], tilt: sw * .004, lean: .05, ...o.him }));
  return [A1, B1];
}
S(L.c2d, (t, a, b) => { // "shall we get moving?" – she pulls him up to dance
  camR(RX.table + 10, 1.12, 660); const up1 = sg(t, a, a + .6), up2 = sg(t, 131.4, 132.0), pull = sg(t, 130.2, 131.4);
  roomIn(t, { chairs: 1, music: 1 }, d => {
    if (d === 0 && up2 < 1) { const P = himChair(t, { smile: .9, look: [1, -.3], blush: .8, hN: pull > 0 ? [lerp(36, 70, pull), lerp(-120, -150, pull)] : [36, -120], lean: lerp(-.1, .25, pull) }, RX.ch1 + 60); }
    if (d === 0 && up1 < 1) herChair(t, { smile: .9, look: [1, 0], lean: lerp(-.06, .3, up1) }, RX.ch2 - 60);
    if (d === 1) { if (up1 >= 1 && up2 < 1) figure('her', lerp(RX.ch2 - 90, RX.table + 30, sg(t, a + .6, 130.2)), FL, 1, -1, poseStand({ t, smile: 1, look: [1, .2], hN: [lerp(20, 64, pull), -146], hF: [30, -120], skirt: Math.sin(t * 5) * .3, tilt: Math.sin(A.beat(t) * Math.PI) * .05 })); if (up2 >= 1) dancers(t, RX.table - 8, { close: sg(t, 132, 133.2) }); }
  });
  snapshots(t);
});
S(L.c2f, (t, a, b) => { // dancing in the living room, a few steps from Derech HaShalom
  const k = seg(t, a, b); camR(RX.table - 8, lerp(1.12, 1.0, k), 656); const turn = sg(t, 135.0, 135.9);
  roomIn(t, { chairs: 1, music: 1 }, d => { if (d === 1) dancers(t, RX.table - 8, { close: turn > 0 && turn < 1 ? .15 : 1, turn: turn < 1 ? turn : 0, amp: 20 }); });
  floatingHearts(t, 640, 430, 6, .5, 500, 200); snapshots(t);
});
S(L.c2g, (t, a, b) => { // "let's get the bill" – they fall back into the armchairs, laughing
  camR(RX.table, 1.14, 662); const dn = sg(t, a + .2, a + .9);
  roomIn(t, { chairs: 1, music: 1 }, d => {
    if (d === 0 && dn >= 1) { himChair(t, { lean: -.2, smile: 1, open: .5 * Math.max(0, Math.sin(t * 9)), blush: .9, look: [1, 0], hN: [40, -104], tilt: Math.sin(t * 9) * .04 }, RX.ch1 + 60); herChair(t, { lean: -.16, smile: 1, open: .5 * Math.max(0, Math.sin(t * 9 + 1)), blush: .7, look: [1, 0], hN: [40, -104], tilt: Math.sin(t * 9 + 1) * .04 }, RX.ch2 - 60); }
    if (d === 1 && dn < 1) dancers(t, RX.table - 8, { close: 1 - dn, amp: 14 * (1 - dn) });
    if (d === 0) { wineBottle(RX.table - 30, FL - 90, 1, 0, { cork: 0, level: .1 }); wineBottle(RX.table + 26, FL - 90, 1, 0, { cork: 0, level: .4 }); wineGlass(RX.table - 4, FL - 90, 1, .2); }
  });
  snapshots(t);
});

/* =================== CHORUS (B): the air conditioner =================== */
S(L.b1a, (t, a, b) => { // between everything that's happening between us
  const k = seg(t, a, b), creep = Math.min(1, Math.floor((A.beat(t) - A.beat(a)) + .2) / 4), touch = sg(t, 142.5, 142.9);
  camR(RX.table, 1.95 + k * .12, 598);
  let P, Q;
  roomIn(t, { chairs: 1, music: 1 }, d => {
    if (d === 0) { wineGlass(RX.table - 34, FL - 90, 1, .2); wineGlass(RX.table + 36, FL - 90, 1, .25);
      P = himChair(t, { lean: .26, smile: .5 + touch * .4, blush: 1, look: [1, 0], hN: [lerp(52, 76, creep), -98], brow: .3 }, RX.ch1 + 60); Q = herChair(t, { lean: .26, smile: .5 + touch * .4, blush: .8, look: [1, 0], hN: [lerp(50, 70, creep), -98], hairWind: .05 }, RX.ch2 - 60); }
    if (d === 1 && P && Q) { // what's in the air between them
      const x0 = P.head[0] + 22, x1 = Q.head[0] - 22, y0 = P.head[1] - 2; g.save(); g.lineCap = 'round';
      for (let j = 0; j < 3; j++) { g.strokeStyle = `rgba(255,${150 + j * 40},${190 + j * 20},${.5 - j * .12})`; g.lineWidth = 2.5 - j * .5; g.beginPath(); for (let i = 0; i <= 24; i++) { const q = i / 24, x = lerp(x0, x1, q), y = y0 + Math.sin(q * Math.PI * (3 + j) + t * (5 + j)) * 5 * Math.sin(q * Math.PI) + j * 3; i ? g.lineTo(x, y) : g.moveTo(x, y); } g.stroke(); }
      const hx = (P.handN[0] + Q.handN[0]) / 2, hy = P.handN[1] - 2, gap = Q.handN[0] - P.handN[0];
      if (gap < 60) for (let i = 0; i < 5; i++) { const an = t * 9 + i * 1.3; star4(hx + Math.cos(an) * (10 + gap * .3), hy - 6 + Math.sin(an) * 8, 5 + 3 * A.pulse(t), '#fff3c4', .9, an); }
      if (touch > 0) { glow(hx, hy, 90, 'rgba(255,120,170,.8)', touch); heart(hx, hy - 30 - touch * 26, .5 + touch * .6, '#ff4d7d', touch); }
      g.restore(); }
  });
  // heartbeats
  const hb = A.pulse(t, 2); g.strokeStyle = `rgba(255,90,130,${hb * .22})`; g.lineWidth = 30; g.strokeRect(0, 0, W, H);
});
function remoteCU(t, a) { // the AC remote in her hand
  const press = 143.95, dn = bell(t, press - .12, press + .18, .08), on = t >= press, temp = on ? Math.round(lerp(30, 18, sg(t, press + .1, press + 1.0))) : 30, k = seg(t, a, 145.0);
  warmBokeh(t, on ? sg(t, press, press + 1) : 0);
  g.save(); g.translate(640, 380); g.rotate(-.1 + k * .03); g.scale(1.05 + k * .05, 1.05 + k * .05);
  g.strokeStyle = LOOKS.her.skin; g.lineCap = 'round'; g.lineWidth = 150; g.beginPath(); g.moveTo(130, 560); g.lineTo(40, 250); g.stroke();
  box(-128, -300, 256, 620, 'rgba(0,0,0,.25)', 44); box(-136, -310, 256, 620, '#f1f3f7', 44); box(-136, -310, 256, 620, 'rgba(0,0,0,0)');
  box(-106, -276, 196, 150, on ? '#c9f2e2' : '#b9c4b6', 14); g.strokeStyle = '#8a968a'; g.lineWidth = 4; rr(-106, -276, 196, 150, 14); g.stroke();
  ltr(temp + '°', -28, -200, 92, on ? '#12303a' : 'rgba(18,48,58,.35)', { font: '"DejaVu Sans Mono","Liberation Mono",monospace' });
  if (on) { snow(52, -232, 20, 1, t); ltr('COOL', 46, -160, 18, '#12303a'); }
  // buttons
  const pb = 6 * dn; circ(-8, -60 + pb, 46, '#c9414f'); circ(-8, -64 + pb, 46, '#ff5a5a'); g.strokeStyle = '#fff'; g.lineWidth = 7; g.lineCap = 'round'; g.beginPath(); g.arc(-8, -62 + pb, 18, -1.0, Math.PI + 1.0); g.stroke(); line([[-8, -86 + pb], [-8, -62 + pb]], '#fff', 7);
  [[-70, 40, '+'], [54, 40, '−'], [-70, 130, '❄'], [54, 130, '☀']].forEach(([x, y, s]) => { box(x - 34, y - 28, 68, 56, '#dfe4ec', 16); text(s, x, y + 2, 34, '#5a6478', { weight: 700 }); });
  box(-72, 200, 128, 44, '#dfe4ec', 16);
  // thumb
  g.strokeStyle = LOOKS.her.skin; g.lineWidth = 62; g.beginPath(); g.moveTo(170, 150); g.lineTo(lerp(60, 14, dn), lerp(-10, -46, dn)); g.stroke(); circ(lerp(60, 14, dn), lerp(-10, -46, dn), 31, LOOKS.her.skin); g.fillStyle = '#ff5a6e'; g.beginPath(); g.ellipse(lerp(52, 6, dn), lerp(-18, -54, dn), 18, 22, -.5, 0, TAU); g.fill();
  for (let i = 0; i < 4; i++) { line([[120, 250 + i * 70], [-150, 262 + i * 64]], LOOKS.her.skin, 54); }
  g.restore();
  if (on) { const q = t - press; for (let i = 0; i < 3; i++) { const r = 80 + (q * 1.6 - i * .18) * 380; if (r > 80 && r < 700) { g.strokeStyle = `rgba(160,235,255,${cl(1 - (r - 80) / 620) * .8})`; g.lineWidth = 8; g.beginPath(); g.arc(632, 316, r, 0, TAU); g.stroke(); } } text('בִּיפּ', 930, 230, 80 * eBack(seg(t, press, press + .18)), '#d8f6ff', { rot: .12, stroke: '#2a7fb8', sw: 10, a: 1 - sg(t, press + .6, press + 1) }); }
  vignette(.55);
}
function acRoom(t, o = {}) { // the living room once the cold air is on
  const { cool = 1, ac = 1, cam = [RX.table, 1.0, 650] } = o; camR(...cam);
  roomIn(t, Object.assign({ chairs: 1, music: 1, cool, ac, curtain: ac * .9, acTemp: 18 }, o.st), d => { if (o.actors) o.actors(d); if (d === 1) coldAir(t, RX.ac, 112, ac); });
}
S(L.b1b, (t, a, b) => { // she turns the AC on because of the heat
  if (t < 145.0) return remoteCU(t, a);
  const ac = sg(t, 145.0, 145.5), cool = sg(t, 145.2, 147.2), k = seg(t, 145, b);
  acRoom(t, { cool, ac, cam: [RX.table, lerp(1.25, 1.02, eOut(k)), lerp(880, 650, eOut(k))], actors: d => { if (d === 0) { himChair(t, { smile: .9, look: [.6, -1], brow: .8, open: .3, blush: .8 * (1 - cool * .5), sweat: 1 - cool, tilt: -.12 }, RX.ch1 + 60); herChair(t, { smile: .9, look: [.5, -1], hN: [40, -200], hF: [36, -180], hairWind: -.5 * ac + Math.sin(t * 6) * .1 * ac, tilt: -.12, sweat: (1 - cool) * .6 }, RX.ch2 - 60); } } });
});
S(L.b1c, (t, a, b) => { // "what heat" – frozen over
  acRoom(t, { cool: lerp(.8, 1, seg(t, a, b)), cam: [RX.table, 1.02 + .02 * A.kick(t), 650], actors: d => { if (d === 0) { const sh = Math.sin(t * 34) * 1.5; himChair(t, { smile: 1, open: .4, look: [1, 0], hN: [-6 + sh, -140], hF: [10 - sh, -138], blush: .3, tilt: sh * .01 }, RX.ch1 + 60); herChair(t, { smile: 1, open: .4, look: [1, 0], hN: [-6 - sh, -140], hF: [10 + sh, -138], hairWind: -.4, tilt: -sh * .01 }, RX.ch2 - 60); } } });
  hotWords(t, a, b, 'freeze', { y: 380, size: 150 });
});
S(L.b1d, (t, a, b) => { // "maybe we'll go to the room"
  const k = seg(t, a, b), up = sg(t, a, a + .6), wx = lerp(RX.ch2 - 70, 1250, sg(t, a + .6, b + .6)), bed = sg(t, a + .2, a + 1.1);
  acRoom(t, { cam: [lerp(900, 1340, sg(t, a, b - .7)), 1.0, 650], st: { bed }, actors: d => {
    if (d === 0) { himChair(t, { smile: .7, look: [1, -.2], brow: .9 * up, blush: .5 + up * .5, open: up * .25, lean: lerp(-.1, .1, up) }, RX.ch1 + 60); if (up < 1) herChair(t, { smile: .9, look: [1, 0], lean: lerp(-.06, .3, up) }, RX.ch2 - 60); }
    if (d === 1 && up >= 1) figure('her', wx, FL, 1, 1, poseWalk(stepPhase(wx) * .6, { t, stride: 24, smile: .8, look: [-1, 0], tilt: -.16, hF: [-46, -126], hN: [30, -150 + Math.sin(t * 7) * 5], skirt: Math.sin(t * 4) * .4, hairWind: .3 })); } });
});
S(L.b1e, (t, a, b) => { // "if you want, you can…"
  const cut = 151.95;
  if (t < cut) { warmBokeh(t, 1); glow(1150, 300, 420, 'rgba(255,190,130,.5)'); const k = seg(t, a, cut); g.save(); g.translate(W / 2, H / 2); g.scale(1 + k * .05, 1 + k * .05); g.translate(-W / 2, -H / 2); closeUp('her', -1, { t, smile: .7, brow: 1, look: [1, .1], open: .3 * Math.max(0, Math.sin((t - a) * 15)), tilt: -.14 + Math.sin(t * 3) * .03, hairWind: .25, blush: .6, lean: .08 }, 660, 330, 7); g.restore(); }
  else { warmBokeh(t, 1); const k = seg(t, cut, b), gulp = bell(t, cut + .3, cut + .8, .15); g.save(); g.translate(W / 2, H / 2); g.scale(1 + k * .08, 1 + k * .08); g.translate(-W / 2, -H / 2); closeUp('him', 1, { t, smile: sg(t, cut + .8, b) * .9, brow: 1 - sg(t, cut + .8, b) * .5, look: [1, 0], open: .3 * (1 - sg(t, cut + .5, cut + .9)), blush: 1, tilt: gulp * .06, blink: gulp > .8 ? 1 : 0, lean: -.02 }, 620, 330 + gulp * 6, 7); g.restore(); const hk = sg(t, cut + .7, b); for (let i = 0; i < 3; i++) heart(900 + i * 90, 200 - i * 40 - hk * 30, (.9 + i * .4) * hk, '#ff4d7d', hk * .9, .2 * i); }
  vignette(.6);
});
S(L.b1f, (t, a, b) => { // "…stay here and sleep, too": a second toothbrush in the cup
  const drop = 154.35, k = seg(t, a, b);
  for (let r = 0; r < 8; r++) for (let c = 0; c < 14; c++) box(c * 96 - 20, r * 96 - 30, 92, 92, (r + c) % 2 ? '#bfe3dc' : '#aed8d0', 6);
  glow(300, 100, 700, 'rgba(255,220,170,.35)');
  box(820, -40, 380, 420, '#8a6a4a', 10); box(840, -20, 340, 380, '#cfe6f0', 6); g.save(); g.globalAlpha = .35; poly([[880, -20], [960, -20], [900, 360], [840, 360]], '#fff'); g.restore(); for (let i = 0; i < 6; i++) glow(870 + i * 54, 20 + Math.sin(i) * 10, 22, 'rgba(255,220,150,.9)', .6 + .4 * Math.sin(t * 2 + i));
  box(0, 560, W, 26, '#8a6a4a'); box(0, 586, W, 150, '#6d5238');
  g.save(); g.translate(1010, 560); box(-40, -120, 80, 120, '#e9eef7', [30, 30, 8, 8]); box(-14, -150, 28, 34, '#c9cee0', 5); box(-30, -70, 60, 34, '#ff8a9a', 4); g.restore();                       // soap pump
  g.save(); g.translate(250, 560); box(-46, -74, 92, 74, '#c97a5a', [4, 4, 14, 14]); g.fillStyle = '#2f8a5a'; for (let i = 0; i < 7; i++) { g.save(); g.rotate((i - 3) * .3); g.beginPath(); g.ellipse(0, -120, 15, 54, 0, 0, TAU); g.fill(); g.restore(); } g.restore();
  const cx = 610, cy = 560, lean = sg(t, drop + .1, drop + .7);
  const brush = (x, rot, col, yoff) => { g.save(); g.translate(x, cy - 30 + yoff); g.rotate(rot); box(-9, -330, 18, 330, col, 8); box(-13, -390, 26, 74, '#f6f8fc', 9); for (let i = 0; i < 5; i++) box(13, -384 + i * 13, 16, 8, i % 2 ? '#fff' : mixHex(col, '#ffffff', .5), 3); g.restore(); };
  brush(cx - 30, lerp(-.22, -.12, lean), '#ff7a9a', 0);
  const fall = seg(t, drop - .45, drop), by = (1 - eOut(fall)) * -520 + Math.abs(Math.sin(cl(seg(t, drop, drop + .5)) * Math.PI * 2)) * -14 * (1 - seg(t, drop, drop + .5));
  if (fall > 0) brush(cx + 34, lerp(.5, .14, eOut(fall)) - lean * .02, '#4a9aff', by);
  if (fall > 0 && fall < 1) { g.strokeStyle = LOOKS.her.skin; g.lineWidth = 74; g.lineCap = 'round'; const hx = cx + 150, hy = cy - 250 + by; g.beginPath(); g.moveTo(1500, hy - 200); g.lineTo(hx, hy); g.stroke(); circ(hx, hy, 50, LOOKS.her.skin); }
  // the glass (in front of the brushes)
  g.fillStyle = 'rgba(210,235,250,.5)'; g.beginPath(); g.moveTo(cx - 88, cy - 180); g.lineTo(cx + 88, cy - 180); g.lineTo(cx + 72, cy); g.lineTo(cx - 72, cy); g.fill(); g.strokeStyle = 'rgba(255,255,255,.8)'; g.lineWidth = 5; g.stroke(); box(cx - 60, cy - 160, 12, 130, 'rgba(255,255,255,.4)', 6);
  sparkle(cx, cy - 190, drop, t, 9, 150);
  const hk = eBack(seg(t, drop + .5, drop + .9)); heart(cx + 6, cy - 470 - Math.sin(t * 4) * 6, 2.4 * hk * (1 + .08 * A.pulse(t)), '#ff4d7d', cl(hk));
  tint('#fff', pulseIn(t, drop, .1) * .2); vignette(.5);
});
S(L.b1g, (t, a, b) => { // "sleep? what sleep"
  const hit = 157.45, q = t - hit, flown = q > 0;
  g.fillStyle = grad(0, H, ['#1a2040', '#2c3560']); g.fillRect(0, 0, W, H); cityView(t, 760, 40, 420, 330, 0, { seed: 5, mr: 30, mx: .7 }); g.strokeStyle = '#4a5488'; g.lineWidth = 16; g.strokeRect(760, 40, 420, 330); line([[970, 40], [970, 370]], '#4a5488', 10);
  box(0, 520, W, 30, '#7a4e2e'); box(0, 550, W, 200, '#5a3a22'); box(120, 240, 26, 280, '#2a1c18'); poly([[40, 250], [226, 250], [190, 120], [76, 120]], '#ffd9a0'); glow(133, 220, 420, 'rgba(255,200,130,.5)');
  // alarm clock
  const cx = 560 + (flown ? q * 360 : 0), cy = 400 + (flown ? -q * 500 + q * q * 1300 : 0), rot = flown ? q * 9 : Math.sin(t * 40) * .0;
  g.save(); g.translate(cx, cy); g.rotate(rot); line([[-70, 100], [-90, 122]], '#c9414f', 14); line([[70, 100], [90, 122]], '#c9414f', 14); circ(-70, -104, 38, '#e0483a'); circ(70, -104, 38, '#e0483a'); box(-8, -150, 16, 36, '#c9414f', 6); circ(0, 0, 122, '#c9414f'); circ(0, 0, 100, '#fffdf6'); for (let i = 0; i < 12; i++) { const an = i / 12 * TAU; line([[Math.sin(an) * 82, -Math.cos(an) * 82], [Math.sin(an) * 92, -Math.cos(an) * 92]], '#27304f', i % 3 ? 3 : 7); } line([[0, 0], [28, -38]], '#27304f', 10); line([[0, 0], [10, -76]], '#27304f', 7); circ(0, 0, 8, '#c9414f'); g.restore();
  // Zzz … crossed out
  const zk = seg(t, a, a + .5); for (let i = 0; i < 3; i++) text('Z', 800 + i * 86, 250 - i * 66 + Math.sin(t * 3 + i) * 6 + (flown ? q * 200 * (i + 1) : 0), (70 + i * 34) * eBack(cl(zk * 1.5 - i * .25)), '#b9c0ff', { rot: -.15 + (flown ? q * (i + 1) : 0), a: flown ? 1 - cl(q * 1.6) : 1, weight: 800 });
  if (flown) { const xk = eOut(seg(t, hit, hit + .2)); g.strokeStyle = '#ff4a4a'; g.lineWidth = 26; g.lineCap = 'round'; g.beginPath(); g.moveTo(740, 60); g.lineTo(740 + 340 * xk, 60 + 300 * xk); g.stroke(); const xk2 = eOut(seg(t, hit + .12, hit + .32)); if (xk2 > 0) { g.beginPath(); g.moveTo(1080, 60); g.lineTo(1080 - 340 * xk2, 60 + 300 * xk2); g.stroke(); } }
  // the pillow that does it
  const px = flown ? 560 - q * 500 : lerp(1500, 620, eIn(seg(t, hit - .35, hit))), py = flown ? 380 + q * 200 : lerp(200, 380, seg(t, hit - .35, hit)); g.save(); g.translate(px, py); g.rotate(t * 7); box(-120, -76, 240, 152, '#f6f2ea', 44); box(-104, -60, 208, 120, '#fff', 36); g.strokeStyle = '#d9d2c4'; g.lineWidth = 3; for (let i = 0; i < 3; i++) { g.beginPath(); g.moveTo(-70 + i * 60, -50); g.quadraticCurveTo(-60 + i * 60, 0, -70 + i * 60, 50); g.stroke(); } g.restore();
  if (flown) for (let i = 0; i < 14; i++) { const an = i * .45, r = q * (300 + rnd(i) * 300); g.save(); g.translate(600 + Math.cos(an) * r, 380 + Math.sin(an) * r * .7 + q * q * 200); g.rotate(q * 6 + i); g.fillStyle = `rgba(255,255,255,${cl(1 - q * 1.2)})`; g.beginPath(); g.ellipse(0, 0, 16, 5, 0, 0, TAU); g.fill(); g.restore(); }
  tint('#fff', pulseIn(t, hit, .1) * .5); vignette(.55);
});
function planeTop(t, k, x, y, s, rot) { // receipt -> paper plane, seen from above. k: 0 flat receipt … 1 finished plane
  g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s);
  const f1 = sg(k, .05, .35), f2 = sg(k, .4, .7), f3 = sg(k, .75, 1);
  g.fillStyle = 'rgba(0,0,0,.2)'; g.beginPath(); g.ellipse(8, 14, 100 - f3 * 30, 150, 0, 0, TAU); g.fill();
  const w = lerp(100, 46, f3), tipW = lerp(100, 0, f1);
  g.fillStyle = '#fffdf6'; g.beginPath(); g.moveTo(-tipW, -150); g.lineTo(tipW, -150); g.lineTo(w, -150 + 110 * f1); g.lineTo(w, 150); g.lineTo(-w, 150); g.lineTo(-w, -150 + 110 * f1); g.closePath(); g.fill();
  if (k < .5) { text('קפה', 0, -96 + f1 * 60, 26, `rgba(39,48,79,${1 - f1})`); for (let i = 0; i < 2; i++) { line([[64, -40 + i * 34], [-10, -40 + i * 34]], `rgba(109,115,144,${1 - f2})`, 5); line([[-46, -40 + i * 34], [-66, -40 + i * 34]], `rgba(109,115,144,${1 - f2})`, 5); } text('2 × הפוך', 0, 62, 24, `rgba(201,65,79,${1 - f2})`); }
  if (f1 > 0) { g.fillStyle = '#ece8dc'; g.beginPath(); g.moveTo(0, -150); g.lineTo(w * f1, -150 + 110 * f1); g.lineTo(0, -150 + 150 * f1); g.lineTo(-w * f1, -150 + 110 * f1); g.closePath(); g.fill(); }
  if (f2 > 0) { g.fillStyle = '#e2ddcf'; g.beginPath(); g.moveTo(0, -150); g.lineTo(w * .55 * f2, 150); g.lineTo(-w * .55 * f2, 150); g.closePath(); g.fill(); }
  line([[0, -150], [0, 150]], `rgba(160,150,130,${.3 + f3 * .5})`, 3);
  g.restore();
}
S(L.b1h, (t, a, b) => { // tonight nobody is keeping score: the café receipt becomes a paper plane
  const thr = 159.55;
  if (t < thr) { const k = seg(t, a, thr - .15);
    g.fillStyle = '#a87446'; g.fillRect(0, 0, W, H); for (let i = 0; i < 8; i++) { g.strokeStyle = 'rgba(90,58,34,.25)'; g.lineWidth = 4; g.beginPath(); g.arc(640, 1500, 900 + i * 90, 0, TAU); g.stroke(); } glow(360, 160, 700, 'rgba(255,200,130,.3)', 1, false); tint('#3a78c8', .12);
    circ(1040, 190, 88, 'rgba(235,245,255,.35)'); circ(1040, 190, 64, 'rgba(250,238,150,.5)'); circ(240, 560, 88, 'rgba(235,245,255,.35)'); circ(240, 560, 64, 'rgba(250,238,150,.3)');
    planeTop(t, k, 640, 380, 1.5, -.1 + k * .1);
    // his hands doing the folding
    const fold = Math.sin(k * Math.PI * 3) ** 2; [[-1, LOOKS.him.skin], [1, LOOKS.him.skin]].forEach(([d]) => { const hx = 640 + d * lerp(330, 150, fold), hy = 470 + Math.cos(k * 9 + d) * 30; g.strokeStyle = LOOKS.him.skin; g.lineWidth = 80; g.lineCap = 'round'; g.beginPath(); g.moveTo(640 + d * 760, 820); g.lineTo(hx, hy); g.stroke(); circ(hx, hy, 52, LOOKS.him.skin); g.strokeStyle = LOOKS.him.top; g.lineWidth = 92; g.beginPath(); g.moveTo(640 + d * 800, 860); g.lineTo(lerp(640 + d * 760, hx, .45), lerp(820, hy, .45)); g.stroke(); });
    vignette(.5);
  } else { const q = seg(t, thr, b), px = lerp(RX.ch1 + 110, -40, eOut(q)), py = FL - 190 - Math.sin(q * Math.PI) * 120;
    acRoom(t, { cam: [lerp(RX.table - 60, 420, sg(t, thr, b)), 1.0, 650], st: { curtain: 1 }, actors: d => {
      if (d === 0) herChair(t, { smile: 1, open: .5 * Math.max(0, Math.sin(t * 10)), look: [1, -.3], hN: [30, -170 + Math.sin(t * 18) * 6], hF: [24, -166 - Math.sin(t * 18) * 6], hairWind: -.4 }, RX.ch2 - 60);
      if (d === 1) { figure('him', RX.ch1 + 150, FL, 1, -1, poseStand({ t, smile: 1, look: [1, -.4], hN: [lerp(-30, 66, eOut(seg(q, 0, .25))), lerp(-190, -170, q)], lean: .12, fN: [22, 0], fF: [-18, 0] })); g.save(); g.translate(px, py); g.rotate(-.25 + Math.sin(q * 9) * .12); poly([[-34, 0], [30, -12], [8, 4]], '#fffdf6'); poly([[-34, 0], [30, 12], [8, 4]], '#e2ddcf'); g.restore(); for (let i = 1; i < 6; i++) circ(px + i * 26, py + Math.sin(i + t * 9) * 5 + i * 2, 3, `rgba(255,255,255,${.5 - i * .08})`); } } });
  }
});
