/* ============================================================
   What the gallery's pages know, at build time: the catalog, the
   engine's own source files (shown to copy, and read for their
   settings), the measured weights.
   ============================================================ */
import catalogMd from "../../catalog.md?raw";
import weightJson from "../data/weight.json";
import { parseCatalog } from "./catalog.js";

export const catalog = parseCatalog(catalogMd);

export type Entry = ReturnType<typeof catalog.entries.get> & {};
export type Link = Entry["links"][number];

/* ---------- The engine's files ---------- */

const raw = import.meta.glob<string>(["../engine/**/*.ts", "../engine/**/*.css"], {
  query: "?raw",
  import: "default",
  eager: true,
});

/** A file of the engine, by its path in the repo (src/engine/…). */
export function source(path: string): string | undefined {
  return raw[path.replace(/^src\//, "../")];
}

export interface SourceFile {
  path: string;
  code: string;
  lang: "ts" | "css";
  /** What the file is to a site copying the entry. */
  role: string;
}

/** The entry's module, its CSS and the shared modules it imports (not the
 *  core: that is copied once per site). */
export function filesOf(id: string): SourceFile[] {
  const files: SourceFile[] = [];
  const seen = new Set<string>();
  const add = (name: string, role: string): void => {
    const path = `src/engine/effects/${name}.ts`;
    const code = source(path);
    if (!code || seen.has(path)) return;
    seen.add(path);
    files.push({ path, code, lang: "ts", role });
    for (const m of code.matchAll(/from "\.\/(_[\w-]+)"/g)) add(m[1] ?? "", "shared by its family");
  };
  add(id, "the module");
  const cssPath = `src/engine/effects/${id}.css`;
  const css = source(cssPath);
  if (css) files.splice(1, 0, { path: cssPath, code: css, lang: "css", role: "its CSS" });
  return files;
}

/** The core's files, in the order a site reads them. */
export function coreFiles(): SourceFile[] {
  const order = [
    ["src/engine/index.ts", "the page script (the site's)"],
    ["src/engine/config.ts", "the site's selectors (the site's)"],
    ["src/engine/registry.ts", "the site's effects (the site's)"],
    ["src/engine/core/index.ts", "what page scripts import"],
    ["src/engine/core/lifecycle.ts", "core-lifecycle, core-lazy-chunk"],
    ["src/engine/core/kit.ts", "the effect contract"],
    ["src/engine/core/guards.ts", "core-guards"],
    ["src/engine/core/lenis.ts", "core-lenis, core-scroll-lock"],
    ["src/engine/core/scroll-lock.ts", "core-scroll-lock, the overlays' side"],
    ["src/engine/core/scroll.ts", "core-scroll-to"],
    ["src/engine/core/header.ts", "core-header"],
    ["src/engine/core/focus.ts", "core-focus-reveal"],
    ["src/engine/core/refresh.ts", "core-refresh"],
    ["src/engine/core/fx-layer.ts", "core-fx-layer"],
    ["src/engine/core/core.css", "core-css-intro, core-view-transitions, core-read-progress"],
  ] as const;
  return order.flatMap(([path, role]) => {
    const code = source(path);
    return code ? [{ path, code, lang: path.endsWith(".css") ? ("css" as const) : ("ts" as const), role }] : [];
  });
}

/** Every entry that has a module here, from the files themselves. */
export const portedIds = Object.keys(raw)
  .map((p) => /^\.\.\/engine\/effects\/([a-z0-9-]+)\.ts$/.exec(p)?.[1])
  .filter((id): id is string => !!id);

/* ---------- Read from a module ---------- */

export interface Setting {
  name: string;
  value: string;
  note: string;
}

/** The settings block at the top of a module: `const NAME = value; // note`
 *  lines under the "Settings" rule. The module is the one truth for them. */
export function settingsOf(code: string): Setting[] {
  const lines = code.split("\n");
  const start = lines.findIndex((l) => /^\/\* -+ Settings/.test(l));
  if (start < 0) return [];
  const out: Setting[] = [];
  for (const line of lines.slice(start + 1)) {
    const m = /^const ([A-Z][A-Z0-9_]*) = (.+?); \/\/ (.+)$/.exec(line);
    if (!m) break;
    out.push({ name: m[1] ?? "", value: m[2] ?? "", note: m[3] ?? "" });
  }
  return out;
}

/** The module's exported hook, as written. */
export function hookIn(code: string): string {
  return /export const hook = (["'])(.+?)\1;/.exec(code)?.[2] ?? "";
}

/** The paragraph of a CSS file's header that starts "Reduced motion:". */
export function endStateOf(css: string): string {
  const head = /\/\*([\s\S]*?)\*\//.exec(css)?.[1] ?? "";
  const paragraphs = head
    .split("\n")
    .map((l) => l.replace(/^\s*=+\s*$/, "").replace(/^ {3}/, ""))
    .join("\n")
    .split(/\n\s*\n/)
    .map((p) => p.replace(/\s*\n\s*/g, " ").trim());
  return paragraphs.find((p) => p.startsWith("Reduced motion:"))?.replace(/^Reduced motion:\s*/, "") ?? "";
}

/** True when a CSS file holds rules, not only its header. */
export const hasRules = (css: string): boolean => css.replace(/\/\*[\s\S]*?\*\//g, "").trim().length > 0;

/* ---------- Sources ---------- */

export interface SourceRef {
  site: string;
  path: string;
  line: number | null;
  url: string;
}

/** Where a catalog link points: which site, which file, which line. */
export function refOf(link: Link): SourceRef | null {
  const m = /github\.com\/[^/]+\/([^/]+)\/blob\/[0-9a-f]+\/([^#]+)(?:#L(\d+))?/.exec(link.url);
  if (!m) return null;
  const repo = m[1] ?? "";
  const path = m[2] ?? "";
  const site =
    repo === "alpacode-website" ? (path.startsWith("fast/") ? "FAST" : "alpacode") : repo === "comunicazionecinofila" ? "cinofila" : repo;
  return { site, path, line: m[3] ? Number(m[3]) : null, url: link.url };
}

/** The sites an entry comes from, in the order its sources name them. */
export function sitesOf(entry: Entry): string[] {
  return [...new Set(entry.links.map(refOf).flatMap((r) => (r ? [r.site] : [])))];
}

/* ---------- Weight ---------- */

export interface Measured {
  min: number;
  gzip: number;
  needs: string[];
  total: number;
}
interface WeightFile {
  measured?: string;
  tools?: Record<string, string>;
  libraries?: { name: string; gzip: number }[];
  core?: { min: number; gzip: number; total: number };
  entries?: Record<string, Measured>;
}
export const weight = weightJson as WeightFile;

export { kb } from "./catalog.js";

/* ---------- Labels ---------- */

export const TIER_LABEL: Record<string, string> = {
  core: "Core",
  "1": "Tier 1, primitives",
  "2": "Tier 2, scenes",
  "3": "Tier 3, showcase",
};
