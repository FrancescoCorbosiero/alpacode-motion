/* ============================================================
   core-scroll-to.
   scrollToTarget(el or y, done?): smooth through Lenis, with room for
   the header when going up; `done` runs once the page has arrived (the
   referral page fires its confetti then). Same-page anchors glide
   instead of jumping, and [data-scroll-top] goes back to the top.
   Canonical: A's, with `done` (C has none).
   Sources: A src/lib/motion.ts:253, :273; C src/scripts/motion.ts:158, :177.
   ============================================================ */
import { config } from "../config";
import { reduced } from "./guards";
import { currentLenis } from "./lenis";

/** Scroll to an element or a position, smooth when Lenis is running.
 *  `done` runs once the page has arrived (an estimate without Lenis). */
export function scrollToTarget(target: HTMLElement | number, done?: () => void): void {
  const lenis = currentLenis();
  if (lenis) {
    let offset = -16;
    if (typeof target !== "number" && target.getBoundingClientRect().top < 0) {
      // Scrolling up brings the header back: leave room for it.
      offset -= document.querySelector<HTMLElement>(config.header)?.offsetHeight ?? 0;
    }
    lenis.scrollTo(target, { offset, duration: 1.3, onComplete: done ? () => done() : undefined });
    return;
  }
  if (typeof target === "number") {
    window.scrollTo({ top: target, behavior: reduced() ? "auto" : "smooth" });
  } else {
    target.scrollIntoView({ behavior: reduced() ? "auto" : "smooth" });
  }
  if (done) window.setTimeout(done, reduced() ? 0 : 650);
}

/* Same-page anchors glide instead of jumping. Capture phase, so Astro's
   router sees defaultPrevented and stands down. */
document.addEventListener(
  "click",
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
    const el = e.target instanceof Element ? e.target : null;
    if (el?.closest("[data-scroll-top]")) {
      e.preventDefault();
      scrollToTarget(0);
      return;
    }
    const a = el?.closest<HTMLAnchorElement>("a[href*='#']");
    if (!a || !currentLenis()) return;
    const url = new URL(a.href, location.href);
    if (url.origin !== location.origin || url.pathname !== location.pathname || !url.hash) return;
    const id = decodeURIComponent(url.hash.slice(1));
    const target = id === "top" ? 0 : document.getElementById(id);
    if (target === null) return;
    e.preventDefault();
    scrollToTarget(target);
    history.replaceState(history.state, "", url.hash);
  },
  true,
);
