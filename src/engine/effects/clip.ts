/* ============================================================
   clip — a photo opens from a clip, its image settling from a slight
   zoom.
   Markup: data-clip on the photo's frame (the image inside it);
   data-clip="round" opens it with rounded corners, "still" leaves the
   image unzoomed (both: "round still", C's photos).
   Below the fold only, once, as the frame enters: the clip opens from
   a band in the middle to the whole frame while the image inside
   settles from a little larger. When it has opened the clip is gone and
   the image's own transform is the stylesheet's again (a hover zoom
   keeps working). Marked data-motion-pending while it waits: keyboard
   focus inside it shows it at once.
   Sources: A src/lib/motion.ts:679; C src/scripts/motion.ts:482.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-clip]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const INSET_Y = 12; // %: where the clip starts, in from the top and the bottom (A 12, C 14)
const INSET_X = 5; // %: and in from the sides (A 5, C 8)
const ROUND = 24; // px: the corners while it opens, with data-clip="round" (C)
const ZOOM = 1.16; // how much larger the image starts, settling to 1 (A; C none: "still")
const DURATION = 1.5; // s: how long the clip takes to open (A and C)
const SETTLE = 1.8; // s: how long the image takes to settle (A)
const EASE = "power4.out"; // a long, soft opening (A and C)
const START = "top 88%"; // where a frame counts as entering (A and C)

export function init(kit: Kit): void {
  const frames = kit.query(hook).filter((el) => !skipIntro(el) && !inFirstView(el));
  frames.forEach((frame) => {
    const options = (frame.dataset.clip ?? "").split(/\s+/);
    const corners = options.includes("round") ? ` round ${ROUND}px` : "";
    const scrollTrigger = { trigger: frame, start: START, once: true };
    frame.setAttribute("data-motion-pending", "");
    gsap.fromTo(
      frame,
      { clipPath: `inset(${INSET_Y}% ${INSET_X}% ${INSET_Y}% ${INSET_X}%${corners})` },
      {
        clipPath: `inset(0% 0% 0% 0%${corners ? " round 0px" : ""})`,
        duration: DURATION,
        ease: EASE,
        clearProps: "clipPath",
        scrollTrigger,
        onStart: () => frame.removeAttribute("data-motion-pending"),
      },
    );
    const image = options.includes("still") ? null : frame.querySelector("img, video");
    if (image) {
      gsap.fromTo(
        image,
        { scale: ZOOM, transition: "none" },
        { scale: 1, duration: SETTLE, ease: "power3.out", clearProps: "transform,transition", scrollTrigger },
      );
    }
  });
  kit.cleanup(() => frames.forEach((frame) => frame.removeAttribute("data-motion-pending")));
}
