"use strict";
/* ===== scenes, part 3: the solo (the receipt flies home) · last choruses · dawn ===== */
function planeSide(x, y, rot = 0, s = 1) { g.save(); g.translate(x, y); g.rotate(rot); g.scale(s, s); poly([[-36, 0], [32, -13], [8, 4]], '#fffdf6'); poly([[-36, 0], [32, 12], [8, 4]], '#dcd6c6'); poly([[-36, 0], [8, 4], [4, 14]], '#c9c2b0'); g.restore(); }
function planeTrail(pts) { pts.forEach(([x, y], i) => circ(x, y, 2.6, `rgba(255,255,255,${.5 * (1 - i / pts.length)})`)); }
const HOMEWIN = { x: X.win[0] - 50, y: X.win[1] - 44, w: 100, h: 88 };
function windowDancers(t, a = 1) { // their silhouettes in the lit window
  g.save(); g.globalAlpha = a; g.beginPath(); g.rect(HOMEWIN.x, HOMEWIN.y, HOMEWIN.w, HOMEWIN.h); g.clip();
  const sw = Math.sin(A.beat(t) * Math.PI) * 7, cx = X.win[0] + sw;
  g.fillStyle = '#4a1630'; g.beginPath(); g.arc(cx - 13, X.win[1] - 14, 15, 0, TAU); g.arc(cx + 14, X.win[1] - 9, 14, 0, TAU); g.fill(); g.fillRect(cx - 32, X.win[1] + 2, 36, 60); g.fillRect(cx + 2, X.win[1] + 6, 32, 60);
  g.beginPath(); g.moveTo(cx + 22, X.win[1] - 18); g.quadraticCurveTo(cx + 40, X.win[1] + 10, cx + 30, X.win[1] + 44); g.lineTo(cx + 12, X.win[1] + 10); g.fill();
  g.restore();
}
const NIGHT = { sleep: 1.2, humid: .7, cafeLights: .1, closed: 1, t3up: 2, homeWin: 1, homeCol: '#ff9ab0' };

/* =================== SOLO =================== */
S(L.solo, (t, a, b) => { // out of the window it goes
  const k = seg(t, a, b), q = seg(t, a, 164.4), follow = sg(t, 164.2, b);
  const px = lerp(X.win[0] - 30, 7380, eIn(q) * .25 + q * .25 + follow * .5), py = -100 - Math.sin(q * Math.PI) * 150 + Math.sin(t * 2.1) * 26 + follow * 60, rot = Math.PI + Math.sin(t * 2.1 + 1) * .22;
  setCam(lerp(8330, px + 120, follow), lerp(-30, 40, follow), lerp(.86, .8, follow));
  street(t, Object.assign({}, NIGHT, { moonX: 260, moonY: 120, signGlow: .5 + .3 * A.pulse(t), catLook: -1 }), d => {
    if (d !== 1) return; windowDancers(t);
    const [vx0, vx1] = viewX(1, 0); floatingHearts(t, X.win[0], X.win[1] - 60, 6, .8, 120, 200);
    planeTrail([1, 2, 3, 4, 5, 6].map(i => [px + i * 22, py + Math.sin(t * 2.1 - i * .25) * 6 + i * 3])); planeSide(px, py, rot, 1.25);
    // music drifting out of the flat
    for (let i = 0; i < 5; i++) { const ph = (t * .22 + i / 5) % 1; note(X.win[0] - 60 - ph * 220 + Math.sin(i * 2 + t) * 20, X.win[1] - 40 - ph * 150, 1.6, ['#ffd98a', '#ff9ab5', '#9fdcff'][i % 3], Math.sin(ph * Math.PI) * .8, Math.sin(t + i) * .3); }
  });
});
S(L.solo2, (t, a, b) => { // over the roofs of the sleeping city, back the way they came
  const k = seg(t, a, b), px = lerp(7360, 4500, k), bt = A.beat(t), py = -470 + Math.sin(bt * Math.PI / 2) * 46 - A.bass(t) * 26, rot = Math.PI + Math.cos(bt * Math.PI / 2) * .16;
  setCam(px - 170, -420, .8);
  street(t, Object.assign({}, NIGHT, { moonX: 330, moonY: 190, moonR: 64, humid: .5, hazeA: .4 }), d => {
    if (d !== 1) return;
    planeTrail([1, 2, 3, 4, 5, 6, 7, 8].map(i => [px + i * 24, py + Math.sin((bt - i * .12) * Math.PI / 2) * 6 + i * 2])); planeSide(px, py, rot, 1.5);
    // a rooftop cat follows it with its head
    g.save(); g.translate(U(2280), UY(GY - (4 * 84 + 96) - 10)); g.scale(2, 2); cat(t, 0, 0, { look: cl((px - U(2280)) / 500, -1, 1), s: .9 }); g.restore();
  });
  windLines(t, .35, { y0: 60, y1: 520, n: 10, speed: .5 });
  for (let i = 0; i < 6; i++) { const ph = (t * .5 + i / 6) % 1; star4(160 + rnd(i + Math.floor(t * .5 + i / 6)) * 960, 80 + rnd(i * 3 + Math.floor(t * .5 + i / 6)) * 300, 10 * Math.sin(ph * Math.PI) * (1 + A.pulse(t)), '#fff', Math.sin(ph * Math.PI) * .8, t); }
});
S(L.solo3, (t, a, b) => { // …and down to the café, onto the old chair
  const k = seg(t, a, b), land = [X.tHer + 86, WALKY - SEAT - 14], q = eOut(seg(t, a, 178.3)), an = (1 - q) * 5.2;
  const px = land[0] + Math.cos(an) * (1 - q) * 520 + (1 - q) * 380, py = land[1] - (1 - q) * 520 + Math.sin(an) * (1 - q) * 60, rot = Math.PI + (1 - q) * Math.sin(an) * .6 - q * .2;
  camKeys(t, [[a, 4000, 200, .74], [b, X.tHer + 30, 430, 1.35]]);
  street(t, Object.assign({}, NIGHT, { moonX: 980, moonY: 110 }), d => { if (d === 0) { cafeTable(t, { water: 0 }); planeTrail([1, 2, 3, 4, 5].map(i => [px + i * 20 * (1 - q), py - i * 16 * (1 - q)])); planeSide(px, py, rot, 1.2); if (q >= 1) sparkle(land[0], land[1], 178.3, t, 7, 50); } });
});

