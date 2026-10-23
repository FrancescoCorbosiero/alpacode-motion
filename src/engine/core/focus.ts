/* ============================================================
   core-focus-reveal.
   Anything still waiting to be revealed (an effect marks it
   data-motion-pending) shows up the moment keyboard focus lands
   inside it. Canonical: C's, which also undoes a scale (its stagger
   children start smaller).
   Sources: A src/lib/motion.ts:1182; C src/scripts/motion.ts:1398.
   ============================================================ */
import { gsap } from "gsap";

document.addEventListener("focusin", (e) => {
  const pending = e.target instanceof Element && e.target.closest<HTMLElement>("[data-motion-pending]");
  if (!pending) return;
  pending.removeAttribute("data-motion-pending");
  gsap.to(pending, {
    opacity: 1,
    y: 0,
    scale: 1,
    duration: 0.3,
    overwrite: true,
    clearProps: "opacity,transform,transition",
  });
});
