/* ============================================================
   frame-scroll — a whole page scrolls inside its frame as the visitor
   scrolls past it.
   Markup: data-frame-scroll on the frame's viewport, the tall picture
   (an <img>, the page from top to bottom) inside it.
   Laid out, the viewport scrolls by hand (overflow-y: auto, the site's
   CSS): the page is all there with no script. The effect sets
   data-frame-scroll-on (the CSS hides the scrollbar) and scrubs the
   picture from its top to its foot while the frame crosses the screen.
   The distance is measured from layout (the picture's height minus the
   view's), a function value refreshed with the triggers, so it holds
   when the picture loads late or the width changes. Clamped: a frame in
   the first view starts at its top, not part-way down.
   Sources: A src/components/BrowserFrame.astro (new: the case pages,
   /lavori/<id>/).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-frame-scroll]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const START = "clamp(top 75%)"; // the frame's top here: the page starts to move
const END = "clamp(bottom 25%)"; // its foot here: the page has reached its own foot
const SMOOTH = 0.6; // s the picture takes to catch up with the scroll

export function init(kit: Kit): void {
  kit.query(hook).forEach((view) => {
    const img = view.querySelector<HTMLImageElement>("img");
    if (!img) return;
    view.setAttribute("data-frame-scroll-on", "");
    view.scrollTop = 0;
    kit.cleanup(() => view.removeAttribute("data-frame-scroll-on"));
    const travel = (): number => Math.max(0, img.offsetHeight - view.clientHeight);
    gsap.fromTo(
      img,
      { y: 0 },
      {
        y: () => -travel(),
        ease: "none",
        scrollTrigger: { trigger: view, start: START, end: END, scrub: SMOOTH, invalidateOnRefresh: true },
      },
    );
    // Its height is known once it's in.
    if (!img.complete) kit.on(img, "load", () => ScrollTrigger.refresh(), { once: true });
  });
}
