/* ============================================================
   hand — a margin note is written in, then its arrow is drawn.
   Markup: data-hand on the note (inline-block or block: the clip is
   its box), its arrow, if any, an SVG inside it.
   Below the fold only, once, as it enters: the note is uncovered left
   to right, as if written, a little past its edges so the hand's
   flourishes show; before it's done, its arrow is drawn from its tail
   to its head. Notes inside a scene are written by its timeline. The
   note waits marked data-motion-pending. Also writeHand(el), for a
   scene or a page script. Lazy: fetched only by a page that has a
   note, with DrawSVG (the arrow).
   Sources: A src/lib/landing/scenes.ts:229, :241.
   ============================================================ */
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

export const hook = "[data-hand]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const WRITE = 0.8; // s: how long the note takes to be written in (A)
const ARROW = 0.45; // s: how long its arrow takes (A)
const OVERLAP = 0.35; // s: the arrow starts this long before the note is done (A)
const START = "top 88%"; // where a note counts as entering (A)

const HIDDEN = "inset(-30% 100% -30% -8%)";
const WRITTEN = "inset(-30% -8% -30% -8%)";

/** Write a margin note in, then draw its arrow. */
export function writeHand(el: HTMLElement, at = 0): gsap.core.Timeline {
  const arrow = el.querySelector<SVGPathElement>("svg path");
  const tl = gsap.timeline({ delay: at });
  tl.fromTo(el, { clipPath: HIDDEN }, { clipPath: WRITTEN, duration: WRITE, ease: "power2.out", clearProps: "clipPath" });
  if (arrow) tl.fromTo(arrow, { drawSVG: "0%" }, { drawSVG: "100%", duration: ARROW, ease: "power2.out" }, `-=${OVERLAP}`);
  return tl;
}

export function init(kit: Kit): void {
  const notes = kit.query(hook).filter((el) => !el.closest("[data-scene]") && !skipIntro(el) && !inFirstView(el));
  notes.forEach((el) => {
    gsap.set(el, { clipPath: HIDDEN });
    el.setAttribute("data-motion-pending", "");
    ScrollTrigger.create({
      trigger: el,
      start: START,
      once: true,
      onEnter: () => {
        el.removeAttribute("data-motion-pending");
        writeHand(el);
      },
    });
  });
  kit.cleanup(() => notes.forEach((el) => el.removeAttribute("data-motion-pending")));
}
