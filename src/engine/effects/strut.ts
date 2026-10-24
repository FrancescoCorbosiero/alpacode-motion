/* ============================================================
   strut — a bar draws itself in from the left.
   Markup: data-strut on a bar (a rule, the strut above a step).
   Below the fold only, once, as it enters: it grows from nothing at its
   left edge to its full length. When it has, its transform is the
   stylesheet's again. Decorative: nothing waits for it.
   Sources: A src/lib/motion.ts:633.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-strut]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1.2; // s: how long a bar takes to draw (A)
const EASE = "power4.out"; // fast out, a long soft end (A)
const START = "top 92%"; // where a bar counts as entering (A)

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    if (skipIntro(el) || inFirstView(el)) return;
    gsap.from(el, {
      scaleX: 0,
      transformOrigin: "left center",
      duration: DURATION,
      ease: EASE,
      clearProps: "transform,transformOrigin",
      scrollTrigger: { trigger: el, start: START, once: true },
    });
  });
}
