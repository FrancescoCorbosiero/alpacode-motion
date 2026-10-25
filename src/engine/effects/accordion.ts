/* ============================================================
   accordion — a <details> opens and closes with a height tween;
   clicked again while closing, it opens back up from where it is.
   Markup: data-accordion on a <details>, its <summary>, then the answer
   in one box (its padding inside it, so padding never fights the
   tween). While it closes the details is marked .is-closing (the
   summary's icon can turn back at once: it stays [open] until the
   answer has folded away).
   A click (or Enter, Space) on the summary opens the answer from 0 to
   its height, fading in, or folds it away, fading out; a click while it
   folds opens it back up from where it is. Then its height is the
   stylesheet's again. Without JS, and under reduced motion, it's the
   native <details>. The port clips the answer while it folds too (A
   only while it opened: the text spilled over what follows).
   Sources: A src/lib/motion.ts:1058 (details.rf-faq-item).
   ============================================================ */
import { gsap } from "gsap";
import type { Kit } from "../core/kit";

export const hook = "[data-accordion]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const OPEN = 0.55; // s it takes to open (A)
const OPEN_EASE = "power3.out"; // (A)
const CLOSE = 0.42; // s it takes to fold away (A)
const CLOSE_EASE = "power3.inOut"; // (A)

const HANDED_BACK = "height,opacity,overflow";

export function init(kit: Kit): void {
  kit.query<HTMLDetailsElement>(hook).forEach((details) => {
    if (!(details instanceof HTMLDetailsElement)) return;
    const summary = details.querySelector<HTMLElement>(":scope > summary");
    const body = summary?.nextElementSibling;
    if (!summary || !(body instanceof HTMLElement)) return;
    let tween: gsap.core.Tween | null = null;
    const closing = (): boolean => details.classList.contains("is-closing");
    kit.on(summary, "click", (e) => {
      e.preventDefault();
      tween?.kill();
      if (details.open && !closing()) {
        details.classList.add("is-closing");
        gsap.set(body, { overflow: "hidden" });
        tween = gsap.to(body, {
          height: 0,
          opacity: 0,
          duration: CLOSE,
          ease: CLOSE_EASE,
          onComplete: () => {
            details.open = false;
            details.classList.remove("is-closing");
            gsap.set(body, { clearProps: HANDED_BACK });
          },
        });
      } else {
        // Clicked again while folding: open back up from where it is.
        const from = closing() ? body.offsetHeight : 0;
        details.classList.remove("is-closing");
        details.open = true;
        tween = gsap.fromTo(
          body,
          { height: from, opacity: from ? Number(gsap.getProperty(body, "opacity")) : 0, overflow: "hidden" },
          { height: "auto", opacity: 1, duration: OPEN, ease: OPEN_EASE, clearProps: HANDED_BACK },
        );
      }
    });
    kit.cleanup(() => {
      tween?.kill();
      if (closing()) details.open = false; // the page goes mid-fold: it was asked to close
      details.classList.remove("is-closing");
      gsap.set(body, { clearProps: HANDED_BACK });
    });
  });
}
