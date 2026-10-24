/* ============================================================
   npm run smoke — the core's lifecycle, checked in a real browser on
   the build (run `npm run build` first):
   - soft navigations through Astro's ClientRouter tear a page down and
     build the next one (no reload, no leftovers, no errors);
   - below the fold, blocks wait hidden; in the first view, nothing does;
   - a block shows at once when keyboard focus lands in it;
   - the replay rebuilds a page; switching reduced motion on mid-visit
     puts everything in its end state, and off again rebuilds it;
   - scrollToTarget runs its `done` on arrival; the scroll lock stops
     the page (and Lenis with it) until the overlay lets go.
   Prints each check; any failure or page error fails the run.
   ============================================================ */
import { launch, serve, watchErrors } from "./lib/browser.mjs";

const { origin, stop } = await serve();
const browser = await launch();
const context = await browser.newContext({ viewport: { width: 1440, height: 900 }, reducedMotion: "no-preference" });
const page = await context.newPage();
let step = "start";
const errors = watchErrors(page, () => step);
let failed = 0;

function check(name, ok, detail = "") {
  console.log(`${ok ? "ok  " : "FAIL"} ${name}${detail ? ` (${detail})` : ""}`);
  if (!ok) failed++;
}
const count = (selector) => page.evaluate((s) => document.querySelectorAll(s).length, selector);
const settle = (ms = 400) => page.waitForTimeout(ms);
/** Follow a link the way a visitor does: the ClientRouter takes it. */
async function navigate(href) {
  step = `navigate ${href}`;
  await page.evaluate(() => (window.__visit = window.__visit ?? Math.random()));
  const visit = await page.evaluate(() => window.__visit);
  await page.click(`a[href="${href}"]`);
  await page.waitForURL(`**${href}`);
  await page.waitForFunction(() => document.readyState === "complete");
  await settle(600);
  return (await page.evaluate(() => window.__visit)) === visit;
}

/* The index: nothing to reveal, the CSS intro only. */
step = "index";
await page.goto(`${origin}/`, { waitUntil: "networkidle" });
await settle();
check("the index starts with motion on", await page.evaluate(() => document.documentElement.classList.contains("has-motion")));
check("nothing is hidden on the index", (await count("[data-motion-pending]")) === 0);

/* Soft navigation to an entry. */
const soft = await navigate("/reveal/");
check("index → /reveal/ is a soft navigation", soft);
const pending = await count("[data-motion-pending]");
check("below the fold, the blocks wait hidden", pending === 7, `${pending} pending`);
check(
  "the hidden blocks are hidden by the script, not the CSS",
  await page.evaluate(() => [...document.querySelectorAll("[data-motion-pending]")].every((el) => el.style.opacity === "0")),
);

/* Keyboard first: focus lands in a waiting block. */
step = "focus";
await page.evaluate(() => document.querySelector(".rv-lede a")?.focus());
await settle(500);
check(
  "a waiting block shows at once when focus lands inside it",
  await page.evaluate(() => {
    const lede = document.querySelector(".rv-lede");
    return !!lede && !lede.hasAttribute("data-motion-pending") && getComputedStyle(lede).opacity === "1";
  }),
);

/* Scrolling the demo in reveals the rest, and hands control back. */
step = "scroll";
await page.evaluate(() => document.querySelector("[data-stage] .rv-grid")?.scrollIntoView({ block: "center" }));
await settle(2200);
check("scrolled in, every block has landed", (await count("[data-motion-pending]")) === 0);
check(
  "control is back with the stylesheet (no inline opacity or transform)",
  await page.evaluate(() => [...document.querySelectorAll(".rv-card")].every((el) => !el.style.opacity && !el.style.transform)),
);

/* Replay: back to the top, rebuilt, glides down again. */
step = "replay";
await page.click("[data-replay]");
await settle(150);
check("replay hides the blocks again", (await count("[data-motion-pending]")) === 7);
await settle(3000);
const glided = await page.evaluate(() => {
  const stage = document.querySelector("[data-stage]").getBoundingClientRect();
  return Math.abs(stage.top) < 120;
});
const after = await count("[data-motion-pending]");
check("…glides down to the demo, and the blocks on screen land again", glided && after < 7, `${after} still below`);

/* Reduced motion switched on mid-visit, from a fresh load at the top. */
step = "reduced on";
// A new history entry: the router would restore the last one's scroll.
await page.goto(`${origin}/reveal/?fresh`, { waitUntil: "networkidle" });
await settle(300);
check("a fresh load at the top: the blocks wait", (await count("[data-motion-pending]")) === 7);
await page.emulateMedia({ reducedMotion: "reduce" });
await settle(400);
check("reduced motion on: motion off", !(await page.evaluate(() => document.documentElement.classList.contains("has-motion"))));
check(
  "reduced motion on: every block in its end state",
  (await count("[data-motion-pending]")) === 0 &&
    (await page.evaluate(() => [...document.querySelectorAll(".rv-card")].every((el) => getComputedStyle(el).opacity === "1"))),
);
check("reduced motion on: Lenis is gone", !(await page.evaluate(() => document.documentElement.classList.contains("lenis"))));
step = "reduced off";
await page.emulateMedia({ reducedMotion: "no-preference" });
await settle(400);
check("reduced motion off again: rebuilt", (await count("[data-motion-pending]")) === 7);

