// Rend le film image par image (navigateur sans fenêtre + ffmpeg).
//   node video/scripts/render.js planche <sortie.jpg> <t1> <t2> ...   planche de contrôle, 3 images par ligne
//   node video/scripts/render.js image <sortie.png> <t> [nu]          une image en taille réelle (nu : sans sous-titres)
//   node video/scripts/render.js film [--jobs 3]                      le film complet, avec le son
//   node video/scripts/render.js part <de> <a> <sortie.mp4>           (interne) un tronçon
const fs = require("fs");
const path = require("path");
const { spawn, execFileSync } = require("child_process");
const { pathToFileURL } = require("url");

const ROOT = path.join(__dirname, "..");
const FILM = path.join(ROOT, "motion", "film.html");
const TL = require("../motion/timeline.js");
const FPS = TL.FPS;

function playwright() {
  for (const p of [process.env.PLAYWRIGHT_CORE, "playwright-core", path.join(ROOT, "..", "node_modules", "playwright-core")]) {
    if (!p) continue;
    try { return require(p).chromium; } catch { /* suivant */ }
  }
  throw new Error("playwright-core introuvable : npm i -D playwright-core, ou définir PLAYWRIGHT_CORE");
}

async function openFilm() {
  const chromium = playwright();
  let browser;
  try { browser = await chromium.launch({ channel: "msedge" }); }
  catch { try { browser = await chromium.launch({ channel: "chrome" }); } catch { browser = await chromium.launch(); } }
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 }, deviceScaleFactor: 1 });
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message));
  await page.goto(pathToFileURL(FILM).href + "?render");
  await page.evaluate(() => Promise.all([...document.fonts].map((f) => f.load().catch(() => null))));
  await page.evaluate(() => document.fonts.ready);
  await page.evaluate(() => Promise.all([...document.images].filter((i) => i.src).map((i) => i.decode().catch(() => null))));
  return { browser, page, errors };
}

// Une image n'est photographiée qu'une fois toutes ses images sources décodées.
const seek = (page, t) => page.evaluate(async (t) => {
  window.__pending = [];
  window.__seek(t);
  await Promise.all(window.__pending);
}, t);

async function planche(out, times) {
  const sharp = require("../../node_modules/sharp");
  const { browser, page, errors } = await openFilm();
  const w = 640, h = 360, cols = 3, tiles = [];
  for (const [i, t] of times.entries()) {
    await seek(page, +t);
    const buf = await page.screenshot({ type: "jpeg", quality: 90 });
    const label = Buffer.from(`<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}"><rect x="8" y="8" width="118" height="34" rx="8" fill="#000" fill-opacity=".75"/><text x="18" y="33" font-family="Arial" font-size="24" font-weight="700" fill="#fff">${(+t).toFixed(2)}</text></svg>`);
    tiles.push({ input: await sharp(buf).resize(w, h).composite([{ input: label }]).toBuffer(), left: (i % cols) * w, top: Math.floor(i / cols) * h });
  }
  await browser.close();
  await sharp({ create: { width: cols * w, height: Math.ceil(times.length / cols) * h, channels: 3, background: "#222" } }).composite(tiles).jpeg({ quality: 88 }).toFile(out);
  console.log("planche", out, errors.length ? "| ERREUR PAGE : " + errors[0] : "");
}

async function image(out, t, bare) {
  const { browser, page, errors } = await openFilm();
  // « nu » : sans les sous-titres incrustés, pour l'affiche du lecteur.
  if (bare) await page.addStyleTag({ content: "#capwrap{display:none!important}" });
  await seek(page, +t);
  await page.screenshot({ path: out, type: out.endsWith(".png") ? "png" : "jpeg", quality: out.endsWith(".png") ? undefined : 94 });
  await browser.close();
  console.log("image", out, errors.length ? "| ERREUR PAGE : " + errors[0] : "");
}

async function part(from, to, out) {
  const { browser, page, errors } = await openFilm();
  const ff = spawn("ffmpeg", ["-loglevel", "error", "-y", "-f", "image2pipe", "-framerate", String(FPS), "-c:v", "mjpeg", "-i", "-",
    "-c:v", "libx264", "-crf", "14", "-preset", "medium", "-pix_fmt", "yuv420p", "-color_primaries", "bt709", "-color_trc", "bt709", "-colorspace", "bt709", "-r", String(FPS), out]);
  ff.stderr.on("data", (d) => process.stderr.write(d));
  for (let f = from; f < to; f++) {
    await seek(page, f / FPS);
    const buf = await page.screenshot({ type: "jpeg", quality: 96 });
    if (!ff.stdin.write(buf)) await new Promise((r) => ff.stdin.once("drain", r));
    if ((f - from) % 120 === 0) console.log(`  ${path.basename(out)} : image ${f - from}/${to - from}`);
  }
  ff.stdin.end();
  await new Promise((r) => ff.on("close", r));
  await browser.close();
  if (errors.length) console.log("ERREUR PAGE :", errors[0]);
}

async function film(jobs) {
  const total = Math.round(TL.DURATION * FPS), dir = path.join(ROOT, "work", "parts");
  fs.rmSync(dir, { recursive: true, force: true });
  fs.mkdirSync(dir, { recursive: true });
  const size = Math.ceil(total / jobs), files = [];
  const t0 = Date.now();
  await Promise.all(Array.from({ length: jobs }, (_, j) => new Promise((resolve, reject) => {
    const a = j * size, b = Math.min(total, a + size), out = path.join(dir, `part${j}.mp4`);
    files[j] = out;
    const p = spawn(process.execPath, [__filename, "part", String(a), String(b), out], { stdio: "inherit", env: process.env });
    p.on("close", (code) => (code === 0 ? resolve() : reject(new Error("tronçon " + j + " en échec"))));
  })));
  const list = path.join(dir, "list.txt");
  fs.writeFileSync(list, files.map((f) => `file '${f.replace(/\\/g, "/")}'`).join("\n"));
  const out = path.join(ROOT, "out", "evo-film-master.mp4");
  execFileSync("ffmpeg", ["-v", "error", "-y", "-f", "concat", "-safe", "0", "-i", list, "-i", path.join(ROOT, "out", "evo-film-audio.wav"),
    "-c:v", "copy", "-c:a", "aac", "-b:a", "256k", "-movflags", "+faststart", "-shortest", out]);
  console.log("film :", out, total, "images,", ((Date.now() - t0) / 60000).toFixed(1), "min");
}

(async () => {
  const [cmd, ...rest] = process.argv.slice(2);
  if (cmd === "planche") await planche(rest[0], rest.slice(1));
  else if (cmd === "image") await image(rest[0], rest[1], rest[2] === "nu");
  else if (cmd === "part") await part(+rest[0], +rest[1], rest[2]);
  else if (cmd === "film") await film(+(rest[rest.indexOf("--jobs") + 1] || 3) || 3);
  else console.log("commandes : planche | image | film");
})().catch((e) => { console.error(e); process.exit(1); });
