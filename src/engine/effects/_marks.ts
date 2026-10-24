/* ============================================================
   The pen's marks, what they share (catalog.md, Tier 1 › The pen):
   which marks are theirs, when they're drawn, and the sweep that draws
   the highlight, the underline and the strike-through.
   A mark below the fold waits undrawn from init and is drawn, after its
   delay, as it enters (data-mark-delay, in seconds: a beat after its
   block). A mark in the first view is left drawn: above the fold the
   pen is CSS (A draws those at init, painted marks wiped and redrawn).
   Marks inside a scene ([data-scene]) are drawn by its timeline, and
   [data-mark-manual] ones by a page script: left alone here.
   The sweep: the mark's background (its CSS draws the band, the line,
   the stroke) grows across through --mark-sweep, 0% → 100%, so a site
   keeps its own band; data-mark-scrub keeps pace with the scroll
   instead (C's), and inside a data-scrub statement arrives with its
   word.
   Not an entry: copied with the mark-* entries.
   Sources: A src/lib/landing/scenes.ts:172, :198; C src/scripts/motion.ts:948.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const START = "top 82%"; // where a mark counts as entering (A; C top 78%)
const DELAY = 0.15; // s after it enters, unless data-mark-delay says (A)
const DURATION = 0.85; // s: how long the pen takes (A; C's highlighter 1.1)
const SWEEP_EASE = "power2.out"; // the sweep: quick, then easing off (A; C power2.inOut)
const SCRUB_START = "top 66%"; // data-mark-scrub: its top here, the sweep starts (C)
const SCRUB_END = "top 50%"; // its top here, the mark is whole (C)
const SMOOTH = 0.6; // s the scrubbed sweep takes to catch up with the scroll (C)

export interface Pen {
  /** Undraw a mark, at init. */
  hide: (mark: HTMLElement) => void;
  /** Draw it in, after a delay, over a duration (s). */
  draw: (mark: HTMLElement, delay: number, duration: number) => void;
  /** A mark left drawn (the first view): settle it, if it needs it. */
  settle?: (mark: HTMLElement) => void;
}

/** The hook's marks this module draws: not a scene's, not a page
 *  script's, not inside a CSS intro. */
export const marksOf = (kit: Kit, hook: string): HTMLElement[] =>
  kit.query(hook).filter((mark) => !mark.closest("[data-scene], [data-mark-manual]") && !skipIntro(mark));

/** Draw each mark as it enters, after its delay; the first view's are
 *  left drawn. */
export function pen(marks: HTMLElement[], how: Pen): void {
  marks.forEach((mark) => {
    if (inFirstView(mark)) {
      how.settle?.(mark);
      return;
    }
    how.hide(mark);
    const delay = parseFloat(mark.dataset.markDelay ?? "");
    ScrollTrigger.create({
      trigger: mark,
      start: START,
      once: true,
      onEnter: () => how.draw(mark, Number.isFinite(delay) ? delay : DELAY, DURATION),
    });
  });
}

/** Sweep a mark in: its background grows across. Also for a page
 *  script drawing a [data-mark-manual] one, or a scene on its timeline. */
export function drawSweep(mark: HTMLElement, delay = 0, duration = DURATION): gsap.core.Tween {
  return gsap.fromTo(
    mark,
    { "--mark-sweep": "0%" },
    { "--mark-sweep": "100%", duration, delay, ease: SWEEP_EASE, onComplete: () => mark.style.removeProperty("--mark-sweep") },
  );
}

/** The sweep's marks: highlight, underline, strike. */
export function sweep(kit: Kit, hook: string): void {
  const marks = marksOf(kit, hook);
  const scrubbed = marks.filter((mark) => mark.hasAttribute("data-mark-scrub"));
  pen(
    marks.filter((mark) => !scrubbed.includes(mark)),
    {
      hide: (mark) => void gsap.set(mark, { "--mark-sweep": "0%" }),
      draw: (mark, delay, duration) => void drawSweep(mark, delay, duration),
    },
  );
  // Scrubbed: the scroll draws it, back and forth; its tween owns its start.
  scrubbed
    .filter((mark) => !inFirstView(mark))
    .forEach((mark) =>
      gsap.fromTo(
        mark,
        { "--mark-sweep": "0%" },
        { "--mark-sweep": "100%", ease: "none", scrollTrigger: { trigger: mark, start: SCRUB_START, end: SCRUB_END, scrub: SMOOTH } },
      ),
    );
}