/* =================== CHORUS (3): the quiet one =================== */
function neon(kind, x, y, s, t, t0, t1, col = '#ffb3d1') { // a glowing line doodle that draws itself and fades
  const k = seg(t, t0, t0 + .7), a = bell(t, t0, t1, .35); if (a <= 0) return;
  g.save(); g.globalAlpha = a; g.translate(x, y + Math.sin(t * 1.5 + x) * 5); g.scale(s, s); g.shadowColor = col; g.shadowBlur = 18; const P = (pts, k0, k1, w = 4) => penPath(pts, seg(k, k0, k1), '#fff', w);
  if (kind === 'cups') { [-34, 30].forEach((ox, i) => { P([[ox - 16, -14], [ox - 12, 18], [ox + 12, 18], [ox + 16, -14], [ox - 16, -14]], i * .35, i * .35 + .4); P([[ox + 16, -6], [ox + 26, -2], [ox + 24, 10], [ox + 13, 12]], i * .35 + .3, i * .35 + .5, 3); P([[ox - 4, -22], [ox - 8, -32], [ox - 2, -42]], i * .35 + .4, i * .35 + .6, 3); }); }
  if (kind === 'thermo') { P([[-8, -40], [-8, 12], [-16, 24], [-10, 40], [10, 40], [16, 24], [8, 12], [8, -40], [-8, -40]], 0, .6); P([[0, 24], [0, -6]], .5, .8, 6); P([[34, -20], [62, -20]], .6, .8, 3); P([[48, -34], [48, -6]], .7, .9, 3); P([[38, -30], [58, -10]], .8, 1, 3); P([[58, -30], [38, -10]], .8, 1, 3); }
  if (kind === 'house') { P([[-30, 30], [-30, -8], [0, -34], [30, -8], [30, 30], [-30, 30]], 0, .6); P([[-8, 30], [-8, 6], [8, 6], [8, 30]], .5, .8); P([[46, -14], [46, 22], [56, 22]], .7, 1, 3); if (k > .7) { g.strokeStyle = '#fff'; g.lineWidth = 3; g.beginPath(); g.arc(46, -22, 8, 0, TAU); g.stroke(); } }
  if (kind === 'bill') { P([[-22, -40], [22, -40], [22, 34], [14, 40], [6, 34], [-2, 40], [-10, 34], [-18, 40], [-22, 34], [-22, -40]], 0, .6); P([[12, -24], [-12, -24]], .5, .7, 3); P([[12, -10], [-6, -10]], .6, .8, 3); P([[12, 6], [-12, 6]], .7, .9, 3); P([[12, 20], [0, 20]], .8, 1, 3); }
  g.restore();
}
function coolRoom(t, o = {}) { camR(...(o.cam || [RX.table - 8, 1.35, 660])); roomIn(t, Object.assign({ chairs: 1, music: 1, cool: .85, ac: 1, curtain: .6, acTemp: 18, dawn: o.dawn || 0 }, o.st), d => { if (d === 1) { coldAir(t, RX.ac, 112, .5, { n: 8 }); if (o.actors) o.actors(); } }); }
S(L.c3a, (t, a, b) => { // slow dancing in the cool blue room
  const k = seg(t, a, b);
  coolRoom(t, { cam: [RX.table - 8, lerp(1.2, 1.4, k), 660], actors: () => dancers(t, RX.table - 8, { close: 1, amp: 9 }) });
  neon('cups', 950, 230, 1.5, t, a + .2, b, '#ffb86a'); tint('#fff', (1 - sg(t, a, a + .3)) * .25);
});
S(L.c3b, (t, a, b) => { // now it's the cold she'd complain about – he just holds her closer
  const k = seg(t, a, b); let D;
  coolRoom(t, { cam: [RX.table - 8, lerp(1.6, 1.75, k), 650], actors: () => { const sh = Math.sin(t * 30) * 1.2 * (1 - sg(t, a + 1.2, a + 2)); D = dancers(t, RX.table - 8 + sh, { close: 1, amp: 6, her: { tilt: .16, look: [1, .5], blink: 1, smile: .7 }, him: { tilt: .06, look: [1, .5], smile: .8 } }); } });
  neon('thermo', 300, 240, 1.5, t, a + .2, b, '#9fdcff'); floatingHearts(t, 640, 330, 5, sg(t, a + 1.5, b) * .7, 300, 160);
});
S(L.c3c, (t, a, b) => { // "what heat" – this time it's the warmth between them
  const k = seg(t, a, b);
  coolRoom(t, { cam: [RX.table - 8, 1.75 + k * .06, 650], actors: () => { const D = dancers(t, RX.table - 8, { close: 1, amp: 5, her: { tilt: .16, look: [1, .5], blink: 1, smile: .8, blush: 1 }, him: { tilt: .06, look: [1, .5], smile: .9, blush: 1 } }); glow((D[0].chest[0] + D[1].chest[0]) / 2, D[0].chest[1], 150, 'rgba(255,150,90,.75)', bell(t, a, b, .4) * (.7 + .3 * A.pulse(t))); } });
  const a2 = bell(t, a + .1, b, .35); glow(640, 130, 360, 'rgba(255,140,80,.5)', a2); text('איזה חום', 640, 128 - k * 12, 84, '#ffd9a0', { a: a2, weight: 800, stroke: 'rgba(200,70,30,.9)', sw: 8, rot: -.03 });
});
S(L.c3d, (t, a, b) => { // "shall we move?" – she leads him out to the balcony
  const k = seg(t, a, b), x = lerp(760, 330, sg(t, a, b + .3));
  coolRoom(t, { cam: [lerp(760, 470, ez(k)), 1.15, 660], st: { curtain: 1 }, actors: () => { figure('him', x + 84, FL, 1, -1, poseWalk(stepPhase(x) + 1.4, { t, smile: .9, hN: [52, -122], look: [1, 0] })); figure('her', x, FL, 1, -1, poseWalk(stepPhase(x), { t, smile: .9, hF: [-34, -122], skirt: Math.sin(stepPhase(x)) * .5, hairWind: .3, look: [-.6, 0], tilt: -.08 })); } });
});
S(L.c3e, (t, a, b) => { // her rented flat, from the balcony
  const k = seg(t, a, b), out = sg(t, a - .2, a + 1.2), pt = sg(t, 191.2, 191.7);
  setCam(lerp(520, 560, k), 360, lerp(1.0, 1.08, k));
  balcony(t, { dawn: .06, wind: .4 }, d => { if (d !== 0) return; const hx = lerp(260, 570, out), mx = lerp(180, 480, out);
    figure('him', mx, FL, 1, 1, out < 1 ? poseWalk(stepPhase(mx), { t, smile: .8 }) : poseStand({ t, smile: .8, hN: [42, -124], look: [.5, pt * .7] }));
    figure('her', hx, FL, 1, 1, out < 1 ? poseWalk(stepPhase(hx) + 1.4, { t, smile: .8, hairWind: -.3 }) : poseStand({ t, smile: .9, hairWind: -.3 + Math.sin(t * 3) * .08, hN: [lerp(42, 60, pt), lerp(-124, -100, pt)], hF: [40, -124], look: [.6, pt * .8], tilt: pt * .1 })); });
  neon('house', 1010, 200, 1.5, t, a + .3, 192.0, '#ffd98a');
});
S(192.25, (t, a, b) => { // really close to Derech HaShalom
  const k = seg(t, a, b); camKeys(t, [[a, 7760, 250, .95], [b, 7990, 60, .8]]);
  street(t, Object.assign({}, NIGHT, { moonX: 1040, moonY: 110, signGlow: .7 + .5 * A.pulse(t), homeWin: .5 }), d => {
    if (d !== 1) return; // the two of them, small, on her balcony
    figure('him', X.win[0] - 34, X.win[1] + 76, .5, -1, poseStand({ t, shadow: 0, hN: [20, -200 + Math.sin(t * 9) * 8] })); figure('her', X.win[0] + 14, X.win[1] + 76, .5, -1, poseStand({ t, shadow: 0, hN: [40, -110], hairWind: .3 }));
    box(HOMEWIN.x - 40, X.win[1] + 44, 190, 56, '#5f66a0', 4); box(HOMEWIN.x - 40, X.win[1] + 44, 190, 8, 'rgba(255,255,255,.10)');
  });
});
S(L.c3g, (t, a, b) => { // the band comes back in: at the dark café the string lights wake up around the receipt
  const k = seg(t, a, b), hit = pulseIn(t, a, .5), lights = .1 + .9 * Math.max(hit, A.pulse(t) * .8 * sg(t, a, a + .4));
  setCam(X.tHer + 40 + k * 20, 446, 1.5 + k * .1);
  const jump = sg(t, 195.6, 196.1), cx = lerp(X.tHer + 240, X.tHer + 124, jump), cy = WALKY - Math.sin(jump * Math.PI) * 70;
  street(t, Object.assign({}, NIGHT, { cafeLights: lights, moon: 0, dawn: .05 }), d => { if (d !== 0) return; cafeTable(t, { water: 0 });
    planeSide(X.tHer + 86, WALKY - SEAT - 14 - hit * 10 - Math.abs(Math.sin(t * 7)) * 3 * A.pulse(t), Math.PI - .2 + Math.sin(t * 6) * .06 * A.pulse(t), 1.2);
    g.save(); g.translate(cx, cy); g.scale(1.9, 1.9); cat(t, 0, 0, { dir: -1, look: -.6 + Math.sin(t * 3) * .3, col: '#2a2440' }); g.restore(); });
  tint('#fff3d6', pulseIn(t, a, .12) * .5);
});

