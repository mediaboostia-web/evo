// Prépare la matière du film : chaque plan devient une suite d'images à 24 i/s
// (avec ralenti si besoin), les photos sont mises à la taille, l'écran du portable
// est repéré image par image pour y poser le vrai site.
// Usage : node video/scripts/prep.js [plans|photos|ecran|donnees ...]   (défaut : tout)
const fs = require("fs");
const path = require("path");
const { spawn, execFileSync } = require("child_process");
const sharp = require("../../node_modules/sharp");

const ROOT = path.join(__dirname, "..", "..");
const SCENES = path.join(ROOT, "evo ressources", "video scenes");
const WORK = path.join(ROOT, "video", "work");
const MOTION = path.join(ROOT, "video", "motion");
const FPS = 24;
const clip = (prefix) => path.join(SCENES, fs.readdirSync(SCENES).find((f) => f.toLowerCase().startsWith(prefix.toLowerCase())));

// nom, clip, début, fin (dans le clip), durée dans le film, mode de ralenti
const SHOTS = [
  ["s1", "Scene_1", 0.0, 3.9, 7.6, "mci"],
  ["s2", "Scene_2", 0.0, 6.0, 6.0, "copy"],
  ["s3", "Scene_1", 3.9, 6.0, 4.4, "mci"],
  ["s4", "Scene_3", 0.0, 6.0, 8.2, "blend"],
  ["s7", "Scene_4", 0.0, 6.0, 7.8, "blend"],
  ["s8", "Scene_5", 0.0, 2.9, 3.75, "blend"],
  ["s9a", "Scene_5", 2.9, 6.0, 4.6, "blend"],
  ["s9b", "Scene_6", 0.0, 3.9, 5.1, "blend"],
  ["s11a", "Scene_6", 3.6, 6.0, 3.4, "blend"],
  ["s11b", "scene_7", 0.0, 6.0, 4.6, "fast"],
];

const run = (args) => new Promise((resolve, reject) => {
  const p = spawn("ffmpeg", ["-v", "error", "-y", ...args]);
  let err = "";
  p.stderr.on("data", (d) => (err += d));
  p.on("close", (code) => (code === 0 ? resolve() : reject(new Error(err.slice(-400)))));
});

async function plans(only) {
  const jobs = SHOTS.filter(([name]) => !only.length || only.includes(name)).map(([name, src, a, b, dur, mode]) => async () => {
    const dir = path.join(WORK, "frames", name);
    fs.rmSync(dir, { recursive: true, force: true });
    fs.mkdirSync(dir, { recursive: true });
    const speed = (b - a) / dur;
    const interp = {
      mci: "minterpolate=fps=24:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none",
      blend: "minterpolate=fps=24:mi_mode=blend:scd=none",
      copy: "fps=24",
      fast: "fps=24",
    }[mode];
    const t0 = Date.now();
    await run(["-ss", String(a), "-t", String(b - a), "-i", clip(src), "-an", "-vf", `setpts=PTS/${speed.toFixed(5)},${interp}`,
      "-frames:v", String(Math.round(dur * FPS)), "-q:v", "2", path.join(dir, "%04d.jpg")]);
    console.log(name, fs.readdirSync(dir).length, "images", ((Date.now() - t0) / 1000).toFixed(0) + " s");
  });
  // Deux encodages à la fois : la machine reste utilisable.
  let i = 0;
  await Promise.all([0, 1].map(async () => { while (i < jobs.length) await jobs[i++](); }));
}

async function photos() {
  const dir = path.join(WORK, "stills");
  fs.mkdirSync(dir, { recursive: true });
  const src = path.join(ROOT, "video", "sources");
  const find = (p) => path.join(src, fs.readdirSync(src).find((f) => f.startsWith(p)));
  await sharp(find("Student_with_hearing_aid")).resize(2400).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(dir, "boy.jpg"));
  await sharp(find("Student_using_headphones")).resize(2400).jpeg({ quality: 88, mozjpeg: true }).toFile(path.join(dir, "girl.jpg"));
  // Portrait de Grâce au tableau, tiré du dernier plan.
  const tmp = path.join(dir, "grace.png");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-ss", "5.7", "-i", clip("scene_7"), "-frames:v", "1", tmp]);
  await sharp(tmp).jpeg({ quality: 92 }).toFile(path.join(dir, "grace.jpg"));
  fs.rmSync(tmp);
  console.log("photos ok");
}

