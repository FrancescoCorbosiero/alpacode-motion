/* ============================================================
   core-refresh.
   Islands hydrating, lazy images, forms swapping panels and FAQs
   opening change the page height after init: a debounced refresh
   keeps trigger positions honest. The lifecycle also refreshes once
   the fonts are in and sorts triggers created out of page order.
   Sources: A src/lib/motion.ts:1221, :1254; C src/scripts/motion.ts:1452, :1467.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

let refreshTimer = 0;
let lastHeight = 0;
new ResizeObserver(() => {
  const h = document.documentElement.scrollHeight;
  if (Math.abs(h - lastHeight) < 2) return;
  lastHeight = h;
  window.clearTimeout(refreshTimer);
  refreshTimer = window.setTimeout(() => ScrollTrigger.refresh(), 200);
}).observe(document.documentElement);
