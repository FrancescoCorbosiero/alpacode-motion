/* ============================================================
   split-words — a heading's words pop up out of their own masks,
   slightly tilted.
   Markup: data-split="words" on a heading.
   Below the fold only, once, as the heading enters (_headings.ts). Each
   word rises out of a mask of its own, leaning a little, and
   straightens as it lands; the next follows a beat later, so the
   heading builds up as it is read. It holds up on long headings, which
   is why split-cycle deals it to a heading too long for letters. In
   the deck split-cycle deals from.
   Sources: A src/lib/motion.ts:533.
   ============================================================ */
import type { Kit } from "../core/kit";
import { addMove, enter, splitHeading, type HeadingMove } from "./_headings";

export const hook = '[data-split="words"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 110; // %: how far each word rises, of its own height (A)
const TILT = 4; // degrees each word leans as it rises (A)
const DURATION = 0.9; // s: how long each word takes (A)
const STAGGER = 0.035; // s between words (A)
const EASE = "power3.out"; // a quick rise, a soft landing (A)

/** The move, also for headings dealt it in turn. */
export const move: HeadingMove = {
  split: { type: "words,lines", mask: "words" },
  play: (split, scrollTrigger) =>
    enter(
      split.words,
      { yPercent: RISE, rotation: TILT },
      { yPercent: 0, rotation: 0, duration: DURATION, ease: EASE, stagger: STAGGER },
      scrollTrigger,
    ),
};
addMove("words", hook, move);

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => splitHeading(el, move));
}
