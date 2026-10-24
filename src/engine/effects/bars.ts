/* ============================================================
   bars — each bar grows to its value (--v), in turn.
   Markup: data-bars on the chart, each bar in it a [data-bars-item]
   with its value as --v, from 0 to 1 (style="--v: 0.42"): bars.css
   draws it that long.
   Below the fold only, once, as the chart enters: the bars grow from
   their left edge to their value, one after the other. When they have,
   the stylesheet has them back. Without the script, they're drawn at
   their values.
   Sources: A src/lib/landing/scenes.ts:601 (the scene bars).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-bars]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1.2; // s: how long a bar takes to grow (A)
const STAGGER = 0.12; // s between bars (A)
const START = "top 78%"; // where the chart counts as entering (A)

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    if (skipIntro(root) || inFirstView(root)) return;
    const bars = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-bars-item]"));
    if (!bars.length) return;
    gsap.set(bars, { scaleX: 0 });
    ScrollTrigger.create({
      trigger: root,
      start: START,
      once: true,
      onEnter: () =>
        gsap.to(bars, {
          scaleX: (_i: number, el: HTMLElement) => Number(getComputedStyle(el).getPropertyValue("--v")) || 0,
          duration: DURATION,
          ease: "power3.out",
          stagger: STAGGER,
          clearProps: "transform",
        }),
    });
  });
}
