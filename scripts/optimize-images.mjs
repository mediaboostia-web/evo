/**
 * Prépare les images du site à partir des sources brutes.
 *
 *   npm run images
 *
 * - Photos 2K de « evo ressources/ »  ->  public/images/*.jpg (2000 px max, mozjpeg)
 * - Logo, mascotte, écran d'app       ->  public/brand/*.png
 *
 * next/image se charge ensuite de servir chaque image en AVIF/WebP,
 * à la taille exacte de l'écran du visiteur.
 */
import { mkdir, readdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import sharp from "sharp";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const rawDir = path.join(root, "evo ressources");
const legacyAssets = path.join(root, "refonte", "assets");
const outImages = path.join(root, "public", "images");
const outBrand = path.join(root, "public", "brand");

/** Préfixe du fichier source -> nom web (kebab-case, descriptif pour le SEO). */
const photos = [
  ["Girl_looking_at_laptop", "eleve-revise-le-soir"],
  ["Girl_studying_at_laptop", "eleve-revise-ordinateur"],
  ["Boy_doing_mathematics_exercise", "eleve-exercice-mathematiques"],
  ["Student_studying_at_desk", "eleve-etudie-bureau"],
  ["Student_writing_mathematics", "eleve-ecrit-cahier"],
  ["Teacher_explaining_lesson", "enseignant-explique-lecon"],
  ["Mother_and_daughter_doing_homework", "mere-fille-devoirs"],
];

await mkdir(outImages, { recursive: true });
await mkdir(outBrand, { recursive: true });

const rawFiles = await readdir(rawDir);

for (const [prefix, name] of photos) {
  const file = rawFiles.find((f) => f.startsWith(prefix));
  if (!file) {
    console.warn(`source introuvable : ${prefix}`);
    continue;
  }
  const out = path.join(outImages, `${name}.jpg`);
  const info = await sharp(path.join(rawDir, file))
    .rotate()
    .resize({ width: 2000, withoutEnlargement: true })
    .jpeg({ quality: 80, mozjpeg: true })
    .toFile(out);
  console.log(`${name}.jpg  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);
}

const report = (name, info) =>
  console.log(`${name}  ${info.width}x${info.height}  ${(info.size / 1024).toFixed(0)} Ko`);

// Logo : marges transparentes retirées pour qu'il occupe toute sa hauteur dans l'en-tête.
report(
  "evo-logo.png",
  await sharp(path.join(legacyAssets, "evo-logo.png"))
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(path.join(outBrand, "evo-logo.png")),
);

// Écran d'app (fond transparent).
report(
  "evo-app-phone.png",
  await sharp(path.join(legacyAssets, "evo-app-phone.png"))
    .trim()
    .png({ compressionLevel: 9 })
    .toFile(path.join(outBrand, "evo-app-phone.png")),
);

// Mascotte sur son fond clair d'origine (pastilles, icônes).
const mascotSrc = path.join(legacyAssets, "evo-mascot.png");
report(
  "evo-mascot.png",
  await sharp(mascotSrc).png({ compressionLevel: 9 }).toFile(path.join(outBrand, "evo-mascot.png")),
);

// Mascotte détourée : le fond clair est rendu transparent par remplissage depuis les bords,
// ce qui préserve les reflets blancs à l'intérieur du robot.
{
  const { data, info } = await sharp(mascotSrc).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
  const { width, height } = info;
  // Le fond est un blanc bleuté très clair (R 228-241, V 240-245, B 252-255).
  const isBackground = (i) => data[i] >= 214 && data[i + 1] >= 230 && data[i + 2] >= 244;
  const mask = Buffer.alloc(width * height, 255);
  const queue = [];
  for (let x = 0; x < width; x++) queue.push(x, (height - 1) * width + x);
  for (let y = 0; y < height; y++) queue.push(y * width, y * width + width - 1);
  while (queue.length) {
    const p = queue.pop();
    if (mask[p] === 0 || !isBackground(p * 4)) continue;
    mask[p] = 0;
    const x = p % width;
    if (x + 1 < width) queue.push(p + 1);
    if (x > 0) queue.push(p - 1);
    if (p + width < width * height) queue.push(p + width);
    if (p - width >= 0) queue.push(p - width);
  }
  // Masque adouci puis resserré d'un demi-pixel : pas de liseré clair sur fond sombre.
  const alpha = await sharp(mask, { raw: { width, height, channels: 1 } })
    .blur(0.9)
    .linear(2.2, -150)
    .extractChannel(0)
    .raw()
    .toBuffer();
  for (let p = 0; p < width * height; p++) data[p * 4 + 3] = alpha[p];
  report(
    "evo-mascot-cutout.png",
    await sharp(data, { raw: { width, height, channels: 4 } })
      .png({ compressionLevel: 9 })
      .toFile(path.join(outBrand, "evo-mascot-cutout.png")),
  );
}

// Icônes du site (favicon, écran d'accueil) : la mascotte sur son fond clair.
const appDir = path.join(root, "src", "app");
const iconBase = sharp(mascotSrc).resize({
  width: 512,
  height: 512,
  fit: "contain",
  background: "#ebf3fe",
});
report("icon.png", await iconBase.clone().resize(256, 256).png().toFile(path.join(appDir, "icon.png")));
report("apple-icon.png", await iconBase.clone().resize(180, 180).png().toFile(path.join(appDir, "apple-icon.png")));
report("icon-192.png", await iconBase.clone().resize(192, 192).png().toFile(path.join(outBrand, "icon-192.png")));
report("icon-512.png", await iconBase.clone().png().toFile(path.join(outBrand, "icon-512.png")));
