"use strict";
/* ===== people: a small articulated character rig (3/4 side view) =====
   Local space: origin on the floor between the feet, +x = the way the character faces, 1 unit ≈ 1px at scale 1 (height ≈ 232). */
const LOOKS = {
  him: { skin: '#d49a6e', skinSh: '#b57c53', hair: '#1e1512', top: '#eef2fa', topSh: '#c5d0e8', pants: '#27304f', pantsSh: '#1b2240', shoe: '#f6f6f8', sole: '#c9414f', lip: '#9a5544' },
  her: { skin: '#e8b38d', skinSh: '#cf9370', hair: '#2a1712', hairHi: '#5a3324', top: '#ff5a6e', topSh: '#d83f58', shoe: '#d8b65a', lip: '#c8405a' },
  waiter: { skin: '#c98f66', skinSh: '#a8744e', hair: '#3a2a22', top: '#f4f4f6', topSh: '#cdd2e0', pants: '#16182c', pantsSh: '#0e1020', shoe: '#0c0c14', sole: '#0c0c14', lip: '#8a4a3a' },
};
const BONE = { thigh: 54, shin: 52, uarm: 37, farm: 35, torso: 74 };

/* pose builders (all values local) */
function poseStand(o = {}) { return Object.assign({ hip: [0, -104], lean: 0, fN: [9, 0], fF: [-7, 0] }, o); }
function poseWalk(ph, o = {}) {
  const L = o.stride ?? 30, f = a => [Math.sin(a) * L, -Math.max(0, Math.cos(a)) * 13];
  const sw = o.swing ?? 20;
  return Object.assign({ hip: [0, -103 + Math.cos(ph * 2) * 2.5], lean: .05, fN: f(ph), fF: f(ph + Math.PI), hN: [6 - Math.sin(ph) * sw, -108 - Math.abs(Math.sin(ph)) * 4], hF: [-2 + Math.sin(ph) * sw, -108 - Math.abs(Math.sin(ph)) * 4] }, o);
}
function poseSit(o = {}) { return Object.assign({ hip: [-4, -68], lean: .04, fN: [46, 0], fF: [38, 0], sit: 1 }, o); }

