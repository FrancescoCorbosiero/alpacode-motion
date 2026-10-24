/* ============================================================
   wordmark — the footer's wordmark: the letters rise, then a mascot
   enters.
   Markup: data-wordmark on the wordmark, each letter a
   [data-wordmark-char], the mascot (if any) a [data-wordmark-mascot];
   data-wordmark="bounce" for the other variant. For "rise" each letter
   sits in a clip of its own (an overflow: clip wrapper in the markup:
   a hand-kerned wordmark keeps its letters as they are, a split would
   undo the kerning), and so does the mascot.
   rise (A): the letters rise out of their masks one after the other;
   a beat later the mascot rises from behind, the same move.
   bounce (C): the letters jump up from below, tilted at random, and
   spring into place; the mascot drops onto them, tumbling, and bounces.
   Once, as the wordmark shows: it is the last thing on the page.
   Decorative (aria-hidden): nothing waits for it. The letters wait in
   their start state from init and play from it (a staggered from() can
   show its waiting pieces in their end state, _headings.ts).
   Sources: A src/lib/motion.ts:1005; C src/scripts/motion.ts:1161.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-wordmark]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 110; // %: rise, how far below its place each letter starts, in its mask (A)
const DURATION = 1.2; // s: rise, how long each letter takes (A)
const STAGGER = 0.045; // s: rise, between letters (A)
const EASE = "power4.out"; // rise: the long, soft landing (A)
const MASCOT_AT = 0.75; // s into the rise: the mascot rises from behind, the same move a beat later (A)
const BOUNCE = { rise: 115, tilt: 14, duration: 1, stagger: 0.028, ease: "back.out(1.7)" }; // bounce: the letters jump up, tilted at random up to tilt degrees, and spring in (C)
const DROP = 260; // px: bounce, the mascot drops from this high, tumbling, as the letters land (C)
const START = "top 98%"; // its top here: it plays as soon as it shows (A 98%, C 96%)

/** Hide the pieces now and play them in from there. */
function enter(tl: gsap.core.Timeline, pieces: Element[], from: gsap.TweenVars, to: gsap.TweenVars, at?: gsap.Position): void {
  gsap.set(pieces, { ...from });
  tl.fromTo(pieces, { ...from }, { ...to, immediateRender: false }, at);
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    if (skipIntro(root) || inFirstView(root)) return;
    const letters = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-wordmark-char]"));
    const mascot = root.querySelector<HTMLElement>("[data-wordmark-mascot]");
    const tl = gsap.timeline({ scrollTrigger: { trigger: root, start: START, once: true } });
    if (root.dataset.wordmark === "bounce") {
      const tilts = letters.map(() => gsap.utils.random(-BOUNCE.tilt, BOUNCE.tilt));
      enter(
        tl,
        letters,
        { yPercent: BOUNCE.rise, rotation: (i: number) => tilts[i] ?? 0 },
        { yPercent: 0, rotation: 0, duration: BOUNCE.duration, ease: BOUNCE.ease, stagger: BOUNCE.stagger, clearProps: "transform" },
      );
      if (mascot) {
        enter(tl, [mascot], { y: -DROP, rotation: -50, opacity: 0 }, { y: 0, rotation: 0, opacity: 1, duration: 1.1, ease: "bounce.out", clearProps: "transform,opacity" }, "-=0.55");
      }
      return;
    }
    enter(tl, letters, { yPercent: RISE }, { yPercent: 0, duration: DURATION, ease: EASE, stagger: STAGGER, clearProps: "transform" });
    if (mascot) enter(tl, [mascot], { yPercent: 104 }, { yPercent: 0, duration: 1, ease: "power3.out", clearProps: "transform" }, MASCOT_AT);
  });
}
