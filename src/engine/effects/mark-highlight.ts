/* ============================================================
   mark-highlight — a highlighter sweeps across the words as they
   enter; scrubbed, it keeps pace with the scroll.
   Markup: data-mark="highlight" on the words (a span or a mark: the
   phrase can wrap, each line gets its own band); data-mark-scrub ties
   the sweep to the scroll (C's), data-mark-delay="0.4" waits that many
   seconds once it's on screen.
   Below the fold only (_marks.ts): once, after its delay, the band
   grows across, left to right. Scrubbed, it grows and shrinks with the
   scroll; inside a data-scrub statement it arrives with its word. The
   band is its CSS: --mark-sweep says how far across it is.
   Sources: A src/lib/landing/scenes.ts:172, :198;
   C src/scripts/motion.ts:948 (data-hl), CSS src/styles/sections.css:578.
   ============================================================ */
import type { Kit } from "../core/kit";
import { sweep } from "./_marks";

export const hook = '[data-mark="highlight"]';

export function init(kit: Kit): void {
  sweep(kit, hook);
}
