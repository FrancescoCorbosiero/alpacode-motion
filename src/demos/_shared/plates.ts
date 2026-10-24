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

/** A site's first screen, drawn as a blueprint: a bar, a hero, a row of
 *  cards. For the entries that show a site in a frame (cursor-thumb,
 *  cases). Seeded, w×h, as a data URI. */
export function site(seed: number, w = 1440, h = 900): string {
  const r = rng(seed);
  const hues = ["#183c86", "#1a2f5c", "#20325a", "#173a7a", "#22305b", "#11306b"];
  const bg = hues[Math.floor(r() * hues.length)] ?? "#183c86";
  const ink = "#f0f3f9";
  const faint = "rgba(240,243,249,0.28)";
  let s = `<rect width="${w}" height="${h}" fill="${bg}"/>`;
  s += `<rect width="${w}" height="${h * 0.09}" fill="rgba(11,14,20,0.35)"/>`;
  s += `<rect x="${w * 0.05}" y="${h * 0.03}" width="${w * 0.1}" height="${h * 0.03}" fill="${ink}"/>`;
  for (let i = 0; i < 4; i++) s += `<rect x="${w * (0.55 + i * 0.09)}" y="${h * 0.04}" width="${w * 0.06}" height="${h * 0.012}" fill="${faint}"/>`;
  const left = r() > 0.5;
  const hx = left ? w * 0.06 : w * 0.5;
  s += `<rect x="${hx}" y="${h * 0.22}" width="${w * 0.4}" height="${h * 0.07}" fill="${ink}"/>`;
  s += `<rect x="${hx}" y="${h * 0.32}" width="${w * 0.3}" height="${h * 0.07}" fill="${ink}"/>`;
  s += `<rect x="${hx}" y="${h * 0.44}" width="${w * 0.34}" height="${h * 0.014}" fill="${faint}"/>`;
  s += `<rect x="${hx}" y="${h * 0.47}" width="${w * 0.28}" height="${h * 0.014}" fill="${faint}"/>`;
  s += `<rect x="${hx}" y="${h * 0.54}" width="${w * 0.12}" height="${h * 0.055}" fill="#3b72e9"/>`;
  const px = left ? w * 0.56 : w * 0.06;
  s += `<rect x="${px}" y="${h * 0.18}" width="${w * 0.38}" height="${h * 0.44}" fill="none" stroke="${ink}" stroke-width="3"/>`;
  s += `<circle cx="${px + w * 0.19}" cy="${h * 0.4}" r="${h * 0.12}" fill="#3b72e9"/>`;
  for (let i = 0; i < 3; i++) s += `<rect x="${w * (0.06 + i * 0.3)}" y="${h * 0.72}" width="${w * 0.27}" height="${h * 0.22}" fill="rgba(240,243,249,0.1)" stroke="${faint}"/>`;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${s}</svg>`)}`;
}

/** A whole page, top to bottom, drawn as a blueprint: the first screen,
 *  then sections of text, pictures and cards, then the foot. For
 *  frame-scroll. Seeded, w×h, as a data URI. */
export function page(seed: number, w = 1440, h = 5200): string {
  const r = rng(seed);
  const ink = "#f0f3f9";
  const faint = "rgba(240,243,249,0.28)";
  let s = `<rect width="${w}" height="${h}" fill="#183c86"/>`;
  s += `<rect width="${w}" height="80" fill="rgba(11,14,20,0.35)"/><rect x="72" y="28" width="140" height="24" fill="${ink}"/>`;
  s += `<rect x="72" y="200" width="${w * 0.5}" height="64" fill="${ink}"/><rect x="72" y="290" width="${w * 0.36}" height="64" fill="${ink}"/>`;
  s += `<rect x="72" y="400" width="180" height="52" fill="#3b72e9"/>`;
  let y = 640;
  let n = 0;
  while (y < h - 700) {
    const kind = n++ % 3;
    if (kind === 0) {
      s += `<rect x="72" y="${y}" width="${w * 0.3}" height="40" fill="${ink}"/>`;
      for (let i = 0; i < 5; i++) s += `<rect x="72" y="${y + 80 + i * 30}" width="${w * (0.5 + r() * 0.3)}" height="12" fill="${faint}"/>`;
      y += 360;
    } else if (kind === 1) {
      s += `<rect x="72" y="${y}" width="${w - 144}" height="520" fill="none" stroke="${ink}" stroke-width="3"/>`;
      s += `<circle cx="${w * (0.3 + r() * 0.4)}" cy="${y + 260}" r="150" fill="#3b72e9"/>`;
      y += 620;
    } else {
      for (let i = 0; i < 3; i++) s += `<rect x="${72 + i * ((w - 144) / 3)}" y="${y}" width="${(w - 144) / 3 - 24}" height="300" fill="rgba(240,243,249,0.1)" stroke="${faint}"/>`;
      y += 400;
    }
  }
  s += `<rect y="${h - 420}" width="${w}" height="420" fill="#0b0e14"/><rect x="72" y="${h - 330}" width="${w * 0.4}" height="56" fill="${ink}"/>`;
  return `data:image/svg+xml,${encodeURIComponent(`<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${w} ${h}" width="${w}" height="${h}">${s}</svg>`)}`;
}
