/* ============================================================
   core-guards — what motion leaves alone, and when.
   The rule behind "nothing is hidden by CSS": an effect hides its
   elements here, at init, and only if they start below the fold, so a
   page whose script fails is a complete, static page.
   Sources: A src/lib/motion.ts:92 (preferences), :211, :217;
   C src/scripts/motion.ts:85, :122, :125; A landing/scenes.ts:92.
   ============================================================ */
import { config } from "../config";

const reducedQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
/** The visitor asked for less motion: no Lenis, no scroll animation. */
export const reduced = (): boolean => reducedQuery.matches;
/** Called when the preference changes during the visit (lifecycle.ts). */
export const onReducedChange = (fn: () => void): void => reducedQuery.addEventListener("change", fn);

/* Magnets, tilt and hover play only make sense with a mouse. */
const fineQuery = window.matchMedia("(hover: hover) and (pointer: fine)");
export const fine = (): boolean => fineQuery.matches;

/** True when the element starts inside (or above) the first screen. Those
 *  are left alone: hiding them now would flash already-painted content. */
export const inFirstView = (el: Element): boolean =>
  el.getBoundingClientRect().top < window.innerHeight * 0.92;

/** The inverse: starts below the fold, so it may be hidden and revealed. */
export const below = (el: Element): boolean => !inFirstView(el);

/** Intro-animated (CSS) and island-rendered elements are off limits: the
 *  first already moved, and a framework would see our inline styles as
 *  hydration mismatches — wrap an island in [data-reveal] instead. */
export const skipIntro = (el: Element): boolean =>
  !!el.closest(config.intro ? `${config.intro}, astro-island` : "astro-island");
