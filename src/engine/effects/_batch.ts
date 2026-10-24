/* ============================================================
   What the batched reveals share (alternate, deal; reveal does the
   same): the elements were hidden at init and are marked pending (the
   core shows one at once when keyboard focus lands in it); one
   ScrollTrigger.batch hands them over as they enter. A jump (an anchor,
   find-in-page) hands over every element it skipped in one batch: the
   ones already above the screen show at once, the rest play; one that
   focus has already shown is left to that. A batch plays in page order:
   the elements of a row share a trigger position, and the sorted
   triggers keep no order among equals (the cards of a row landed out
   of turn). When an element has landed, the stylesheet has it back.
   Not an entry.
   Sources: A src/lib/motion.ts:600 (the jump), src/lib/landing/scenes.ts:736;
   FAST fast/src/lib/motion.ts:35.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

/** For sort(): a before b when a comes first in the page. */
export const inPageOrder = (a: Element, b: Element): number =>
  a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1;

export function batchIn(kit: Kit, elements: HTMLElement[], start: string, to: gsap.TweenVars): void {
  if (!elements.length) return;
  elements.forEach((el) => el.setAttribute("data-motion-pending", ""));
  kit.cleanup(() => elements.forEach((el) => el.removeAttribute("data-motion-pending")));
  ScrollTrigger.batch(elements, {
    start,
    once: true,
    onEnter: (batch) => {
      const waiting = (batch as HTMLElement[])
        .filter((el) => el.hasAttribute("data-motion-pending"))
        .sort(inPageOrder);
      waiting.forEach((el) => el.removeAttribute("data-motion-pending"));
      const passed = waiting.filter((el) => el.getBoundingClientRect().bottom < 0);
      const entering = waiting.filter((el) => !passed.includes(el));
      if (passed.length) gsap.set(passed, { overwrite: true, clearProps: "opacity,transform" });
      if (entering.length) gsap.to(entering, { ...to, overwrite: true, clearProps: "opacity,transform" });
    },
  });
}
