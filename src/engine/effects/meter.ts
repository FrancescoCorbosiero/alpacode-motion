/* ============================================================
   meter — a needle swings from one end of a dial to the other as the
   visitor scrolls; the word under it scrambles into the next; the
   beats hand over.
   Markup: data-scene="meter" on a tall wrapper (--len, in screens)
   whose stage ([data-scene-stage]) sticks under .has-motion; the
   needle [data-meter-needle] (an SVG group turning on
   data-meter-pivot="x y", in the drawing's units), the word
   [data-meter-word], the beats [data-meter-beat], each naming its word
   in [data-meter-key]. Laid out, the needle rests at the far end (its
   transform in the markup) on the last beat's word, the beats read in
   order.
   One timeline scrubbed over the wrapper: the needle starts at FROM and
   reaches TO on the last beat, a step per beat, springing a little;
   the word scrambles as each beat comes in. The timeline owns the
   needle's start (fromTo), so a refresh mid-scene stays right.
   Sources: AF fast/src/lib/motion.ts:81 (FAST's home);
   H sites/studio/src/lib/motion.ts:71 (Alpacode Studio, /prodotti/ai-al-lavoro).
   ============================================================ */
import { gsap } from "gsap";
import { ScrambleTextPlugin } from "gsap/ScrambleTextPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger, ScrambleTextPlugin);

export const hook = '[data-scene="meter"]';

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const FROM = -80; // degrees: where the needle starts (FAST and the studio)
const TO = 80; // degrees: where it ends, on the last beat (FAST and the studio)
const SMOOTH = 0.6; // s the scene takes to catch up with the scroll
const SPRING = "back.out(2.4)"; // how the needle lands on each step (FAST and the studio)
const SCRAMBLE = "upperCase"; // the characters the word scrambles through (FAST and the studio)

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    const needle = root.querySelector<SVGGElement>("[data-meter-needle]");
    const word = root.querySelector<HTMLElement>("[data-meter-word]");
    const beats = gsap.utils.toArray<HTMLElement>("[data-meter-beat]", root);
    if (!needle || !word || beats.length < 2) return;
    const pivot = needle.dataset.meterPivot ?? "200 200";
    const words = beats.map((b) => b.querySelector("[data-meter-key]")?.textContent?.trim() ?? "");
    const angle = (i: number) => FROM + ((TO - FROM) * i) / (beats.length - 1);
    const last = word.textContent ?? "";
    word.textContent = words[0] ?? "";
    kit.cleanup(() => (word.textContent = last));

    const tl = gsap.timeline({
      defaults: { ease: "none" },
      scrollTrigger: { trigger: root, start: "top top", end: "bottom bottom", scrub: SMOOTH, invalidateOnRefresh: true },
    });
    // The timeline owns the start: the needle at FROM, the first beat in.
    tl.fromTo(needle, { rotation: angle(0), svgOrigin: pivot }, { rotation: angle(0), duration: 0.01 }, 0);
    beats.forEach((b, i) => {
      if (i === 0) return;
      const at = i / beats.length;
      tl.fromTo(beats[i - 1], { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -30, duration: 0.05, immediateRender: false }, at - 0.05)
        .fromTo(b, { autoAlpha: 0, y: 30 }, { autoAlpha: 1, y: 0, duration: 0.06, ease: "power2.out" }, at)
        .fromTo(
          needle,
          { rotation: angle(i - 1), svgOrigin: pivot },
          { rotation: angle(i), duration: 0.12, ease: SPRING, immediateRender: false },
          at - 0.06,
        )
        .to(word, { scrambleText: { text: words[i] ?? "", chars: SCRAMBLE, speed: 0.7 }, duration: 0.08 }, at - 0.03);
    });
    tl.to({}, { duration: 0.1 }, 0.9);
  });
}