function figure(kind, x, y, s, dir, p = {}) {
  const C = LOOKS[kind], her = kind === 'her';
  const hip = p.hip || [0, -104], lean = p.lean || 0, t = p.t || 0;
  const ca = Math.cos(lean), sa = Math.sin(lean);
  const sh = [hip[0] + sa * BONE.torso, hip[1] - ca * BONE.torso];                 // shoulder centre
  const ht = lean + (p.tilt || 0);
  const hd = [sh[0] + Math.sin(ht) * 33 + 3, sh[1] - Math.cos(ht) * 33];           // head centre
  const fN = p.fN || [9, 0], fF = p.fF || [-7, 0];
  const dN = [sh[0] + 5, sh[1] + 70], dF = [sh[0] - 3, sh[1] + 70];                // default hanging hands
  const hN = p.hN || dN, hF = p.hF || dF;
  const P = (lx, ly) => [x + lx * s * dir, y + ly * s];

  g.save(); g.translate(x, y); g.scale(s * dir, s); g.lineCap = 'round'; g.lineJoin = 'round';
  if (p.shadow !== 0) { g.fillStyle = `rgba(0,0,12,${p.shadow ?? .28})`; g.beginPath(); g.ellipse(hip[0] + 8, 3, 46, 7, 0, 0, TAU); g.fill(); }

  const limb = (a, j, b, col, w0, w1) => { g.strokeStyle = col; g.lineWidth = w0; g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(j[0], j[1]); g.stroke(); g.lineWidth = w1; g.beginPath(); g.moveTo(j[0], j[1]); g.lineTo(b[0], b[1]); g.stroke(); };
  const arm = (side, hand) => {
    const s0 = [sh[0] + (side ? 6 : -4), sh[1] + 6], j = ik(s0[0], s0[1], hand[0], hand[1], BONE.uarm, BONE.farm, p.elbow ?? 1), e = [j[0], j[1]], h2 = [j[2], j[3]];
    const sk = side ? C.skin : C.skinSh;
    limb(s0, e, h2, sk, her ? 9 : 11, her ? 8 : 9.5);
    if (!her) { const q = kind === 'waiter' ? .98 : .62; g.strokeStyle = side ? C.top : C.topSh; g.lineWidth = 15; g.beginPath(); g.moveTo(s0[0], s0[1]); g.lineTo(lerp(s0[0], e[0], q), lerp(s0[1], e[1], q)); g.stroke(); if (kind === 'waiter') { g.lineWidth = 12; g.beginPath(); g.moveTo(e[0], e[1]); g.lineTo(lerp(e[0], h2[0], .8), lerp(e[1], h2[1], .8)); g.stroke(); } }
    g.fillStyle = sk; g.beginPath(); g.arc(h2[0], h2[1], her ? 5.4 : 6.2, 0, TAU); g.fill();
    return h2;
  };
  const leg = (side, foot) => {
    const h0 = [hip[0] + (side ? 3 : -3), hip[1]], ank = [foot[0], foot[1] - 7], j = ik(h0[0], h0[1], ank[0], ank[1], BONE.thigh, BONE.shin, -1), k = [j[0], j[1]], a2 = [j[2], j[3]];
    if (her) limb(h0, k, a2, side ? C.skin : C.skinSh, 12, 9.5); else limb(h0, k, a2, side ? C.pants : C.pantsSh, 17, 13.5);
    // shoe
    const rot = p.sit ? 0 : cl((foot[1]) * -.03, -.5, .5);
    g.save(); g.translate(a2[0], a2[1] + 2); g.rotate(-rot);
    if (her) { g.fillStyle = C.skin; rr(-5, -2, 22, 8, 4); g.fill(); g.fillStyle = C.shoe; g.fillRect(-6, 5, 25, 3); g.fillRect(2, -2, 3, 8); g.fillRect(-6, -4, 10, 3); }
    else { g.fillStyle = C.shoe; rr(-8, -5, 31, 12, [5, 8, 3, 3]); g.fill(); g.fillStyle = C.sole; g.fillRect(-8, 5, 31, 3); if (kind === 'him') { g.fillStyle = '#c9cfe0'; g.fillRect(2, -4, 2, 6); g.fillRect(7, -4, 2, 6); } }
    g.restore();
    return k;
  };

  /* far limbs */
  const handF = arm(0, hF); const kF = leg(0, fF);
  /* her long hair behind the body */
  const wnd = p.hairWind || 0;
  if (her) {
    g.save(); g.translate(hd[0], hd[1]); g.rotate(ht * .6); g.fillStyle = C.hair; g.beginPath(); g.moveTo(-14, -22);
    g.bezierCurveTo(-34, -14, -30 - wnd * 10, 26, -26 - wnd * 34, 62 + Math.abs(wnd) * -8);
    g.bezierCurveTo(-18 - wnd * 40, 78, -2 - wnd * 30, 70, 0 - wnd * 16, 52); g.lineTo(6, 6); g.closePath(); g.fill();
    g.strokeStyle = C.hairHi; g.lineWidth = 1.6; for (let i = 0; i < 4; i++) { g.beginPath(); g.moveTo(-20 + i * 4, -8); g.bezierCurveTo(-26 + i * 4 - wnd * 8, 22, -22 + i * 5 - wnd * 26, 44, -20 + i * 5 - wnd * (30 + i * 3) + Math.sin(t * 5 + i) * wnd * 5, 64 - i * 3); g.stroke(); }
    g.restore();
  }
  const kN0 = null;
  /* torso */
  const perp = [ca, sa];
  const T = (u, v) => [hip[0] + sa * v + perp[0] * u, hip[1] - ca * v + perp[1] * u];   // u across, v up along the spine
  if (her) {
    // near leg first (bare), then the dress over it
    var kN = leg(1, fN);
    const sway = p.skirt || 0;
    g.fillStyle = C.top; g.beginPath();
    let a = T(-13, 70), b = T(13, 72), c = T(15, 40), d = T(12, 22), e2 = T(-12, 20), f2 = T(-14, 44);
    g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]);
    if (p.sit) { const kx = Math.max(kN[0], kF[0]), ky = Math.min(kN[1], kF[1]); g.lineTo(kx + 6, ky - 9); g.lineTo(kx + 9, ky + 20); g.lineTo(hip[0] + 6, hip[1] + 26); g.lineTo(hip[0] - 20, hip[1] + 16); }
    else { const hem = hip[1] + 54, x1 = Math.max(kN[0], kF[0], hip[0]) + 17 + sway * 10, x0 = Math.min(kN[0], kF[0], hip[0]) - 17 + sway * 14; g.quadraticCurveTo(hip[0] + 22, hip[1] + 20, x1, hem); g.quadraticCurveTo((x0 + x1) / 2, hem + 7 + Math.sin(t * 6) * sway * 3, x0, hem - 2); g.quadraticCurveTo(hip[0] - 20, hip[1] + 14, e2[0], e2[1]); }
    g.lineTo(e2[0], e2[1]); g.lineTo(f2[0], f2[1]); g.closePath(); g.fill();
    g.fillStyle = C.topSh; g.beginPath(); a = T(-13, 70); g.moveTo(a[0], a[1]); let q1 = T(-6, 70), q2 = T(-7, 22); g.lineTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.lineTo(e2[0], e2[1]); g.lineTo(f2[0], f2[1]); g.closePath(); g.fill();
    // shoulders / neckline (skin) and straps
    g.fillStyle = C.skin; g.beginPath(); a = T(-15, 74); b = T(16, 76); c = T(13, 66); d = T(-13, 64); g.moveTo(a[0], a[1]); g.quadraticCurveTo(sh[0], sh[1] - 6, b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.closePath(); g.fill();
    g.strokeStyle = C.top; g.lineWidth = 3; let s1 = T(-9, 68), s2 = T(-7, 78), s3 = T(10, 70), s4 = T(9, 79); g.beginPath(); g.moveTo(s1[0], s1[1]); g.lineTo(s2[0], s2[1]); g.moveTo(s3[0], s3[1]); g.lineTo(s4[0], s4[1]); g.stroke();
  } else {
    var kN = leg(1, fN);
    g.fillStyle = C.pants; let a = T(-15, 12), b = T(16, 12), c = T(15, -8), d = T(-14, -8); g.beginPath(); g.moveTo(a[0], a[1]); g.lineTo(b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.fill();
    g.fillStyle = C.top; g.beginPath(); a = T(-17, 76); b = T(18, 78); c = T(19, 30); d = T(17, 2); let e2 = T(-16, 2), f2 = T(-18, 34);
    g.moveTo(a[0], a[1]); g.quadraticCurveTo(sh[0], sh[1] - 7, b[0], b[1]); g.lineTo(c[0], c[1]); g.lineTo(d[0], d[1]); g.lineTo(e2[0], e2[1]); g.lineTo(f2[0], f2[1]); g.closePath(); g.fill();
    g.fillStyle = C.topSh; g.beginPath(); let q1 = T(-8, 74), q2 = T(-9, 2); g.moveTo(a[0], a[1]); g.lineTo(q1[0], q1[1]); g.lineTo(q2[0], q2[1]); g.lineTo(e2[0], e2[1]); g.lineTo(f2[0], f2[1]); g.closePath(); g.fill();
    if (kind === 'him') { g.strokeStyle = 'rgba(120,140,180,.6)'; g.lineWidth = 1.2; let b1 = T(9, 70), b2 = T(8, 4); g.beginPath(); g.moveTo(b1[0], b1[1]); g.lineTo(b2[0], b2[1]); g.stroke(); for (let i = 0; i < 4; i++) { const bb = T(9, 58 - i * 15); g.fillStyle = '#9aa8c8'; g.beginPath(); g.arc(bb[0], bb[1], 1.4, 0, TAU); g.fill(); } }
    if (kind === 'waiter') { g.fillStyle = '#16182c'; let w1 = T(-17, 26), w2 = T(19, 26), w3 = T(19, -36), w4 = T(-14, -36); g.beginPath(); g.moveTo(w1[0], w1[1]); g.lineTo(w2[0], w2[1]); g.lineTo(w3[0], w3[1]); g.lineTo(w4[0], w4[1]); g.fill(); let bt = T(6, 62); g.fillStyle = '#16182c'; g.beginPath(); g.moveTo(bt[0] - 5, bt[1] - 3); g.lineTo(bt[0] + 5, bt[1] + 3); g.lineTo(bt[0] + 5, bt[1] - 3); g.lineTo(bt[0] - 5, bt[1] + 3); g.fill(); }
  }
  /* neck */
  g.strokeStyle = C.skinSh; g.lineWidth = her ? 10 : 12; g.beginPath(); g.moveTo(sh[0] + 2, sh[1] - 2); g.lineTo(hd[0] - 2, hd[1] + 14); g.stroke();
  if (kind === 'him') { g.fillStyle = C.top; const c1 = T(-9, 80), c2 = T(4, 70), c3 = T(14, 82), c4 = T(6, 86); g.beginPath(); g.moveTo(c1[0], c1[1]); g.lineTo(c2[0], c2[1]); g.lineTo(c3[0], c3[1]); g.lineTo(c4[0], c4[1]); g.closePath(); g.fill(); g.strokeStyle = 'rgba(120,140,180,.5)'; g.lineWidth = 1; g.stroke(); }
  /* head */
  drawHead(kind, hd[0], hd[1], ht * .6, p);
  /* near arm (over everything) */
  const handN = arm(1, hN);
  g.restore();
  return { head: P(hd[0], hd[1]), handN: P(handN[0], handN[1]), handF: P(handF[0], handF[1]), sh: P(sh[0], sh[1]), chest: P(sh[0] + 2, sh[1] + 30), hip: P(hip[0], hip[1]), kneeN: P(kN[0], kN[1]), s, dir };
}

