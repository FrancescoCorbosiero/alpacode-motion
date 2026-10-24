/* ============================================================
   hero-away — hero content drifts off and dims as the page scrolls
   away.
   Markup: data-hero-away on a part of a hero; its value is how far it
   drifts by the time the hero is gone, in % of its own height (negative
   is up: the default, -14, is alpacode's copy; its lockup sinks, "22");
   data-hero-fade="0.15" is the opacity it dims to ("1": it doesn't).
   Scrubbed from the moment the hero's top meets the top of the screen
   until its foot has gone (the hero: the part's closest [data-hero], or
   its section). At the top of the page every part is where the page put
   it, so it plays in the first view, CSS intro and all: the tween owns
   its start (both sources used to(), which reads the start at init,
   when an intro may still be moving the part). Not inside an island.
   Sources: C src/scripts/motion.ts:1148; A src/lib/motion.ts:925.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-hero-away]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DRIFT = -14; // % of its own height, by the time the hero is gone: up (A's copy; its lockup 22, down; C 14)
const FADE = 0.15; // the opacity it dims to (A's copy; its lockup 1, it doesn't; C 0.2)

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    if (el.closest("astro-island")) return;
    const hero = el.closest<HTMLElement>("[data-hero], section") ?? el;
    const drift = parseFloat(el.dataset.heroAway ?? "");
    const asked = parseFloat(el.dataset.heroFade ?? "");
    const fade = Number.isFinite(asked) ? asked : FADE;
    const dims = fade < 1;
    gsap.fromTo(
      el,
      { yPercent: 0, ...(dims ? { opacity: 1 } : {}) },
      {
        yPercent: Number.isFinite(drift) ? drift : DRIFT,
        ...(dims ? { opacity: fade } : {}),
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      },
    );
  });
}
