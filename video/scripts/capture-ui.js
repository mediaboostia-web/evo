// Capture la vraie interface du site (serveur local ou en ligne) pour le film.
// Rien n'est redessiné : chaque bulle, chaque carte est une capture du site.
// Usage : node video/scripts/capture-ui.js [url]   (défaut : http://localhost:3000)
const fs = require("fs");
const path = require("path");
const { chromium } = require(process.env.PLAYWRIGHT_CORE || "playwright-core");

const URL = process.argv[2] || "http://localhost:3000";
const OUT = path.join(__dirname, "..", "motion", "ui");
fs.mkdirSync(OUT, { recursive: true });
// En développement, Next.js affiche une pastille dans le coin : elle ne fait pas partie du site.
const HIDE_DEV = "nextjs-portal{display:none!important}";

(async () => {
  const browser = await chromium.launch({ channel: "msedge" });
  const boxes = {};

  // 1. Cartes de démonstration, à 3 pixels par point pour rester nettes une fois agrandies.
  const ctx = await browser.newContext({ viewport: { width: 1440, height: 1000 }, deviceScaleFactor: 3, reducedMotion: "reduce" });
  const page = await ctx.newPage();
  await page.goto(URL, { waitUntil: "networkidle" });
  await page.addStyleTag({ content: HIDE_DEV });
  await page.evaluate(() => document.fonts.ready);

  const rel = async (root, loc) => {
    const a = await root.boundingBox(), b = await loc.boundingBox();
    return { x: +(b.x - a.x).toFixed(1), y: +(b.y - a.y).toFixed(1), w: +b.width.toFixed(1), h: +b.height.toFixed(1) };
  };
  const snap = async (loc, name) => { await loc.screenshot({ path: path.join(OUT, name + ".png") }); };

  // Conversation
  const chat = page.locator('[aria-label^="Illustration d\'une conversation"]').first();
  await chat.scrollIntoViewIfNeeded();
  await page.waitForTimeout(900);
  const cb = await chat.boundingBox();
  boxes.chat = { w: cb.width, h: cb.height, parts: {} };
  const parts = {
    head: chat.locator("> div > div").first(),
    q1: chat.locator("p.self-end").nth(0),
    a1: chat.locator("div.self-start > div").first(),
    q2: chat.locator("p.self-end").nth(1),
    chip0: chat.locator("ul > li").nth(0),
    chip1: chat.locator("ul > li").nth(1),
    chip2: chat.locator("ul > li").nth(2),
  };
  for (const [k, loc] of Object.entries(parts)) {
    boxes.chat.parts[k] = await rel(chat, loc);
    await snap(loc, "chat-" + k);
  }
  await snap(chat, "chat-full");

  // Exercice : avant et après la bonne réponse
  const quiz = page.locator("div.on-light", { hasText: "Exercice 4/10" }).first();
  await quiz.scrollIntoViewIfNeeded();
  await page.waitForTimeout(500);
  const qb = await quiz.boundingBox();
  boxes.quiz = { w: qb.width, h: qb.height, parts: {} };
  const right = quiz.locator("button", { hasText: /^1$/ }).first();
  boxes.quiz.parts.right = await rel(quiz, right);
  await snap(quiz, "quiz-a");
  await right.click();
  await page.mouse.move(5, 5);
  await page.waitForTimeout(900);
  await snap(quiz, "quiz-b");

  // Tableau de bord du parent
  const dash = page.locator('[aria-label^="Illustration du tableau de bord parent"]').first();
  await dash.scrollIntoViewIfNeeded();
  await page.waitForTimeout(1600);
  const db = await dash.boundingBox();
  boxes.dash = { w: db.width, h: db.height };
  await snap(dash, "dash");
  await ctx.close();

  // 2. Le haut de la page d'accueil, tel qu'un visiteur le voit (écran final du film).
  const ctx2 = await browser.newContext({ viewport: { width: 1600, height: 900 }, deviceScaleFactor: 2, reducedMotion: "reduce" });
  const p2 = await ctx2.newPage();
  await p2.goto(URL, { waitUntil: "networkidle" });
  await p2.addStyleTag({ content: HIDE_DEV });
  await p2.evaluate(() => document.fonts.ready);
  await p2.waitForTimeout(1500);
  await p2.screenshot({ path: path.join(OUT, "hero.png") });
  const cta = p2.locator("main a", { hasText: "Réserver ma place" }).first();
  const b = await cta.boundingBox();
  boxes.hero = { w: 1600, h: 900, cta: { x: b.x, y: b.y, w: b.width, h: b.height } };
  const h1 = await p2.locator("h1").first().boundingBox();
  boxes.hero.h1 = { x: h1.x, y: h1.y, w: h1.width, h: h1.height };
  await ctx2.close();

  fs.writeFileSync(path.join(OUT, "boxes.json"), JSON.stringify(boxes, null, 1));
  console.log(JSON.stringify(boxes));
  await browser.close();
})().catch((e) => { console.error(e); process.exit(1); });
