/* ============================================================
   magnetic — pulled toward the pointer, springs back on leave.
   Markup: data-magnetic on the element (a call to action, a badge);
   data-magnetic="flat" is pulled harder and doesn't lean (C's).
   With a mouse only: as the pointer moves over it, it follows a part of
   the pointer's offset from its centre and leans toward it in 3D, and
   springs back when the pointer leaves, its transform the stylesheet's
   again. A transition on its transform (a button's press) is held while
   it plays (_pointer.ts). Nothing happens on touch, nor under reduced
   motion.
   Sources: A src/lib/motion.ts:1097; C src/scripts/motion.ts:1210.
   ============================================================ */
import type { Kit } from "../core/kit";
import { play } from "./_pointer";

export const hook = "[data-magnetic]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const PULL = 0.16; // how much of the pointer's offset from its centre it follows (A; C 0.35: data-magnetic="flat")
const LEAN = 12; // degrees it leans meanwhile, rotationY 1.2 times (A; C none: "flat")
const FLAT_PULL = 0.35; // data-magnetic="flat": pulled harder, no lean (C)
const PERSPECTIVE = 800; // px, for the lean (A)
const FOLLOW = 0.45; // s it takes to catch up with the pointer (A; C 0.4)
const SPRING = "elastic.out(1, 0.5)"; // back when the pointer leaves (A; C elastic.out(1, 0.4))
const BACK = 0.9; // s the spring takes (A; C 0.8)

export function init(kit: Kit): void {
  if (!kit.fine) return;
  kit.query(hook).forEach((el) => {
    if (el.closest("astro-island")) return;
    const flat = el.dataset.magnetic === "flat";
    play(kit, el, {
      lean: flat ? 0 : LEAN,
      perspective: PERSPECTIVE,
      pull: flat ? FLAT_PULL : PULL,
      follow: FOLLOW,
      back: { duration: BACK, ease: SPRING },
    });
  });
}
