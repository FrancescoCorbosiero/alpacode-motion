/* ============================================================
   kicker — a kicker label fades in while its strut draws in.
   Markup: data-kicker on the label above a heading, whose strut is its
   ::before (kicker.css scales it by --kick).
   Below the fold only, once, as it enters: the label fades in while the
   strut grows from its left edge. A pseudo-element can't be tweened, so
   the strut follows --kick (0 → 1), a custom property on the label.
   When it has landed, the label is the stylesheet's again.
   The port also leaves a kicker inside a CSS intro alone (A doesn't
   check).
   Sources: A src/lib/motion.ts:645; CSS A src/styles/base.css:112.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-kicker]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1; // s: how long the label and its strut take (A)
const EASE = "power4.out"; // fast out, a long soft end (A)
const START = "top 90%"; // where a kicker counts as entering (A)

export function init(kit: Kit): void {
  const kickers = kit.query(hook).filter((el) => !skipIntro(el) && !inFirstView(el));
  kickers.forEach((el) => {
    el.setAttribute("data-motion-pending", "");
    gsap.fromTo(
      el,
      { "--kick": 0, opacity: 0 },
      {
        "--kick": 1,
        opacity: 1,
        duration: DURATION,
        ease: EASE,
        scrollTrigger: { trigger: el, start: START, once: true },
        onStart: () => el.removeAttribute("data-motion-pending"),
        onComplete: () => {
          el.style.removeProperty("--kick");
          el.style.removeProperty("opacity");
        },
      },
    );
  });
  kit.cleanup(() => kickers.forEach((el) => el.removeAttribute("data-motion-pending")));
}
