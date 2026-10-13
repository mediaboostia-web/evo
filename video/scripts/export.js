// Livre le film au site : version web allégée, affiche du lecteur, sous-titres.
// Usage : node video/scripts/export.js      (après « node video/scripts/render.js film »)
const fs = require("fs");
const path = require("path");
const { execFileSync } = require("child_process");
const sharp = require("../../node_modules/sharp");
const TL = require("../motion/timeline.js");

const ROOT = path.join(__dirname, "..");
const PUBLIC = path.join(ROOT, "..", "public", "video");
const master = path.join(ROOT, "out", "evo-film-master.mp4");
fs.mkdirSync(PUBLIC, { recursive: true });

// 1. Version web : 1080p, débit plafonné pour rester légère sur une connexion mobile.
const web = path.join(PUBLIC, "evo-presentation.mp4");
execFileSync("ffmpeg", ["-v", "error", "-y", "-i", master, "-c:v", "libx264", "-preset", "slow", "-crf", "24", "-maxrate", "1700k", "-bufsize", "3400k",
  "-profile:v", "high", "-pix_fmt", "yuv420p", "-g", "48", "-c:a", "aac", "-b:a", "160k", "-ac", "2", "-movflags", "+faststart", web]);

// 2. Affiche du lecteur : Grâce devant le vrai site, sans sous-titre incrusté.
const tmp = path.join(ROOT, "work", "affiche.png");
execFileSync(process.execPath, [path.join(__dirname, "render.js"), "image", tmp, "44.2", "nu"], { stdio: "inherit", env: process.env });
sharp(tmp).jpeg({ quality: 84, mozjpeg: true }).toFile(path.join(PUBLIC, "evo-presentation-affiche.jpg"));

// 3. Sous-titres au format WebVTT (les mêmes que ceux incrustés), pour YouTube ou un autre lecteur.
const ts = (t) => { const h = Math.floor(t / 3600), m = Math.floor(t / 60) % 60, s = (t % 60).toFixed(3).padStart(6, "0"); return `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${s}`; };
const vtt = "WEBVTT\n\n" + TL.captions.map((c, i) => `${i + 1}\n${ts(c.start)} --> ${ts(c.end)}\n${c.text.replace("|", "\n")}\n`).join("\n");
fs.writeFileSync(path.join(PUBLIC, "evo-presentation.fr.vtt"), vtt);

const mb = (f) => (fs.statSync(f).size / 1048576).toFixed(1) + " Mo";
console.log("web :", mb(web), "| maître :", mb(master), "| sous-titres :", TL.captions.length, "répliques");
