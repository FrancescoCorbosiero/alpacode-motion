/* ============================================================
   core-focus-reveal.
   Anything still waiting to be revealed (an effect marks it
   data-motion-pending) shows up the moment keyboard focus lands
   inside it. Canonical: C's, which also undoes a scale (its stagger
   children start smaller); the port also undoes what the other reveals
   hide with: a clip or a filter (cleared at once), a sideways offset or
   a tilt (dealt cards, alternating rows).
   Sources: A src/lib/motion.ts:1182; C src/scripts/motion.ts:1398.
   ============================================================ */
import { gsap } from "gsap";

document.addEventListener("focusin", (e) => {
  const pending = e.target instanceof Element && e.target.closest<HTMLElement>("[data-motion-pending]");
  if (!pending) return;
  pending.removeAttribute("data-motion-pending");
  gsap.set(pending, { clearProps: "clipPath,filter,visibility" });
  gsap.to(pending, {
    opacity: 1,
    x: 0,
    y: 0,
    rotation: 0,
    scale: 1,
    duration: 0.3,
    overwrite: true,
    clearProps: "opacity,transform,transition",
  });
});
