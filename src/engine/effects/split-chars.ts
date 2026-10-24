/* ============================================================
   split-chars — a heading's letters rise and settle one by one.
   Markup: data-split="chars" on a heading: a short one, a word or two.
   Below the fold only, once, as the heading enters (_headings.ts). The
   letters fade up from a little below their line, one after the other;
   the words stay whole, so a line never breaks inside one. Asked for by
   name it plays on any heading; split-cycle deals it only to a short
   one (and words to a longer one). In the deck split-cycle deals from.
   Not C's chars, which drop from above: that is split-drop.
   Sources: A src/lib/motion.ts:553.
   ============================================================ */
import type { Kit } from "../core/kit";
import { addMove, enter, splitHeading, type HeadingMove } from "./_headings";

export const hook = '[data-split="chars"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 60; // %: how far below its place each letter starts, of its own height (A)
const DURATION = 0.7; // s: how long each letter takes (A)
const STAGGER = 0.022; // s between letters (A)
const EASE = "power3.out"; // a quick rise, a soft landing (A)

/** The move, also for headings dealt it in turn. */
export const move: HeadingMove = {
  split: { type: "chars,words" },
  play: (split, scrollTrigger) =>
    enter(split.chars, { opacity: 0, yPercent: RISE }, { opacity: 1, yPercent: 0, duration: DURATION, ease: EASE, stagger: STAGGER }, scrollTrigger),
};
addMove("chars", hook, move);

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => splitHeading(el, move));
}
