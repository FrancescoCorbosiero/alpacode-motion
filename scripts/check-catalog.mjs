/* ============================================================
   The catalog check, the second half of `npm run check`: catalog.md
   and the repo agree, so the loop stays honest.
   - The catalog's own counts match its tables.
   - Every module in src/engine/effects/ has its row, a Status of port
     or demo, `hook` and `init` exports, its CSS (whose header states
     its reduced-motion end state) and its place in registry.ts.
   - A port or demo entry has its module; a demo entry also has its
     page, its weight (the same in weight.json and in its Weight cell)
     and its screenshots (docs/shots/<id>/).
   - Every demo page belongs to a module.
   ============================================================ */
import { existsSync, readdirSync, readFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { isPinned, kb, parseCatalog } from "../src/gallery/catalog.js";

const root = resolve(import.meta.dirname, "..");
const read = (p) => readFileSync(join(root, p), "utf8");
const md = read("catalog.md");
const catalog = parseCatalog(md);
const problems = [];
const fail = (msg) => problems.push(msg);

/* ---------- The catalog's counts ---------- */
const all = [...catalog.entries.values()];
const tier = (t) => all.filter((e) => e.section.tier === t);
const intro = /\*\*(\d+) effects\*\*: (\d+) tier-1 primitives, (\d+) tier-2 scenes, (\d+) tier-3 showcase\s+entries — plus (\d+) core pieces/.exec(md);
if (!intro) fail("catalog.md: the intro's counts (**N effects**: …) are missing or reworded");
else {
  const [, total, t1, t2, t3, core] = intro.map(Number);
  const real = { total: all.length - tier("core").length, t1: tier("1").length, t2: tier("2").length, t3: tier("3").length, core: tier("core").length };
  if (total !== real.total) fail(`catalog.md says ${total} effects, its tables hold ${real.total}`);
  if (t1 !== real.t1) fail(`catalog.md says ${t1} tier-1 entries, its tables hold ${real.t1}`);
  if (t2 !== real.t2) fail(`catalog.md says ${t2} tier-2 entries, its tables hold ${real.t2}`);
  if (t3 !== real.t3) fail(`catalog.md says ${t3} tier-3 entries, its tables hold ${real.t3}`);
  if (core !== real.core) fail(`catalog.md says ${core} core pieces, its tables hold ${real.core}`);
}
for (const e of all) {
  if (!["src", "port", "demo"].includes(e.status)) fail(`${e.id}: unknown Status "${e.status}"`);
}

/* ---------- The modules ---------- */
const effectsDir = join(root, "src/engine/effects");
const modules = readdirSync(effectsDir)
  .filter((f) => /^[a-z0-9][a-z0-9-]*\.ts$/.test(f))
  .map((f) => f.replace(/\.ts$/, ""));
const registry = read("src/engine/registry.ts");
const weight = JSON.parse(read("src/data/weight.json"));

for (const id of modules) {
  const entry = catalog.entries.get(id);
  const code = read(`src/engine/effects/${id}.ts`);
  if (!entry) fail(`${id}: a module with no row in catalog.md`);
  else if (entry.status === "src") fail(`${id}: has a module, but its Status is still src (port or demo)`);
  if (!/export const hook = /.test(code)) fail(`${id}.ts: no \`export const hook\``);
  if (!/export function init\(kit: Kit\)/.test(code)) fail(`${id}.ts: no \`export function init(kit: Kit)\``);
  const cssPath = `src/engine/effects/${id}.css`;
  if (!existsSync(join(root, cssPath))) fail(`${id}: no ${cssPath}`);
  else if (!/^\s*Reduced motion:/m.test(read(cssPath))) fail(`${cssPath}: its header doesn't state the reduced-motion end state ("Reduced motion: …")`);
  if (!registry.includes(`"./effects/${id}"`)) fail(`${id}: not in src/engine/registry.ts`);
}

/* ---------- The entries ---------- */
const demos = new Set(
  readdirSync(join(root, "src/demos"))
    .filter((f) => f.endsWith(".astro"))
    .map((f) => f.replace(/\.astro$/, "")),
);
for (const e of all.filter((x) => x.section.tier !== "core")) {
  if (e.status === "src") continue;
  if (!modules.includes(e.id)) fail(`${e.id}: Status ${e.status}, but no src/engine/effects/${e.id}.ts`);
  if (e.status !== "demo") continue;
  if (!demos.has(e.id)) fail(`${e.id}: Status demo, but no src/demos/${e.id}.astro`);
  const w = weight.entries?.[e.id];
  if (!w) fail(`${e.id}: Status demo, but not measured (npm run weight)`);
  else if (e.weight !== kb(w.gzip)) fail(`${e.id}: Weight ${e.weight || "empty"} in catalog.md, ${kb(w.gzip)} in weight.json (npm run weight)`);
  const shots = ["1440x900", "390x844", "reduced", ...(isPinned(e) ? ["390x664"] : [])];
  for (const s of shots) {
    if (!existsSync(join(root, "docs/shots", e.id, `${s}.webp`))) fail(`${e.id}: Status demo, but no docs/shots/${e.id}/${s}.webp (npm run shots -- ${e.id})`);
  }
}
for (const id of demos) {
  if (!modules.includes(id)) fail(`src/demos/${id}.astro: a demo with no module`);
}

/* ---------- Report ---------- */
const effects = all.filter((e) => e.section.tier !== "core");
const by = (s) => effects.filter((e) => e.status === s).length;
if (problems.length) {
  console.error(`catalog check: ${problems.length} problem(s)`);
  problems.forEach((p) => console.error(`  - ${p}`));
  process.exit(1);
}
console.log(
  `catalog check: ${effects.length} effects (${by("demo")} demo, ${by("port")} port, ${by("src")} src), ` +
    `${tier("core").length} core pieces, ${modules.length} modules — consistent`,
);
