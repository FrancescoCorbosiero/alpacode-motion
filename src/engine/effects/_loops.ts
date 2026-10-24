/* ============================================================
   The pen's drawn marks (mark-circle, mark-box): an SVG round a word or
   two, redrawn at the word's real size, then drawn round it with
   DrawSVG. The markup holds the mark's static drawing (a viewBox of
   100 stretched round the word, its stroke kept even): the end state,
   without JS. The script redraws it in the word's own pixels, seeded by
   the word, so every mark differs and stays the same on every visit,
   and draws it in as it enters (_marks.ts). A resize changes the words'
   boxes: the drawn marks are redrawn at the next refresh. The markup's
   drawing comes back with the page.
   Fetched only by pages with a circle or a box (registry.ts, lazy):
   DrawSVG is 1.6 KB the other pages don't load. Not an entry.
   Source: A src/lib/landing/scenes.ts:108, :125, :144, :157, :172, :219.
   ============================================================ */
import { gsap } from "gsap";
import { DrawSVGPlugin } from "gsap/DrawSVGPlugin";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import type { Kit } from "../core/kit";
import { marksOf, pen } from "./_marks";
import { rng } from "./_seed";

gsap.registerPlugin(ScrollTrigger, DrawSVGPlugin);

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const EASE = "power2.inOut"; // drawn round by hand: it starts and ends slow (A)

/** A mark's shape in a w×h box, from its seeded randomness. */
export type Shape = (w: number, h: number, r: () => number) => string;

/** A smooth path through points (Catmull-Rom as cubic Béziers). */
function smooth(pts: [number, number][]): string {
  const at = (i: number): [number, number] => pts[Math.max(0, Math.min(pts.length - 1, i))] ?? [0, 0];
  let d = `M${at(0)[0].toFixed(1)} ${at(0)[1].toFixed(1)}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const [p0, p1, p2, p3] = [at(i - 1), at(i), at(i + 1), at(i + 2)];
    const c1x = p1[0] + (p2[0] - p0[0]) / 6;
    const c1y = p1[1] + (p2[1] - p0[1]) / 6;
    const c2x = p2[0] - (p3[0] - p1[0]) / 6;
    const c2y = p2[1] - (p3[1] - p1[1]) / 6;
    d += ` C${c1x.toFixed(1)} ${c1y.toFixed(1)} ${c2x.toFixed(1)} ${c2y.toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

/** A loop round a w×h box: a little more than one turn, never closed. */
export const loop: Shape = (w, h, r) => {
  const cx = w / 2;
  const cy = h / 2;
  const rx = w / 2 - 2;
  const ry = h / 2 - 2;
  const start = -Math.PI * (0.62 + r() * 0.16);
  const turn = Math.PI * 2 * (1.08 + r() * 0.08);
  const pts: [number, number][] = [];
  const n = 14;
  for (let i = 0; i <= n; i++) {
    const t = start + (i / n) * turn;
    const wob = 1 + (r() - 0.5) * 0.07;
    const drift = 1 + (i / n) * 0.06;
    pts.push([cx + Math.cos(t) * rx * wob * drift, cy + Math.sin(t) * ry * wob]);
  }
  return smooth(pts);
};

/** A box drawn in one stroke, its corners overshooting. */
export const box: Shape = (w, h, r) => {
  const j = (): number => (r() - 0.5) * 5;
  const pts: [number, number][] = [
    [4 + j(), 5 + j()],
    [w - 3 + j(), 3 + j()],
    [w - 4 + j(), h - 3 + j()],
    [3 + j(), h - 4 + j()],
    [6 + j(), 1 + j()],
  ];
  return pts.map((p, i) => `${i ? "L" : "M"}${p[0].toFixed(1)} ${p[1].toFixed(1)}`).join(" ");
};

const svgOf = (mark: HTMLElement): SVGSVGElement | null => mark.querySelector<SVGSVGElement>(":scope > svg");

/** Redraw a mark's SVG at its real size (no stretched strokes). */
function redraw(mark: HTMLElement, shape: Shape): SVGPathElement | null {
  const svg = svgOf(mark);
  const path = svg?.querySelector<SVGPathElement>("path");
  if (!svg || !path) return null;
  const w = svg.clientWidth;
  const h = svg.clientHeight;
  if (!w || !h) return path;
  svg.setAttribute("viewBox", `0 0 ${w} ${h}`);
  path.setAttribute("d", shape(w, h, rng(mark.textContent ?? "")));
  path.style.vectorEffect = "none";
  return path;
}

/** Draw a mark round its word: also for a page script drawing a
 *  [data-mark-manual] one, or a scene on its timeline. */
export function drawLoop(mark: HTMLElement, shape: Shape, delay = 0, duration = 0.85): gsap.core.Tween | null {
  const path = redraw(mark, shape);
  if (!path) return null;
  gsap.set(path, { opacity: 1 });
  return gsap.fromTo(
    path,
    { drawSVG: "0%" },
    {
      drawSVG: "100%",
      duration,
      delay,
      ease: EASE,
      onComplete: () => void gsap.set(path, { clearProps: "strokeDasharray,strokeDashoffset" }),
    },
  );
}

/** The marks of a hook, drawn round their words in a shape. */
export function loops(kit: Kit, hook: string, shape: Shape): void {
  const marks = marksOf(kit, hook);
  // The markup's own drawing, put back with the page.
  const drawn = marks.map((mark) => {
    const svg = svgOf(mark);
    const path = svg?.querySelector<SVGPathElement>("path") ?? null;
    return { svg, path, viewBox: svg?.getAttribute("viewBox") ?? null, d: path?.getAttribute("d") ?? null };
  });
  kit.cleanup(() =>
    drawn.forEach(({ svg, path, viewBox, d }) => {
      if (svg && viewBox !== null) svg.setAttribute("viewBox", viewBox);
      if (path && d !== null) path.setAttribute("d", d);
      path?.style.removeProperty("vector-effect");
    }),
  );
  pen(marks, {
    settle: (mark) => void redraw(mark, shape),
    hide: (mark) => {
      const path = svgOf(mark)?.querySelector("path");
      if (path) gsap.set(path, { opacity: 0 });
    },
    draw: (mark, delay, duration) => void drawLoop(mark, shape, delay, duration),
  });
  // A resize changes the words' boxes: redraw the drawn marks.
  const onRefresh = (): void =>
    marks.forEach((mark) => {
      const path = svgOf(mark)?.querySelector("path");
      if (path && !gsap.isTweening(path) && getComputedStyle(path).opacity !== "0") redraw(mark, shape);
    });
  ScrollTrigger.addEventListener("refresh", onRefresh);
  kit.cleanup(() => ScrollTrigger.removeEventListener("refresh", onRefresh));
}
