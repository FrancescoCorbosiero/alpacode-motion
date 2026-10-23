/* ============================================================
   core-header.
   The header reports `.scrolled` past 8px and slides away
   (`.is-hidden`) while the page is read downwards, back as soon as the
   reader turns round; it stays while the mobile nav is open (C). The
   scroll-top button shows past 600px, a floating button past the fold
   (A). Under reduced motion it still reports `.scrolled`, but never
   slides away. Canonical: the union.
   Sources: A src/lib/motion.ts:300; C src/scripts/motion.ts:321.
   ============================================================ */
import { config } from "../config";
import { reduced } from "./guards";

let lastY = 0;

function onScroll(): void {
  const y = window.scrollY;
  const header = document.querySelector<HTMLElement>(config.header);
  if (header) {
    header.classList.toggle("scrolled", y > 8);
    if (reduced()) {
      header.classList.remove("is-hidden");
    } else {
      const navOpen = !!config.navOpen && !!document.querySelector(config.navOpen);
      if (!navOpen && y > 240 && y > lastY + 4) header.classList.add("is-hidden");
      else if (navOpen || y < lastY - 4 || y <= 240) header.classList.remove("is-hidden");
    }
  }
  document.querySelector<HTMLElement>("[data-scroll-top]")?.classList.toggle("is-visible", y > 600);
  // Pages whose hero buttons sit low on phones keep the floating button
  // for after the first screen.
  document
    .querySelector<HTMLElement>("[data-fab]")
    ?.classList.toggle("is-past-fold", y > window.innerHeight * 0.6);
  lastY = y;
}
window.addEventListener("scroll", onScroll, { passive: true });

/** A new page: read where it starts. */
export function resetHeader(): void {
  lastY = window.scrollY;
  onScroll();
}
