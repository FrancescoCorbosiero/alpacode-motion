/* ============================================================
   core-scroll-lock, the overlays' side.
   A ref-counted body scroll lock, shared by every overlay (a dialog,
   the mobile nav). Each overlay saving and restoring
   body.style.overflow on its own breaks with two open at once: closed
   in the wrong order, one writes a stale "hidden" back.
   It announces itself ("motion:scroll-lock", detail = locked) so the
   engine pauses Lenis with it (lenis.ts). Import this, not the engine.
   Source: A src/lib/scroll-lock.ts (event "alpa:scroll-lock", renamed
   in the naming registry).
   ============================================================ */

let locks = 0;

const announce = (locked: boolean): void => {
  document.dispatchEvent(new CustomEvent("motion:scroll-lock", { detail: locked }));
};

/** Acquire the lock; call the returned function to release it. */
export function lockScroll(): () => void {
  locks += 1;
  if (locks === 1) {
    document.body.style.overflow = "hidden";
    announce(true);
  }
  let released = false;
  return () => {
    if (released) return;
    released = true;
    locks -= 1;
    if (locks === 0) {
      document.body.style.overflow = "";
      announce(false);
    }
  };
}
