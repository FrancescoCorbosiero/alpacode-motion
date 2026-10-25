/* ============================================================
   nudge — the "no-no" shake on fields that need fixing.
   Markup: data-nudge on a form the browser validates: when it flags
   its fields (a submit, reportValidity(), checkValidity()), they shake
   together, each field's [data-nudge-field] (else its label, else the
   control itself). A form that validates in its own script calls
   nudge(fields) instead (both sources do: their .is-invalid fields).
   A quick shake left and right, settling, like a head saying no; then
   the transform is the stylesheet's again (both sources left an inline
   translate(0px, 0px) behind: a keyframed tween ignores its clearProps).
   Under reduced motion it does nothing: the browser's own message, or
   the page's, says it.
   Sources: A src/lib/motion.ts:472; C src/scripts/motion.ts:301.
   ============================================================ */
import { gsap } from "gsap";
import { reduced } from "../core/guards";
import type { Kit } from "../core/kit";

export const hook = "[data-nudge]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SHAKE = [-10, 9, -6, 4, 0]; // px: the shake, one way and the other, settling (A and C)
const DURATION = 0.45; // s (A and C)

/** The "no-no" shake on fields that need fixing. */
export function nudge(fields: Iterable<Element>): void {
  const list = Array.from(fields);
  if (reduced() || !list.length) return;
  // A keyframed tween ends on its last frame's inline transform, whatever
  // its clearProps (both sources left translate(0px, 0px) behind): the
  // transform is handed back once it's done.
  gsap.fromTo(list, { x: 0 }, { keyframes: { x: SHAKE }, duration: DURATION, ease: "none", onComplete: () => void gsap.set(list, { clearProps: "transform" }) });
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((form) => {
    let flagged = new Set<Element>();
    // invalid doesn't bubble: heard on the way down, the form's fields
    // gathered and shaken together once the browser is done flagging.
    kit.on(
      form,
      "invalid",
      (e) => {
        const control = e.target instanceof Element ? e.target : null;
        if (!control) return;
        if (!flagged.size) queueMicrotask(() => {
          nudge(flagged);
          flagged = new Set();
        });
        flagged.add(control.closest("[data-nudge-field]") ?? control.closest("label") ?? control);
      },
      { capture: true },
    );
  });
}
