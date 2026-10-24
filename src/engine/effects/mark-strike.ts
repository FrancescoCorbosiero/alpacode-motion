/* ============================================================
   mark-strike — a strike-through is drawn across.
   Markup: data-mark="strike" on the words (the phrase can wrap, each
   line gets its own stroke); data-mark-delay="0.4" waits that many
   seconds once it's on screen.
   Below the fold only (_marks.ts): once, after its delay, the stroke is
   drawn across the words, left to right. The same sweep as the
   highlight: its CSS decides it's a stroke. Not the pinned rewrite
   scene (a title struck out and written anew: rewrite, tier 2).
   Sources: A src/lib/landing/scenes.ts:189; CSS A src/styles/landing.css:237.
   ============================================================ */
import type { Kit } from "../core/kit";
import { sweep } from "./_marks";

export const hook = '[data-mark="strike"]';

export function init(kit: Kit): void {
  sweep(kit, hook);
}
