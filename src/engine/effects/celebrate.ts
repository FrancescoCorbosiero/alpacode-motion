/* ============================================================
   celebrate — a burst of confetti from an element: out in a ring,
   then falling.
   Markup: data-celebrate on a button: each click sets one off from it;
   its value is the count and the spread ("12 0.7"). A page script calls
   celebrate(el, { count, spread, shapes }) (a form sent, a link made).
   The bits fly out from the element's middle (no lower than TOP below
   its top) in a ring, rising, spinning and swelling, then fall away and
   fade. They live in the core's effects layer (core-fx-layer), above
   everything, and go with the page. shapes: the bits, in turn, by name
   (SHAPES: the house's struts, ticks, euro signs and alpaca; C's paws,
   hearts and bones) or as markup of the page's own. Canonical: C's
   signature, with each site's set as a preset; A's tuning. Under
   reduced motion it does nothing.
   Sources: A src/lib/motion.ts:349; C src/scripts/motion.ts:207.
   ============================================================ */
import { gsap } from "gsap";
import { fxLayer } from "../core/fx-layer";
import { reduced } from "../core/guards";
import type { Kit } from "../core/kit";

export const hook = "[data-celebrate]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const COUNT = 30; // bits in a burst (A; C 26)
const BITS = ["strut", "square", "euro", "strut", "square", "alpaca"]; // the bits, in turn, by their name in SHAPES (A's house set; C ["paw", "heart", "bone"])
const COLORS = ["var(--blue)", "var(--ink)", "var(--blue-deep)", "#8fb0f5"]; // their colours, in turn (A; C its peach, sage, ochre and olive)
const REACH = [110, 250]; // px: how far the ring throws a bit, the least and the most, at spread 1 (A; C [90, 220])
const RISE = 70; // px the ring rises meanwhile, at spread 1 (A; C 60)
const FALL = [180, 340]; // px a bit falls after, the least and the most (A; C [160, 320])
const TOP = 60; // px: the burst starts in the element's middle, but no lower than this below its top (A; C its middle: Infinity)
const SIZE = [14, 30]; // px: a drawn shape's size, at random between these (C; A's bits are sized in celebrate.css)

// A's tiny alpaca.
const ALPACA =
  '<svg viewBox="0 0 100 120" fill="currentColor" aria-hidden="true"><path d="M55 20Q55 9 57 2Q60 7 61.5 13.5L63.5 13Q65 6 68 1Q70 7 69.5 13.5Q76 12 80 17L87 21.5Q90.5 23.5 89.5 27Q88.5 30.5 84 30.5L76.5 31Q71 32 70 38L69.5 57Q73.5 66 70.5 77L71 116Q71 118 69 118L65 118L64 89L62 89L61.5 117L56.5 117L56 85Q42 90 29.5 85L29.5 117L24 117L23 94L21 94L20.5 117L15 117L14.5 85Q8.5 78 9 67Q9 60 12 57Q6.5 56.5 7 52.5Q8 48.5 13.5 50.5Q31 45.5 49.5 48.5Q55 49.5 55 43L55 26Z"/></svg>';
// C's paw, heart and bone.
const PAW =
  '<svg viewBox="0 0 50 44" fill="currentColor" aria-hidden="true"><ellipse cx="12" cy="15" rx="4.3" ry="5.8"/><ellipse cx="21" cy="10" rx="4.3" ry="6"/><ellipse cx="30" cy="11" rx="4.3" ry="6"/><ellipse cx="38.5" cy="16" rx="4.3" ry="5.6"/><ellipse cx="25" cy="29" rx="9.5" ry="8"/></svg>';
const HEART =
  '<svg viewBox="0 0 24 22" fill="currentColor" aria-hidden="true"><path d="M12 21.5S1.5 15 1.5 7.6C1.5 4 4.2 1.5 7.3 1.5c2 0 3.7 1 4.7 2.6 1-1.6 2.7-2.6 4.7-2.6 3.1 0 5.8 2.5 5.8 6.1C22.5 15 12 21.5 12 21.5Z"/></svg>';
const BONE =
  '<svg viewBox="0 0 44 20" fill="currentColor" aria-hidden="true"><path d="M9 1.5a5 5 0 0 0-4.6 6.9A5 5 0 1 0 9.6 16H34.4a5 5 0 1 0 5.2-7.6A5 5 0 1 0 31 5.2H13A5 5 0 0 0 9 1.5Z"/></svg>';

/** The bits a burst can throw, by name, and what goes inside each (A's
 *  struts and ticks are drawn by celebrate.css). A site keeps its own
 *  set and drops the rest. */
const SHAPES: Record<string, string> = { strut: "", square: "", euro: "€", alpaca: ALPACA, paw: PAW, heart: HEART, bone: BONE };

export interface Burst {
  /** How many bits (COUNT). */
  count?: number;
  /** How far they fly, 1 the settings' (A's referral invite 0.85). */
  spread?: number;
  /** The bits, in turn: names in SHAPES, or markup of the page's own. */
  shapes?: string[];
}

/** A burst of confetti from the middle of an element. */
export function celebrate(origin: Element, opts: Burst = {}): void {
  if (reduced()) return;
  const { count = COUNT, spread = 1, shapes = BITS } = opts;
  const r = origin.getBoundingClientRect();
  const cx = r.left + r.width / 2;
  const cy = r.top + Math.min(r.height / 2, TOP);
  const layer = fxLayer();
  for (let i = 0; i < count; i++) {
    const shape = shapes[i % shapes.length] ?? "square";
    const named = Object.hasOwn(SHAPES, shape);
    const inside = named ? (SHAPES[shape] ?? "") : shape;
    const bit = document.createElement("span");
    bit.className = `fx-bit fx-${named ? shape : "shape"}`;
    if (inside.startsWith("<")) bit.innerHTML = inside;
    else bit.textContent = inside;
    bit.style.color = COLORS[i % COLORS.length] ?? "currentColor";
    bit.style.setProperty("--fx-size", `${Math.round(gsap.utils.random(SIZE[0], SIZE[1]))}px`);
    layer.appendChild(bit);
    const angle = (i / count) * Math.PI * 2 + gsap.utils.random(-0.25, 0.25);
    const dist = gsap.utils.random(REACH[0], REACH[1]) * spread;
    gsap.set(bit, { left: cx, top: cy, xPercent: -50, yPercent: -50, scale: 0, rotation: gsap.utils.random(-90, 90) });
    gsap
      .timeline({ onComplete: () => bit.remove() })
      .to(bit, {
        x: Math.cos(angle) * dist,
        y: Math.sin(angle) * dist - RISE * spread,
        scale: 1,
        rotation: `+=${gsap.utils.random(-160, 160)}`,
        duration: gsap.utils.random(0.55, 0.85),
        ease: "power3.out",
      })
      .to(bit, {
        y: `+=${gsap.utils.random(FALL[0], FALL[1])}`,
        rotation: `+=${gsap.utils.random(-120, 120)}`,
        opacity: 0,
        duration: gsap.utils.random(0.9, 1.4),
        ease: "power1.in",
      });
  }
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    kit.on(el, "click", () => {
      const [count, spread] = (el.dataset.celebrate ?? "").trim().split(/\s+/).map(parseFloat);
      celebrate(el, {
        count: Number.isFinite(count) ? count : undefined,
        spread: Number.isFinite(spread) ? spread : undefined,
      });
    });
  });
}
