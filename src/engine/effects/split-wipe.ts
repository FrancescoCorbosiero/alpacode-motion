/* ============================================================
   split-wipe — each line of a heading is uncovered left to right.
   Markup: data-split="wipe" on a heading.
   Below the fold only, once, as the heading enters (_headings.ts). Each
   line is a clip that opens in the direction it is read, one after the
   other; the clip reaches a fifth of a line above and below it, so
   accents and descenders are never cut. When it has opened, the clip
   is gone and the line is plain text again. In the deck split-cycle
   deals from.
   Sources: A src/lib/motion.ts:527; C src/scripts/motion.ts:383.
   ============================================================ */
import type { Kit } from "../core/kit";
import { addMove, enter, splitHeading, type HeadingMove } from "./_headings";

export const hook = '[data-split="wipe"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1.3; // s: how long each line takes to open (A 1.3, C 1.2)
const STAGGER = 0.12; // s between lines (A and C)
const EASE = "power3.inOut"; // eases in and out: the line is drawn open, not flung (A and C)
const BLEED = "-20%"; // how far the clip reaches above and below a line (A and C)

/** The move, also for headings dealt it in turn. */
export const move: HeadingMove = {
  split: { type: "lines" },
  play: (split, scrollTrigger) =>
    enter(
      split.lines,
      { clipPath: `inset(${BLEED} 100% ${BLEED} 0%)` },
      { clipPath: `inset(${BLEED} 0% ${BLEED} 0%)`, duration: DURATION, ease: EASE, stagger: STAGGER, clearProps: "clipPath" },
      scrollTrigger,
    ),
};
addMove("wipe", hook, move);

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => splitHeading(el, move));
}
