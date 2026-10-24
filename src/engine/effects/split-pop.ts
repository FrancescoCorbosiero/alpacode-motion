/* ============================================================
   split-pop — a heading's words jump in with a spring, a scale and a
   random tilt.
   Markup: data-split="pop" on a heading.
   Below the fold only, once, as the heading enters (_headings.ts). Each
   word springs up from a little below and smaller, tilted at random,
   overshoots and settles, one after the other: the liveliest of the
   headings. A uses it only when asked for (alpacode's cycle leaves it
   out); C deals it in turn, which is a setting of split-cycle. In the
   deck split-cycle deals from.
   Sources: A src/lib/motion.ts:562; C src/scripts/motion.ts:372.
   ============================================================ */
import { gsap } from "gsap";
import type { Kit } from "../core/kit";
import { addMove, enter, splitHeading, type HeadingMove } from "./_headings";

export const hook = '[data-split="pop"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 46; // px: how far below its place each word starts (A and C)
const SCALE = 0.6; // how small each word starts (A and C)
const TILT = 10; // degrees: each word starts tilted at random, up to this either way (A 10, C 12)
const DURATION = 0.9; // s: how long each word takes (A and C)
const STAGGER = 0.05; // s between words (A and C)
const EASE = "back.out(2)"; // the spring: it overshoots, then settles (A back.out(2), C back.out(2.2))

/** The move, also for headings dealt it in turn. */
export const move: HeadingMove = {
  split: { type: "words,lines" },
  play: (split, scrollTrigger) => {
    // One tilt per word, the same for the wait and the start of the move.
    const tilts = split.words.map(() => gsap.utils.random(-TILT, TILT));
    return enter(
      split.words,
      { opacity: 0, y: RISE, scale: SCALE, rotation: (i: number) => tilts[i] ?? 0 },
      { opacity: 1, y: 0, scale: 1, rotation: 0, duration: DURATION, ease: EASE, stagger: STAGGER },
      scrollTrigger,
    );
  },
};
addMove("pop", hook, move);

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => splitHeading(el, move));
}
