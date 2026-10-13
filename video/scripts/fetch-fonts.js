// Télécharge les polices du site (Gabarito, Atkinson Hyperlegible) pour le film.
const fs = require("fs");
const path = require("path");

const OUT = path.join(__dirname, "..", "motion", "fonts");
const BASE = "https://raw.githubusercontent.com/google/fonts/main/ofl/";
const files = {
  "Gabarito.ttf": "gabarito/Gabarito%5Bwght%5D.ttf",
  "AtkinsonHyperlegible-Regular.ttf": "atkinsonhyperlegible/AtkinsonHyperlegible-Regular.ttf",
  "AtkinsonHyperlegible-Bold.ttf": "atkinsonhyperlegible/AtkinsonHyperlegible-Bold.ttf",
};

(async () => {
  fs.mkdirSync(OUT, { recursive: true });
  for (const [name, url] of Object.entries(files)) {
    const res = await fetch(BASE + url);
    if (!res.ok) throw new Error(name + " : " + res.status);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(path.join(OUT, name), buf);
    console.log(name, buf.length);
  }
})().catch((e) => { console.error(e); process.exit(1); });
