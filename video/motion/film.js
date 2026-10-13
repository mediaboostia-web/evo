/* Evo, le film de présentation. Chaque scène se dessine à partir du temps seul :
   aucune transition CSS, aucun minuteur. L'image 1 234 est donc toujours la même,
   à l'aperçu comme au rendu. Les instants viennent de timeline.js (la voix). */
(() => {
  const B = BAI, TL = EVO_TL, DATA = EVO_DATA, FPS = TL.FPS;
  const { p, lerp, clamp, $, $$ } = B;
  const E = B.ease;
  // Arrivée avec un très léger dépassement, comme un objet qui se pose.
  E.back = (x) => { const c = 1.3, y = x - 1; return 1 + (c + 1) * y * y * y + c * y * y; };
  const px = (v) => v.toFixed(2) + "px";
  const after = (t, t0) => B.after(t, t0, FPS);
  const W = 1920, H = 1080;
  window.__pending = [];

  // ---- images -------------------------------------------------------------------------------
  function load(img, src) {
    if (img.dataset.src === src) return;
    img.dataset.src = src;
    img.src = src;
    window.__pending.push(img.decode().catch(() => null));
  }
  /** Image du plan `shot` à `sec` secondes de son début. */
  function frame(img, shot, sec) {
    const i = clamp(Math.floor(sec * FPS + 1e-4), 0, DATA.shots[shot] - 1);
    load(img, `../work/frames/${shot}/${String(i + 1).padStart(4, "0")}.jpg`);
  }
  const rect = (el, x, y, w, h, r) => {
    el.style.left = px(x); el.style.top = px(y); el.style.width = px(w); el.style.height = px(h);
    if (r != null) el.style.borderRadius = px(r);
  };
  /** Place une image 16:9 de largeur `w` dans son cadre. */
  const place = (img, x, y, w) => { img.style.left = px(x); img.style.top = px(y); img.style.width = px(w); img.style.height = px((w * 9) / 16); };
  const icon = (name, size, color = "#fff") => `<svg width="${size}" height="${size}" viewBox="0 0 256 256" fill="${color}">${DATA.icons[name].map((d) => `<path d="${d}"/>`).join("")}</svg>`;
  /** Surligneur qui balaie un mot ; le texte passe du blanc au bleu nuit. */
  function mark(el, t, t0, dur = 0.45, from = "#ffffff") {
    const u = p(t, t0, dur, E.inOut);
    el.style.backgroundSize = `${(u * 100).toFixed(2)}% 100%`;
    el.style.color = B.mix(from, "#070614", clamp(u * 1.6 - 0.3));
    return u;
  }
  /** Anneau qui s'élargit et s'efface : un clic, un signal. */
  function ring(el, t, t0, cx, cy, r0, r1, dur = 0.6) {
    const u = clamp((t - t0) / dur);
    const r = lerp(r0, r1, E.out(u));
    rect(el, cx - r, cy - r, r * 2, r * 2);
    el.style.opacity = t < t0 || u >= 1 ? 0 : (1 - u) * 0.9;
  }
  /** Ligne sonore : vivante quand il y a du son, plate quand il n'y en a plus. */
  function wave(a, b, t, amp, y0) {
    let d = "";
    for (let x = -10; x <= W + 10; x += 12) {
      const env = Math.pow(Math.sin((Math.PI * clamp(x / W)) || 0), 1.4);
      const y = y0 + amp * env * (Math.sin(x * 0.021 + t * 9) * 0.55 + Math.sin(x * 0.047 - t * 13) * 0.3 + Math.sin(x * 0.0113 + t * 5) * 0.4);
      d += (d ? "L" : "M") + x + " " + y.toFixed(1);
    }
    a.setAttribute("d", d); b.setAttribute("d", d);
  }

  // ---- déformation en perspective : poser une image sur quatre coins --------------------------
  const adj = (m) => [m[4] * m[8] - m[5] * m[7], m[2] * m[7] - m[1] * m[8], m[1] * m[5] - m[2] * m[4], m[5] * m[6] - m[3] * m[8], m[0] * m[8] - m[2] * m[6], m[2] * m[3] - m[0] * m[5], m[3] * m[7] - m[4] * m[6], m[1] * m[6] - m[0] * m[7], m[0] * m[4] - m[1] * m[3]];
  const mul = (a, b) => { const c = []; for (let i = 0; i < 3; i++) for (let j = 0; j < 3; j++) { let s = 0; for (let k = 0; k < 3; k++) s += a[3 * i + k] * b[3 * k + j]; c[3 * i + j] = s; } return c; };
  const mulv = (m, v) => [m[0] * v[0] + m[1] * v[1] + m[2] * v[2], m[3] * v[0] + m[4] * v[1] + m[5] * v[2], m[6] * v[0] + m[7] * v[1] + m[8] * v[2]];
  const basis = (x1, y1, x2, y2, x3, y3, x4, y4) => { const m = [x1, x2, x3, y1, y2, y3, 1, 1, 1], v = mulv(adj(m), [x4, y4, 1]); return mul(m, [v[0], 0, 0, 0, v[1], 0, 0, 0, v[2]]); };
  /** quad = [haut-gauche, haut-droit, bas-droit, bas-gauche] */
  function pin(el, w, h, q) {
    const t = mul(basis(q[0][0], q[0][1], q[1][0], q[1][1], q[3][0], q[3][1], q[2][0], q[2][1]), adj(basis(0, 0, w, 0, 0, h, w, h))).map((v, _, a) => v / a[8]);
    el.style.transform = `matrix3d(${t[0]},${t[3]},0,${t[6]},${t[1]},${t[4]},0,${t[7]},0,0,1,0,${t[2]},${t[5]},0,${t[8]})`;
  }

  // ---- éléments -------------------------------------------------------------------------------
  const I = (id) => $("#" + id + " img") || $("#" + id);
  const words = B.words;

  // Icônes du site dans les rangées d'accessibilité et sur le bouton final.
  ["ClosedCaptioning", "HandWaving", "SpeakerHigh", "DotsSix"].forEach((n, i) => { $(`#acc-row${i} .tile`).innerHTML = icon(n, 54); });
  $("#end-arrow").innerHTML = icon("ArrowRight", 54, "#0067ff");
  $$("#chat-dots i").forEach((d) => { d.style.cssText = "display:block;width:13px;height:13px;border-radius:50%;background:#0067ff"; });

  // La vraie interface, posée à l'échelle : chaque morceau est une capture du site.
  const CK = 1.6, CX = 900, CY = 62, chat = DATA.boxes.chat, cp = chat.parts;
  rect($("#demo-chat"), CX, CY, chat.w * CK, chat.h * CK, 24 * CK);
  for (const k of Object.keys(cp)) { const el = $("#chat-" + k); rect(el, cp[k].x * CK, cp[k].y * CK, cp[k].w * CK, cp[k].h * CK); }
  rect($("#chat-dots"), cp.a1.x * CK, cp.a1.y * CK, 66 * CK, 42 * CK, 20 * CK);
  rect($("#chat-hl1"), 119 * CK, 180.5 * CK, 66 * CK, 25 * CK);
  rect($("#chat-hl2"), 33 * CK, 203.5 * CK, 58 * CK, 25 * CK);
  const QK = 1.5, QX = 1230, QY = 250, quiz = DATA.boxes.quiz;
  rect($("#demo-quiz"), QX, QY, quiz.w * QK, quiz.h * QK, 24 * QK);
  ["quiz-a", "quiz-b"].forEach((id) => rect($("#" + id), 0, 0, quiz.w * QK, quiz.h * QK));
  const QR = quiz.parts.right, QC = [QX + (QR.x + QR.w / 2) * QK, QY + (QR.y + QR.h / 2) * QK];
  const TAP = [CX + (cp.chip1.x + cp.chip1.w / 2) * CK, CY + (cp.chip1.y + cp.chip1.h / 2) * CK];
  const TEN = Array.from({ length: 10 }, (_, j) => 56.35 + 1.1 * (1 - Math.pow(1 - j / 9, 1.6))); // mêmes instants que les dix notes

  // ---- 1. 19 h --------------------------------------------------------------------------------
  // Point le plus « plein » des chiffres : c'est par lui que la caméra traverse le 19:00.
  let pivot = null;
  function inkPivot() {
    if (pivot || !document.fonts.check('900 560px "Gabarito"')) return pivot || { x: 960, y: 520, s: 60 };
    const c = document.createElement("canvas"); c.width = 960; c.height = 540;
    const g = c.getContext("2d", { willReadFrequently: true });
    g.scale(0.5, 0.5); g.font = '900 560px "Gabarito"'; g.textAlign = "center"; g.fillText("19:00", 960, 700);
    const d = g.getImageData(0, 0, 960, 540).data;
    const ink = (x, y) => x >= 0 && y >= 0 && x < 960 && y < 540 && d[(y * 960 + x) * 4 + 3] > 128;
    let best = { cost: 1e9 };
    for (let y = 60; y < 480; y += 2) for (let x = 40; x < 920; x += 2) {
      if (!ink(x, y)) continue;
      let r = 0;
      while (r < 90 && ink(x - r - 1, y - r - 1) && ink(x + r + 1, y - r - 1) && ink(x - r - 1, y + r + 1) && ink(x + r + 1, y + r + 1) && ink(x, y - r - 1) && ink(x, y + r + 1) && ink(x - r - 1, y) && ink(x + r + 1, y)) r++;
      if (r < 6) continue;
      const X = x * 2, Y = y * 2, cost = Math.max(X, W - X, Y, H - Y) / (r * 2);
      if (cost < best.cost) best = { cost, x: X, y: Y };
    }
    pivot = { x: best.x, y: best.y, s: best.cost * 1.35 };
    return pivot;
  }
  const fmtH = (m) => `${Math.floor(m / 60)} h ${String(Math.floor(m % 60)).padStart(2, "0")}`;

  function open(lt, el, T) {
    frame(I("open-shot"), "s1", lt);
    $("#open-shot").style.transform = `scale(${lerp(1.07, 1, p(T, 0, 2.8, E.inOut)).toFixed(4)})`;
    // Les chiffres : 18:59 devient 19:00 sur le deuxième tic, puis la caméra les traverse.
    const digits = after(T, 0.65) ? "19:00" : "18:59";
    const mt = $("#m19t"), mo = $("#m19o");
    if (mt.textContent !== digits) { mt.textContent = digits; mo.textContent = digits; }
    const pv = inkPivot();
    const u = clamp((T - 1.95) / 0.85);
    const S = (1 + 0.04 * clamp(T / 2)) * Math.pow(pv.s, u * u * u);
    const tf = `translate(${pv.x} ${pv.y}) scale(${S.toFixed(4)}) translate(${-pv.x} ${-pv.y})`;
    mt.setAttribute("transform", tf); mo.setAttribute("transform", tf);
    mo.style.opacity = 0;
    $("#open-mask").style.display = u >= 1 ? "none" : "";
    $("#open-black").style.opacity = 1 - p(T, 0.12, 0.3, E.soft);
    // Qui elle est, ce qui l'attend.
    const out = 5.35;
    B.show($("#open-name-big"), T, 2.95, out, { from: { y: 50, blur: 10 }, to: { x: -90, y: 0 } });
    B.show($("#open-age"), T, 3.3, out + 0.05, { from: { y: 30 }, to: { x: -90, y: 0 } });
    B.show($("#open-test"), T, 4.15, out + 0.1, { from: { y: 30 }, to: { x: -90, y: 0 } });
    $("#open-scrim").style.opacity = p(T, 2.8, 0.5);
    // Deux heures sur le même exercice : le compteur tourne.
    const tin = 5.6;
    B.set($("#open-timer"), { o: p(T, tin, 0.35), y: lerp(40, 0, p(T, tin, 0.5)), blur: 8 * (1 - p(T, tin, 0.4)) });
    const c = p(T, 5.8, 1.25, E.inOut);
    const txt = fmtH(c * 120);
    const cn = $("#open-count");
    if (cn.textContent !== txt) cn.textContent = txt;
    const ringEl = $("#open-ring"), len = 2 * Math.PI * 62;
    ringEl.style.strokeDasharray = len; ringEl.style.strokeDashoffset = (len * (1 - c)).toFixed(2);
    B.set(cn, { s: 1 + 0.05 * Math.sin(Math.PI * clamp((T - 7.05) / 0.3)) });
  }

  // ---- 2. Relire, gommer, recommencer -------------------------------------------------------
  function trip(lt, el, T) {
    const a = p(T, 9.38, 0.5, E.inOut), b = p(T, 10.28, 0.5, E.inOut), x = p(T, 12.5, 0.5, E.inOut);
    const gap = 16, w3 = (W - 2 * gap) / 3, w2 = (W - gap) / 2;
    const A = $("#trip-a"), Bp = $("#trip-b"), C = $("#trip-c");
    const aw = lerp(lerp(lerp(W, w2, a), w3, b), 900, x);
    const ah = lerp(H, 800, x);
    rect(A, lerp(0, 80, x), lerp(0, 90, x), aw, ah, 36 * x);
    const bx = lerp(lerp(W + gap, w2 + gap, a), w3 + gap, b) + x * 1500, bw = lerp(w2, w3, b);
    rect(Bp, bx, 0, bw, H, 0);
    const cx = lerp(W + gap, 2 * (w3 + gap), b) + x * 1700;
    rect(C, cx, 0, w3, H, 0);
    // Trois moments du même geste : le troisième volet rejoue le début. Elle recommence.
    const push = 1 + 0.05 * (lt / 5.4);
    const inner = (panel, w, h, shotSec, focus, s) => {
      const img = panel.querySelector("img");
      frame(img, "s2", shotSec);
      place(img, clamp(w / 2 - focus * s, w - W * s, 0), (h - H * s) / 2, W * s);
    };
    inner(A, aw, ah, lt, 760, push);
    inner(Bp, bw, H, lt + 0.6, 1130, push * 1.04);
    inner(C, w3, H, Math.max(0, lt - 2.5), 700, push * 1.1);
    const v = $$("#trip .verb");
    B.show(v[0], T, 8.58, 12.45, { from: { y: 46, blur: 8 }, dout: 0.25 });
    B.show(v[1], T, 9.6, 12.45, { from: { y: 46, blur: 8 }, dout: 0.25 });
    B.show(v[2], T, 10.5, 12.45, { from: { y: 46, blur: 8 }, dout: 0.25 });
  }

  // ---- 3. Personne pour expliquer autrement ---------------------------------------------------
  function doubt(lt, el, T) {
    const P = $("#doubt-p"), img = P.querySelector("img");
    const out = p(T, 17.05, 0.35, E.in);
    rect(P, 80, 90, 900, 800, 36);
    frame(img, "s3", lt);
    const s = lerp(1.0, 1.08, lt / 4.4);
    place(img, 450 - 800 * s, (800 - H * s) / 2 - 10, W * s);
    B.set(P, { x: -140 * out, o: 1 - out });
    B.stagger(words($("#doubt-l1")), T, 13.15, 0.12, 17.05, { from: { y: 40, blur: 8 }, to: { x: -120, y: 0 } });
    $("#doubt-l1w").style.opacity = lerp(1, 0.42, p(T, 14.7, 0.4, E.soft));
    const w2 = words($("#doubt-l2"));
    B.stagger(w2.slice(0, 1), T, 14.82, 0.1, 17.08, { from: { y: 40, blur: 8 }, to: { x: -120, y: 0 } });
    B.stagger(w2.slice(1, 4), T, 15.3, 0.13, 17.1, { from: { y: 40, blur: 8 }, to: { x: -120, y: 0 } });
    B.stagger(w2.slice(4), T, 16.25, 0.1, 17.12, { from: { y: 40, blur: 8 }, to: { x: -120, y: 0 } });
    mark($("#doubt-mark"), T, 16.4, 0.45);
    $("#doubt-mark").style.opacity = 1 - out;
  }

  // ---- 4. En classe ---------------------------------------------------------------------------
  function klass(lt, el, T) {
    frame(I("class-shot"), "s4", lt);
    B.show($("#class-chip"), T, 17.65, 20.35, { from: { x: -60, y: 0 }, to: { x: -60, y: 0 } });
    B.show($("#class-t1a"), T, 20.62, 22.3, { from: { y: 60, blur: 10 }, to: { x: -110, y: 0 } });
    B.show($("#class-t1b"), T, 21.22, 22.36, { from: { y: 40, blur: 8 }, to: { x: -110, y: 0 } });
    // La question qu'elle n'a pas posée : écrite, puis barrée.
    B.show($("#class-q"), T, 22.6, 25.45, { from: { y: 50, blur: 10 }, dout: 0.18 });
    const st = $("#class-strike"), su = p(T, 24.28, 0.4, E.inOut);
    st.style.width = px(su * 760); st.style.opacity = T > 25.45 ? 0 : 1;
    $("#class-q").style.color = B.mix("#ffffff", "#9fb0d6", su);
    B.show($("#class-never"), T, 24.55, 25.45, { from: { y: 36, blur: 8 }, dout: 0.18 });
  }

  // ---- 5. Sans l'entendre ---------------------------------------------------------------------
  function hear(lt, el, T) {
    const img = $("#hear-img");
    load(img, "../work/stills/boy.jpg");
    const s = lerp(1.0, 1.2, E.soft(lt / 5));
    const shot = $("#hear-shot");
    place(img, -8, 0, 1936);
    shot.style.transformOrigin = "834px 356px"; // l'appareil auditif : le point fixe du plan
    shot.style.transform = `scale(${s.toFixed(4)})`;
    const quiet = after(T, TL.silence[0]);
    // Dans le silence, la couleur se retire avec le son.
    const g = p(T, TL.silence[0], 0.25, E.soft);
    shot.style.filter = `grayscale(${(g * 0.85).toFixed(3)}) brightness(${(1 - 0.18 * g).toFixed(3)})`;
    ring($("#hear-r1"), T, 26.25, 834, 356, 30, 190, 0.9);
    ring($("#hear-r2"), T, 27.15, 834, 356, 30, 190, 0.9);
    wave($("#hear-w0"), $("#hear-w1"), T, quiet ? 0 : 44 * (1 - 0.35 * p(T, 27.6, 0.8, E.in)), 800);
    $("#hear-w1").setAttribute("stroke", quiet ? "#ffffff" : "#3ad8fb");
    $("#hear-w1").style.opacity = quiet ? 0.6 : 1;
    B.show($("#hear-l1"), T, 25.95, Infinity, { from: { y: 30 } });
    B.show($("#hear-l2"), T, 27.38, Infinity, { from: { y: 60, blur: 12 }, din: 0.55 });
  }

  // ---- 6. Sans le voir ------------------------------------------------------------------------
  function see(lt, el, T) {
    const img = $("#see-img");
    load(img, "../work/stills/girl.jpg");
    const shot = $("#see-shot");
    place(img, -8, 0, 1936);
    shot.style.transformOrigin = "1240px 860px"; // ses mains sur le braille
    shot.style.transform = `scale(${lerp(1.0, 1.2, E.soft(lt / 4)).toFixed(4)})`;
    const [b0, b1] = TL.blur;
    const u = p(T, b0, 0.5, E.inOut) * (1 - p(T, b1 - 0.5, 0.5, E.inOut));
    shot.style.filter = u > 0.002 ? `blur(${(u * 38).toFixed(2)}px) brightness(${(1 - 0.22 * u).toFixed(3)})` : "none";
    wave($("#see-w0"), $("#see-w1"), T, 40 + 14 * u, 800);
    B.show($("#see-l1"), T, 30.8, Infinity, { from: { y: 30 } });
    B.show($("#see-l2"), T, 31.5, Infinity, { from: { y: 60, blur: 12 }, din: 0.55 });
  }

  // ---- 7. À la maison -------------------------------------------------------------------------
  function mom(lt, el, T) {
    frame(I("mom-shot"), "s7", lt);
    $("#mom-shot").style.transform = `scale(${lerp(1, 1.05, lt / 7.8).toFixed(4)})`;
    B.show($("#mom-chip"), T, 34.9, 37.6, { from: { x: -60, y: 0 }, to: { x: -60, y: 0 } });
    $("#mom-scrim").style.opacity = lerp(0.55, 1, p(T, 39.3, 0.5));
    B.stagger(words($("#mom-q")), T, 39.55, 0.13, Infinity, { from: { y: 46, blur: 8 } });
    mark($("#mom-mark"), T, 40.9, 0.5);
  }

  // ---- 8. Elle essaie autre chose : le vrai site sur son écran, puis on y entre ---------------
  function pivotScene(lt, el, T) {
    frame(I("pivot-shot"), "s8", lt);
    const q = DATA.quads[clamp(Math.floor(lt * FPS + 1e-4), 0, DATA.quads.length - 1)];
    const t = clamp((T - 45.3) / 0.85), u = t * t * t;
    const full = [[0, 0], [W, 0], [W, H], [0, H]];
    const quad = q.map((c, i) => [lerp(c[0], full[i][0], u), lerp(c[1], full[i][1], u)]);
    const el2 = $("#pivot-pin");
    pin(el2, 1600, 900, quad);
    el2.style.filter = `brightness(${lerp(1.12, 1, u).toFixed(3)}) blur(${lerp(0.7, 0, clamp(u * 4)).toFixed(2)}px)`;
    $("#pivot-sheen").style.opacity = 1 - u;
    const cx = (q[0][0] + q[2][0]) / 2, cy = (q[0][1] + q[2][1]) / 2;
    const shot = $("#pivot-shot");
    shot.style.transformOrigin = `${cx.toFixed(1)}px ${cy.toFixed(1)}px`;
    shot.style.transform = `scale(${(lerp(1, 1.03, clamp(lt / 3)) * (1 + 4.6 * u)).toFixed(4)})`;
    shot.style.filter = u > 0.002 ? `blur(${(u * 18).toFixed(2)}px)` : "none";
    $("#pivot-vig").style.opacity = 1 - u;
  }

  // ---- 9. Evo, Mon Répétiteur Virtuel ---------------------------------------------------------
  function brand(lt, el, T) {
    const out = p(T, 49.28, 0.32, E.in);
    const burst = clamp((T - 46.15) / 0.7);
    B.set($("#brand-burst"), { s: lerp(0.5, 2.6, E.out(burst)), o: 1 - E.soft(burst) });
    const a = p(T, 46.18, 0.55);
    B.set($("#brand-evo"), { s: lerp(1.3, 1, a), o: clamp(a * 2.2) * (1 - out), blur: 22 * (1 - a), x: -260 * out });
    const ws = words($("#brand-sub"));
    [47.08, 47.28, 47.92].forEach((t0, i) => B.show(ws[i], T, t0, 49.28, { from: { y: 44, blur: 8 }, to: { x: -260, y: 0 }, dout: 0.32 }));
    B.show($("#brand-line"), T, 48.45, 49.28, { from: { y: 30 }, to: { x: -260, y: 0 }, dout: 0.32 });
    const ph = p(T, 46.3, 0.95, E.back);
    B.set($("#brand-phone"), { y: lerp(340, 0, ph) - 16 * clamp((T - 47.2) / 2.4), r: lerp(8, 0, ph), o: clamp((T - 46.3) / 0.25) * (1 - out), x: 240 * out });
    [330, 470, 610].forEach((r, i) => {
      const e = $("#brand-r" + (i + 1)), k = p(T, 46.45 + i * 0.14, 0.9);
      const rr = r * lerp(0.7, 1, k) * (1 + 0.02 * lt);
      rect(e, 1444 - rr, 540 - rr, rr * 2, rr * 2);
      e.style.opacity = k * (1 - out);
    });
  }

  // ---- 10. La démonstration, sur la vraie interface -------------------------------------------
  const STEPS = [[49.6, "1", "Sa question"], [51.3, "2", "L’explication"], [54.1, "3", "L’exercice"], [56.2, "4", "Encore, et encore"]];
  function demo(lt, el, T) {
    const inn = p(T, 49.6, 0.55), out = p(T, 59.0, 0.3, E.in);
    B.set($("#demo-all"), { x: lerp(240, 0, inn) - 240 * out, o: clamp(inn * 2) * (1 - out) });
    // Grâce : d'abord de profil devant l'écran, puis de face quand elle s'y met.
    const img = $("#demo-img"), second = after(T, 54.2);
    if (second) { frame(img, "s9b", T - 54.2); place(img, -1000, -135, W); }
    else { frame(img, "s9a", lt); place(img, -1150, -135, W); }
    // Le repère d'étape change avec la voix.
    let k = 0;
    STEPS.forEach((s, i) => { if (after(T, s[0])) k = i; });
    const n = $("#demo-step-n"), l = $("#demo-step-l");
    if (n.textContent !== STEPS[k][1]) { n.textContent = STEPS[k][1]; l.textContent = STEPS[k][2]; }
    const su = p(T, STEPS[k][0], 0.4);
    B.set($("#demo-step"), { y: lerp(34, 0, su), o: su });

    // La conversation : question, Evo écrit, l'explication avec le bâton de manioc.
    const back = p(T, 54.0, 0.5, E.inOut) * (1 - p(T, 56.0, 0.45, E.inOut));
    B.set($("#demo-chat"), { y: lerp(120, 0, p(T, 49.75, 0.6)), o: p(T, 49.75, 0.35) * lerp(1, 0.55, back), s: lerp(1, 0.86, back), x: -30 * back });
    const bubble = (id, t0, ox) => {
      const e = $("#" + id), a = p(T, t0, 0.42, E.back);
      e.style.transformOrigin = ox;
      B.set(e, { s: lerp(0.7, 1, a), y: lerp(26, 0, a), o: clamp((T - t0) / 0.14) });
    };
    bubble("chat-q1", 50.3, "100% 100%");
    const dots = $("#chat-dots"), typing = T >= 51.0 && !after(T, 51.65);
    dots.style.opacity = typing ? 1 : 0;
    $$("#chat-dots i").forEach((d, i) => { d.style.transform = `translateY(${(-6 * Math.max(0, Math.sin((T - 51.0) * 9 - i * 0.9))).toFixed(2)}px)`; });
    bubble("chat-a1", 51.65, "0% 100%");
    const h1 = p(T, 52.55, 0.3, E.inOut), h2 = p(T, 52.8, 0.3, E.inOut);
    $("#chat-hl1").style.width = px(66 * CK * h1); $("#chat-hl1").style.opacity = T < 51.9 ? 0 : 0.5;
    $("#chat-hl2").style.width = px(58 * CK * h2); $("#chat-hl2").style.opacity = T < 51.9 ? 0 : 0.5;
    bubble("chat-q2", 53.5, "100% 100%");
    // Les réponses rapides : « Encore un exemple », touchée dix fois.
    let count = 0, pulse = 0;
    TEN.forEach((t0) => { if (after(T, t0)) { count++; pulse = Math.max(pulse, 1 - clamp((T - t0) / 0.12)); } });
    ["chat-chip0", "chat-chip1", "chat-chip2"].forEach((id, i) => {
      const a = p(T, 53.85 + i * 0.09, 0.4);
      B.set($("#" + id), { y: lerp(20, 0, a), o: a * (i === 1 || T < 56.2 ? 1 : lerp(1, 0.45, p(T, 56.2, 0.3))), s: i === 1 ? 1 - 0.07 * pulse : 1 });
    });
    const tapEl = $("#demo-tap");
    let lastTap = -1; TEN.forEach((t0) => { if (T >= t0) lastTap = t0; });
    ring(tapEl, T, lastTap, TAP[0], TAP[1], 30, 120, 0.35);
    if (lastTap < 0) tapEl.style.opacity = 0;

    // « Un exemple de chez elle » : l'étiquette part du mot surligné.
    const no = p(T, 53.85, 0.25, E.in);
    B.draw($("#demo-note-wire"), T, 52.9, 0.35);
    $("#demo-note-wire").style.opacity = T < 52.9 ? 0 : 1 - no;
    B.show($("#demo-note-chip"), T, 53.05, 53.85, { from: { x: -40, y: 0 }, to: { x: 60, y: 0 }, dout: 0.25 });

    B.stagger(words($("#demo-say1")), T, 50.05, 0.12, 51.2, { from: { y: 40, blur: 8 }, to: { x: 80, y: 0 }, dout: 0.22 });
    B.stagger(words($("#demo-say2")), T, 51.38, 0.14, 53.88, { from: { y: 40, blur: 8 }, to: { x: 80, y: 0 }, dout: 0.22 });

    // L'exercice : la carte arrive, le curseur choisit, le niveau monte.
    const qi = p(T, 54.05, 0.6), qo = p(T, 55.95, 0.35, E.in);
    B.set($("#demo-quiz"), { x: lerp(760, 0, qi) + 760 * qo, o: clamp((T - 54.05) / 0.2) * (1 - qo), s: 1 - 0.015 * Math.sin(Math.PI * clamp((T - 55.0) / 0.22)) });
    $("#quiz-b").style.opacity = after(T, 55.0) ? 1 : 0;
    ring($("#demo-click"), T, 55.0, QC[0], QC[1], 24, 150, 0.55);
    B.show($("#demo-level"), T, 55.12, 55.95, { from: { y: 40 }, to: { x: 300, y: 0 }, din: 0.4, dout: 0.3 });
    const cur = $("#demo-cursor");
    B.cursor(cur, T, [[54.3, 1780, 960], [54.92, QC[0] - 6, QC[1] - 4], [55.25, QC[0] - 6, QC[1] - 4], [55.95, 1900, 780]], [55.0]);
    cur.style.opacity = clamp((T - 54.3) / 0.15) * (1 - clamp((T - 55.7) / 0.25));

    // Dix fois. Personne ne soupire.
    const tn = $("#demo-ten-n"), txt = "×" + Math.max(1, count);
    if (tn.textContent !== txt) tn.textContent = txt;
    const ti = p(T, TEN[0], 0.3);
    B.set(tn, { o: ti, s: (1 + 0.1 * pulse) * lerp(0.8, 1, ti) });
    B.stagger(words($("#demo-ten-l")), T, 57.5, 0.16, Infinity, { from: { y: 30, blur: 6 } });
  }

  // ---- 11. Pour chaque élève, dès le départ ---------------------------------------------------
  function access(lt, el, T) {
    const out = p(T, 65.88, 0.32, E.in);
    const boy = $("#acc-boy"), girl = $("#acc-girl");
    load($("#acc-boy-img"), "../work/stills/boy.jpg"); load($("#acc-girl-img"), "../work/stills/girl.jpg");
    const z = 1 + 0.05 * (lt / 6.9);
    place($("#acc-boy-img"), 250 - 708 * z, -10 * z, 1416 * z);
    place($("#acc-girl-img"), 250 - 857 * z, -6 * z, 1416 * z);
    const bi = p(T, 59.7, 0.7), gi = p(T, 60.3, 0.7);
    B.set(boy, { x: lerp(-640, 0, bi) - 640 * out, o: clamp(bi * 3) });
    B.set(girl, { x: lerp(640, 0, gi) + 640 * out, o: clamp(gi * 3) });
    B.stagger(words($("#acc-h1")), T, 59.5, 0.1, 65.88, { from: { y: 40, blur: 8 } });
    B.show($("#acc-h2"), T, 64.3, 65.9, { from: { y: 40, blur: 8 } });
    mark($("#acc-mark"), T, 64.45, 0.45);
    [61.4, 62.14, 63.06, 64.05].forEach((t0, i) => {
      const row = $("#acc-row" + i), a = p(T, t0, 0.5, E.back);
      B.set(row, { y: lerp(50, 0, a) - 30 * out, o: clamp((T - t0) / 0.18) * (1 - out) });
      const tile = row.querySelector(".tile");
      tile.style.transform = `scale(${lerp(0.5, 1, a).toFixed(3)}) rotate(${lerp(-14, 0, a).toFixed(2)}deg)`;
      // Le trait relie l'outil à l'élève qu'il aide.
      const w = p(T, t0 + 0.25, 0.35, E.inOut), wire = row.querySelector(".wire"), dot = row.querySelector(".dot");
      wire.style.transformOrigin = i < 2 ? "100% 50%" : "0% 50%";
      wire.style.transform = `scaleX(${w.toFixed(3)})`;
      dot.style.transform = `scale(${p(T, t0 + 0.5, 0.3, E.back).toFixed(3)})`;
    });
  }

  // ---- 12. Ce soir-là, puis le lendemain ------------------------------------------------------
  function next(lt, el, T) {
    const A = $("#next-a"), Bn = $("#next-b");
    const ai = p(T, 66.2, 0.6), half = p(T, 68.75, 0.5, E.inOut), fullU = p(T, 69.4, 0.6, E.inOut);
    // Ce soir-là : son visage, à gauche.
    frame($("#next-a-img"), "s11a", lt);
    rect(A, lerp(-960, 0, ai) - 960 * fullU, 0, 960, H, 0);
    place($("#next-a-img"), -900, 0, W);
    B.show($("#next-l1"), T, 66.5, Infinity, { from: { y: 30 } });
    B.stagger(words($("#next-l2")), T, 67.3, 0.2, Infinity, { from: { y: 60, blur: 10 } });
    mark($("#next-mark"), T, 67.85, 0.45);
    // Le lendemain : la classe entre par la droite, puis prend tout l'écran.
    const bx = lerp(lerp(W, 960, half), 0, fullU);
    rect(Bn, bx, 0, W - bx, H, 0);
    frame($("#next-b-img"), "s11b", Math.max(0, T - 68.75));
    place($("#next-b-img"), lerp(-620, 0, fullU), 0, W);
    const chip = $("#next-chip");
    chip.style.left = px(bx + 110);
    B.show(chip, T, 69.0, 71.6, { from: { x: 60, y: 0 }, to: { x: -60, y: 0 } });
  }

  // ---- 13. Le message : trois élèves, une même phrase -----------------------------------------
  function msg(lt, el, T) {
    const u = p(T, 73.2, 0.75, E.inOut), out = p(T, 78.62, 0.38, E.in);
    const G = $("#msg-g"), gi = $("#msg-g-img");
    load(gi, `../work/frames/s11b/${String(DATA.shots.s11b).padStart(4, "0")}.jpg`);
    rect(G, lerp(0, 120, u), lerp(0, 76, u), lerp(W, 540, u), lerp(H, 540, u), 40 * u);
    const s = lerp(1, 0.62, u);
    // Les trois portraits avancent très lentement : rien ne reste figé pendant la phrase.
    const z = 1 + 0.06 * clamp((T - 73.9) / 5.1), dz = z - 1;
    place(gi, lerp(0, -505, u) - dz * 775, lerp(0, -40, u) - dz * 310, W * s * z);
    G.style.transform = `translateY(${(-420 * out).toFixed(2)}px)`; G.style.opacity = 1 - out;
    load($("#msg-b-img"), "../work/stills/boy.jpg"); load($("#msg-f-img"), "../work/stills/girl.jpg");
    place($("#msg-b-img"), -411 - dz * 681, -10 - dz * 251, 1362 * z);
    place($("#msg-f-img"), -554 - dz * 824, -dz * 228, 1362 * z);
    [["#msg-b", 73.5], ["#msg-f", 73.66]].forEach(([id, t0], i) => {
      const a = p(T, t0, 0.7);
      B.set($(id), { y: lerp(760, 0, a) - 420 * p(T, 78.66 + i * 0.04, 0.34, E.in), o: clamp((T - t0) / 0.2) * (1 - p(T, 78.66 + i * 0.04, 0.34, E.in)) });
    });
    B.stagger(words($("#msg-l1")), T, 73.75, 0.09, 78.6, { from: { y: 40, blur: 8 }, to: { y: -200 } });
    const w2 = words($("#msg-l2"));
    B.stagger(w2, T, 76.0, 0.11, 78.64, { from: { y: 34, blur: 6 }, to: { y: -200 } });
    mark($("#msg-mark"), T, 77.0, 0.5, "#b9c6e4");
    $("#msg-mark").style.opacity = 1 - out;
  }

  // ---- 14. Réservez sa place : la vraie page d'accueil, le clic, l'écran final ----------------
  const CTA = [393, 742];
  function end(lt, el, T) {
    const site = $("#end-site");
    const up = p(T, 79.0, 0.65);
    const cam = lerp(1, 1.14, p(T, 80.0, 3.3, E.inOut));
    site.style.transform = `translateY(${lerp(H, 0, up).toFixed(2)}px) scale(${cam.toFixed(4)})`;
    // « Evo » : un signal part du logo. « Un répétiteur pour chaque élève » : le titre est souligné.
    const ringEl = $("#end-ring");
    if (T < 82) ring(ringEl, T, 79.55, 300, 60, 40, 150, 0.7);
    else ring(ringEl, T, 83.3, CTA[0], CTA[1], 30, 250, 0.6);
    $("#end-under").style.width = px(806 * p(T, 80.95, 0.6, E.inOut));
    // Le curseur vient sur « Réserver ma place » et clique.
    const cur = $("#end-cursor");
    B.cursor(cur, T, [[82.25, 1180, 1010], [83.12, CTA[0] + 30, CTA[1] + 2], [84, CTA[0] + 30, CTA[1] + 2]], [83.3]);
    cur.style.opacity = clamp((T - 82.25) / 0.15);
    $("#end-press").style.opacity = 0.4 * Math.sin(Math.PI * clamp((T - 83.26) / 0.26));
    // Le bouton devient l'écran final.
    const card = $("#end-card"), c = p(T, 83.62, 0.75, E.inOut);
    const cxy = [384 + (CTA[0] - 384) * cam, 712.8 + (CTA[1] - 712.8) * cam];
    card.style.clipPath = `circle(${(c * 2100).toFixed(1)}px at ${cxy[0].toFixed(1)}px ${cxy[1].toFixed(1)}px)`;
    card.style.visibility = c <= 0 ? "hidden" : "visible";
    B.show($("#end-logo"), T, 84.0, Infinity, { from: { y: 40, s: 0.8 }, din: 0.5 });
    B.stagger(words($("#end-h")), T, 84.1, 0.14, Infinity, { from: { y: 70, blur: 12 }, din: 0.6 });
    const ua = p(T, 84.5, 0.55, E.back);
    B.set($("#end-url"), { y: lerp(50, 0, ua), o: clamp((T - 84.5) / 0.2), s: lerp(0.9, 1, ua) });
    $("#end-arrow").style.transform = `translateX(${(8 * Math.sin((T - 85) * 4) * clamp((T - 85) / 0.3)).toFixed(2)}px)`;
    const ph = p(T, 83.95, 0.95, E.back);
    B.set($("#end-phone"), { y: lerp(380, 0, ph) - 10 * clamp((T - 84.9) / 1.6), r: lerp(8, 0, ph), o: clamp((T - 83.95) / 0.25) });
    [360, 520].forEach((r, i) => {
      const e = $("#end-r" + (i + 1)), k = p(T, 84.15 + i * 0.15, 0.9);
      const rr = r * lerp(0.7, 1, k) * (1 + 0.012 * (T - 84));
      rect(e, 1464 - rr, 540 - rr, rr * 2, rr * 2);
      e.style.opacity = k;
    });
  }

  // ---- ce qui vit par-dessus toutes les scènes : sous-titres, éclairs de transition ----------
  const cap = $("#cap");
  function always(T) {
    const c = TL.captions.find((x) => T >= x.start && T < x.end);
    if (window.__pending.length > 400) window.__pending.length = 0; // aperçu : la liste ne grossit pas sans fin
    if (!c) { cap.style.opacity = 0; cap.dataset.k = ""; }
    else {
      const key = String(c.start);
      if (cap.dataset.k !== key) { cap.dataset.k = key; cap.innerHTML = c.text.replace("|", "<br>"); cap.className = c.sound ? "sound" : ""; }
      const a = p(T, c.start, 0.16, E.soft);
      B.set(cap, { o: a, y: lerp(14, 0, a) });
    }
    // Retour en arrière (la classe) et retour du son : un bref éclair blanc.
    const f = Math.max(0.55 * (1 - clamp((T - 17.4) / 0.4)) * (T >= 17.4 ? 1 : 0), 0.4 * (1 - clamp((T - TL.silence[1]) / 0.3)) * (T >= TL.silence[1] ? 1 : 0));
    $("#flash").style.opacity = f.toFixed(3);
  }

  const draws = { open, trip, doubt, class: klass, hear, see, mom, pivot: pivotScene, brand, demo, access, next, msg, end };
  B.film({
    width: W, height: H, fps: FPS, background: "#070614", duration: TL.DURATION,
    scenes: TL.scenes.map((s) => ({ ...s, draw: draws[s.id] })),
    always,
  });
})();
