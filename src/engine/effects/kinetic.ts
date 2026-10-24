/* ============================================================
   kinetic — a band's lines slide across in opposite directions while
   it crosses the screen.
   Markup: data-kinetic on the band, its lines [data-kinetic-line="1"]
   (left) and [data-kinetic-line="-1"] (right), each wider than the
   band (its words repeated).
   Scrubbed while the band crosses the screen, from its top at the
   bottom edge to its foot at the top: each line travels a quarter of
   the band's width, the "1" lines leftwards, the "-1" ones rightwards,
   so the words seem to pass each other. A band in the first view is
   left still: its lines would jump from where they were painted (A
   doesn't check).
   Sources: A src/lib/landing/scenes.ts:556.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-kinetic]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SHIFT = 25; // % of the band's width each line travels (A)
const SMOOTH = 0.4; // s the lines take to catch up with the scroll (A)

export function init(kit: Kit): void {
  kit.query(hook).forEach((band) => {
    if (skipIntro(band) || inFirstView(band)) return;
    band.querySelectorAll<HTMLElement>("[data-kinetic-line]").forEach((line) => {
      const left = (Number(line.dataset.kineticLine) || 1) > 0;
      gsap.fromTo(
        line,
        { xPercent: left ? 0 : -SHIFT },
        {
          xPercent: left ? -SHIFT : 0,
          ease: "none",
          scrollTrigger: { trigger: band, start: "top bottom", end: "bottom top", scrub: SMOOTH },
        },
      );
    });
  });
}
