/* ============================================================
   npm run weight — what each entry costs a page.
   Measured as docs/weight.md says: esbuild (bundled, minified, ESM),
   gzip -9. For each module in src/engine/effects/ (the _shared ones
   ride with the entries that import them):
     own    the module and its shared modules, gsap, lenis and the
            core left out: what it adds to a site that has the core
     needs  the libraries and plugins it imports
     total  core + this effect + every library: a page with only it
   Also the core on its own, and the libraries' baselines.
   Writes src/data/weight.json (the gallery reads it) and the Weight
   column of catalog.md. `npm run weight -- --dry` only prints.
   ============================================================ */
import { build, version as esbuildVersion } from "esbuild";
import { gzipSync } from "node:zlib";
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join, resolve } from "node:path";
import { kb, parseCatalog, setCell } from "../src/gallery/catalog.js";

const root = resolve(import.meta.dirname, "..");
const dry = process.argv.includes("--dry");
const effectsDir = join(root, "src/engine/effects");
const corePath = join(root, "src/engine/core");
const pkg = (name) => JSON.parse(readFileSync(join(root, "node_modules", name, "package.json"), "utf8")).version;

/** Leave the libraries out (and the core, for an effect's own code). */
const externals = (core) => ({
  name: "externals",
  setup(b) {
    b.onResolve({ filter: /^(gsap|lenis)(\/.*)?$/ }, (a) => ({ path: a.path, external: true }));
    if (core) b.onResolve({ filter: /^\.\.\/core(\/.*)?$/ }, (a) => ({ path: a.path, external: true }));
  },
});

/** Bundle a snippet; its size minified and gzipped. */
async function measure(contents, plugins = []) {
  const result = await build({
    stdin: { contents, resolveDir: root, loader: "ts", sourcefile: "measure.ts" },
    bundle: true,
    minify: true,
    format: "esm",
    write: false,
    logLevel: "silent",
    plugins,
  });
  const code = result.outputFiles[0].contents;
  return { min: code.length, gzip: gzipSync(code, { level: 9 }).length };
}

/* ---------- The libraries ---------- */
const reg = (...plugins) =>
  `import { gsap } from "gsap";\n${plugins.map((p) => `import { ${p} } from "gsap/${p}";`).join("\n")}\n` +
  (plugins.length ? `gsap.registerPlugin(${plugins.join(", ")});\n` : "") +
  `window.__m = gsap;\n`;
const withLenis = (s) => `${s}import Lenis from "lenis";\nwindow.__l = Lenis;\n`;

const gsapCore = (await measure(reg())).gzip;
const libraries = [
  { name: "gsap core", gzip: gsapCore },
  { name: "+ ScrollTrigger", gzip: (await measure(reg("ScrollTrigger"))).gzip },
  { name: "+ ScrollTrigger, SplitText and Lenis (what both engines load)", gzip: (await measure(withLenis(reg("ScrollTrigger", "SplitText")))).gzip },
  {
    name: "+ DrawSVG and MotionPath as well (alpacode's landings)",
    gzip: (await measure(withLenis(reg("ScrollTrigger", "SplitText", "DrawSVGPlugin", "MotionPathPlugin")))).gzip,
  },
  { name: "Lenis alone", gzip: (await measure(`import Lenis from "lenis";\nwindow.__l = Lenis;\n`)).gzip },
];

const PLUGINS = [
  ["ScrollTrigger", ["ScrollTrigger"]],
  ["SplitText", ["SplitText"]],
  ["DrawSVG", ["DrawSVGPlugin"]],
  ["MotionPath", ["MotionPathPlugin"]],
  ["ScrambleText", ["ScrambleTextPlugin"]],
  ["Flip", ["Flip"]],
  ["Draggable + Inertia", ["Draggable", "InertiaPlugin"]],
  ["Observer", ["Observer"]],
  ["MorphSVG", ["MorphSVGPlugin"]],
  ["CustomEase", ["CustomEase"]],
  ["Physics2D", ["Physics2DPlugin"]],
];
const plugins = [];
for (const [name, mods] of PLUGINS) plugins.push({ name, gzip: (await measure(reg(...mods))).gzip - gsapCore });
const st = libraries[1].gzip;
plugins.push({ name: "ScrollSmoother (over ScrollTrigger)", gzip: (await measure(reg("ScrollTrigger", "ScrollSmoother"))).gzip - st });

/* ---------- The core ---------- */
const coreIndex = join(corePath, "index.ts");
const coreOwn = await measure(
  `export * from ${JSON.stringify(coreIndex)};\nexport * from ${JSON.stringify(join(corePath, "scroll-lock.ts"))};\n`,
  [externals(false)],
);
const coreTotal = await measure(`import { start } from ${JSON.stringify(coreIndex)};\nstart([], []);\n`);
const core = { min: coreOwn.min, gzip: coreOwn.gzip, total: coreTotal.gzip };

/* ---------- The entries ---------- */
/** The libraries a module imports, its shared modules' included. */
function needsOf(file, seen = new Set()) {
  if (seen.has(file)) return [];
  seen.add(file);
  const code = readFileSync(file, "utf8");
  const names = [];
  for (const m of code.matchAll(/from "(gsap(?:\/(\w+))?|lenis)"/g)) {
    names.push(m[1] === "lenis" ? "Lenis" : m[2] ? m[2].replace(/Plugin$/, "") : "gsap");
  }
  for (const m of code.matchAll(/from "\.\/(_[\w-]+)"/g)) names.push(...needsOf(join(effectsDir, `${m[1]}.ts`), seen));
  return [...new Set(names)];
}

