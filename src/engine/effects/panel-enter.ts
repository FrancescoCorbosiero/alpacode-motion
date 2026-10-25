/* ============================================================
   panel-enter — a form step or a tab comes in from the side it was
   asked from; its fields follow in a cascade.
   Markup: [data-panel-field] on what cascades in after the panel (its
   title, its fields, its buttons), or the site's selectors for it in
   config.ts. The page script that swaps the panels in calls
   panelEnter(panel, dir, fields?): dir 1 forward (it comes from the
   right), -1 back; fields, elements or a selector, in place of the
   hook's.
   The panel slides in from its side and fades up; its fields rise a
   little after it, one after another; then their transforms and
   opacity are the stylesheet's again. Nothing to build at init: the
   tabs or the steps are the page's. Under reduced motion it does
   nothing: the panel just shows.
   Sources: A src/lib/motion.ts:457; C src/scripts/motion.ts:256 (stepEnter).
   ============================================================ */
import { gsap } from "gsap";
import { config } from "../config";
import { reduced } from "../core/guards";
import type { Kit } from "../core/kit";

export const hook = "[data-panel-field]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SHIFT = 36; // px: how far to its side the panel starts (A; C 56)
const DURATION = 0.55; // s the panel takes (A; C 0.6)
const RISE = 16; // px each field rises (A; C 18)
const FIELD = 0.5; // s each field takes (A and C)
const STAGGER = 0.035; // s between fields (A; C 0.06)
const DELAY = 0.05; // s after the panel, the first field (A; C 0.08)

const fieldsIn = (panel: HTMLElement): Element[] =>
  [...panel.querySelectorAll([hook, ...(config.selectors[hook] ?? [])].join(","))];

/** A panel comes in from the side it was asked from, its fields after it. */
export function panelEnter(panel: HTMLElement, dir: 1 | -1, fields?: Iterable<Element> | string): void {
  if (reduced()) return;
  gsap.fromTo(
    panel,
    { x: SHIFT * dir, opacity: 0 },
    { x: 0, opacity: 1, duration: DURATION, ease: "power3.out", clearProps: "transform,opacity" },
  );
  const pieces = typeof fields === "string" ? [...panel.querySelectorAll(fields)] : fields ? [...fields] : fieldsIn(panel);
  if (!pieces.length) return;
  // Each waits in its start until its turn (a staggered from() could
  // let one show for a frame before it).
  gsap.set(pieces, { y: RISE, opacity: 0 });
  gsap.fromTo(
    pieces,
    { y: RISE, opacity: 0 },
    {
      y: 0,
      opacity: 1,
      duration: FIELD,
      ease: "power2.out",
      stagger: STAGGER,
      delay: DELAY,
      immediateRender: false,
      clearProps: "transform,opacity",
    },
  );
}

/** Nothing to build: the page's script calls panelEnter(). */
export function init(kit: Kit): void {
  void kit;
}
