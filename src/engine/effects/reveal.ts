/* ============================================================
   reveal — blocks fade up in staggered batches as they enter.
   Markup: data-reveal on any block. data-reveal="stagger" is left to
   reveal-stagger (a grid whose children land in a cascade).
   Blocks below the fold are hidden at init and marked
   data-motion-pending (the core shows one at once when keyboard focus
   lands inside it). One ScrollTrigger.batch hands them over as they
   enter: a jump (an anchor, find-in-page) hands over every block it
   skipped in one batch, so the ones already above the screen show at
   once and the stagger stays short for the rest. When a block has
   landed, control goes back to the stylesheet (clearProps), so its
   hover transforms keep working. A block keyboard focus has already
   shown is left alone when its batch comes (neither source does this:
   the batch re-tweened it, slower), and a batch plays in page order
   (the blocks of a grid row could land out of turn).
   Sources: A src/lib/motion.ts:600; C src/scripts/motion.ts:448;
   FAST fast/src/lib/motion.ts:23 (data-rise).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";
import { inPageOrder } from "./_batch";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-reveal]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 44; // px: how far a block rises (A 44, C 44, FAST 34)
const DURATION = 1.1; // s: how long a block takes to land (A 1.1, C 1.0, FAST 0.8)
const STAGGER = 0.09; // s between the blocks of a small batch (A 0.09, C 0.1, FAST 0.08)
const SPREAD = 0.45; // s a batch of more than five is spread over (A 0.45, C 0.5)
const START = "top 90%"; // where a block counts as entering (A, C and FAST)

export function init(kit: Kit): void {
  const blocks = kit
    .query(hook)
    .filter((el) => el.dataset.reveal !== "stagger" && !skipIntro(el) && !inFirstView(el));
  if (!blocks.length) return;
  gsap.set(blocks, { opacity: 0, y: RISE, transition: "none" });
  blocks.forEach((el) => el.setAttribute("data-motion-pending", ""));
  kit.cleanup(() => blocks.forEach((el) => el.removeAttribute("data-motion-pending")));
  ScrollTrigger.batch(blocks, {
    start: START,
    once: true,
    onEnter: (batch) => {
      // A block keyboard focus has already shown (core-focus-reveal) is
      // left to that: re-tweening it would slow it down again.
      // In page order: a row's blocks share a trigger position, and the
      // sorted triggers keep no order among equals.
      const els = (batch as HTMLElement[]).filter((el) => el.hasAttribute("data-motion-pending")).sort(inPageOrder);
      els.forEach((el) => el.removeAttribute("data-motion-pending"));
      const passed = els.filter((el) => el.getBoundingClientRect().bottom < 0);
      const entering = els.filter((el) => !passed.includes(el));
      if (passed.length) gsap.set(passed, { overwrite: true, clearProps: "opacity,transform,transition" });
      if (!entering.length) return;
      gsap.to(entering, {
        opacity: 1,
        y: 0,
        duration: DURATION,
        ease: "power3.out",
        stagger: entering.length > 5 ? { amount: SPREAD } : STAGGER,
        overwrite: true,
        clearProps: "opacity,transform,transition",
      });
    },
  });
}