/** Repère les quatre coins de l'écran du portable sur chaque image du plan s8. */
async function ecran() {
  const dir = path.join(WORK, "frames", "s8");
  const files = fs.readdirSync(dir).sort();
  const S = 2; // on mesure sur une image réduite de moitié
  const raw = [];
  let seed = [560, 760];
  for (const f of files) {
    const { data, info } = await sharp(path.join(dir, f)).resize(1920 / S).raw().toBuffer({ resolveWithObject: true });
    const W = info.width, H = info.height, C = info.channels;
    const lit = (x, y) => {
      const i = (y * W + x) * C, r = data[i], g = data[i + 1], b = data[i + 2];
      return b >= r - 8 && r + g + b > 330; // blanc bleuté ou bleu clair : l'écran allumé
    };
    // Tache connexe à partir du centre de l'écran : le mur et la bouteille n'y sont pas reliés.
    const seen = new Uint8Array(W * H);
    let sx = Math.round(seed[0] / S), sy = Math.round(seed[1] / S);
    search: for (let r = 0; r < 60; r++) for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      if (lit(sx + dx, sy + dy)) { sx += dx; sy += dy; break search; }
    }
    const stack = [[sx, sy]];
    seen[sy * W + sx] = 1;
    let tl = [sx, sy], tr = [sx, sy], br = [sx, sy], bl = [sx, sy], cx = 0, cy = 0, n = 0;
    while (stack.length) {
      const [x, y] = stack.pop();
      cx += x; cy += y; n++;
      if (x + y < tl[0] + tl[1]) tl = [x, y];
      if (x + y > br[0] + br[1]) br = [x, y];
      if (x - y > tr[0] - tr[1]) tr = [x, y];
      if (x - y < bl[0] - bl[1]) bl = [x, y];
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1], [x + 2, y], [x - 2, y], [x, y + 2], [x, y - 2]]) {
        if (nx < 0 || ny < 0 || nx >= W || ny >= H || seen[ny * W + nx] || !lit(nx, ny)) continue;
        seen[ny * W + nx] = 1;
        stack.push([nx, ny]);
      }
    }
    seed = [(cx / n) * S, (cy / n) * S];
    raw.push([tl, tr, br, bl].map(([x, y]) => [x * S, y * S]));
  }
  // Lissage dans le temps (fenêtre de 7 images), puis léger débord pour couvrir tout l'écran.
  const quads = raw.map((_, i) => {
    const a = Math.max(0, i - 3), b = Math.min(raw.length - 1, i + 3);
    const q = [0, 1, 2, 3].map((k) => {
      let x = 0, y = 0;
      for (let j = a; j <= b; j++) { x += raw[j][k][0]; y += raw[j][k][1]; }
      return [x / (b - a + 1), y / (b - a + 1)];
    });
    const mx = q.reduce((s, p) => s + p[0], 0) / 4, my = q.reduce((s, p) => s + p[1], 0) / 4;
    return q.map(([x, y]) => [+(mx + (x - mx) * 1.022).toFixed(1), +(my + (y - my) * 1.022).toFixed(1)]);
  });
  fs.writeFileSync(path.join(WORK, "quads.json"), JSON.stringify(quads));
  console.log("écran :", quads.length, "images | première", JSON.stringify(quads[0]), "| dernière", JSON.stringify(quads[quads.length - 1]));
}

/** Rassemble ce que le film lit : nombre d'images par plan, coins de l'écran, boîtes de l'interface, icônes. */
function donnees() {
  const shots = {};
  for (const [name] of SHOTS) {
    const dir = path.join(WORK, "frames", name);
    shots[name] = fs.existsSync(dir) ? fs.readdirSync(dir).length : 0;
  }
  const quadsFile = path.join(WORK, "quads.json");
  const quads = fs.existsSync(quadsFile) ? JSON.parse(fs.readFileSync(quadsFile, "utf8")) : [];
  const boxes = JSON.parse(fs.readFileSync(path.join(MOTION, "ui", "boxes.json"), "utf8"));
  // Les icônes du site (Phosphor), pour que le film parle le même langage visuel.
  const defs = path.join(ROOT, "node_modules", "@phosphor-icons", "react", "dist", "defs");
  const icons = {};
  for (const name of ["ClosedCaptioning", "HandWaving", "SpeakerHigh", "DotsSix", "ArrowRight", "Check", "ArrowsClockwise", "EarSlash", "EyeSlash"]) {
    const src = fs.readFileSync(path.join(defs, name + ".es.js"), "utf8");
    const bold = src.slice(src.indexOf('"bold"'), src.indexOf('"duotone"'));
    icons[name] = [...bold.matchAll(/d:\s*"([^"]+)"/g)].map((m) => m[1]);
  }
  fs.writeFileSync(path.join(MOTION, "data.js"), "window.EVO_DATA = " + JSON.stringify({ shots, quads, boxes, icons }) + ";\n");
  console.log("data.js :", JSON.stringify(shots));
}

(async () => {
  const args = process.argv.slice(2);
  const steps = args.filter((a) => ["plans", "photos", "ecran", "donnees"].includes(a));
  const only = args.filter((a) => /^s\d/.test(a));
  const all = !steps.length;
  if (all || steps.includes("plans")) await plans(only);
  if (all || steps.includes("photos")) await photos();
  if (all || steps.includes("ecran")) await ecran();
  if (all || steps.includes("donnees")) donnees();
})().catch((e) => { console.error(e); process.exit(1); });
