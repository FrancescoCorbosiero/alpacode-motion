/* ============================================================
   core-lifecycle and core-lazy-chunk.
   Astro's ClientRouter swaps pages without reloading, so everything is
   built per page: inside a gsap.context() and a gsap.matchMedia(),
   listeners through on(), extra teardown in cleanups; all of it is
   reverted on astro:before-swap and rebuilt on astro:page-load (or at
   DOMContentLoaded on the first visit). A pageBody guard stops a double
   init. Identical in A and C; three additions here:
   - each effect is built in a context of its own, so one that throws is
     undone alone and the page keeps the rest (and stays complete);
   - the effects come from the site's registry: the ones in the main
     bundle are built in its order, the lazy ones are fetched only by
     pages that have their hook (D7) and built in the page's context;
   - when the visitor switches reduced motion on or off mid-visit, the
     page is rebuilt for it.
   Under reduced motion nothing is built: no Lenis, no scroll animation.
   Sources: A src/lib/motion.ts:487, :1189, :1232, :1244, :1266;
   C src/scripts/motion.ts:334, :1405, :1457, :1479.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { config } from "../config";
import { clearFxLayer } from "./fx-layer";
import { fine, onReducedChange, reduced } from "./guards";
import { resetHeader } from "./header";
import type { Effect, Kit, LazyEffect } from "./kit";
import { createLenis, destroyLenis } from "./lenis";
import "./focus";
import "./refresh";
import "./scroll";

gsap.registerPlugin(ScrollTrigger);

let ctx: gsap.Context | null = null;
let mm: gsap.MatchMedia | null = null;
let pageBody: HTMLElement | null = null;
let cleanups: (() => void)[] = [];
let eager: Effect[] = [];
let lazy: LazyEffect[] = [];

/** A listener removed with the page. */
function on<K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  type: K,
  fn: (e: HTMLElementEventMap[K]) => void,
  opts?: AddEventListenerOptions,
): void {
  el.addEventListener(type, fn, opts);
  cleanups.push(() => el.removeEventListener(type, fn, opts));
}

/** The hook's elements plus the site's own selectors for it (config.ts). */
function query<T extends Element = HTMLElement>(hook: string): T[] {
  const mapped = config.selectors[hook];
  return gsap.utils.toArray<T>(mapped?.length ? [hook, ...mapped].join(",") : hook);
}

/** One effect, in a context of its own inside the page's. The error is
 *  caught inside the context function, so GSAP's current context is
 *  restored; then whatever the effect had hidden is put back. */
function build(effect: Effect, kit: Kit): void {
  let failed = false;
  let error: unknown;
  const own = gsap.context(() => {
    try {
      effect.init(kit);
    } catch (err) {
      failed = true;
      error = err;
    }
  });
  if (failed) {
    own.revert();
    console.error(`motion: ${effect.hook} failed and was undone`, error);
  }
}

function initPage(): void {
  if (pageBody === document.body) return; // already initialised for this page
  teardownPage();
  pageBody = document.body;
  resetHeader();
  if (reduced()) return;
  document.documentElement.classList.add("has-motion");
  createLenis();
  mm = gsap.matchMedia();
  const kit: Kit = { media: mm, on, fine: fine(), cleanup: (fn) => void cleanups.push(fn), query };
  ctx = gsap.context(() => eager.forEach((effect) => build(effect, kit)));
  // Triggers created out of document order refresh in page order.
  ScrollTrigger.sort();
  // Fonts change line breaks and heights: measure again once they're in.
  document.fonts?.ready.then(() => ScrollTrigger.refresh());
  loadLazy(kit);
}

/* The heavy modules and the plugins they need are separate chunks,
   fetched only by pages that have their hook, and built inside this
   page's context and matchMedia so they go with the page. If the fetch
   fails the page simply stays as it is: nothing was hidden yet. */
function loadLazy(kit: Kit): void {
  const body = document.body;
  lazy.forEach((entry) => {
    if (!query(entry.hook).length) return;
    entry.load().then(
      (effect) => {
        if (pageBody !== body || !ctx) return; // the page changed meanwhile
        ctx.add(() => build(effect, kit));
        ScrollTrigger.sort();
        ScrollTrigger.refresh();
      },
      (err) => console.error(`motion: ${entry.hook} could not be loaded`, err),
    );
  });
}

function teardownPage(): void {
  cleanups.forEach((fn) => fn());
  cleanups = [];
  mm?.revert();
  mm = null;
  ctx?.revert();
  ctx = null;
  clearFxLayer();
}

/** Rebuild the page's motion from scratch: what a change of the
 *  reduced-motion preference does (and the gallery's replay). */
export function restart(): void {
  teardownPage();
  pageBody = null;
  if (reduced()) {
    destroyLenis();
    document.documentElement.classList.remove("has-motion");
  }
  initPage();
}

let started = false;

/** Start the engine with the site's effects (registry.ts). Once per visit:
 *  the ClientRouter keeps this script across page swaps. */
export function start(effects: Effect[], lazyEffects: LazyEffect[] = []): void {
  if (started) return;
  started = true;
  eager = effects;
  lazy = lazyEffects;
  document.addEventListener("astro:before-swap", () => {
    teardownPage();
    pageBody = null;
    destroyLenis();
  });
  // The swap replaces <html>'s attributes.
  document.addEventListener("astro:after-swap", () => {
    if (!reduced()) document.documentElement.classList.add("has-motion");
  });
  // astro:page-load fires after soft navigations — and, on the first visit,
  // only at window "load"; initialise as soon as the DOM is parsed instead.
  document.addEventListener("astro:page-load", initPage);
  onReducedChange(restart);
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initPage);
  } else {
    initPage();
  }
}
