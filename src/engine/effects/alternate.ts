/* ============================================================
   alternate — rows slide in from alternate sides.
   Markup: data-alternate on the list: its children are the rows.
   Below the fold only, once, in batches as they enter (_batch.ts): the
   first row slides in from the left, the next from the right, and so
   on. The rows wait marked data-motion-pending, with opacity, not
   visibility, so focus can land in them (A hides them with autoAlpha).
   The page clips its sides (alternate.css).
   Sources: A src/lib/landing/scenes.ts:736 (the scene trades).
   ============================================================ */
import { gsap } from "gsap";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";
import { batchIn } from "./_batch";

export const hook = "[data-alternate]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SHIFT = 120; // px: how far to the side a row starts, left then right (A)
const DURATION = 0.9; // s: how long a row takes to land (A)
const STAGGER = 0.08; // s between the rows of a batch (A)
const START = "top 92%"; // where a row counts as entering (A)

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    if (skipIntro(root) || inFirstView(root)) return;
    const rows = gsap.utils.toArray<HTMLElement>(root.children);
    rows.forEach((row, i) => gsap.set(row, { x: i % 2 ? SHIFT : -SHIFT, opacity: 0 }));
    batchIn(kit, rows, START, { x: 0, opacity: 1, duration: DURATION, ease: "power3.out", stagger: STAGGER });
  });
}