/* On through the router: the old page's split is gone, the new one splits. */
step = "split-lines";
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await settle(200);
check("→ /split-lines/ via the catalog, softly", (await navigate("/")) && (await navigate("/split-lines/")));
check(
  "below the fold, the heading is split at init and its lines wait in their masks",
  await page.evaluate(() => {
    const lines = [...document.querySelectorAll("[data-split] .split-line")];
    return lines.length > 0 && lines.every((l) => getComputedStyle(l).transform !== "none");
  }),
);
check("no block of the last page is left waiting", (await count("[data-motion-pending]")) === 0);
await page.evaluate(() => document.querySelector("[data-split]")?.scrollIntoView({ block: "center" }));
await settle(1800);
const lines = await count(".split-line");
check("the heading is split into lines", lines >= 2, `${lines} lines`);
check(
  "the first heading's lines have risen",
  await page.evaluate(() =>
    [...document.querySelector("[data-split]").querySelectorAll(".split-line")].every((l) =>
      ["none", "matrix(1, 0, 0, 1, 0, 0)"].includes(getComputedStyle(l).transform),
    ),
  ),
);

step = "scrub";
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await settle(200);
check("→ /scrub/ softly", (await navigate("/")) && (await navigate("/scrub/")));
check("the split headings of the last page are gone", (await count(".split-line")) === 0);
const words = await count(".scrub-word");
check("the statement is split into words", words > 10, `${words} words`);
const dim = await page.evaluate(() => getComputedStyle(document.querySelector(".scrub-word")).opacity);
check("before it is read, its words are dim", Number(dim) < 0.3, `opacity ${dim}`);
await page.evaluate(() => {
  const s = document.querySelector("[data-scrub]");
  window.scrollTo({ top: s.getBoundingClientRect().bottom + scrollY - innerHeight * 0.3, behavior: "instant" });
});
await settle(1500);
const lit = await page.evaluate(() => {
  const w = [...document.querySelectorAll(".scrub-word")];
  return getComputedStyle(w[w.length - 1]).opacity;
});
check("read to the end, its last word is lit", Number(lit) > 0.95, `opacity ${lit}`);

/* The heading cycle: bare headings dealt in turn, an asked one kept, its
   neighbour dealt past it. Each move leaves its trace in the split. */
step = "split-cycle";
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await settle(200);
check("→ /split-cycle/ softly", (await navigate("/")) && (await navigate("/split-cycle/")));
const dealt = await page.evaluate(() =>
  [...document.querySelectorAll("[data-stage] h2[data-split]")].map((h) => {
    if (h.querySelector(".split-line-mask")) return "lines";
    if (h.querySelector(".split-word-mask")) return "words";
    if (h.querySelector(".split-char")) return "chars";
    const line = h.querySelector(".split-line");
    if (!line) return "none";
    if (line.style.clipPath) return "wipe";
    if (line.style.filter) return "blur";
    return "?";
  }),
);
const expected = ["lines", "wipe", "words", "blur", "chars", "wipe", "words"];
check(
  "bare headings are dealt in turn, the asked one keeps its move, its neighbour isn't dealt it again",
  dealt.join() === expected.join(),
  dealt.join(", "),
);
// A jump down the page starts five headings at once: while the letters
// play, the ones whose turn hasn't come keep their start state (a
// staggered from() lost it now and then: the letters flashed).
await page.evaluate(() => {
  const h = [...document.querySelectorAll("[data-stage] h2[data-split]")][4];
  window.scrollTo({ top: h.getBoundingClientRect().top + scrollY - innerHeight * 0.7, behavior: "instant" });
});
let stripped = 0;
for (let k = 0; k < 4; k++) {
  await page.waitForTimeout(30);
  stripped += await page.evaluate(() => {
    const h = [...document.querySelectorAll("[data-stage] h2[data-split]")][4];
    return [...h.querySelectorAll(".split-char")].filter((c) => c.style.opacity === "").length;
  });
}
check("after a jump, the letters waiting their turn stay hidden until it comes", stripped === 0, `${stripped} lost their start`);

/* The core page: scroll to, with done; the scroll lock. */
step = "core";
await page.evaluate(() => window.scrollTo({ top: 0, behavior: "instant" }));
await settle(200);
check("→ /core/ softly", await navigate("/core/"));
await page.evaluate(() => document.querySelector("[data-try-glide]")?.scrollIntoView({ block: "center" }));
await settle(500);
await page.click("[data-try-glide]");
check("done hasn't run before arrival", !(await page.evaluate(() => document.querySelector("[data-try-target]")?.classList.contains("is-arrived"))));
await settle(2200);
check("scrollToTarget ran done on arrival", await page.evaluate(() => document.querySelector("[data-try-target]")?.classList.contains("is-arrived")));
await page.evaluate(() => document.querySelector("[data-try-lock]")?.scrollIntoView({ block: "center" }));
await settle(500);
await page.click("[data-try-lock]");
await settle(200);
check("the lock stops Lenis", await page.evaluate(() => document.documentElement.classList.contains("lenis-stopped")));
const y0 = await page.evaluate(() => scrollY);
await page.mouse.move(40, 450);
await page.mouse.wheel(0, 900);
await settle(600);
check("…and the page doesn't move under the wheel", (await page.evaluate(() => scrollY)) === y0);
const list = await page.locator(".sheet-list").boundingBox();
await page.mouse.move(list.x + list.width / 2, list.y + list.height / 2);
await page.mouse.wheel(0, 400);
await settle(400);
check("…while the overlay's own pane scrolls natively", (await page.evaluate(() => document.querySelector(".sheet-list").scrollTop)) > 0);
await page.keyboard.press("Escape");
await settle(200);
check(
  "closing the overlay lets the page go",
  await page.evaluate(() => !document.documentElement.classList.contains("lenis-stopped") && document.body.style.overflow === ""),
);

await browser.close();
stop();

if (errors.length) {
  console.error(`\n${errors.length} page error(s):`);
  errors.forEach((e) => console.error(`  ${e}`));
}
if (failed || errors.length) process.exit(1);
console.log("\nAll good.");
