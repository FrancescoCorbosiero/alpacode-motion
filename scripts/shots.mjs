/* ============================================================
   npm run shots [-- id …] — the screenshots that prove an entry (D12).
   Serves the build (run `npm run build` first) and, for each entry with
   a page (or the ids given), takes six frames while its demo scrolls
   through the screen, at 1440×900 and 390×844, and at 390×664 when the
   entry is pinned to a stage; each set becomes one sheet. Then the page
   under reduced motion, from the top to the end of its demo (the docs
   below never move), at both widths, on one more sheet:
     docs/shots/<id>/1440x900.webp, 390x844.webp, [390x664.webp], reduced.webp
   The frames at full size go to .shots/<id>/ (not in git), for a
   closer look. Any page error or console error fails the run.
   ============================================================ */
import { mkdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { costOf, isPinned, parseCatalog } from "../src/gallery/catalog.js";
import { demoIds, launch, root, serve, watchErrors } from "./lib/browser.mjs";

const FRAMES = 6;
// ms after each scroll step: a move that plays once is caught mid-way;
// a scrubbed one is shot where the scroll has put it, once it caught up.
const BETWEEN = { once: 160, scrub: 900 };
const SETTLE = 1600; // ms before the last frame: the end state

const catalog = parseCatalog(readFileSync(join(root, "catalog.md"), "utf8"));
const asked = process.argv.slice(2).filter((a) => !a.startsWith("-"));
const ids = asked.length ? asked : demoIds();

const { origin, stop } = await serve();
const browser = await launch();
const errors = [];
const today = new Date().toISOString().slice(0, 10);

/** Six frames of the page as its stage scrolls from below the fold to
 *  past the middle of the screen. */
async function frames(id, width, height, between) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "no-preference" });
  const page = await context.newPage();
  let where = `${id} ${width}x${height}`;
  const pageErrors = watchErrors(page, () => where);
  await page.goto(`${origin}/${id}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const box = await page.evaluate(() => {
    const stage = document.querySelector("[data-stage] .stage-body") ?? document.querySelector("main");
    const r = stage.getBoundingClientRect();
    return { top: r.top + scrollY, height: r.height };
  });
  const from = box.top - height * 0.8;
  const to = box.top + box.height - height * 0.55;
  const shots = [];
  for (let i = 0; i < FRAMES; i++) {
    const y = Math.max(0, Math.round(from + ((to - from) * i) / (FRAMES - 1)));
    where = `${id} ${width}x${height} frame ${i + 1}`;
    await page.evaluate((top) => window.scrollTo({ top, behavior: "instant" }), y);
    await page.waitForTimeout(i === FRAMES - 1 ? SETTLE : between);
    shots.push(await page.screenshot({ type: "png" }));
  }
  errors.push(...pageErrors);
  await context.close();
  return shots;
}

/** The page under reduced motion, down to the end of its demo (all of
 *  it, for a page without one). */
async function reduced(id, width, height) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 1, reducedMotion: "reduce" });
  const page = await context.newPage();
  const pageErrors = watchErrors(page, () => `${id} reduced ${width}`);
  await page.goto(`${origin}/${id}/`, { waitUntil: "networkidle" });
  await page.evaluate(() => document.fonts.ready);
  await page.waitForTimeout(300);
  const bottom = await page.evaluate(() => {
    const stage = document.querySelector("[data-stage]");
    return stage ? Math.ceil(stage.getBoundingClientRect().bottom + scrollY) : 0;
  });
  const shot = await page.screenshot(
    bottom ? { type: "png", fullPage: true, clip: { x: 0, y: 0, width, height: bottom } } : { type: "png", fullPage: true },
  );
  errors.push(...pageErrors);
  await context.close();
  return shot;
}

/** Lay images out on one sheet, each at its display width, captioned;
 *  shoot it, and encode it as WebP in the page (a third lighter than a
 *  JPEG of the same quality). */
async function sheet(title, images, columns) {
  const context = await browser.newContext({ viewport: { width: 400, height: 300 }, deviceScaleFactor: 1 });
  const page = await context.newPage();
  const cells = images
    .map(
      (img, i) =>
        `<figure><img src="data:image/png;base64,${img.png.toString("base64")}" style="width:${Math.round(img.display)}px"><figcaption>${img.caption ?? i + 1}</figcaption></figure>`,
    )
    .join("");
  await page.setContent(`<!doctype html><html><head><style>
    body{margin:0;padding:20px 24px 24px;background:#0b0e14;color:#f0f3f9;font:600 13px/1.4 system-ui,sans-serif;display:inline-block}
    h1{margin:0 0 14px;font-size:14px;font-weight:700}
    .grid{display:grid;grid-template-columns:repeat(${columns},max-content);gap:14px 12px;align-items:start}
    figure{margin:0}img{display:block;outline:1px solid rgba(240,243,249,.2)}
    figcaption{margin-top:5px;color:rgba(240,243,249,.7)}
  </style></head><body><h1>${title}</h1><div class="grid">${cells}</div></body></html>`);
  await page.waitForFunction(() => [...document.images].every((i) => i.complete));
  const size = await page.evaluate(() => ({ width: Math.ceil(document.body.scrollWidth), height: Math.ceil(document.body.scrollHeight) }));
  await page.setViewportSize(size);
  const png = await page.screenshot({ type: "png", fullPage: true });
  const webp = await page.evaluate(async (b64) => {
    const img = new Image();
    img.src = `data:image/png;base64,${b64}`;
    await img.decode();
    const canvas = document.createElement("canvas");
    canvas.width = img.naturalWidth;
    canvas.height = img.naturalHeight;
    canvas.getContext("2d").drawImage(img, 0, 0);
    return canvas.toDataURL("image/webp", 0.82).split(",")[1];
  }, png.toString("base64"));
  await context.close();
  return Buffer.from(webp, "base64");
}

for (const id of ids) {
  const entry = catalog.entries.get(id);
  const out = join(root, "docs/shots", id);
  const raw = join(root, ".shots", id);
  mkdirSync(out, { recursive: true });
  mkdirSync(raw, { recursive: true });
  const sizes = [
    [1440, 900, 1 / 3, 3],
    [390, 844, 1 / 2, 6],
  ];
  if (entry && isPinned(entry)) sizes.push([390, 664, 1 / 2, 6]);
  const between = entry && costOf(entry).some((c) => /^(scrub|sticky|pin|scroll)\b/.test(c)) ? BETWEEN.scrub : BETWEEN.once;
  for (const [width, height, scale, columns] of sizes) {
    const shots = await frames(id, width, height, between);
    shots.forEach((png, i) => writeFileSync(join(raw, `${width}x${height}-${i + 1}.png`), png));
    const title = `${id} · ${width}×${height} · ${FRAMES} frames as the demo scrolls through, each ${between} ms after its step, the last settled · ${today}`;
    const images = shots.map((png, i) => ({ png, display: width * scale, caption: i === FRAMES - 1 ? `${i + 1} · settled` : `${i + 1}` }));
    writeFileSync(join(out, `${width}x${height}.webp`), await sheet(title, images, columns));
    console.log(`${id}: ${width}x${height}`);
  }
  const wide = await reduced(id, 1440, 900);
  const narrow = await reduced(id, 390, 844);
  writeFileSync(join(raw, "reduced-1440.png"), wide);
  writeFileSync(join(raw, "reduced-390.png"), narrow);
  const title = `${id} · prefers-reduced-motion: reduce · down to the end of the demo, at 1440 and 390 · ${today}`;
  // The desktop at a third of its size, the phone at two thirds, so it reads.
  const images = [
    { png: wide, display: 1440 / 3, caption: "1440 wide" },
    { png: narrow, display: (390 * 2) / 3, caption: "390 wide" },
  ];
  writeFileSync(join(out, "reduced.webp"), await sheet(title, images, 2));
  console.log(`${id}: reduced`);
}

await browser.close();
stop();

if (errors.length) {
  console.error(`\n${errors.length} error(s) in the pages:`);
  errors.forEach((e) => console.error(`  ${e}`));
  process.exit(1);
}
console.log(`\nWritten: docs/shots/{${ids.join(",")}}/`);
