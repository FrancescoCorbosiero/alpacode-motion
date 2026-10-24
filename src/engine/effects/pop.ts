/* ============================================================
   pop — an icon stamps in: from nothing, with a twist and an elastic
   landing.
   Markup: data-pop on an icon; data-pop="-160" twists it in from that
   angle (C's), instead of alternating sides.
   Below the fold only, once, as it enters, a beat after its trigger:
   it grows from nothing while turning back from TWIST degrees, the
   icons down the page alternating the side they turn from, and lands
   with a spring. When it has, its transform is the stylesheet's again.
   Decorative: nothing waits for it.
   Sources: A src/lib/motion.ts:664; C src/scripts/motion.ts:1069.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-pop]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const TWIST = 90; // degrees it turns in from, alternating sides down the page (A ±90; C −160 one way: data-pop="-160")
const DURATION = 1.15; // s: how long the landing takes (A 1.15, C 1.3)
const EASE = "elastic.out(1, 0.5)"; // the spring it lands on (A; C elastic.out(1, 0.45))
const DELAY = 0.15; // s after its trigger: the icon follows its block in (A; C none)
const START = "top 90%"; // where an icon counts as entering (A and C)

export function init(kit: Kit): void {
  kit.query(hook).forEach((el, i) => {
    if (skipIntro(el) || inFirstView(el)) return;
    const asked = parseFloat(el.dataset.pop ?? "");
    gsap.from(el, {
      scale: 0,
      rotation: Number.isFinite(asked) ? asked : i % 2 ? TWIST : -TWIST,
      duration: DURATION,
      ease: EASE,
      delay: DELAY,
      clearProps: "transform",
      scrollTrigger: { trigger: el, start: START, once: true },
    });
  });
}
