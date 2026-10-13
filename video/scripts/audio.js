// Bande-son du film, entièrement fabriquée ici : la voix est posée selon timeline.js,
// la musique (piano, nappe, arpège) et les bruitages sont synthétisés par calcul.
// Aucun échantillon tiers : pas de droits à vérifier.
// Usage : node video/scripts/audio.js   ->  video/work/audio/*.wav et video/out/evo-film-audio.wav
const fs = require("fs");
const path = require("path");
const { execFileSync, spawnSync } = require("child_process");
const TL = require("../motion/timeline.js");

const ROOT = path.join(__dirname, "..");
const OUT = path.join(ROOT, "work", "audio");
fs.mkdirSync(OUT, { recursive: true });
fs.mkdirSync(path.join(ROOT, "out"), { recursive: true });

const SR = 44100;
const D = TL.DURATION;
const N = Math.ceil((D + 0.5) * SR);
const stem = () => [new Float32Array(N), new Float32Array(N)];
const hz = (midi) => 440 * 2 ** ((midi - 69) / 12);
const panLR = (p) => [Math.cos(((p + 1) * Math.PI) / 4), Math.sin(((p + 1) * Math.PI) / 4)];

// Hasard reproductible : deux exécutions donnent exactement le même son.
let seed = 20261013;
const rnd = () => { seed |= 0; seed = (seed + 0x6d2b79f5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t; return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const noise = () => rnd() * 2 - 1;

function put(buf, t, n, pan, fn) {
  const i0 = Math.floor(t * SR), [pl, pr] = panLR(pan);
  for (let i = 0; i < n; i++) {
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    const v = fn(i, i / SR);
    buf[0][j] += v * pl;
    buf[1][j] += v * pr;
  }
}

// ---- instruments ---------------------------------------------------------------------------
/** Piano doux : partiels légèrement inharmoniques, les aigus s'éteignent plus vite. */
function piano(buf, t, midi, vel, dur = 5) {
  const f = hz(midi), B = 0.00035, tau1 = 2.3 * Math.pow(261.6 / f, 0.35);
  const parts = [];
  for (let k = 1; k <= 9; k++) {
    const fk = f * k * Math.sqrt(1 + B * k * k);
    if (fk > 8500) break;
    parts.push({ w: (2 * Math.PI * fk) / SR, a: Math.pow(k, -1.3 - (1 - vel) * 0.9), d: Math.exp(-1 / ((tau1 / Math.pow(k, 0.75)) * SR)) });
  }
  const amps = parts.map((p) => p.a);
  const n = Math.floor(dur * SR);
  put(buf, t, n, Math.max(-0.5, Math.min(0.5, (midi - 62) / 40)), (i, ts) => {
    let s = 0;
    for (let k = 0; k < parts.length; k++) { s += amps[k] * Math.sin(parts[k].w * i); amps[k] *= parts[k].d; }
    return s * Math.min(1, ts / 0.006) * Math.min(1, (dur - ts) / 0.5) * vel * 0.2;
  });
}

/** Nappe : deux sinus à peine désaccordés par note, entrée et sortie très lentes. */
function pad(buf, t, notes, dur, gain = 1, attack = 1.6) {
  notes.forEach((midi, k) => {
    const f = hz(midi), w1 = (2 * Math.PI * f * 1.0018) / SR, w2 = (2 * Math.PI * f * 0.9982) / SR, w3 = (2 * Math.PI * f * 2) / SR;
    put(buf, t, Math.floor((dur + 2) * SR), k % 2 ? 0.35 : -0.35, (i, ts) => {
      const env = Math.min(1, ts / attack) * Math.min(1, Math.max(0, (dur + 2 - ts) / 2));
      const trem = 1 + 0.08 * Math.sin(2 * Math.PI * 0.21 * ts + k);
      return (Math.sin(w1 * i) + Math.sin(w2 * i) + 0.18 * Math.sin(w3 * i)) * env * env * trem * 0.021 * gain;
    });
  });
}

/** Note pincée de l'arpège. */
function pluck(buf, t, midi, gain, pan) {
  const w = (2 * Math.PI * hz(midi)) / SR;
  put(buf, t, Math.floor(0.9 * SR), pan, (i, ts) => (Math.sin(w * i) + 0.3 * Math.sin(2 * w * i) + 0.08 * Math.sin(3 * w * i)) * Math.exp(-ts / 0.2) * Math.min(1, ts / 0.004) * gain);
}

/** Cloche : partiels non entiers, longue traîne. */
function bell(buf, t, midi, gain, pan = 0) {
  const f = hz(midi);
  const ps = [[1, 1, 1.5], [2.0, 0.42, 0.9], [3.01, 0.18, 0.5], [4.2, 0.08, 0.3]];
  put(buf, t, Math.floor(3 * SR), pan, (i, ts) => {
    let s = 0;
    for (const [m, a, tau] of ps) s += a * Math.exp(-ts / tau) * Math.sin((2 * Math.PI * f * m * i) / SR);
    return s * Math.min(1, ts / 0.003) * gain;
  });
}

/** Pulsation grave et feutrée. */
function kick(buf, t, gain) {
  let ph = 0;
  put(buf, t, Math.floor(0.5 * SR), 0, (i, ts) => {
    ph += (2 * Math.PI * (44 + 55 * Math.exp(-ts / 0.035))) / SR;
    return Math.sin(ph) * Math.exp(-ts / 0.16) * Math.min(1, ts / 0.003) * gain;
  });
}

// ---- bruitages -------------------------------------------------------------------------------
/** Souffle filtré dont la couleur glisse : le « whoosh » des transitions. */
function whoosh(buf, t, dur, f0, f1, gain, panFrom = -0.6, panTo = 0.6, shape = "bell") {
  let lo = 0, bp = 0;
  const n = Math.floor(dur * SR);
  const i0 = Math.floor(t * SR);
  for (let i = 0; i < n; i++) {
    const u = i / n, fc = f0 * Math.pow(f1 / f0, u);
    const g = 2 * Math.sin((Math.PI * fc) / SR);
    const hi = noise() - lo - 0.9 * bp; // filtre à variable d'état, sortie passe-bande
    bp += g * hi; lo += g * bp;
    const env = shape === "rise" ? u * u * u : Math.sin(Math.PI * u) ** 2;
    const [pl, pr] = panLR(panFrom + (panTo - panFrom) * u);
    const j = i0 + i;
    if (j < 0 || j >= N) continue;
    buf[0][j] += bp * env * gain * pl;
    buf[1][j] += bp * env * gain * pr;
  }
}

function tick(buf, t, f, gain, pan = 0) {
  const w = (2 * Math.PI * f) / SR;
  put(buf, t, Math.floor(0.08 * SR), pan, (i, ts) => (Math.sin(w * i) * Math.exp(-ts / 0.012) + noise() * Math.exp(-ts / 0.002) * 0.5) * gain);
}

function pop(buf, t, midi, gain, pan = 0.3) {
  let ph = 0;
  const f = hz(midi);
  put(buf, t, Math.floor(0.25 * SR), pan, (i, ts) => {
    ph += (2 * Math.PI * f * (1 + 0.45 * Math.min(1, ts / 0.05))) / SR;
    return Math.sin(ph) * Math.exp(-ts / 0.045) * Math.min(1, ts / 0.002) * gain;
  });
}

function impact(buf, t, gain) {
  let ph = 0;
  put(buf, t, Math.floor(1.6 * SR), 0, (i, ts) => {
    ph += (2 * Math.PI * (38 + 60 * Math.exp(-ts / 0.06))) / SR;
    return (Math.sin(ph) * Math.exp(-ts / 0.45) + noise() * Math.exp(-ts / 0.03) * 0.25) * Math.min(1, ts / 0.002) * gain;
  });
}

/** Bruit de fond très bas : la pièce « existe » sous les images tournées. */
function room(buf, t0, t1, gain, bright) {
  let b = 0, b2 = 0, c = 0, c2 = 0;
  const i0 = Math.floor(t0 * SR), i1 = Math.floor(t1 * SR), k = bright ? 0.06 : 0.02;
  for (let i = i0; i < i1 && i < N; i++) {
    const ts = (i - i0) / SR, te = (i1 - i) / SR;
    const env = Math.min(1, ts / 0.4) * Math.min(1, te / 0.25);
    b += k * (noise() - b); b2 += k * (b - b2);
    c += k * (noise() - c); c2 += k * (c - c2);
    buf[0][i] += b2 * env * gain * 14;
    buf[1][i] += c2 * env * gain * 14;
  }
}

// ---- réverbération (Freeverb) ------------------------------------------------------------
function reverb(buf, wet, room = 0.86, damp = 0.25) {
  const combs = [1116, 1188, 1277, 1356, 1422, 1491, 1557, 1617], alls = [556, 441, 341, 225];
  const out = stem();
  for (let ch = 0; ch < 2; ch++) {
    const spread = ch * 23, x = buf[ch], y = out[ch];
    const cb = combs.map((l) => ({ b: new Float32Array(l + spread), i: 0, s: 0 }));
    const ab = alls.map((l) => ({ b: new Float32Array(l + spread), i: 0 }));
    for (let n = 0; n < N; n++) {
      const inp = x[n] * 0.015;
      let acc = 0;
      for (const c of cb) {
        const o = c.b[c.i];
        c.s = o * (1 - damp) + c.s * damp;
        c.b[c.i] = inp + c.s * room;
        if (++c.i >= c.b.length) c.i = 0;
        acc += o;
      }
      for (const a of ab) {
        const o = a.b[a.i];
        a.b[a.i] = acc + o * 0.5;
        if (++a.i >= a.b.length) a.i = 0;
        acc = o - acc;
      }
      y[n] = x[n] + acc * wet * 3;
    }
  }
  return out;
}

// ---- 1. la voix ----------------------------------------------------------------------------
const voiceFile = path.join(ROOT, "voix", "voix-off.mp3");
const pcm = execFileSync("ffmpeg", ["-v", "error", "-i", voiceFile, "-ac", "1", "-ar", String(SR), "-af", "highpass=f=70", "-f", "f32le", "-"], { maxBuffer: 1 << 28 });
const src = new Float32Array(pcm.buffer, pcm.byteOffset, pcm.length / 4);
const voice = stem();
for (const [a, b, t] of TL.voice) {
  const i0 = Math.floor(a * SR), n = Math.floor((b - a) * SR), o = Math.floor(t * SR), fade = Math.floor(0.012 * SR);
  for (let i = 0; i < n; i++) {
    const g = Math.min(1, i / fade, (n - i) / fade);
    const v = (src[i0 + i] || 0) * g;
    voice[0][o + i] += v;
    voice[1][o + i] += v;
  }
}
// Niveau de la voix, mesuré là où elle parle, et son enveloppe pour baisser la musique dessous.
const env = new Float32Array(N);
let e = 0, sum = 0, cnt = 0;
for (let i = 0; i < N; i++) {
  const a = Math.abs(voice[0][i]);
  e += (a > e ? 0.004 : 0.00006) * (a - e); // monte en 6 ms, redescend en 0,4 s
  env[i] = e;
  if (a > 0.02) { sum += a * a; cnt++; }
}
const vRms = Math.sqrt(sum / cnt);
console.log("voix : niveau moyen", (20 * Math.log10(vRms)).toFixed(1), "dB");

// ---- 2. la musique ---------------------------------------------------------------------------
const music = stem();
const beat = 60 / 72, bar = 4 * beat;
const CH = {
  Am: { bass: [45, 52], tri: [57, 60, 64], rh: [[72, 76, 69], [76, 72, 71]] },
  F: { bass: [41, 48], tri: [57, 60, 65], rh: [[69, 72, 77], [72, 69, 67]] },
  C: { bass: [48, 55], tri: [60, 64, 67], rh: [[67, 72, 76], [76, 74, 72]] },
  G: { bass: [43, 50], tri: [59, 62, 67], rh: [[74, 71, 67], [71, 74, 79]] },
};

// Premier mouvement : la mineur, piano seul et clairsemé. Le doute.
pad(music, 0.2, [45, 52], 2.6, 0.7, 1.2);
["Am", "F", "C", "G", "Am", "F", "C", "G"].forEach((name, k) => {
  const t = 2.4 + k * bar, c = CH[name], rh = c.rh[k % 2];
  piano(music, t, c.bass[0], 0.42);
  piano(music, t + 0.02, c.bass[1], 0.3);
  piano(music, t + 1.5 * beat, rh[0], 0.36);
  piano(music, t + 2.5 * beat, rh[1], 0.3);
  if (k % 2) piano(music, t + 3 * beat, rh[2], 0.26);
  pad(music, t, c.tri.map((n) => n - 12), bar, 0.55);
});
// Après le silence : quelques notes seules, très nettes (le son est là, l'image non).
[[30.62, 76, 0.4], [31.45, 72, 0.32], [32.3, 69, 0.34], [33.1, 72, 0.3], [33.93, 77, 0.36]].forEach(([t, m, v]) => piano(music, t, m, v));
pad(music, 30.6, [45, 52, 57], 3.4, 0.7, 0.8);
// La maison : même thème, un peu plus plein.
["F", "C", "G"].forEach((name, k) => {
  const t = 33.93 + k * bar, c = CH[name], rh = c.rh[k % 2];
  piano(music, t, c.bass[0], 0.42);
  piano(music, t + 0.02, c.bass[1], 0.3);
  if (k) piano(music, t + 1.5 * beat, rh[0], 0.34);
  piano(music, t + 2.5 * beat, rh[1], 0.3);
  piano(music, t + 3.5 * beat, rh[2], 0.24);
  pad(music, t, c.tri.map((n) => n - 12), bar, 0.6);
});
// Le basculement : tout se suspend sur un accord ouvert.
pad(music, 43.6, [43, 50, 55, 60, 62], 2.4, 0.95, 2.2);
piano(music, 43.93, 43, 0.3);
piano(music, 44.76, 62, 0.24);

// Second mouvement : do majeur, mêmes notes, autre lumière. La confiance.
const M2 = 46.2;
const seq = ["C", "G", "Am", "F", "C", "G", "Am", "F", "C", "G", "F", "C"];
const low = { C: 36, G: 43, Am: 45, F: 41 };
const hope = { 0: [76, 79, 84], 6: [76, 79, 84], 7: [74, 79, 83], 8: [72, 76, 81], 9: [74, 79, 86] };
seq.forEach((name, k) => {
  const t = M2 + k * bar, c = CH[name], [a, b, d] = c.tri, last = k >= 10;
  piano(music, t, low[name], 0.5, 6);
  piano(music, t + 0.01, low[name] + 12, 0.34, 6);
  c.tri.forEach((n, j) => piano(music, t + 0.012 * j, n, k === 0 ? 0.5 : 0.36));
  if (!last) c.tri.forEach((n, j) => piano(music, t + 2 * beat + 0.012 * j, n, 0.26));
  pad(music, t, [a - 12, b - 12, d - 12, a], bar, k === 0 ? 1.1 : 0.85, 0.9);
  if (k >= 1 && !last) {
    [a, d, b + 12, d, a + 12, d, b + 12, d].forEach((n, j) => pluck(music, t + j * (beat / 2), n, j % 2 ? 0.045 : 0.062, j % 2 ? 0.45 : -0.45));
    kick(music, t, 0.2);
    kick(music, t + 2 * beat, 0.14);
  }
  if (hope[k]) hope[k].forEach((n, j) => bell(music, t + j * beat, n, k === 0 ? 0.11 : 0.06, j % 2 ? 0.3 : -0.3));
});
// Résolution : le dernier accord tombe sur « Réservez sa place ».
const end = M2 + 11 * bar;
[36, 43, 60, 64, 67, 72].forEach((n, j) => piano(music, end + 0.015 * j, n, 0.5, 6));
bell(music, end, 84, 0.1);
bell(music, end + 2 * beat, 88, 0.05, 0.3);

const musicWet = reverb(music, 0.3);

// ---- 3. les bruitages --------------------------------------------------------------------------
const sfx = stem();
// L'horloge de 19 h, avant que la musique n'entre.
[[0.15, 1900, 0.3], [0.65, 1400, 0.24], [1.15, 1900, 0.2], [1.65, 1400, 0.14], [2.15, 1900, 0.09]].forEach(([t, f, g]) => tick(sfx, t, f, g, -0.2));
whoosh(sfx, 1.95, 0.9, 300, 2400, 0.3); // les chiffres s'ouvrent sur la chambre
whoosh(sfx, 9.4, 0.4, 500, 1500, 0.16, 0.2, 0.8); // deuxième volet
whoosh(sfx, 10.3, 0.4, 500, 1700, 0.18, 0.4, 0.9); // troisième volet
whoosh(sfx, 12.75, 0.5, 900, 300, 0.2, 0.5, -0.5);
whoosh(sfx, 17.2, 0.45, 400, 2600, 0.22);
// Juste avant le silence, le son est aspiré.
whoosh(sfx, 27.95, 0.45, 2500, 180, 0.42, 0, 0, "rise");
// Le son revient d'un coup.
impact(sfx, 30.6, 0.35);
whoosh(sfx, 34.35, 0.5, 300, 1800, 0.18);
// Le basculement : montée, puis l'accord.
whoosh(sfx, 44.9, 1.28, 250, 5200, 0.55, 0, 0, "rise");
impact(sfx, 46.17, 1.0);
whoosh(sfx, 49.35, 0.5, 1800, 500, 0.2, -0.6, 0.6);
// L'interface : chaque bulle a sa note, dans l'accord du moment.
pop(sfx, 50.3, 79, 0.3, 0.4);
[51.05, 51.25, 51.45].forEach((t) => tick(sfx, t, 2600, 0.07, 0.4));
pop(sfx, 51.65, 74, 0.3, 0.3);
pop(sfx, 53.5, 81, 0.28, 0.5);
whoosh(sfx, 53.95, 0.4, 600, 2000, 0.16, 0.2, 0.7);
tick(sfx, 55.0, 2300, 0.4, 0.4); // le clic sur la bonne réponse
[84, 88, 91].forEach((n, j) => bell(sfx, 55.06 + j * 0.09, n, 0.2, 0.3));
whoosh(sfx, 56.0, 0.35, 1800, 700, 0.14, 0.7, 0.2);
// « Dix fois » : dix petites touches, de plus en plus serrées.
for (let j = 0; j < 10; j++) pop(sfx, 56.35 + 1.1 * (1 - Math.pow(1 - j / 9, 1.6)), 72 + (j % 5) * 2, 0.16, 0.4);
whoosh(sfx, 59.05, 0.5, 500, 2200, 0.2, 0.6, -0.6);
[[61.4, 76], [62.14, 79], [63.06, 84], [64.05, 88]].forEach(([t, n]) => pop(sfx, t, n, 0.26, 0));
whoosh(sfx, 65.95, 0.5, 2000, 400, 0.18);
whoosh(sfx, 68.55, 0.55, 400, 2600, 0.24, -0.5, 0.5);
whoosh(sfx, 72.95, 0.5, 2200, 500, 0.2, 0.5, -0.5);
whoosh(sfx, 78.7, 0.6, 400, 2400, 0.22);
tick(sfx, 83.3, 2300, 0.4, -0.2); // le clic sur « Réserver ma place »
[84, 91].forEach((n, j) => bell(sfx, 83.36 + j * 0.1, n, 0.16, -0.2));
// La pièce, la classe.
const amb = stem();
room(amb, 0, 17.4, 1, false);
room(amb, 17.4, TL.silence[0], 1.5, true);
room(amb, TL.silence[1], 34.6, 2.2, true);
room(amb, 34.6, 46.1, 1, false);
room(amb, 66.2, 73.2, 1, true);
const sfxWet = reverb(sfx, 0.12, 0.7, 0.4);

// ---- 4. le mélange ---------------------------------------------------------------------------
const rms = (b, t0, t1) => { let s = 0; const i0 = Math.floor(t0 * SR), i1 = Math.floor(t1 * SR); for (let i = i0; i < i1; i++) s += b[0][i] ** 2 + b[1][i] ** 2; return Math.sqrt(s / (2 * (i1 - i0))); };
const peak = (b) => { let p = 0; for (let c = 0; c < 2; c++) for (let i = 0; i < N; i++) p = Math.max(p, Math.abs(b[c][i])); return p; };
const db = (x) => 10 ** (x / 20);

const gMusic = (vRms * db(-12)) / rms(musicWet, 50, 78); // musique : 12 dB sous la voix, puis encore baissée quand elle parle
const gSfx = (vRms * db(9)) / peak(sfxWet); // la pointe la plus forte (l'accord du basculement) reste sous les pointes de la voix
const gAmb = (vRms * db(-34)) / rms(amb, 2, 16);
const ref = vRms * 0.5;
const mix = stem();
const [s0, s1] = TL.silence.map((t) => Math.floor(t * SR));
for (let i = 0; i < N; i++) {
  const t = i / SR;
  const duck = 1 - 0.6 * Math.min(1, env[i] / ref); // jusqu'à -8 dB sous la parole
  let gate = 1; // le silence voulu : zéro absolu
  if (i >= s0 && i < s1) gate = 0;
  else if (i >= s1 && t < TL.silence[1] + 0.12) gate = (t - TL.silence[1]) / 0.12;
  else if (i < s0 && t > TL.silence[0] - 0.02) gate = (TL.silence[0] - t) / 0.02;
  const tail = Math.min(1, Math.max(0, (D - 0.1 - t) / 1.6)); // fondu final
  const open = Math.min(1, t / 0.05);
  for (let c = 0; c < 2; c++) {
    mix[c][i] = (voice[c][i] + (musicWet[c][i] * gMusic * duck + sfxWet[c][i] * gSfx * (0.55 + 0.45 * duck) + amb[c][i] * gAmb) * gate * tail) * open;
  }
}

function wav(file, buf, len = Math.floor(D * SR)) {
  const data = Buffer.alloc(len * 8);
  for (let i = 0; i < len; i++) { data.writeFloatLE(buf[0][i], i * 8); data.writeFloatLE(buf[1][i], i * 8 + 4); }
  const h = Buffer.alloc(44);
  h.write("RIFF", 0); h.writeUInt32LE(36 + data.length, 4); h.write("WAVEfmt ", 8); h.writeUInt32LE(16, 16);
  h.writeUInt16LE(3, 20); h.writeUInt16LE(2, 22); h.writeUInt32LE(SR, 24); h.writeUInt32LE(SR * 8, 28);
  h.writeUInt16LE(8, 32); h.writeUInt16LE(32, 34); h.write("data", 36); h.writeUInt32LE(data.length, 40);
  fs.writeFileSync(file, Buffer.concat([h, data]));
}
const scaled = (b, g) => b.map((ch) => ch.map((v) => v * g));
wav(path.join(OUT, "voix.wav"), voice);
wav(path.join(OUT, "musique.wav"), scaled(musicWet, gMusic));
wav(path.join(OUT, "bruitages.wav"), scaled(sfxWet, gSfx));
wav(path.join(OUT, "mix.wav"), mix);

// ---- 5. niveau de diffusion : -15 LUFS, pointes limitées à -1 dB -----------------------------
const loud = (file) => {
  const r = spawnSync("ffmpeg", ["-hide_banner", "-nostats", "-i", file, "-af", "ebur128=peak=true", "-f", "null", "-"], { encoding: "utf8" });
  const sumry = r.stderr.slice(r.stderr.lastIndexOf("Summary"));
  return { I: parseFloat(/I:\s+(-?[\d.]+) LUFS/.exec(sumry)[1]), peak: parseFloat(/Peak:\s+(-?[\d.]+) dBFS/.exec(sumry)[1]) };
};
const m = loud(path.join(OUT, "mix.wav"));
const gain = -15 - m.I;
const final = path.join(ROOT, "out", "evo-film-audio.wav");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", path.join(OUT, "mix.wav"), "-af", `volume=${gain.toFixed(2)}dB,alimiter=limit=0.89:attack=4:release=60:level=false`, "-c:a", "pcm_s24le", final]);
const f = loud(final);
console.log("mélange : avant", m.I, "LUFS, pointe", m.peak, "| après", f.I, "LUFS, pointe", f.peak);
for (const s of ["voix", "musique", "bruitages"]) console.log(" ", s, loud(path.join(OUT, s + ".wav")).I, "LUFS");
// Vérification du silence voulu.
console.log("silence (28,5 à 30,5 s) :", rms(mix, 28.5, 30.5) === 0 ? "zéro absolu" : "PAS SILENCIEUX " + rms(mix, 28.5, 30.5));
