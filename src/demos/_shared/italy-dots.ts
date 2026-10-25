/* ============================================================
   The dot map of the map entry, worked out at build time from the
   regions of italy-map.ts (ISTAT/openpolis outlines, in an
   equirectangular projection): a grid of dots, kept where it falls on
   land, drawn as one path of zero-length strokes with round caps (one
   element, a few KB, whatever the number of dots). Plus the projection
   that puts a place (lat, lon) on the same map.
   ============================================================ */
import { italyMap } from "./italy-map";

type Pt = [number, number];

/* The map's projection, fitted on its own cities (Torino, Palermo) and
   checked on the others (Roma, Venezia, Bari, Cagliari: within a unit). */
const X0 = 48;
const LON0 = 7.6869;
const KX = 35.245;
const Y0 = 105;
const LAT0 = 45.0703;
const KY = 47.019;

export function project(lat: number, lon: number): { x: number; y: number } {
  return { x: X0 + (lon - LON0) * KX, y: Y0 + (LAT0 - lat) * KY };
}

/** The subpaths of an absolute M/L/Z path, as polygons. */
function polygons(d: string): Pt[][] {
  return d
    .split("M")
    .filter(Boolean)
    .map((sub) =>
      sub
        .replace(/Z/g, "")
        .split("L")
        .map((p) => p.split(",").map(Number) as Pt),
    );
}

/** Even-odd ray casting: inside an odd number of rings. */
function inside(x: number, y: number, rings: Pt[][]): boolean {
  let hit = false;
  for (const ring of rings) {
    for (let i = 0, j = ring.length - 1; i < ring.length; j = i++) {
      const [xi, yi] = ring[i]!;
      const [xj, yj] = ring[j]!;
      if (yi > y !== yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi) hit = !hit;
    }
  }
  return hit;
}

const regions = italyMap.regions.map((r) => polygons(r.d));

/** The land, as a path of dots `step` units apart: every row is offset
 *  by half a step from the one above, like a halftone. */
export function dotPath(step = 6.5): { d: string; count: number } {
  const { w, h } = italyMap.viewBox;
  const parts: string[] = [];
  let row = 0;
  for (let y = step / 2; y < h; y += step * 0.866, row++) {
    for (let x = (row % 2 ? step : step / 2); x < w; x += step) {
      if (regions.some((rings) => inside(x, y, rings))) parts.push(`M${x.toFixed(1)} ${y.toFixed(1)}h0`);
    }
  }
  return { d: parts.join(""), count: parts.length };
}

/** A gentle arc from a to b: a quadratic curve bowed to the left of
 *  the way, by a share of its length. */
export function arc(a: { x: number; y: number }, b: { x: number; y: number }, bow = 0.22): string {
  const mx = (a.x + b.x) / 2;
  const my = (a.y + b.y) / 2;
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  const cx = mx + dy * bow;
  const cy = my - dx * bow;
  return `M${a.x.toFixed(1)} ${a.y.toFixed(1)}Q${cx.toFixed(1)} ${cy.toFixed(1)} ${b.x.toFixed(1)} ${b.y.toFixed(1)}`;
}

export const mapBox = italyMap.viewBox;
