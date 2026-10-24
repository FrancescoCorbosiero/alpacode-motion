/* ============================================================
   skew — a band leans with the speed of the scroll.
   Markup: data-skew on the band: the box that leans, never an element
   a CSS animation moves (a band whose words drift: data-skew on the
   band, the drift on its track). A running animation's transform beats
   the inline one: FAST put data-band on its drifting track, whose
   keyframes have no start, so the lean became the start of the drift's
   interpolation, whole as a loop began and gone by its end, 22s later,
   then whole again. A transform the band has in CSS (a tilt) is kept:
   the lean is added to it.
   While it's on screen the band leans into the scroll, the faster the
   further (up to MAX degrees), and straightens as the scroll slows. The
   port straightens it when the scroll stops too: the source only
   leaned on scroll updates, so a stop left it leaning until the next.
   Sources: FAST fast/src/lib/motion.ts:67 (data-band).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-skew]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const MAX = 12; // degrees it leans at the most (FAST)
const PER = 250; // px/s of scroll for each degree of lean (FAST)
const SMOOTH = 0.4; // s it takes to follow (FAST)
const REST = 0.15; // s after the last scroll update: it straightens (the port's)

export function init(kit: Kit): void {
  kit.query(hook).forEach((band) => {
    if (band.closest("astro-island")) return;
    const lean = gsap.quickTo(band, "skewX", { duration: SMOOTH, ease: "power3.out" });
    const straighten = gsap.delayedCall(REST, () => void lean(0)).pause();
    ScrollTrigger.create({
      trigger: band,
      start: "top bottom",
      end: "bottom top",
      onUpdate: (self) => {
        lean(gsap.utils.clamp(-MAX, MAX, self.getVelocity() / -PER));
        straighten.restart(true);
      },
      onLeave: () => void lean(0),
      onLeaveBack: () => void lean(0),
    });
  });
}
