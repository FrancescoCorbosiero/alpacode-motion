/* Neutral images for the demos (O1: no client photos): blueprint plates
   in the gallery's palette, drawn as SVG and used as <img> sources, each
   seeded so it is the same on every build. */

function rng(seed: number): () => number {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

/** A blueprint plate, w×h, as a data URI. */
export function plate(seed: number, w = 1200, h = 900): string {
  const r = rng(seed);
  const line = "rgba(240,243,249,0.16)";
  const ink = "#f0f3f9";
  let grid = "";
  for (let x = 0; x <= w; x += 60) grid += `<path d="M${x} 0V${h}" stroke="${line}" stroke-width="1"/>`;
  for (let y = 0; y <= h; y += 60) grid += `<path d="M0 ${y}H${w}" stroke="${line}" stroke-width="1"/>`;
  let shapes = "";
  const cx = w * (0.35 + r() * 0.3);
  const cy = h * (0.35 + r() * 0.3);
  const rad = Math.min(w, h) * (0.22 + r() * 0.12);
  shapes += `<circle cx="${cx}" cy="${cy}" r="${rad}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  shapes += `<circle cx="${cx}" cy="${cy}" r="${rad * 0.42}" fill="#3b72e9"/>`;
  shapes += `<path d="M${cx - rad * 1.5} ${cy}H${cx + rad * 1.5}M${cx} ${cy - rad * 1.5}V${cy + rad * 1.5}" stroke="${ink}" stroke-width="1.5" stroke-dasharray="8 10"/>`;
  const bw = w * (0.18 + r() * 0.1);
  const bx = r() > 0.5 ? w * 0.08 : w - bw - w * 0.08;
  const by = h * (0.1 + r() * 0.6);
  shapes += `<rect x="${bx}" y="${by}" width="${bw}" height="${bw * 0.62}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  shapes += `<rect x="${bx}" y="${by - 18}" width="${bw * 0.4}" height="8" fill="#3b72e9"/>`;
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}"><rect width="${w}" height="${h}" fill="#183c86"/>${grid}${shapes}</svg>`;
  return `data:image/svg+xml,${encodeURIComponent(svg)}`;
}