/* head in local space, facing +x. Also used on its own for close-ups. */
function drawHead(kind, hx, hy, rot, p = {}) {
  const C = LOOKS[kind], her = kind === 'her', t = p.t || 0, wnd = p.hairWind || 0;
  const look = p.look || [0, 0], blink = p.blink ?? (Math.sin(t * .9 + (her ? 1 : 3)) > .985 || Math.sin(t * .37 + (her ? 2 : 5)) > .993 ? 1 : 0), smile = p.smile ?? 0, open = p.open || 0, brow = p.brow || 0, blush = p.blush || 0, sweat = p.sweat || 0;
  g.save(); g.translate(hx, hy); g.rotate(rot);
  // ear
  g.fillStyle = C.skinSh; g.beginPath(); g.ellipse(-10, 2, 4.5, 6.5, 0, 0, TAU); g.fill();
  // face
  g.fillStyle = C.skin; g.beginPath(); g.ellipse(1, -1, 20, 22.5, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(6, 11, 13.5, 11.5, .2, 0, TAU); g.fill();
  // jaw shade / stubble
  if (kind !== 'her') { g.save(); g.beginPath(); g.ellipse(1, -1, 20, 22.5, 0, 0, TAU); g.ellipse(6, 11, 13.5, 11.5, .2, 0, TAU); g.clip(); g.fillStyle = kind === 'him' ? 'rgba(40,26,20,.08)' : 'rgba(40,26,20,.05)'; g.beginPath(); g.ellipse(5, 23, 19, 11, .15, 0, TAU); g.fill(); g.restore(); }
  // blush
  if (blush > 0) { g.fillStyle = `rgba(255,80,90,${.38 * blush})`; g.beginPath(); g.ellipse(2, 8, 5.5, 3.6, 0, 0, TAU); g.fill(); g.beginPath(); g.ellipse(16, 8, 3.6, 3.2, 0, 0, TAU); g.fill(); }
  // eyes
  const eye = (ex, ey, w) => {
    if (blink > .6) { g.strokeStyle = '#2a1712'; g.lineWidth = her ? 1.8 : 1.5; g.beginPath(); g.moveTo(ex - 4.2 * w, ey); g.quadraticCurveTo(ex, ey + 2.4, ex + 4.2 * w, ey); g.stroke(); return; }
    const sq = 1 - smile * .18 * (smile > 0 ? 1 : 0);
    g.fillStyle = '#fffdf8'; g.beginPath(); g.ellipse(ex, ey, 4.7 * w, 4.3 * sq, 0, 0, TAU); g.fill();
    g.save(); g.beginPath(); g.ellipse(ex, ey, 4.7 * w, 4.3 * sq, 0, 0, TAU); g.clip();
    const ix = ex + look[0] * 2.4 * w, iy = ey + look[1] * 2 + .3;
    g.fillStyle = her ? '#6b4226' : '#4a2c1a'; g.beginPath(); g.arc(ix, iy, 2.4, 0, TAU); g.fill(); g.fillStyle = '#120a08'; g.beginPath(); g.arc(ix, iy, 1.2, 0, TAU); g.fill();
    g.fillStyle = '#fff'; g.beginPath(); g.arc(ix - .9, iy - 1, .8, 0, TAU); g.fill(); g.restore();
    g.strokeStyle = '#2a1712'; g.lineWidth = her ? .95 : .7; g.beginPath(); g.moveTo(ex - 4.7 * w, ey - .2); g.bezierCurveTo(ex - 3.4 * w, ey - 4.9 * sq, ex + 3.4 * w, ey - 4.9 * sq, ex + 4.7 * w, ey - .2); g.stroke();
    if (her) { g.lineWidth = .8; g.beginPath(); g.moveTo(ex - 4.6 * w, ey - .5); g.quadraticCurveTo(ex - 5.8 * w, ey - 1.2, ex - 6.6 * w, ey - 2.6); g.stroke(); }
  };
  eye(3.4, -1.6, 1); eye(13.6, -1.6, .74);
  // brows
  g.strokeStyle = C.hair; g.lineWidth = her ? 1.05 : 2.0; const by = (her ? -12.6 : -10.8) - Math.max(0, brow) * 2.6, wr = Math.min(0, brow) * -2.4;
  g.beginPath(); g.moveTo(her ? .5 : -1, by + 1 + wr * .2); g.quadraticCurveTo(3.8, by - 1.5, 8, by - wr); g.moveTo(11, by - wr); g.quadraticCurveTo(13.6, by - 1.3, her ? 15.8 : 16.8, by + .7); g.stroke();
  // nose
  g.strokeStyle = C.skinSh; g.lineWidth = 1.5; g.beginPath(); g.moveTo(10.5, 0); g.quadraticCurveTo(14.2, 5.4, 10.6, 6.6); g.stroke();
  // mouth
  if (open > .05) { g.fillStyle = '#5a1a22'; g.beginPath(); g.ellipse(9.5, 12.6, 4 + smile * 1.2, 1 + open * 3.6, 0, 0, TAU); g.fill(); if (smile > .3) { g.fillStyle = '#fff'; g.fillRect(6.6, 11.2, 5.8, 1.6); } g.strokeStyle = C.lip; g.lineWidth = her ? 1.6 : 1; g.beginPath(); g.ellipse(9.5, 12.6, 4 + smile * 1.2, 1 + open * 3.6, 0, 0, TAU); g.stroke(); }
  else if (her) { // full lips
    const lx = 4.4 - smile * .9, rx = 14.2 + smile * .5, cy = 11.9 - smile * 1.3;
    g.fillStyle = C.lip; g.beginPath(); g.moveTo(lx, cy); g.quadraticCurveTo(7.2, cy - 1.9 + smile * .9, 9.2, cy - .7 + smile * 1.2); g.quadraticCurveTo(11.2, cy - 1.9 + smile * .9, rx, cy); g.quadraticCurveTo(9.4, cy + 4.6 + smile * 4.2, lx, cy); g.fill();
    g.strokeStyle = '#8f2a40'; g.lineWidth = .6; g.beginPath(); g.moveTo(lx, cy); g.quadraticCurveTo(9.3, cy + 1.1 + smile * 3.2, rx, cy); g.stroke(); }
  else { g.strokeStyle = C.lip; g.lineWidth = 1.7; g.beginPath(); g.moveTo(4.6 - smile * .8, 12 - smile * 1.2); g.quadraticCurveTo(9.6, 12 + smile * 5.4, 14.4 + smile * .6, 12 - smile * 1.4); g.stroke(); }
  // hair
  g.fillStyle = C.hair;
  if (her) {
    g.beginPath(); g.moveTo(-21, 12); g.bezierCurveTo(-27, -30, 12, -37, 21, -11); g.bezierCurveTo(15, -19, 3, -25, -7, -11); g.bezierCurveTo(-10, -2, -10, 10, -12, 18); g.closePath(); g.fill();
    // a front lock over the near shoulder, lifted by the wind
    g.beginPath(); g.moveTo(-12, -6); g.bezierCurveTo(-18 - wnd * 6, 16, -12 - wnd * 18, 34, -8 - wnd * 26 + Math.sin(t * 6) * wnd * 4, 52); g.bezierCurveTo(-2 - wnd * 22, 44, -2 - wnd * 8, 20, -4, -2); g.closePath(); g.fill();
    g.strokeStyle = C.hairHi; g.lineWidth = 1.4; g.beginPath(); g.moveTo(-16, -18); g.quadraticCurveTo(-2, -30, 14, -16); g.stroke();
    // hoop earring
    g.strokeStyle = '#e7c765'; g.lineWidth = 1.8; g.beginPath(); g.arc(-8.5, 13 + Math.sin(t * 5) * Math.abs(wnd) * 1.5, 4.4, 0, TAU); g.stroke();
  } else {
    g.beginPath(); g.moveTo(-19.5, 3); g.bezierCurveTo(-24, -27, 4, -35, 13, -27); g.quadraticCurveTo(22, -26, 20, -12); g.quadraticCurveTo(9, -19, -3, -15); g.quadraticCurveTo(-9, -11, -10.5, -1); g.quadraticCurveTo(-14, 0, -15, 6); g.closePath(); g.fill();
    if (kind === 'waiter') { g.beginPath(); g.ellipse(-20, -6, 5, 6, 0, 0, TAU); g.fill(); }
  }
  // sweat drops sliding down the temple
  if (sweat > 0) for (let i = 0; i < 3; i++) { const ph = (t * .45 + i * .37) % 1, sx = -3 + i * 9 - (i === 2 ? 22 : 0), sy = -14 + ph * 24; g.fillStyle = `rgba(170,225,255,${sweat * (1 - ph) * .95})`; g.beginPath(); g.moveTo(sx, sy - 4); g.quadraticCurveTo(sx + 3.2, sy + 1, sx, sy + 3); g.quadraticCurveTo(sx - 3.2, sy + 1, sx, sy - 4); g.fill(); }
  g.restore();
}

/* speech / thought bubble in world space. tail points toward (tx,ty) */
function bubble(x, y, w, h, tx, ty, a = 1, thought = false) {
  if (a <= 0) return; g.save(); g.globalAlpha *= a; g.fillStyle = '#fffdf7';
  rr(x - w / 2, y - h / 2, w, h, Math.min(w, h) * .42); g.fill();
  if (thought) { const dx = tx - x, dy = ty - y; for (let i = 1; i <= 3; i++) { const q = .5 + i * .14; g.beginPath(); g.arc(x + dx * q, y + dy * q, 9 - i * 2, 0, TAU); g.fill(); } }
  else { const side = tx < x ? -1 : 1; g.beginPath(); g.moveTo(x + side * w * .12, y + h / 2 - 4); g.lineTo(lerp(x, tx, .8), lerp(y + h / 2, ty, .7)); g.lineTo(x + side * w * .3, y + h / 2 - 4); g.fill(); }
  g.restore();
}