/* =================== CHORUS (B, again): dawn =================== */
S(L.b2a, (t, a, b) => { // between everything that's happening between us
  const k = seg(t, a, b), dawn = lerp(.22, .34, k), near = sg(t, a + .4, a + 2.2);
  setCam(lerp(540, 525, k), lerp(420, 432, k), lerp(1.5, 1.72, k));
  let P, Q;
  balcony(t, { dawn, wind: .35 }, d => { if (d !== 0) return;
    P = figure('him', 486 + near * 8, FL, 1, 1, poseStand({ t, smile: .7, blush: .8, look: [1, 0], tilt: near * .12, lean: near * .06, hN: [lerp(40, 44, near), -126], blink: near > .9 ? 1 : undefined }));
    Q = figure('her', 574 - near * 8, FL, 1, -1, poseStand({ t, smile: .7, blush: .8, look: [1, 0], tilt: near * .12, lean: near * .06, hN: [lerp(40, 44, near), -126], hairWind: .3 + Math.sin(t * 3) * .08, blink: near > .9 ? 1 : undefined }));
    const mx = (P.head[0] + Q.head[0]) / 2, my = P.head[1] - 6; for (let i = 0; i < 4; i++) { const an = t * 5 + i * 1.6; star4(mx + Math.cos(an) * 12, my + Math.sin(an) * 12, 4, '#fff3c4', near); } heart(mx, my - 54 - near * 14, .5 + near * .5 + .1 * A.pulse(t), '#ff4d7d', near); glow(mx, my, 70, 'rgba(255,130,170,.7)', near * .8); });
  const hb = A.pulse(t, 2); g.strokeStyle = `rgba(255,120,150,${hb * .16})`; g.lineWidth = 30; g.strokeRect(0, 0, W, H);
});
S(L.b2b, (t, a, b) => { // the AC hums and drips outside while the morning breeze does its work for free
  const k = seg(t, a, b), dawn = lerp(.34, .52, k), hug = sg(t, a + .8, a + 1.8);
  camKeys(t, [[a, 300, 250, 1.5], [a + 1.3, 320, 260, 1.5], [b, 520, 360, 1.05]]);
  balcony(t, { dawn, wind: .7 }, d => { if (d !== 0) return;
    // the plant under the drip puts out a flower
    const fl = eBack(seg(t, a + .9, a + 1.5)); if (fl > 0) { line([[318, FL - 96], [322, FL - 96 - 44 * fl]], '#2f8a5a', 4); for (let i = 0; i < 5; i++) circ(322 + Math.cos(i / 5 * TAU + t) * 9 * fl, FL - 96 - 44 * fl + Math.sin(i / 5 * TAU + t) * 9 * fl, 6 * fl, '#ff8ab0'); circ(322, FL - 96 - 44 * fl, 5 * fl, '#ffe27a'); }
    figure('him', 500, FL, 1, 1, poseStand({ t, smile: .8, look: [1, 0], hN: [lerp(40, 66, hug), lerp(-126, -160, hug)], hF: [44, -124] }));
    figure('her', 560, FL, 1, 1, poseStand({ t, smile: .8, look: [.8, 0], hN: hug < 1 ? [-6 + Math.sin(t * 28) * 2, -138] : [44, -124], hF: [10, -136], hairWind: -.6 + Math.sin(t * 4) * .15, tilt: -hug * .1, skirt: -.6 })); });
  windLines(t, .5, { y0: 80, y1: 560, n: 12, speed: .6, col: '255,236,214' });
});
S(L.b2c, (t, a, b) => { // "what heat": here comes the sun
  const k = seg(t, a, b), dawn = lerp(.52, .7, k);
  setCam(lerp(560, 600, k), 350, 1.0);
  balcony(t, { dawn, wind: .5 }, d => { if (d !== 0) return; figure('him', 500, FL, 1, 1, poseStand({ t, smile: .9, look: [1, -.2], hN: [16, -212], hF: [44, -124], tilt: -.05 })); figure('her', 560, FL, 1, 1, poseStand({ t, smile: .9, look: [1, -.2], hN: [44, -124], hF: [14, -208], hairWind: -.5, skirt: -.4 })); });
  g.save(); g.translate(1010, 470); g.rotate(t * .15); for (let i = 0; i < 14; i++) { g.rotate(TAU / 14); g.fillStyle = `rgba(255,220,140,${.10 + .08 * A.pulse(t)})`; g.beginPath(); g.moveTo(60, -10); g.lineTo(900, -60); g.lineTo(900, 60); g.lineTo(60, 10); g.fill(); } g.restore();
  hotWords(t, a, b, 'sun', { y: 210, size: 150 });
});
S(L.b2d, (t, a, b) => { // "let's go to the room"
  const k = seg(t, a, b), x = lerp(560, 230, sg(t, a, b + .2)), dawn = lerp(.7, .76, k);
  setCam(lerp(600, 420, ez(k)), 360, 1.05);
  balcony(t, { dawn, wind: .8 }, d => { if (d !== 0) return; g.save(); g.globalAlpha = 1 - sg(t, b - .4, b); figure('him', x + 84, FL, 1, -1, poseWalk(stepPhase(x) + 1.4, { t, smile: .9, hN: [54, -122] })); figure('her', x, FL, 1, -1, poseWalk(stepPhase(x), { t, smile: .9, hF: [-34, -122], look: [-.7, 0], tilt: -.1, hairWind: .5, skirt: .5 })); g.restore(); });
});
function faceTop(kind, x, y, r, rot, p = {}) { // a face seen from straight above (lying down)
  const C = LOOKS[kind], her = kind === 'her', { look = 0, lid = 0, smile = .5, open = 0, blush = .5 } = p;
  g.save(); g.translate(x, y); g.rotate(rot);
  if (her) { // hair fanned out on the pillow
    g.fillStyle = C.hair; g.beginPath(); g.ellipse(0, -r * .45, r * 1.75, r * 1.3, 0, 0, TAU); g.fill();
    g.beginPath(); g.moveTo(-r * 1.5, -r * .2); g.bezierCurveTo(-r * 2.0, r * .7, -r * 1.5, r * 1.5, -r * 1.05, r * 1.9); g.lineTo(-r * .7, r * .8); g.closePath(); g.fill(); g.beginPath(); g.moveTo(r * 1.5, -r * .2); g.bezierCurveTo(r * 2.0, r * .7, r * 1.6, r * 1.4, r * 1.2, r * 1.8); g.lineTo(r * .7, r * .8); g.closePath(); g.fill();
    g.strokeStyle = C.hairHi; g.lineWidth = 2; for (let i = 0; i < 7; i++) { const an = -Math.PI + i / 6 * Math.PI; g.beginPath(); g.moveTo(Math.cos(an) * r * 1.0, -r * .3 + Math.sin(an) * r * .9); g.quadraticCurveTo(Math.cos(an) * r * 1.4, -r * .45 + Math.sin(an) * r * 1.1, Math.cos(an) * r * 1.68, -r * .45 + Math.sin(an) * r * 1.24); g.stroke(); } }
  ell(-r * .98, 0, r * .16, r * .24, C.skinSh); ell(r * .98, 0, r * .16, r * .24, C.skinSh);
  ell(0, 0, r, r * 1.08, C.skin);
  g.fillStyle = C.hair; if (her) { g.beginPath(); g.moveTo(-r, -r * .1); g.bezierCurveTo(-r * 1.05, -r * 1.3, r * 1.05, -r * 1.3, r, -r * .1); g.bezierCurveTo(r * .6, -r * .7, r * .1, -r * .75, -r * .2, -r * .55); g.bezierCurveTo(-r * .6, -r * .5, -r * .85, -r * .3, -r, -r * .1); g.fill(); g.strokeStyle = '#e7c765'; g.lineWidth = 3; g.beginPath(); g.arc(-r * 1.0, r * .36, r * .15, 0, TAU); g.stroke(); }
  else { g.beginPath(); g.moveTo(-r * .98, -r * .2); g.bezierCurveTo(-r * 1.1, -r * 1.35, r * 1.1, -r * 1.35, r * .98, -r * .2); g.bezierCurveTo(r * .5, -r * .66, -r * .5, -r * .66, -r * .98, -r * .2); g.fill(); g.fillStyle = 'rgba(40,26,20,.08)'; g.beginPath(); g.ellipse(0, r * .62, r * .7, r * .4, 0, 0, TAU); g.fill(); }
  ell(-r * .56, r * .3, r * .2, r * .13, `rgba(255,80,90,${.4 * blush})`); ell(r * .56, r * .3, r * .2, r * .13, `rgba(255,80,90,${.4 * blush})`);
  [-1, 1].forEach(sd => { const ex = sd * r * .36, ey = -r * .04;
    if (lid > .92) { g.strokeStyle = '#2a1712'; g.lineWidth = 2.5; g.beginPath(); g.moveTo(ex - r * .17, ey); g.quadraticCurveTo(ex, ey + r * .1, ex + r * .17, ey); g.stroke(); return; }
    ell(ex, ey, r * .19, r * .17, '#fffdf8'); g.save(); g.beginPath(); g.ellipse(ex, ey, r * .19, r * .17, 0, 0, TAU); g.clip(); circ(ex + look * r * .08, ey + r * .01, r * .1, her ? '#6b4226' : '#4a2c1a'); circ(ex + look * r * .08, ey + r * .01, r * .05, '#120a08'); circ(ex + look * r * .08 - r * .03, ey - r * .03, r * .03, '#fff'); box(ex - r * .3, ey - r * .3, r * .6, r * .13 + lid * r * .32, C.skin); g.restore();
    g.strokeStyle = '#2a1712'; g.lineWidth = her ? 2.6 : 2; g.beginPath(); g.moveTo(ex - r * .2, ey - r * .02 + lid * r * .1); g.quadraticCurveTo(ex, ey - r * .22 + lid * r * .3, ex + r * .2, ey - r * .02 + lid * r * .1); g.stroke();
    g.strokeStyle = C.hair; g.lineWidth = her ? 2.4 : 4; g.beginPath(); g.moveTo(ex - r * .2, ey - r * .3); g.quadraticCurveTo(ex, ey - r * .4, ex + r * .2, ey - r * .3); g.stroke(); });
  g.strokeStyle = C.skinSh; g.lineWidth = 2.5; g.beginPath(); g.moveTo(-r * .04, r * .12); g.quadraticCurveTo(r * .1, r * .3, -r * .04, r * .34); g.stroke();
  if (open > .05) { ell(0, r * .6, r * .2 + smile * r * .06, r * .06 + open * r * .14, '#5a1a22'); box(-r * .13, r * .52, r * .26, r * .06, '#fff', 2); g.strokeStyle = C.lip; g.lineWidth = her ? 3 : 2; g.beginPath(); g.ellipse(0, r * .6, r * .2 + smile * r * .06, r * .06 + open * r * .14, 0, 0, TAU); g.stroke(); }
  else { g.strokeStyle = C.lip; g.lineWidth = her ? 4 : 3; g.lineCap = 'round'; g.beginPath(); g.moveTo(-r * .24, r * .56 - smile * r * .06); g.quadraticCurveTo(0, r * .56 + smile * r * .24, r * .24, r * .56 - smile * r * .06); g.stroke(); }
  g.restore();
}
function bedTop(t, o = {}) { // the two of them on top of the covers, seen from above
  const { dawn = .8, lid = 0, wake = 0, clock = '05:41', ring = 0, drop = 1 } = o;
  g.fillStyle = '#8a6244'; g.fillRect(0, 0, W, H); for (let i = 0; i < 12; i++) box(i * 112, 0, 3, H, 'rgba(0,0,0,.14)');
  ell(640, 690, 560, 70, '#c98a86');                                                      // rug
  box(176, 46, 936, 700, 'rgba(0,0,0,.25)', 20); box(160, 20, 936, 60, '#5a3a22', 14); box(170, 60, 916, 700, '#f1ece2', 14);   // frame, sheet
  box(170, 330, 916, 440, '#7fa6c9', [26, 26, 0, 0]); for (let i = 0; i < 9; i++) for (let j = 0; j < 4; j++) star4(230 + i * 100 + (j % 2) * 50, 390 + j * 100, 9, 'rgba(255,255,255,.3)', 1, .4); box(170, 330, 916, 26, '#9fbfdc', [26, 26, 0, 0]);
  [[400, -.06], [876, .07]].forEach(([px, r]) => { g.save(); g.translate(px, 196); g.rotate(r); box(-180, -92, 366, 190, 'rgba(0,0,0,.12)', 50); box(-184, -96, 366, 190, '#fff', 50); g.strokeStyle = '#e4ddd0'; g.lineWidth = 3; g.beginPath(); g.moveTo(-150, -60); g.quadraticCurveTo(0, -40, 150, -64); g.stroke(); g.restore(); });
  const bounce = (1 - drop) * -420 + Math.sin(cl(drop) * Math.PI) * 0, sh = wake * Math.sin(t * 22) * 5;
  // him (left), turned toward her
  g.save(); g.translate(430 + sh, 250 + bounce); g.rotate(.2);
  g.lineCap = 'round'; g.strokeStyle = LOOKS.him.pants; g.lineWidth = 60; g.beginPath(); g.moveTo(-26, 240); g.lineTo(-10, 430); g.moveTo(34, 240); g.lineTo(84, 410); g.stroke(); box(-44, 420, 62, 40, '#f6f6f8', 14); box(62, 398, 62, 40, '#f6f6f8', 14);
  box(-74, 50, 150, 210, LOOKS.him.top, 40); line([[0, 60], [4, 250]], 'rgba(120,140,180,.6)', 3); for (let i = 0; i < 4; i++) circ(2 + i * .8, 90 + i * 42, 4, '#9aa8c8'); poly([[-30, 50], [0, 86], [30, 50]], LOOKS.him.skin);
  g.strokeStyle = LOOKS.him.top; g.lineWidth = 46; g.beginPath(); g.moveTo(-66, 80); g.lineTo(-110, 150); g.stroke(); g.strokeStyle = LOOKS.him.skin; g.lineWidth = 36; g.beginPath(); g.moveTo(-110, 150); g.lineTo(-96, 250); g.stroke();
  g.strokeStyle = LOOKS.him.top; g.lineWidth = 46; g.beginPath(); g.moveTo(66, 84); g.lineTo(120, 120); g.stroke(); g.strokeStyle = LOOKS.him.skin; g.lineWidth = 36; g.beginPath(); g.moveTo(120, 120); g.lineTo(196, 96); g.stroke();
  g.restore();
  // her (right), turned toward him
  g.save(); g.translate(850 - sh, 256 + bounce * 1.1); g.rotate(-.2);
  g.lineCap = 'round'; g.strokeStyle = LOOKS.her.skin; g.lineWidth = 42; g.beginPath(); g.moveTo(-26, 300); g.lineTo(-70, 420); g.moveTo(26, 300); g.lineTo(6, 440); g.stroke();
  g.fillStyle = LOOKS.her.top; g.beginPath(); g.moveTo(-56, 60); g.lineTo(56, 60); g.lineTo(60, 170); g.lineTo(96, 320); g.lineTo(-96, 320); g.lineTo(-60, 170); g.closePath(); g.fill(); g.fillStyle = LOOKS.her.skin; g.beginPath(); g.moveTo(-58, 44); g.lineTo(58, 44); g.lineTo(52, 70); g.quadraticCurveTo(0, 100, -52, 70); g.fill(); line([[-40, 44], [-36, 74]], LOOKS.her.top, 8); line([[40, 44], [36, 74]], LOOKS.her.top, 8);
  g.strokeStyle = LOOKS.her.skin; g.lineWidth = 30; g.beginPath(); g.moveTo(-58, 70); g.lineTo(-118, 112); g.lineTo(-196, 86); g.stroke(); g.beginPath(); g.moveTo(58, 70); g.lineTo(100, 150); g.lineTo(86, 236); g.stroke();
  g.restore();
  // hands meeting in the middle
  const hx = 640, hy = 322 + bounce; circ(hx - 12, hy, 22, LOOKS.him.skin); circ(hx + 12, hy + 2, 19, LOOKS.her.skin); for (let i = 0; i < 3; i++) circ(hx + 4 + i * 2, hy - 12 + i * 12, 6, '#ff5a6e'); heart(hx, hy - 52 - Math.sin(t * 3) * 5, 1.1 + .15 * A.pulse(t), '#ff4d7d', drop);
  faceTop('him', 446 + sh, 232 + bounce, 62, .3, { look: 1, lid: lid * .9, smile: .6 + wake * .4, open: wake * .6, blush: .7 });
  faceTop('her', 834 - sh, 238 + bounce * 1.1, 58, -.3, { look: -1, lid, smile: .6 + wake * .4, open: wake * .6, blush: .7 });
  // nightstand: clock, lamp, her earrings
  box(1126, 60, 170, 250, '#6d4a30', 14); box(1136, 70, 150, 230, '#7a5638', 10); circ(1204, 126, 46, '#f3e7d3'); circ(1204, 126, 30, '#ffd9a0');
  g.save(); g.translate(1204, 236 + (ring ? Math.sin(t * 60) * 4 : 0)); g.rotate(ring ? Math.sin(t * 50) * .06 : 0); box(-62, -34, 124, 68, '#15182c', 12); ltr(clock.replace(':', Math.floor(t * 2) % 2 ? ':' : ' '), 0, 2, 34, ring ? '#ff5a3c' : '#5cff9a'); if (ring) for (let i = 0; i < 3; i++) { g.strokeStyle = `rgba(255,120,90,${.8 - i * .2})`; g.lineWidth = 5; g.beginPath(); g.arc(0, 0, 84 + i * 20 + Math.sin(t * 30) * 4, -2.3, -.8); g.stroke(); g.beginPath(); g.arc(0, 0, 84 + i * 20 + Math.sin(t * 30) * 4, Math.PI - .8 + 1.6, Math.PI + 2.3 - 1.6 + 1.5); g.stroke(); } g.restore();
  // morning through the blinds
  g.save(); g.globalCompositeOperation = 'lighter'; for (let i = 0; i < 7; i++) { const x0 = -260 + i * 150 + (dawn - .7) * 900 + Math.sin(t * .2) * 10; g.fillStyle = `rgba(255,200,120,${.16 * seg(dawn, .6, .95)})`; g.beginPath(); g.moveTo(x0, 0); g.lineTo(x0 + 70, 0); g.lineTo(x0 + 70 - 420, H); g.lineTo(x0 - 420, H); g.fill(); } g.restore();
  tint('#1c2450', (1 - seg(dawn, .5, 1)) * .3);
}
S(L.b2e, (t, a, b) => { // "if you want, you can stay and sleep here too"
  const k = seg(t, a, b), drop = eBack(seg(t, a, a + .5)), lid = sg(t, a + 2.2, b - .2) * .96;
  g.save(); g.translate(W / 2, H / 2); g.scale(1.12 - k * .1, 1.12 - k * .1); g.rotate(-.03 + k * .03); g.translate(-W / 2, -H / 2);
  bedTop(t, { dawn: lerp(.76, .86, k), drop, lid, clock: k < .5 ? '05:41' : '05:42' });
  g.restore();
  for (let i = 0; i < 3; i++) { const ph = (t * .3 + i / 3) % 1; text('z', 660 + i * 40 + ph * 30, 150 - ph * 80, 30 + ph * 20, '#e9eef7', { a: Math.sin(ph * Math.PI) * lid * .9, rot: -.2 }); }
  tint('#fff', pulseIn(t, a + .45, .1) * .2); vignette(.4);
});
S(L.b2g, (t, a, b) => { // "sleep? what sleep" – wide awake
  const wake = sg(t, a, a + .15), k = seg(t, a, b);
  g.save(); g.translate(W / 2, H / 2); g.scale(1.02 + pulseIn(t, a, .2) * .06, 1.02 + pulseIn(t, a, .2) * .06); g.translate(-W / 2, -H / 2);
  bedTop(t, { dawn: .88, lid: 0, wake, clock: '06:00', ring: 1 });
  g.restore();
  for (let i = 0; i < 26; i++) { const an = rnd(i) * TAU, r = (t - a) * (160 + rnd(i + 5) * 320), x = 640 + Math.cos(an) * r, y = 260 + Math.sin(an) * r * .7 + (t - a) * (t - a) * 60; g.save(); g.translate(x, y); g.rotate(t * 3 + i); g.fillStyle = `rgba(255,255,255,${cl(1.2 - (t - a) * .6)})`; g.beginPath(); g.ellipse(0, 0, 18, 6, 0, 0, TAU); g.fill(); g.restore(); }
  text('!', 640, 120, 120 * eBack(seg(t, a, a + .2)), '#fff3c4', { stroke: '#e0483a', sw: 12, a: 1 - sg(t, a + .7, a + 1) });
  tint('#fff', pulseIn(t, a, .1) * .5); vignette(.4);
});
S(L.b2h, (t, a, b) => { // tonight nobody settled the bill: morning at the café
  const k = seg(t, a, b), wx = lerp(3320, X.tHer + 150, sg(t, a - .3, 217.3)), arrived = t > 217.3, pick = sg(t, 217.4, 217.8), read = sg(t, 217.9, 218.4), pocket = sg(t, 219.3, 219.8);
  setCam(lerp(3660, 3790, sg(t, a, 217.6)), 432, lerp(1.2, 1.4, k));
  street(t, { dawn: lerp(.84, .92, k), clock: '06:01', temp: '24°C', hum: '70%', sleep: 1.2, cafeLights: .35, closed: t < 216.5, t3up: 2, humid: .4, wind: .3, moon: 0, hazeA: .5 }, d => {
    if (d !== 0) return; cafeTable(t, { water: 0 });
    if (pick <= 0) planeSide(X.tHer + 86, WALKY - SEAT - 14, Math.PI - .2, 1.2);
    const W1 = figure('waiter', wx, WALKY, 1, 1, arrived ? poseStand({ t, hN: [lerp(40, 30, read), lerp(-110, -150, pick) + pocket * 46], hF: [24, -146 + pocket * 40], look: [lerp(.6, .2, read), read * .6 - pocket * .6], smile: read, brow: read * .8, tilt: read * .08 - pocket * .08, lean: pick > 0 && pick < 1 ? .25 : 0 }) : poseWalk(stepPhase(wx), { t, hN: [20, -120], look: [.6, 0] }));
    if (pick > 0 && pocket < 1) { g.save(); g.globalAlpha = 1 - pocket; if (read < .5) planeSide(W1.handN[0] + 10, W1.handN[1] - 8, Math.PI - .2, 1.1); else { g.translate(W1.handN[0] + 2, W1.handN[1] - 10); g.rotate(-.1); box(-22, -44, 44, 56, '#fffdf6', 2); line([[14, -30], [-6, -30]], '#6d7390', 2); line([[14, -20], [-12, -20]], '#6d7390', 2); heart(0, -2, .45, '#ff4d7d'); } g.restore(); }
    if (read > .6) floatingHearts(t, W1.head[0] + 30, W1.head[1] - 40, 4, read * (1 - pocket), 80, 120);
  });
});

