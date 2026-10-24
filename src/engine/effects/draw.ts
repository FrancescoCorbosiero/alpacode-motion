/* ============================================================
   draw — an SVG's strokes draw themselves in, one after another.
   Markup: data-draw on an SVG, or on the figure around it; the strokes
   that draw are its [data-draw-path] elements, or else all its paths.
   data-draw="1.6" gives the seconds a stroke takes (a signature).
   Below the fold only, once, as it enters: each stroke is drawn from
   its start to its end, the next one starting STAGGER later (A's map:
   almost together, from the first one out; C's one after another is
   0.75). Native strokeDasharray, no plugin (D8): the dash is the
   stroke's length (its pathLength, if it has one), and once drawn the
   stroke is the stylesheet's again. So a dashed stroke draws solid and
   gets its dashes back at the end: draw solid ones. A stroke with
   vector-effect: non-scaling-stroke measures in screen units, not the
   SVG's: that one needs DrawSVG (the pen's marks).
   Sources: C src/scripts/motion.ts:1084; A src/lib/motion.ts:984 (the
   map), src/lib/landing/scenes.ts:775 (the signature).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-draw]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 0.9; // s each stroke takes (A's map and C; A's signature 1.6: data-draw="1.6")
const STAGGER = 0.09; // s between the strokes' starts (A's map 0.09; C 0.75, one after another)
const DELAY = 0.2; // s after its trigger (A's map and signature; C none)
const EASE = "power2.inOut"; // a stroke drawn by hand (C; A's signature power1.inOut, its map an ease-out)
const START = "top 75%"; // where it counts as entering (A's map 75%, its signature 80%; C 85%)

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    if (skipIntro(root) || inFirstView(root)) return;
    const marked = root.querySelectorAll<SVGGeometryElement>("[data-draw-path]");
    const strokes = gsap.utils.toArray<SVGGeometryElement>(marked.length ? marked : root.querySelectorAll("path"));
    const duration = parseFloat(root.dataset.draw ?? "") || DURATION;
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: START, once: true } });
    strokes.forEach((stroke, i) => {
      let length = Number(stroke.getAttribute("pathLength")) || 0;
      if (!length) {
        try {
          length = stroke.getTotalLength();
        } catch {
          return; // not rendered (display: none at this width)
        }
      }
      if (!length) return;
      tl.fromTo(
        stroke,
        { strokeDasharray: length, strokeDashoffset: length },
        { strokeDashoffset: 0, duration, ease: EASE, clearProps: "strokeDasharray,strokeDashoffset" },
        DELAY + i * STAGGER,
      );
    });
  });
}
