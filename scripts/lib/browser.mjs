/* ============================================================
   What the browser scripts share: dist/ served on a free port, and a
   Chromium to look at it with.
   Chromium: $CHROMIUM_PATH if set; else the one Claude Code's cloud
   sessions ship (/opt/pw-browsers/chromium); else the installed Chrome.
   ============================================================ */
import { createServer } from "node:http";
import { existsSync, readdirSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize, resolve } from "node:path";
import { chromium } from "playwright-core";

export const root = resolve(import.meta.dirname, "../..");
const dist = join(root, "dist");

const TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript",
  ".css": "text/css",
  ".svg": "image/svg+xml",
  ".woff2": "font/woff2",
  ".woff": "font/woff",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".json": "application/json",
  ".webm": "video/webm",
  ".mp4": "video/mp4",
};

/** Serve dist/ as a static host would. Resolves to its origin and a stop(). */
export function serve() {
  if (!existsSync(join(dist, "index.html"))) {
    throw new Error("No build in dist/: run `npm run build` first.");
  }
  const server = createServer((req, res) => {
    const path = decodeURIComponent(new URL(req.url ?? "/", "http://x").pathname);
    let file = normalize(join(dist, path));
    if (!file.startsWith(dist)) {
      res.writeHead(403).end();
      return;
    }
    if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
    if (!existsSync(file)) {
      res.writeHead(404).end("Not found");
      return;
    }
    res.writeHead(200, { "content-type": TYPES[extname(file)] ?? "application/octet-stream" });
    res.end(readFileSync(file));
  });
  return new Promise((ok) => {
    server.listen(0, "127.0.0.1", () => {
      const { port } = /** @type {import("node:net").AddressInfo} */ (server.address());
      ok({ origin: `http://127.0.0.1:${port}`, stop: () => server.close() });
    });
  });
}

// No calls home while it looks at the gallery.
const QUIET = ["--disable-background-networking", "--disable-component-update", "--no-first-run", "--disable-sync"];

export async function launch() {
  const path = process.env.CHROMIUM_PATH || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : "");
  return path ? chromium.launch({ executablePath: path, args: QUIET }) : chromium.launch({ channel: "chrome", args: QUIET });
}

/** Collect a page's errors: uncaught ones and console.error. */
export function watchErrors(page, where) {
  const errors = [];
  page.on("pageerror", (e) => errors.push(`${where()}: ${e.message}`));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push(`${where()}: ${m.text()}`);
  });
  return errors;
}

/** The entries with a page: their demo files. */
export function demoIds() {
  return readdirSync(join(root, "src/demos"))
    .filter((f) => f.endsWith(".astro"))
    .map((f) => f.replace(/\.astro$/, ""))
    .sort();
}
