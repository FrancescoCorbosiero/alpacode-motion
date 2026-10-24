/* ============================================================
   hero-video — a background video gets its sources only when welcome,
   plays only on screen with the tab visible, and remembers the
   visitor's pause for the visit.
   Markup: data-hero-video on a muted, looping <video> with a poster and
   preload="none", its <source>s holding data-src (not src); a
   [data-hero-video-toggle] button in the same hero, hidden, with
   data-label-pause and data-label-play (its aria-labels).
   When motion runs and the visitor isn't saving data, the sources get
   their src and the toggle shows; the video plays while the hero is on
   screen and the tab is visible, and pauses otherwise (the source
   assumed a hero at the top, playing until its foot had gone past the
   top: a page loaded further down played it off screen). The toggle pauses and plays it, its
   aria-pressed and label following; the pause is remembered for the
   visit (sessionStorage). A looping video needs a way to stop it (WCAG
   2.2.2). Without JS, and under reduced motion: no sources, the poster
   stays, the toggle stays hidden; the page going puts it back so.
   Sources: A src/lib/motion.ts:898, :931.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-hero-video]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const KEY = "alpacode_hero_video"; // where the visitor's pause is kept for the visit, in sessionStorage (A's)

const pausedByVisitor = (): boolean => {
  try {
    return sessionStorage.getItem(KEY) === "paused";
  } catch {
    return false;
  }
};

export function init(kit: Kit): void {
  const saveData = (navigator as Navigator & { connection?: { saveData?: boolean } }).connection?.saveData;
  if (saveData) return;
  kit.query<HTMLVideoElement>(hook).forEach((video) => {
    if (!(video instanceof HTMLVideoElement) || video.closest("astro-island")) return;
    const hero = video.closest<HTMLElement>("[data-hero], section") ?? document.body;
    const sources = [...video.querySelectorAll<HTMLSourceElement>("source[data-src]")];
    sources.forEach((s) => (s.src = s.dataset.src ?? ""));
    video.load();
    const toggle = hero.querySelector<HTMLButtonElement>("[data-hero-video-toggle]");
    let wanted = !pausedByVisitor();
    let onScreen = false; // until the trigger has measured: its refresh starts it
    const sync = (): void => {
      if (wanted && onScreen && !document.hidden) void video.play().catch(() => undefined);
      else video.pause();
      if (toggle) {
        toggle.setAttribute("aria-pressed", wanted ? "false" : "true");
        toggle.setAttribute("aria-label", (wanted ? toggle.dataset.labelPause : toggle.dataset.labelPlay) ?? "");
      }
    };
    if (toggle) {
      toggle.hidden = false;
      kit.on(toggle, "click", () => {
        wanted = !wanted;
        try {
          if (wanted) sessionStorage.removeItem(KEY);
          else sessionStorage.setItem(KEY, "paused");
        } catch {
          /* storage unavailable: the choice holds for this page */
        }
        sync();
      });
    }
    // On screen while any of the hero is: from its top at the foot of
    // the screen to its foot at the top (a hero at the top of the page
    // is on screen from the start, as in the source).
    const watch = (self: ScrollTrigger): void => {
      onScreen = self.progress > 0 && self.progress < 1;
      sync();
    };
    ScrollTrigger.create({ trigger: hero, start: "top bottom", end: "bottom top", onToggle: watch, onRefresh: watch });
    document.addEventListener("visibilitychange", sync);
    kit.cleanup(() => {
      document.removeEventListener("visibilitychange", sync);
      video.pause();
      sources.forEach((s) => s.removeAttribute("src"));
      video.load(); // back to the poster
      if (toggle) toggle.hidden = true;
    });
    sync();
  });
}
