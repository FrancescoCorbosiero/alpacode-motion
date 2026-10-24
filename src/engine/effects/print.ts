/* ============================================================
   print — a QR (or any grid-like SVG) prints itself row by row under a
   scan bar.
   Markup: data-print on the tile that holds the SVG; also a function,
   printQr(tile, { delay, trigger }), for a page script that swaps a new
   QR in (alpacode's referral page prints the visitor's own).
   Below the fold only, once, as the tile enters: the SVG is uncovered
   from the top, one row of its grid at a time (its viewBox height is
   its row count), while a bar of light runs down over it and fades.
   Under reduced motion printQr() is a no-op: the QR is simply there.
   Sources: A src/lib/motion.ts:433, :1132; CSS A src/styles/motion.css:355.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, reduced, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-print]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1.15; // s: how long the print takes, top to bottom (A)
const ROWS = 30; // the rows it prints in, when the SVG's viewBox doesn't say (A)
const START = "top 82%"; // where a tile counts as entering (A)

/** The QR prints itself: rows uncovered one by one under a scan bar. */
export function printQr(tile: HTMLElement, opts: { delay?: number; trigger?: boolean } = {}): gsap.core.Timeline | null {
  const svg = tile.querySelector("svg");
  if (reduced() || !svg) return null;
  const rows = Number(svg.getAttribute("viewBox")?.trim().split(/[\s,]+/)[3]) || ROWS;
  let bar = tile.querySelector<HTMLElement>(".print-scan");
  if (!bar) {
    bar = document.createElement("span");
    bar.className = "print-scan";
    bar.setAttribute("aria-hidden", "true");
    tile.appendChild(bar);
  }
  return gsap
    .timeline({ delay: opts.delay ?? 0, scrollTrigger: opts.trigger ? { trigger: tile, start: START, once: true } : undefined })
    .fromTo(svg, { clipPath: "inset(0% 0% 100% 0%)" }, { clipPath: "inset(0% 0% 0% 0%)", duration: DURATION, ease: `steps(${rows})`, clearProps: "clipPath" }, 0)
    .fromTo(bar, { top: "0%" }, { top: "100%", duration: DURATION, ease: "none" }, 0)
    .fromTo(bar, { opacity: 0 }, { opacity: 1, duration: 0.12 }, 0)
    .to(bar, { opacity: 0, duration: 0.3, ease: "power1.out" }, DURATION);
}

export function init(kit: Kit): void {
  const tiles = kit.query(hook).filter((tile) => !skipIntro(tile) && !inFirstView(tile));
  tiles.forEach((tile) => printQr(tile, { trigger: true }));
  kit.cleanup(() => tiles.forEach((tile) => tile.querySelector(".print-scan")?.remove()));
}
