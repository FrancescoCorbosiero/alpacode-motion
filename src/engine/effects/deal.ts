/* ============================================================
   deal — cards land like a dealt hand, from alternate sides, tilted,
   with a bounce.
   Markup: data-deal on the list: its children are the cards.
   Below the fold only, once, in batches as they enter (_batch.ts): each
   card comes up from below, from one side then the other, tilted the
   way it came, and lands straight with a little overshoot. The cards
   wait marked data-motion-pending, with opacity, not visibility, so
   focus can land in them (FAST hides them with autoAlpha).
   Sources: FAST fast/src/lib/motion.ts:35 (.fx-cards > li).
   ============================================================ */
import { gsap } from "gsap";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";
import { batchIn } from "./_batch";

export const hook = "[data-deal]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 70; // px: how far below its place a card starts (FAST)
const SHIFT = 30; // px: how far to the side, one side then the other (FAST)
const TILT = 5; // degrees: how far it starts tilted, the way it came (FAST)
const DURATION = 0.9; // s: how long a card takes to land (FAST)
const STAGGER = 0.09; // s between the cards of a batch (FAST)
const EASE = "back.out(1.5)"; // the landing's small overshoot (FAST)
const START = "top 92%"; // where a card counts as entering (FAST)

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    const cards = gsap.utils.toArray<HTMLElement>(root.children);
    const waiting = cards.filter((card) => !skipIntro(card) && !inFirstView(card));
    waiting.forEach((card) => {
      const side = cards.indexOf(card) % 2 ? 1 : -1;
      gsap.set(card, { opacity: 0, y: RISE, x: SHIFT * side, rotation: TILT * side });
    });
    batchIn(kit, waiting, START, { opacity: 1, x: 0, y: 0, rotation: 0, duration: DURATION, ease: EASE, stagger: STAGGER });
  });
}
