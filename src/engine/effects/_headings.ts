/* ============================================================
   The headings' shared move (catalog.md, Tier 1 › Headings), used by
   every split-* entry: SplitText with autoSplit (it splits again when
   fonts or widths change, and hands the new split the tween's
   progress), one ScrollTrigger at top 88%, once; skipped in the first
   view and inside CSS intros. Each entry brings its own split and tween,
   and adds it to the deck as it loads: split-cycle deals a heading that
   doesn't ask for a variant the next move in turn from the deck, so the
   deck is exactly the split-* entries a site copied.
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

/** A move's pieces wait in their start state from init, and the tween
 *  plays them from it as the heading enters. The start is set here, not
 *  left to a staggered from(): GSAP re-renders a from() tween's start as
 *  it begins, and when several headings start at once (a jump down the
 *  page) the pieces whose turn hadn't come could show their end state
 *  until it did — a flash, intermittent, in both sources. */
export function enter(
  pieces: Element[],
  from: gsap.TweenVars,
  to: gsap.TweenVars,
  scrollTrigger: ScrollTrigger.Vars,
): gsap.core.Tween {
  gsap.set(pieces, { ...from });
  return gsap.fromTo(pieces, { ...from }, { ...to, immediateRender: false, scrollTrigger });
}

/** Split a heading and play its move as it enters. */
export function splitHeading(el: HTMLElement, move: HeadingMove): void {
  if (skipIntro(el) || inFirstView(el)) return;
  SplitText.create(el, {
    ...move.split,
    linesClass: "split-line",
    wordsClass: "split-word",
    charsClass: "split-char",
    autoSplit: true,
    onSplit: (self) => move.play(self, { trigger: el, start: START, once: true }),
  });
}

/** A move in the deck: its name (the value of data-split that asks for
 *  it) and the hook its entry answers to. */
export interface DeckMove {
  hook: string;
  move: HeadingMove;
}

const deck = new Map<string, DeckMove>();

/** Each split-* entry adds its move as it loads. */
export function addMove(name: string, hook: string, move: HeadingMove): void {
  deck.set(name, { hook, move });
}

/** The moves the site copied, by name. */
export const movesOf = (): ReadonlyMap<string, DeckMove> => deck;
