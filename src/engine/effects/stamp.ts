/* ============================================================
   stamp — a stamp slams down (from 2.6×, accelerating) and the sheet
   takes the hit.
   Markup: data-stamp on the stamp, inside its sheet (its parent);
   data-stamp="0.28" is a delay in seconds, for stamps in a row.
   Below the fold only, once, when its sheet is well in view: the stamp
   comes down from large above it, turning onto its resting tilt, faster
   and faster; as it lands the sheet jolts. Its resting tilt is the
   stylesheet's (a transform, or the rotate property): it lands on it,
   and when it has, its transform is the stylesheet's again. Decorative
   (aria-hidden): nothing waits for it.
   Sources: C src/scripts/motion.ts:1031; A src/lib/landing/scenes.ts:621.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-stamp]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SCALE = 2.6; // how large the stamp starts, above the sheet (A and C)
const TWIST = 21; // degrees it turns onto its resting tilt as it comes down (A 21: from −32° onto −11°; C 45)
const DURATION = 0.42; // s: how long it takes to come down (A 0.42, C 0.45)
const EASE = "power4.in"; // faster and faster: it slams (A and C)
const SHAKE = [5, 0, 5, 0]; // px: the sheet's jolt as it lands (A; C −6, 5, −3, 0)
const SHAKE_TIME = 0.2; // s: how long the jolt lasts (A 0.2, C 0.3)
const START = "top 55%"; // the sheet's top here: it comes down once the sheet is well in view (A; C top 70%)

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    if (skipIntro(el) || inFirstView(el)) return;
    const sheet = el.parentElement ?? el;
    const delay = parseFloat(el.dataset.stamp ?? "") || 0;
    gsap
      .timeline({ scrollTrigger: { trigger: sheet, start: START, once: true } })
      .from(el, { opacity: 0, scale: SCALE, rotation: `-=${TWIST}`, duration: DURATION, ease: EASE }, delay)
      .fromTo(sheet, { x: 0 }, { keyframes: { x: SHAKE }, duration: SHAKE_TIME, ease: "none" })
      // Cleared after the jolt, not in it: a keyframed tween writes its
      // last frame after its own clearProps, and an inline transform
      // would undo a sheet's resting tilt.
      .set(sheet, { clearProps: "transform" })
      .set(el, { clearProps: "opacity,transform" });
  });
}
