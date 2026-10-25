/* ============================================================
   reveal-panel — a panel just swapped in (a thank-you, a share panel):
   its pieces rise in one after another.
   Markup: data-reveal-panel on a panel the page shows by removing its
   hidden attribute: each time it's shown, its children rise in. Or,
   without the hook, the script that swaps it in calls
   revealPanel(panel) (alpacode's, only when the panel is new, not when
   it's restored): one or the other, not both.
   Its children start a little lower and transparent and rise into place
   one after another; then their transforms and opacity are the
   stylesheet's again. Under reduced motion it does nothing: the panel
   just shows.
   Sources: A src/lib/motion.ts:480.
   ============================================================ */
import { gsap } from "gsap";
import { reduced } from "../core/guards";
import type { Kit } from "../core/kit";

export const hook = "[data-reveal-panel]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const RISE = 26; // px each piece rises (A)
const DURATION = 0.6; // s each piece takes (A)
const STAGGER = 0.06; // s between pieces (A)

/** A panel just swapped in: its pieces rise in one after another. */
export function revealPanel(panel: HTMLElement): void {
  if (reduced()) return;
  const pieces = [...panel.children];
  if (!pieces.length) return;
  // Each waits in its start until its turn (a staggered from() could
  // let one show for a frame before it).
  gsap.set(pieces, { y: RISE, opacity: 0 });
  gsap.fromTo(
    pieces,
    { y: RISE, opacity: 0 },
    { y: 0, opacity: 1, duration: DURATION, ease: "power3.out", stagger: STAGGER, immediateRender: false, clearProps: "transform,opacity" },
  );
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((panel) => {
    const watch = new MutationObserver((records) => {
      if (records.some((r) => r.oldValue !== null) && !panel.hidden) revealPanel(panel);
    });
    watch.observe(panel, { attributes: true, attributeFilter: ["hidden"], attributeOldValue: true });
    kit.cleanup(() => watch.disconnect());
  });
}
