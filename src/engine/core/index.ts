/* ============================================================
   The core: the skeleton every effect stands on, copied once per site
   (catalog.md, Core). What page scripts and effects import from it.
   Overlays import scroll-lock.ts directly, not this: it keeps them
   free of the engine.
   ============================================================ */
export { start, restart } from "./lifecycle";
export { scrollToTarget } from "./scroll";
export { fxLayer } from "./fx-layer";
export { reduced, fine, inFirstView, below, skipIntro } from "./guards";
export type { Kit, Effect, LazyEffect, On } from "./kit";
