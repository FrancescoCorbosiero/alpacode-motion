/* ============================================================
   The pointer's play, what tilt and magnetic share: an element that
   leans toward the pointer in 3D, may follow it a little, and springs
   back when it leaves. Built only with a mouse (kit.fine: a tap's
   pointer events would leave it leaning), never inside an island.
   A CSS transition on transform would fight the quick tweens (A's
   buttons have one, 0.1s; C turned its cards' off by hand, listing the
   transitions to keep): while the pointer plays, transform's transition
   is held at 0s and the element's others keep theirs. The spring back
   hands the transform and the transitions to the stylesheet again, and
   so does the page going.
   Not an entry: copied with tilt and magnetic.
   Sources: A src/lib/motion.ts:1097; C src/scripts/motion.ts:1177, :1210.
   ============================================================ */
import { gsap } from "gsap";
import type { Kit } from "../core/kit";

export interface Play {
  /** Degrees it leans at its edges: rotationX up to this, rotationY
   *  1.2 times (A and C). 0: no lean. */
  lean: number;
  /** px of perspective for the lean. */
  perspective: number;
  /** How much of the pointer's offset from its centre it follows (0:
   *  it stays put). */
  pull: number;
  /** s the lean and the pull take to catch up. */
  follow: number;
  /** While the pointer is on it: risen by y px and scaled (C's cards). */
  lift?: { y: number; scale: number };
  /** The spring back when the pointer leaves. */
  back: { duration: number; ease: string };
}

const HANDED_BACK = "transform,transitionProperty,transitionDuration,transitionDelay";
const list = (value: string): string[] => value.split(",").map((s) => s.trim());

/** The element's transitions, with transform's held at 0s: a later
 *  entry for a property wins, so it's added at the end. None: nothing
 *  of transform's to hold. */
function held(el: HTMLElement): gsap.TweenVars | null {
  const cs = getComputedStyle(el);
  const props = list(cs.transitionProperty);
  const durations = list(cs.transitionDuration);
  const delays = list(cs.transitionDelay);
  const moves = props.some(
    (p, i) =>
      (p === "all" || p === "transform") &&
      parseFloat(durations[i % durations.length] ?? "0") + parseFloat(delays[i % delays.length] ?? "0") > 0,
  );
  if (!moves) return null;
  return {
    transitionProperty: [...props, "transform"].join(", "),
    transitionDuration: [...props.map((_, i) => durations[i % durations.length]), "0s"].join(", "),
    transitionDelay: [...props.map((_, i) => delays[i % delays.length]), "0s"].join(", "),
  };
}

/** Lean an element toward the pointer (and pull it) while it's on it. */
export function play(kit: Kit, el: HTMLElement, how: Play): void {
  const quick = (prop: string): ((value: number) => void) =>
    gsap.quickTo(el, prop, { duration: how.follow, ease: "power3.out" });
  const rx = how.lean ? quick("rotationX") : null;
  const ry = how.lean ? quick("rotationY") : null;
  const xTo = how.pull ? quick("x") : null;
  const yTo = how.pull ? quick("y") : null;
  let transitions: gsap.TweenVars | null | undefined; // read once, before any of ours is inline
  kit.on(el, "pointerenter", () => {
    transitions ??= held(el);
    if (transitions) gsap.set(el, transitions);
    gsap.set(el, { transformPerspective: how.perspective });
    if (how.lift) gsap.to(el, { y: -how.lift.y, scale: how.lift.scale, duration: how.follow, ease: "power3.out", overwrite: "auto" });
  });
  kit.on(el, "pointermove", (e) => {
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    rx?.(-py * how.lean);
    ry?.(px * how.lean * 1.2);
    xTo?.(px * r.width * how.pull);
    yTo?.(py * r.height * how.pull);
  });
  kit.on(el, "pointerleave", () => {
    gsap.to(el, {
      rotationX: 0,
      rotationY: 0,
      x: 0,
      y: 0,
      scale: 1,
      ...how.back,
      overwrite: "auto",
      clearProps: HANDED_BACK,
    });
  });
  kit.cleanup(() => {
    gsap.killTweensOf(el);
    gsap.set(el, { clearProps: HANDED_BACK });
  });
}
