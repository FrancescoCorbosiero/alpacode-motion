/* ============================================================
   mark-underline — an underline is drawn across.
   Markup: data-mark="underline" on the words (the phrase can wrap,
   each line gets its own stroke); data-mark-delay="0.4" waits that many
   seconds once it's on screen.
   Below the fold only (_marks.ts): once, after its delay, the line is
   drawn across, left to right. The same sweep as the highlight: its CSS
   decides it's a line.
   Sources: A src/lib/landing/scenes.ts:189; CSS A src/styles/landing.css:234.
   ============================================================ */
import type { Kit } from "../core/kit";
import { sweep } from "./_marks";

export const hook = '[data-mark="underline"]';

export function init(kit: Kit): void {
  sweep(kit, hook);
}
