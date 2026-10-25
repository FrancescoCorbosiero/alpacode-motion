/* ============================================================
   tilt — leans toward the pointer in 3D; data-tilt="card" also lifts.
   Markup: data-tilt on the element; data-tilt="card" leans further and
   rises a little while the pointer is on it (C's cards).
   With a mouse only: as the pointer moves over it, it leans toward it
   (a few degrees at its edges), and springs back when it leaves, its
   transform the stylesheet's again. A transition on its transform is
   held while it plays (_pointer.ts). An element that is also magnetic
   is magnetic's, which leans too. Nothing happens on touch, nor under
   reduced motion.
   Sources: A src/lib/motion.ts:1097; C src/scripts/motion.ts:1177.
   ============================================================ */
import type { Kit } from "../core/kit";
import { play } from "./_pointer";

export const hook = "[data-tilt]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const LEAN = 5; // degrees it leans at its edges, rotationY 1.2 times (A; C's cards 10: data-tilt="card")
const CARD_LEAN = 10; // data-tilt="card": degrees (C)
const CARD_LIFT = 8; // data-tilt="card": px it rises while the pointer is on it (C)
const CARD_SCALE = 1.015; // data-tilt="card": how much it swells meanwhile (C)
const PERSPECTIVE = 800; // px (A; C 900)
const FOLLOW = 0.5; // s the lean takes to catch up with the pointer (A and C)
const SPRING = "elastic.out(1, 0.5)"; // back when the pointer leaves (A; C elastic.out(1, 0.6))
const BACK = 0.9; // s the spring takes (A and C)

export function init(kit: Kit): void {
  if (!kit.fine) return;
  const magnets = new Set(kit.query("[data-magnetic]"));
  kit.query(hook).forEach((el) => {
    if (magnets.has(el) || el.closest("astro-island")) return;
    const card = el.dataset.tilt === "card";
    play(kit, el, {
      lean: card ? CARD_LEAN : LEAN,
      perspective: PERSPECTIVE,
      pull: 0,
      follow: FOLLOW,
      lift: card ? { y: CARD_LIFT, scale: CARD_SCALE } : undefined,
      back: { duration: BACK, ease: SPRING },
    });
  });
}
