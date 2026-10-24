/* ============================================================
   marquee — a ticker drifts on its own, speeds up with the scroll and
   follows its direction; stops under the mouse.
   Markup: data-marquee on the band, its [data-marquee-track] holding
   the items twice over (the loop wraps at half its width; the second
   set aria-hidden, or the whole band if it's decoration);
   data-marquee="right" drifts the other way, data-marquee-speed="56"
   sets its own pace in px/s.
   Without JS (and until it starts) the track drifts in CSS, paused
   under the pointer or focus (marquee.css). With motion the script
   takes over from where the CSS drift has got to (both sources jumped
   back to the start) and, while the band is on screen, drifts at its pace,
   borrows some of the scroll's speed, which fades frame by frame, and
   runs the way the page is scrolled; with a mouse it stops under it.
   Its ticker callback runs only while the band is on screen (both
   sources kept it for the page's life and returned early), and the
   hover only with a mouse (a tap's mouseenter could leave it stopped).
   ride(band, fn) lets a rider walk with it (alpacode's alpacas, tier 3):
   fn(dx, dt) every frame it moves.
   Sources: A src/lib/motion.ts:850; C src/scripts/motion.ts:1103;
   CSS A src/styles/components.css:1343, C src/styles/sections.css:48.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-marquee]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SPEED = 70; // px/s it drifts on its own (A's home band 70, its referral bands 56: data-marquee-speed="56"; C 60)
const BORROW = 0.35; // how much of the scroll's speed it borrows (A and C)
const MAX = 900; // px/s: the most it borrows (A and C)
const FADE = 0.94; // per frame, what's left of the borrowed speed (A and C)

type Rider = (dx: number, dt: number) => void;
const riders = new WeakMap<Element, Set<Rider>>();

/** A rider walks with a band: fn(dx, dt) on every frame it moves.
 *  Returns the way off. */
export function ride(band: Element, fn: Rider): () => void {
  const set = riders.get(band) ?? new Set<Rider>();
  riders.set(band, set);
  set.add(fn);
  return () => void set.delete(fn);
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((band) => {
    const track = band.querySelector<HTMLElement>("[data-marquee-track]");
    if (!track || band.closest("astro-island")) return;
    // Take over from the CSS drift where it is, not from the start.
    const drifted = getComputedStyle(track).transform;
    let x = drifted && drifted !== "none" ? new DOMMatrixReadOnly(drifted).m41 : 0;
    track.style.animation = "none";
    track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
    const speed = parseFloat(band.dataset.marqueeSpeed ?? "") || SPEED;
    const way = band.dataset.marquee === "right" ? 1 : -1;
    let dir = way;
    let boost = 0;
    let half = track.scrollWidth / 2;
    let hovered = false;
    const tick = (_time: number, dt: number): void => {
      if (hovered || !half) return;
      const dx = dir * (speed + boost) * (dt / 1000);
      x += dx;
      if (x <= -half) x += half;
      else if (x > 0) x -= half;
      track.style.transform = `translate3d(${x.toFixed(2)}px,0,0)`;
      riders.get(band)?.forEach((fn) => fn(dx, dt));
      boost *= FADE;
    };
    let ticking = false;
    const run = (on: boolean): void => {
      if (on === ticking) return;
      ticking = on;
      if (on) gsap.ticker.add(tick);
      else gsap.ticker.remove(tick);
    };
    ScrollTrigger.create({
      trigger: band,
      start: "top bottom",
      end: "bottom top",
      onToggle: (self) => run(self.isActive),
      onRefresh: (self) => {
        half = track.scrollWidth / 2;
        run(self.isActive);
      },
      onUpdate: (self) => {
        boost = Math.min(Math.abs(self.getVelocity()) * BORROW, MAX);
        dir = self.direction === -1 ? -way : way;
      },
    });
    if (kit.fine) {
      kit.on(band, "mouseenter", () => void (hovered = true));
      kit.on(band, "mouseleave", () => void (hovered = false));
    }
    kit.cleanup(() => {
      run(false);
      track.style.removeProperty("transform");
      track.style.removeProperty("animation");
    });
  });
}
