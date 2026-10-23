/* ============================================================
   scrub — a statement's words light up as the scroll reads them.
   Markup: data-scrub on a paragraph.
   The words start dim and come to full strength one after another,
   scrubbed by the scroll from when the statement enters until its
   foot passes the middle of the screen; scrolling back dims them
   again. SplitText splits it into words and splits again when widths
   or fonts change.
   The port leaves a statement in the first view alone, like every
   effect that hides: dimming painted words is hiding them (neither
   source checks).
   Sources: A src/lib/motion.ts:699; C src/scripts/motion.ts:499.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { SplitText } from "gsap/SplitText";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger, SplitText);

export const hook = "[data-scrub]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DIM = 0.16; // opacity of a word not read yet (A and C)
const START = "top 82%"; // the statement's top here: the first word starts (A and C)
const END = "bottom 48%"; // its foot here: the last word is lit (A 48%, C 50%)
const SMOOTH = 0.6; // s the words take to catch up with the scroll (A and C)

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    if (skipIntro(el) || inFirstView(el)) return;
    SplitText.create(el, {
      type: "words",
      wordsClass: "scrub-word",
      autoSplit: true,
      onSplit: (self) =>
        gsap.fromTo(
          self.words,
          { opacity: DIM },
          {
            opacity: 1,
            ease: "none",
            stagger: 0.1,
            scrollTrigger: { trigger: el, start: START, end: END, scrub: SMOOTH },
          },
        ),
    });
  });
}
