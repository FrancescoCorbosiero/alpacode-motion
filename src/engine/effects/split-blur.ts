/* ============================================================
   split-blur — a heading's lines come into focus while drifting up.
   Markup: data-split="blur" on a heading.
   Below the fold only, once, as the heading enters (_headings.ts). Each
   line fades in from a blur, a little below its place, one after the
   other. The blur is the dearest variant to paint (a filter on every
   frame): when a line has landed the filter is gone. In the deck
   split-cycle deals from.
   Sources: A src/lib/motion.ts:542; C src/scripts/motion.ts:399.
   ============================================================ */
import type { Kit } from "../core/kit";
import { addMove, enter, splitHeading, type HeadingMove } from "./_headings";

export const hook = '[data-split="blur"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const BLUR = 14; // px: how blurred a line starts (A and C)
const RISE = 28; // px: how far below its place a line starts (A and C)
const DURATION = 1.2; // s: how long each line takes (A and C)
const STAGGER = 0.1; // s between lines (A and C)
const EASE = "power2.out"; // a soft landing (A and C)

/** The move, also for headings dealt it in turn. */
export const move: HeadingMove = {
  split: { type: "lines" },
  play: (split, scrollTrigger) =>
    enter(
      split.lines,
      { opacity: 0, y: RISE, filter: `blur(${BLUR}px)` },
      { opacity: 1, y: 0, filter: "blur(0px)", duration: DURATION, ease: EASE, stagger: STAGGER, clearProps: "filter" },
      scrollTrigger,
    ),
};
addMove("blur", hook, move);

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => splitHeading(el, move));
}
