/* ============================================================
   core-lenis and core-scroll-lock.
   Lenis smooths wheel and trackpad (touch keeps native scrolling),
   driven by GSAP's ticker and synced to ScrollTrigger. It is recreated
   after every page swap: the swap wipes the classes it sets on <html>.
   Overlays pause it by announcing themselves (scroll-lock.ts); they
   don't import the engine.
   Sources: A src/lib/motion.ts:222, :246; C src/scripts/motion.ts:130, :152.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import Lenis from "lenis";
import { config } from "../config";
import { reduced } from "./guards";

gsap.registerPlugin(ScrollTrigger);

let lenis: Lenis | null = null;
let locked = false;

export const currentLenis = (): Lenis | null => lenis;

export function createLenis(): void {
  if (lenis || reduced()) return;
  lenis = new Lenis({
    lerp: 0.1,
    // Scrollable panes (a modal, the mobile menu) scroll natively under
    // the pointer.
    allowNestedScroll: true,
    prevent: (node) => !!config.scrollPanes && node.matches(config.scrollPanes),
  });
  lenis.on("scroll", ScrollTrigger.update);
  // An overlay still open across a page change keeps the page still.
  if (locked) lenis.stop();
}

export function destroyLenis(): void {
  lenis?.destroy();
  lenis = null;
}

gsap.ticker.add((time) => lenis?.raf(time * 1000));
gsap.ticker.lagSmoothing(0);

/* Overlays pause the page scroll: Lenis scrolls the window itself, which
   overflow: hidden alone doesn't stop. */
document.addEventListener("motion:scroll-lock", (e) => {
  locked = !!(e as CustomEvent<boolean>).detail;
  if (locked) lenis?.stop();
  else lenis?.start();
});
