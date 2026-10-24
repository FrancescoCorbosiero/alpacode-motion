/* ============================================================
   cases — Casi di studio: the projects one after another on a pinned
   stage, each one's "before" struck through as its "after" comes in.
   Markup: data-scene="cases" on a tall wrapper (--len, in screens: one
   per case and one for the stage) whose stage the site's CSS makes
   sticky under .has-motion, with its cases laid one over the other;
   the cases [data-case], each with its frame [data-case-frame], its
   text [data-case-text], the line [data-case-strike] over its "before"
   and its "after" value [data-case-after]; the progress
   [data-cases-progress] (hidden, a span > i per case).
   One timeline scrubbed over the wrapper, a case per unit: the line
   strikes the "before" through, the "after" comes in, then the next
   site wipes up over the frame while the text hands over (beats, as
   the stage does it). The case on stage is .is-active (the CSS lets
   only that one take the pointer). The texts only fade, so their links
   stay focusable: when keyboard focus lands in a case still to come,
   the page scrolls to it. Laid out (no script, reduced motion), the
   cases stand one under the other, struck through and complete.
   Sources: A src/components/home/Cases.astro (new: the home, Casi di
   studio).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = '[data-scene="cases"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SMOOTH = 0.6; // s the stage takes to catch up with the scroll
const HOLD = 0.7; // share of a case's scroll it holds the stage before the next comes in
const STRIKE = 0.12; // where in its unit the line strikes the "before" through
const TURN = 0.26; // where in its unit the "after" comes in
const SHIFT = 36; // px the texts travel as they hand over

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    const cases = gsap.utils.toArray<HTMLElement>("[data-case]", root);
    const n = cases.length;
    if (!n) return;
    const part = (el: HTMLElement | undefined, sel: string) => el?.querySelector<HTMLElement>(sel) ?? null;
    const progress = root.querySelector<HTMLElement>("[data-cases-progress]");
    const bars = progress ? gsap.utils.toArray<HTMLElement>("i", progress) : [];
    if (progress) {
      progress.hidden = false;
      kit.cleanup(() => (progress.hidden = true));
    }

    let active = -1;
    const setActive = (i: number): void => {
      if (i === active) return;
      active = i;
      cases.forEach((c, k) => c.classList.toggle("is-active", k === i));
    };
    kit.cleanup(() => cases.forEach((c) => c.classList.remove("is-active")));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: {
        trigger: root,
        start: "top top",
        end: "bottom bottom",
        scrub: SMOOTH,
        invalidateOnRefresh: true,
        onUpdate: (st) => setActive(Math.min(n - 1, Math.floor(st.progress * n + (1 - HOLD) / 2))),
      },
    });

    cases.forEach((c, k) => {
      const strike = part(c, "[data-case-strike]");
      const after = part(c, "[data-case-after]");
      if (strike) tl.fromTo(strike, { scaleX: 0 }, { scaleX: 1, duration: 0.16, ease: "power2.inOut" }, k + STRIKE);
      if (after) tl.fromTo(after, { opacity: 0, y: 18 }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, k + TURN);
      const bar = bars[k];
      if (bar) tl.fromTo(bar, { scaleX: 0 }, { scaleX: 1, duration: 1 }, k);
      if (k === 0) return;
      // The hand-over from the case before, in the last part of its unit.
      const prev = cases[k - 1];
      const t = k - (1 - HOLD);
      tl.fromTo(
        part(prev, "[data-case-text]"),
        { opacity: 1, y: 0 },
        { opacity: 0, y: -SHIFT, duration: 0.12, ease: "power1.in", immediateRender: false },
        t,
      )
        .fromTo(part(c, "[data-case-text]"), { opacity: 0, y: SHIFT }, { opacity: 1, y: 0, duration: 0.16, ease: "power2.out" }, t + 0.1)
        .fromTo(
          part(prev, "[data-case-frame]"),
          { scale: 1, opacity: 1 },
          { scale: 0.94, opacity: 0.4, duration: 0.26, ease: "power2.inOut", immediateRender: false },
          t,
        )
        .fromTo(
          part(c, "[data-case-frame]"),
          { clipPath: "inset(100% 0% 0% 0%)" },
          { clipPath: "inset(0% 0% 0% 0%)", duration: 0.26, ease: "power2.inOut" },
          t,
        );
    });
    // Every case gets the same share of the scroll.
    tl.set({}, {}, n);
    setActive(0);

    // A link in a case still to come: bring that case on stage.
    kit.on(root, "focusin", (e) => {
      const k = cases.findIndex((c) => c.contains(e.target as Node));
      const st = tl.scrollTrigger;
      if (k < 0 || k === active || !st) return;
      window.scrollTo({ top: st.start + (st.end - st.start) * ((k + HOLD / 2) / n) });
    });
  });
}
