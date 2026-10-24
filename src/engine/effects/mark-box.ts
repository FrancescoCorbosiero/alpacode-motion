/* ============================================================
   mark-box — a box drawn in one stroke round the word, corners
   overshooting.
   Markup: data-mark="box" on a word or two, holding its SVG (a viewBox
   of 100 stretched round the word, its static box: the end state
   without JS); data-mark-delay="0.4" waits that many seconds once it's
   on screen.
   Below the fold only (_marks.ts): once, after its delay, the box is
   redrawn at the word's own size (_loops.ts), its corners overshooting,
   seeded by the word, and drawn round it in one stroke. Redrawn on
   resize. Lazy: fetched only by a page that has a box, with DrawSVG.
   Sources: A src/lib/landing/scenes.ts:144, :157, :172.
   ============================================================ */
import type { Kit } from "../core/kit";
import { box, loops } from "./_loops";

export const hook = '[data-mark="box"]';

export function init(kit: Kit): void {
  loops(kit, hook, box);
}
