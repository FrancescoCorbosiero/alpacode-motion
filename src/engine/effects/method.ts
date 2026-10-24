/* ============================================================
   method — Metodo: one technical drawing on a pinned stage, turning
   into the next step's as the visitor scrolls.
   Markup: data-scene="method" on a tall wrapper (--len, in screens)
   whose stage the site's CSS makes sticky under .has-motion, with the
   steps' drawings laid one over the other; the steps
   [data-method-step], each with its drawing (an <svg>) and its text
   [data-method-text]. Every drawing is made of the same pieces, marked
   [data-method-piece="<key>"] (rects, circles, a path with as many
   points in every drawing), plus its note [data-method-note]; the
   progress [data-method-rail] (hidden, an i inside).
   The drawings are the states: the scene reads each piece's geometry
   from them (x y width height, cx cy r, d) and tweens the first
   drawing's pieces from one to the next — so a drawing is changed in
   the markup alone. The others stand aside, their notes move into the
   first one and cross-fade. Holds, then a turn: the step on stage is
   .is-active; on a desktop the other texts stay readable, dimmed; on a
   phone they share one place and hand over. Laid out (no script,
   reduced motion), every step shows its own drawing.
   Sources: A src/components/home/Process.astro (new: the home and
   /servizi, Metodo).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = '[data-scene="method"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SMOOTH = 0.6; // s the drawing takes to catch up with the scroll
const TURN = 0.45; // share of a step's scroll the drawing takes to become the next one
const END = 0.6; // steps of scroll the last drawing holds before the stage lets go
const DIM = 0.32; // opacity of a step's text off stage, on a desktop (on a phone: 0, they hand over)
const DESK = "(min-width: 901px)"; // where the texts stand in a column beside the drawing
const PHONE = "(max-width: 900px)"; // where they share one place under it
const SHIFT = 20; // px the texts travel as they hand over on a phone

type Geometry = Record<string, string>;

const GEOMETRY: Record<string, string[]> = { rect: ["x", "y", "width", "height"], circle: ["cx", "cy", "r"], path: ["d"] };

function geometry(el: Element): Geometry {
  const out: Geometry = {};
  (GEOMETRY[el.tagName.toLowerCase()] ?? []).forEach((a) => {
    const v = el.getAttribute(a);
    if (v != null) out[a] = v;
  });
  return out;
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    const steps = gsap.utils.toArray<HTMLElement>("[data-method-step]", root);
    const arts = steps.map((s) => s.querySelector<SVGSVGElement>("svg"));
    const texts = steps.map((s) => s.querySelector<HTMLElement>("[data-method-text]"));
    const main = arts[0];
    const n = steps.length;
    if (n < 2 || !main || arts.some((a) => !a)) return;
    const pieces = gsap.utils.toArray<SVGElement>("[data-method-piece]", main);
    const states = arts.map((svg) => {
      const map: Record<string, Geometry> = {};
      svg!.querySelectorAll<SVGElement>("[data-method-piece]").forEach((el) => (map[el.dataset.methodPiece ?? ""] = geometry(el)));
      return map;
    });
    const T = n - 1 + END;
    const rail = root.querySelector<HTMLElement>("[data-method-rail]");
    if (rail) {
      rail.hidden = false;
      kit.cleanup(() => (rail.hidden = true));
    }

    let active = -1;
    const setActive = (i: number): void => {
      if (i === active) return;
      active = i;
      texts.forEach((t, k) => t?.classList.toggle("is-active", k === i));
    };
    kit.cleanup(() => texts.forEach((t) => t?.classList.remove("is-active")));

    kit.media.add({ desk: DESK, phone: PHONE }, (self) => {
      const desk = !!self.conditions?.desk;
      // The other drawings stand aside; their notes join the first one.
      gsap.set(arts.slice(1), { autoAlpha: 0 });
      const notes = arts.map((svg, s) => {
        const note = svg!.querySelector<SVGGElement>("[data-method-note]");
        if (!note || s === 0) return note;
        const copy = note.cloneNode(true) as SVGGElement;
        main.appendChild(copy);
        return copy;
      });
      gsap.set(notes.slice(1), { opacity: 0 });
      gsap.set(texts.slice(1), { opacity: desk ? DIM : 0, y: desk ? 0 : SHIFT });

      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: root,
          start: "top top",
          end: "bottom bottom",
          scrub: SMOOTH,
          invalidateOnRefresh: true,
          onUpdate: (st) => setActive(Math.min(n - 1, Math.floor(st.progress * T + TURN / 2))),
        },
      });
      for (let s = 1; s < n; s++) {
        const at = s - TURN;
        pieces.forEach((el) => {
          const key = el.dataset.methodPiece ?? "";
          const from = states[s - 1]?.[key];
          const to = states[s]?.[key];
          if (!from || !to) return;
          tl.fromTo(el, { attr: from }, { attr: to, duration: TURN, ease: "power2.inOut", immediateRender: false }, at);
        });
        const was = notes[s - 1];
        const now = notes[s];
        if (was) tl.fromTo(was, { opacity: 1 }, { opacity: 0, duration: TURN / 2, immediateRender: false }, at);
        if (now) tl.fromTo(now, { opacity: 0 }, { opacity: 1, duration: TURN / 2, immediateRender: false }, at + TURN / 2);
        const before = texts[s - 1];
        const after = texts[s];
        if (before)
          tl.fromTo(
            before,
            { opacity: 1, y: 0 },
            { opacity: desk ? DIM : 0, y: desk ? 0 : -SHIFT, duration: TURN / 2, immediateRender: false },
            at + TURN * 0.25,
          );
        if (after)
          tl.fromTo(
            after,
            { opacity: desk ? DIM : 0, y: desk ? 0 : SHIFT },
            { opacity: 1, y: 0, duration: TURN / 2, immediateRender: false },
            at + TURN / 2,
          );
      }
      const bar = rail?.querySelector("i");
      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: T, immediateRender: false }, 0);
      tl.set({}, {}, T);
      setActive(0);

      return () => {
        notes.slice(1).forEach((note) => note?.remove());
        active = -1;
      };
    });
  });
}
