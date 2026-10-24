/* ============================================================
   hero-settle — a hero photo or video settles a little closer as the
   page scrolls away.
   Markup: data-hero-settle on the photo or the video, inside a frame
   that clips it; its value is "scale" or "scale drift": "1.08 0" is
   alpacode's video (closer, no drift), the default its photos (1.07,
   sinking 4%).
   Scrubbed from the moment the hero's top meets the top of the screen
   until its foot has gone (the hero: its closest [data-hero], or its
   section): it grows to its scale and sinks a little, the way a
   photographer steps in. At the top it's as the page put it, so it
   plays in the first view; the tween owns its start. Not inside an
   island.
   Sources: A src/lib/motion.ts:927.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-hero-settle]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SCALE = 1.07; // how much closer it ends, by the time the hero is gone (A's photos; its video 1.08: "1.08 0")
const DRIFT = 4; // %: how far it sinks, of its own height (A's photos; its video 0)

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    if (el.closest("astro-island")) return;
    const hero = el.closest<HTMLElement>("[data-hero], section") ?? el;
    const [scale, drift] = (el.dataset.heroSettle ?? "").trim().split(/\s+/).map(parseFloat);
    gsap.fromTo(
      el,
      { scale: 1, yPercent: 0 },
      {
        scale: Number.isFinite(scale) ? scale : SCALE,
        yPercent: Number.isFinite(drift) ? drift : DRIFT,
        ease: "none",
        scrollTrigger: { trigger: hero, start: "top top", end: "bottom top", scrub: true },
      },
    );
  });
}
