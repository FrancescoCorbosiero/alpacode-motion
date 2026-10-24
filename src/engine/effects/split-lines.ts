/* ============================================================
   split-lines — each line of a heading rises out of its mask.
   Markup: data-split="lines" on a heading.
   Below the fold only, once, as the heading enters (_headings.ts). The
   lines are measured where they wrap, so the move follows the layout
   at every width and splits again when the fonts arrive. It is also in
   the deck split-cycle deals from: the first move of the cycle.
   Sources: A src/lib/motion.ts:573; C src/scripts/motion.ts:410.
   ============================================================ */
import type { Kit } from "../core/kit";
import { addMove, enter, splitHeading, type HeadingMove } from "./_headings";

export const hook = '[data-split="lines"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 115; // %: how far each line rises, of its own height (A and C)
const DURATION = 1.15; // s: how long each line takes (A and C)
const STAGGER = 0.085; // s between lines (A 0.085, C 0.09)
const EASE = "power4.out"; // the long, soft landing (A and C)

/** The move, also for headings dealt it in turn. */
export const move: HeadingMove = {
  split: { type: "lines", mask: "lines" },
  play: (split, scrollTrigger) =>
    enter(split.lines, { yPercent: RISE }, { yPercent: 0, duration: DURATION, ease: EASE, stagger: STAGGER }, scrollTrigger),
};
addMove("lines", hook, move);

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => splitHeading(el, move));
}
