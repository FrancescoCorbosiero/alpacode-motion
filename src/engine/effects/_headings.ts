/* ============================================================
   The headings' shared move (catalog.md, Tier 1 › Headings), used by
   every split-* entry: SplitText with autoSplit (it splits again when
   fonts or widths change, and hands the new split the tween's
   progress), one ScrollTrigger at top 88%, once; skipped in the first
   view and inside CSS intros. Each entry brings its own split and tween.
   Not an entry: copied with whichever split-* entry needs it.
   Sources: A src/lib/motion.ts:584; C src/scripts/motion.ts:415.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { inFirstView, skipIntro } from "../core/guards";

gsap.registerPlugin(ScrollTrigger, SplitText);

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const START = "top 88%"; // where a heading's trigger fires (A and C)

export interface HeadingMove {
  /** How the heading is split: SplitText's type and mask. */
  split: { type: string; mask?: "lines" | "words" | "chars" };
  /** The tween over the split, on the heading's trigger. Returned, so a
   *  re-split carries its progress over. */
  play: (split: SplitText, scrollTrigger: ScrollTrigger.Vars) => gsap.core.Animation;
}

/** Split a heading and play its move as it enters. */
export function splitHeading(el: HTMLElement, move: HeadingMove): void {
  if (skipIntro(el) || inFirstView(el)) return;
  SplitText.create(el, {
    ...move.split,
    linesClass: "split-line",
    wordsClass: "split-word",
    autoSplit: true,
    onSplit: (self) => move.play(self, { trigger: el, start: START, once: true }),
  });
}
