/* ============================================================
   mark-circle — a hand-drawn loop is redrawn at the word's real size,
   then drawn round it.
   Markup: data-mark="circle" on a word or two, holding its SVG (a
   viewBox of 100 stretched round the word, its static loop: the end
   state without JS); data-mark-delay="0.4" waits that many seconds once
   it's on screen.
   Below the fold only (_marks.ts): once, after its delay, the loop is
   redrawn at the word's own size (_loops.ts) — a little more than one
   turn, never closed, seeded by the word, so each mark differs and
   stays the same on every visit — and drawn round it. Redrawn on
   resize. Lazy: fetched only by a page that has a circle, with DrawSVG.
   Sources: A src/lib/landing/scenes.ts:125, :157, :172.
   ============================================================ */
import type { Kit } from "../core/kit";
import { loop, loops } from "./_loops";

export const hook = '[data-mark="circle"]';

export function init(kit: Kit): void {
  loops(kit, hook, loop);
}
