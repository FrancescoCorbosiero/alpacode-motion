/* ============================================================
   map — Dove operiamo: the dots of the map spread out from the base,
   then an arc reaches every place where a client is.
   Markup: data-scene="map" on the section; in its <svg>, the dots
   [data-map-dots] (one path), the mask circle [data-map-reach] (its r
   is the full reach), the base [data-map-base="<key>"], the arcs
   [data-map-arc="<key>"] (pathLength="1"), the places
   [data-map-place="<key>"], the ping [data-map-ping]; beside the map,
   the rows [data-map-row="<key>"].
   Below the fold, once, as it enters: the dots are masked by a circle
   growing from the base, the arcs draw out to their places one after
   another (nearest first, as the markup orders them), each place pops
   in as its arc lands; then the mask goes and the map is the
   stylesheet's. The ping round the base loops while the map is on
   screen and the tab is shown. A row and its place light up together
   (.is-hot) when the row is hovered with a mouse or holds the focus.
   Laid out (no script, reduced motion), the map is whole.
   Sources: A src/components/home/Coverage.astro (new: the home and
   /lavori, Dove operiamo).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = '[data-scene="map"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const START = "top 65%"; // where the map counts as entering
const REACH = 1.8; // s the dots take to spread out from the base
const DRAW = 0.9; // s an arc takes to reach its place
const STAGGER = 0.22; // s between one arc and the next
const ARCS = 0.4; // s into the spread when the first arc leaves
const PING = 2.6; // s of one ping round the base

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    const svg = root.querySelector<SVGSVGElement>("svg");
    if (!svg) return;

    // A row and its place, lit together.
    root.querySelectorAll<HTMLElement>("[data-map-row]").forEach((row) => {
      const id = row.dataset.mapRow;
      const lit = id
        ? svg.querySelectorAll(`[data-map-place="${id}"], [data-map-arc="${id}"], [data-map-base="${id}"]`)
        : [];
      const on = () => lit.forEach((el) => el.classList.add("is-hot"));
      const off = () => lit.forEach((el) => el.classList.remove("is-hot"));
      if (kit.fine) {
        kit.on(row, "pointerenter", on);
        kit.on(row, "pointerleave", off);
      }
      kit.on(row, "focusin", on);
      kit.on(row, "focusout", off);
    });
    kit.cleanup(() => svg.querySelectorAll(".is-hot").forEach((el) => el.classList.remove("is-hot")));

    // The ping: a loop, on screen only.
    const ping = svg.querySelector<SVGElement>("[data-map-ping]");
    if (ping) {
      const loop = gsap.fromTo(
        ping,
        { scale: 0.4, opacity: 0.7, transformOrigin: "50% 50%" },
        { scale: 3.2, opacity: 0, duration: PING, ease: "power2.out", repeat: -1, paused: true },
      );
      let onScreen = false;
      const run = () => (onScreen && !document.hidden ? loop.play() : loop.pause());
      ScrollTrigger.create({
        trigger: root,
        start: "top bottom",
        end: "bottom top",
        onToggle: (self) => {
          onScreen = self.isActive;
          run();
        },
      });
      document.addEventListener("visibilitychange", run);
      kit.cleanup(() => document.removeEventListener("visibilitychange", run));
    }

    if (skipIntro(root) || inFirstView(root)) return;
    const dots = svg.querySelector<SVGElement>("[data-map-dots]");
    const reach = svg.querySelector<SVGCircleElement>("[data-map-reach]");
    const arcs = gsap.utils.toArray<SVGPathElement>("[data-map-arc]", svg);
    const places = gsap.utils.toArray<SVGElement>("[data-map-place]", svg);
    const full = Number(reach?.getAttribute("r")) || 0;
    if (dots && reach && full) {
      dots.setAttribute("mask", `url(#${reach.closest("mask")?.id ?? ""})`);
      kit.cleanup(() => dots.removeAttribute("mask"));
    }
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: START, once: true } });
    if (dots && reach && full) {
      tl.fromTo(reach, { attr: { r: 0 } }, { attr: { r: full }, duration: REACH, ease: "power2.out" }, 0).add(
        () => dots.removeAttribute("mask"),
        REACH,
      );
    }
    if (arcs.length)
      tl.fromTo(
        arcs,
        { strokeDasharray: 1, strokeDashoffset: 1 },
        {
          strokeDashoffset: 0,
          duration: DRAW,
          ease: "power2.inOut",
          stagger: STAGGER,
          clearProps: "strokeDasharray,strokeDashoffset",
        },
        ARCS,
      );
    if (places.length)
      tl.fromTo(
        places,
        { scale: 0, transformOrigin: "50% 50%" },
        { scale: 1, duration: 0.5, ease: "back.out(2.4)", stagger: STAGGER, clearProps: "transform" },
        ARCS + DRAW * 0.75,
      );
  });
}
