/* ============================================================
   rail — a rail fills with the scroll (--p), the steps light up as it
   passes, each tile gives a little jolt.
   Markup: data-rail on the list's box; its fill reads --p (0 → 1) in
   the site's CSS (transform: scaleX(var(--p, 1)), or scaleY for a
   vertical rail); its steps are [data-rail-step], each with an optional
   [data-rail-tile] (its number, its icon).
   Below the fold only: from its top at 72% of the screen to its foot at
   60%, the rail's --p follows the scroll; step i of n lights up
   (.is-reached) once the fill is i/n of the way, so the last one lights
   before the end (C's lights at i/(n−1), the last at the very end: a
   setting); its tile springs back from smaller as it does.
   Scrolling back dims them again. The steps are dimmed only on a rail
   the script runs (data-rail-live: rail.css): a rail in the first view
   is left full (neither source checks, and its painted fill would
   empty at init).
   Sources: A src/lib/motion.ts:740 (data-progress); C src/scripts/motion.ts:968;
   CSS A src/styles/motion.css:178.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-rail]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const START = "top 72%"; // the rail's top here: it starts to fill (A and C)
const END = "bottom 60%"; // its foot here: it's full (A; C bottom 45%)
const LAST_AT_END = false; // false: step i of n lights at i/n, the last before the end (A); true: at i/(n−1), the last at the very end (C)

export function init(kit: Kit): void {
  kit.query(hook).forEach((rail) => {
    if (skipIntro(rail) || inFirstView(rail)) return;
    const steps = gsap.utils.toArray<HTMLElement>(rail.querySelectorAll("[data-rail-step]"));
    const span = LAST_AT_END ? Math.max(1, steps.length - 1) : steps.length;
    rail.style.setProperty("--p", "0");
    rail.setAttribute("data-rail-live", "");
    kit.cleanup(() => {
      rail.style.removeProperty("--p");
      rail.removeAttribute("data-rail-live");
      steps.forEach((step) => step.classList.remove("is-reached"));
    });
    ScrollTrigger.create({
      trigger: rail,
      start: START,
      end: END,
      onUpdate: (self) => {
        rail.style.setProperty("--p", self.progress.toFixed(4));
        steps.forEach((step, i) => {
          const on = self.progress >= i / span - 0.001;
          if (on && !step.classList.contains("is-reached")) {
            const tile = step.querySelector("[data-rail-tile]");
            if (tile) gsap.fromTo(tile, { scale: 0.72 }, { scale: 1, duration: 0.8, ease: "elastic.out(1, 0.45)", clearProps: "transform" });
          }
          step.classList.toggle("is-reached", on);
        });
      },
    });
  });
}