/* =================== ENDING =================== */
S(L.end1, (t, a, b) => { // one more "hafuch" for both of them, as the sun comes up over Derech HaShalom
  const k = seg(t, a, b), hx = lerp(250, 520, sg(t, a - .4, 221.9)), give = sg(t, 222.0, 222.6), clink = pulseIn(t, 222.95, .3), turn = t > 223.7;
  setCam(lerp(520, 600, k), lerp(380, 350, k), lerp(1.35, 1.0, ez(k)));
  balcony(t, { dawn: lerp(.92, 1, k), wind: .4, inside: .3 }, d => { if (d !== 0) return;
    const P = figure('him', 610, FL, 1, turn ? 1 : -1, poseStand({ t, smile: .9, look: [1, 0], hN: give > 0 ? [lerp(8, 44, give), lerp(-108, -150 - clink * 10, give)] : undefined, hF: [-20, -124], blush: .5 }));
    const Q = figure('her', hx, FL, 1, 1, hx < 519 ? poseWalk(stepPhase(hx), { t, smile: .9, hN: [40, -140], hF: [34, -140], hairWind: -.3 }) : poseStand({ t, smile: 1, look: [1, 0], hN: [44, -150 - clink * 10], hF: [30, -140 + give * 26], hairWind: -.4 + Math.sin(t * 3) * .1, blush: .5 }));
    hafuch(Q.handN[0] + 2, Q.handN[1] + 14, .9, t, 1); if (give < .5) hafuch(Q.handF[0] + 2, Q.handF[1] + 14, .9, t, 1); else hafuch(P.handN[0] - (turn ? -2 : 2), P.handN[1] + 14, .9, t, 1);
    if (clink > 0) for (let i = 0; i < 8; i++) star4((P.handN[0] + Q.handN[0]) / 2 + Math.cos(i * .785) * (16 + (1 - clink) * 50), Q.handN[1] - 6 + Math.sin(i * .785) * (16 + (1 - clink) * 50), 8, '#fff3c4', clink, i);
  });
  floatingHearts(t, 640, 300, 5, sg(t, 223, b) * .6, 420, 200);
});
S(L.end2, (t, a, b) => { // good morning, Derech HaShalom
  const k = seg(t, a, b); camKeys(t, [[a, 8200, 150, .72], [b, 8260, 40, .54]]);
  street(t, { dawn: 1, sleep: lerp(1.2, .3, k), humid: .3, hazeA: .5, wind: .3, moon: 0, signGlow: 0, homeWin: 0, clock: '06:10' }, d => {
    if (d !== 1) return; figure('him', X.win[0] - 34, X.win[1] + 76, .5, -1, poseStand({ t, shadow: 0, hN: [34, -150] })); figure('her', X.win[0] + 14, X.win[1] + 76, .5, -1, poseStand({ t, shadow: 0, hN: [34, -150], hairWind: .3 }));
    box(HOMEWIN.x - 40, X.win[1] + 44, 190, 56, mixHex('#5f66a0', '#efe6dc', .8), 4);
    // birds off the roofs
    for (let i = 0; i < 9; i++) { const bx = 7500 + i * 150 + (t - a) * (60 + i * 9), by = -520 - i * 22 - (t - a) * 30 + Math.sin(i) * 60, fl = Math.sin(t * 9 + i) * 10; g.strokeStyle = 'rgba(40,40,70,.8)'; g.lineWidth = 4; g.lineCap = 'round'; g.beginPath(); g.moveTo(bx - 14, by - fl); g.quadraticCurveTo(bx - 6, by - 6, bx, by); g.quadraticCurveTo(bx + 6, by - 6, bx + 14, by - fl); g.stroke(); }
  });
  const sun = sg(t, a, a + 3); glow(980, 560 - sun * 120, 520, 'rgba(255,214,140,.7)', sun);
  const drop = eBack(seg(t, a + .7, a + 1.4)); title(t, cl(seg(t, a + .7, a + .95)), 132 - (1 - drop) * 420, .72);
});

/* =================== timeline =================== */
let _sorted = false;
function drawAt(t) {
  if (!_sorted) { SHOTS.sort((p, q) => p[0] - q[0]); _sorted = true; }
  t = cl(t, 0, DUR);
  g.setTransform(RS, 0, 0, RS, 0, 0); g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowBlur = 0; g.clearRect(0, 0, W, H);
  let i = SHOTS.length - 1; while (i > 0 && t < SHOTS[i][0]) i--;
  const a = SHOTS[i][0], b = i + 1 < SHOTS.length ? SHOTS[i + 1][0] : DUR;
  g.save(); g.beginPath(); g.rect(0, 0, W, H); g.clip(); setCam(W / 2, H / 2, 1); SHOTS[i][1](t, a, b); g.restore();
  g.globalAlpha = 1; g.globalCompositeOperation = 'source-over'; g.shadowBlur = 0; g.setLineDash([]);
  vignette(.32);
  const out = sg(t, 228.4, 230.8); if (out > 0) { g.fillStyle = `rgba(3,3,10,${out})`; g.fillRect(0, 0, W, H); }
}