const ids = readdirSync(effectsDir)
  .filter((f) => /^[a-z0-9][a-z0-9-]*\.ts$/.test(f))
  .map((f) => f.replace(/\.ts$/, ""))
  .sort();

const entries = {};
for (const id of ids) {
  const file = join(effectsDir, `${id}.ts`);
  const own = await measure(`export * from ${JSON.stringify(file)};\n`, [externals(true)]);
  const total = await measure(
    `import { start } from ${JSON.stringify(coreIndex)};\nimport * as effect from ${JSON.stringify(file)};\nstart([effect], []);\n`,
  );
  entries[id] = { min: own.min, gzip: own.gzip, needs: needsOf(file), total: total.gzip };
}

/* ---------- Report ---------- */
const today = new Date().toISOString().slice(0, 10);
const data = {
  measured: today,
  tools: { esbuild: esbuildVersion, gsap: pkg("gsap"), lenis: pkg("lenis") },
  libraries,
  plugins,
  core,
  entries,
};

console.log(`Measured ${today}: esbuild ${esbuildVersion}, gsap ${data.tools.gsap}, lenis ${data.tools.lenis}; gzip -9, 1 KB = 1000 B\n`);
console.log("The libraries");
libraries.forEach((l) => console.log(`  ${l.name.padEnd(62)} ${kb(l.gzip)}`));
console.log("\nEach plugin over gsap core");
plugins.forEach((p) => console.log(`  ${p.name.padEnd(62)} ${kb(p.gzip)}`));
console.log(`\nThe core: own ${kb(core.gzip)} (${kb(core.min)} min), with its libraries ${kb(core.total)}`);
console.log("\nThe entries (own gzip, own min, needs, page total)");
for (const [id, e] of Object.entries(entries)) {
  console.log(`  ${id.padEnd(22)} ${kb(e.gzip).padStart(8)} ${kb(e.min).padStart(9)}  ${e.needs.join(", ").padEnd(32)} ${kb(e.total)}`);
}

if (dry) process.exit(0);

writeFileSync(join(root, "src/data/weight.json"), `${JSON.stringify(data, null, 2)}\n`);
let md = readFileSync(join(root, "catalog.md"), "utf8");
const catalog = parseCatalog(md);
for (const [id, e] of Object.entries(entries)) {
  if (!catalog.entries.has(id)) {
    console.warn(`\n${id}: a module with no row in catalog.md`);
    continue;
  }
  md = setCell(md, id, "Weight", kb(e.gzip));
}
// The core's line, under its heading.
md = md.replace(/(the core is )[\d.]+ K?B( gzip of its own\s+code)/, `$1${kb(core.gzip)}$2`);
writeFileSync(join(root, "catalog.md"), md);

/* docs/weight.md: the tables between its weight markers. */
const USED_BY = {
  ScrollTrigger: "both sites",
  SplitText: "both sites",
  DrawSVG: "alpacode's landings",
  MotionPath: "alpacode's landings (`loop`)",
  ScrambleText: "FAST",
};
const row = (cells) => `| ${cells.join(" | ")} |`;
const table = (head, rows) => [row(head), row(head.map(() => "---")), ...rows.map(row)].join("\n");
const blocks = {
  libraries: table(
    ["Bundle", "gzip"],
    // The base every page with motion loads, in bold.
    libraries.map((l) => [l.name, l.name.includes("both engines") ? `**${kb(l.gzip)}**` : kb(l.gzip)]),
  ),
  plugins: table(
    ["Plugin", "+ gzip", "Used by"],
    plugins.map((p) => {
      const over = / \(over (\w+)\)$/.exec(p.name);
      const name = p.name.replace(/ \(over \w+\)$/, "");
      return [name, over ? `${kb(p.gzip)} over ${over[1]}` : kb(p.gzip), USED_BY[name] ?? "—"];
    }),
  ),
  ported: table(
    ["", "Its own code, gzip", "minified", "Needs", "A page with the core and only it"],
    [
      ["the core (all 13 pieces)", kb(core.gzip), kb(core.min), "gsap, ScrollTrigger, Lenis", kb(core.total)],
      ...Object.entries(entries).map(([id, e]) => [`\`${id}\``, kb(e.gzip), kb(e.min), e.needs.join(", "), kb(e.total)]),
    ],
  ),
};
let doc = readFileSync(join(root, "docs/weight.md"), "utf8");
for (const [name, body] of Object.entries(blocks)) {
  doc = doc.replace(new RegExp(`(<!-- weight:${name} -->\\n)[\\s\\S]*?(\\n<!-- /weight:${name} -->)`), `$1${body}$2`);
}
doc = doc.replace(/(Measured with `npm run weight` \(esbuild )[\d.]+(:[\s\S]*?gsap )[\d.]+( and lenis )[\d.]+(, on\s+)[\d-]+/, `$1${esbuildVersion}$2${data.tools.gsap}$3${data.tools.lenis}$4${today}`);
writeFileSync(join(root, "docs/weight.md"), doc);
console.log("\nWritten: src/data/weight.json, catalog.md (the Weight column, the core's line), docs/weight.md (its tables)");
