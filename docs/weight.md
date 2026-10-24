# Weight

What motion costs a page. Measured with `npm run weight` (esbuild 0.27.7:
bundled, minified, ESM; gzip -9), gsap 3.15.0 and lenis 1.3.27, on
2026-10-24; the script rewrites the tables marked as its own. Gzip is
what travels; the browser parses and runs the minified size, about three
times as much. 1 KB = 1000 bytes.

Phase 0 measured the same with esbuild 0.25 by hand: its figures came out
about 0.2 KB lower on the libraries (gsap core 27.5 KB, the base 53.2 KB);
the tables below are the script's.

## The libraries

<!-- weight:libraries -->
| Bundle | gzip |
| --- | --- |
| gsap core | 27.7 KB |
| + ScrollTrigger | 45.3 KB |
| + ScrollTrigger, SplitText and Lenis (what both engines load) | **53.3 KB** |
| + DrawSVG and MotionPath as well (alpacode's landings) | 64.1 KB |
| Lenis alone | 5.4 KB |
<!-- /weight:libraries -->

Each plugin on its own, over gsap core (deltas don't add up exactly:
compression is shared):

<!-- weight:plugins -->
| Plugin | + gzip | Used by |
| --- | --- | --- |
| ScrollTrigger | 17.6 KB | both sites |
| SplitText | 3.0 KB | both sites |
| DrawSVG | 1.6 KB | alpacode's landings |
| MotionPath | 8.8 KB | alpacode's landings (`loop`) |
| ScrambleText | 3.5 KB | FAST |
| Flip | 8.8 KB | — |
| Draggable + Inertia | 15.5 KB | — |
| Observer | 3.7 KB | — |
| MorphSVG | 8.9 KB | — |
| CustomEase | 3.2 KB | — |
| Physics2D | 712 B | — |
| ScrollSmoother | 4.7 KB over ScrollTrigger | — |
<!-- /weight:plugins -->

## The engines

Measured in phase 0 (esbuild 0.25), on the sources at the commits pinned
in catalog.md:

| Engine | Total gzip | Its own code |
| --- | --- | --- |
| alpacode, `src/lib/motion.ts` (with `alpaca.ts`) | 61.7 KB | about 8.5 KB |
| alpacode, the landings' chunk (`scenes.ts`, `.lnd` pages only) | about 15 KB more | about 4.8 KB, plus DrawSVG and MotionPath |
| C, `src/scripts/motion.ts` (48 effects) | 61.6 KB | about 8.4 KB |
| FAST, `fast/src/lib/motion.ts` | 49.6 KB | under 1 KB |

For scale: alpacode's home hero video is 464 KB (webm) or 1.4 MB (mp4).

## What is ported here

`npm run weight` measures every module in `src/engine/effects/` and the
core, writes `src/data/weight.json` (the gallery's pages read it) and the
Weight column of catalog.md.

<!-- weight:ported -->
|  | Its own code, gzip | minified | Needs | A page with the core and only it |
| --- | --- | --- | --- | --- |
| the core (all 13 pieces) | 2.3 KB | 5.3 KB | gsap, ScrollTrigger, Lenis | 51.9 KB |
| `alternate` | 625 B | 1.1 KB | gsap, ScrollTrigger | 52.3 KB |
| `bars` | 411 B | 577 B | gsap, ScrollTrigger | 52.2 KB |
| `cases` | 882 B | 1.8 KB | gsap, ScrollTrigger | 52.6 KB |
| `chat` | 630 B | 1.2 KB | gsap, ScrollTrigger | 52.4 KB |
| `clip` | 569 B | 975 B | gsap, ScrollTrigger | 52.3 KB |
| `count` | 600 B | 951 B | gsap, ScrollTrigger | 52.4 KB |
| `cursor-thumb` | 1.2 KB | 2.7 KB | gsap | 52.9 KB |
| `deal` | 665 B | 1.2 KB | gsap, ScrollTrigger | 52.4 KB |
| `draw` | 486 B | 764 B | gsap, ScrollTrigger | 52.3 KB |
| `flip-filter` | 678 B | 1.2 KB | gsap, Flip | 61.5 KB |
| `frame-scroll` | 401 B | 615 B | gsap, ScrollTrigger | 52.1 KB |
| `hand` | 543 B | 953 B | gsap, DrawSVG, ScrollTrigger | 54.0 KB |
| `kicker` | 398 B | 678 B | gsap, ScrollTrigger | 52.2 KB |
| `knoll` | 638 B | 1.1 KB | gsap, ScrollTrigger | 52.4 KB |
| `map` | 972 B | 2.0 KB | gsap, ScrollTrigger | 52.7 KB |
| `mark-box` | 1.2 KB | 2.3 KB | gsap, DrawSVG, ScrollTrigger | 54.6 KB |
| `mark-circle` | 1.4 KB | 2.8 KB | gsap, DrawSVG, ScrollTrigger | 54.8 KB |
| `mark-highlight` | 632 B | 1.1 KB | gsap, ScrollTrigger | 52.4 KB |
| `mark-strike` | 628 B | 1.1 KB | gsap, ScrollTrigger | 52.4 KB |
| `mark-underline` | 630 B | 1.1 KB | gsap, ScrollTrigger | 52.4 KB |
| `meter` | 694 B | 1.3 KB | gsap, ScrambleText, ScrollTrigger | 56.1 KB |
| `method` | 1.1 KB | 2.3 KB | gsap, ScrollTrigger | 52.8 KB |
| `pop` | 370 B | 511 B | gsap, ScrollTrigger | 52.2 KB |
| `print` | 630 B | 1.1 KB | gsap, ScrollTrigger | 52.4 KB |
| `reveal` | 613 B | 1.2 KB | gsap, ScrollTrigger | 52.3 KB |
| `scrub` | 353 B | 531 B | gsap, ScrollTrigger, SplitText | 55.2 KB |
| `split-blur` | 543 B | 900 B | gsap, ScrollTrigger, SplitText | 55.4 KB |
| `split-chars` | 510 B | 857 B | gsap, ScrollTrigger, SplitText | 55.3 KB |
| `split-cycle` | 686 B | 1.1 KB | gsap, ScrollTrigger, SplitText | 55.5 KB |
| `split-lines` | 504 B | 847 B | gsap, ScrollTrigger, SplitText | 55.3 KB |
| `split-pop` | 576 B | 977 B | gsap, ScrollTrigger, SplitText | 55.4 KB |
| `split-wipe` | 538 B | 905 B | gsap, ScrollTrigger, SplitText | 55.4 KB |
| `split-words` | 518 B | 877 B | gsap, ScrollTrigger, SplitText | 55.3 KB |
| `stamp` | 433 B | 642 B | gsap, ScrollTrigger | 52.2 KB |
| `strut` | 311 B | 443 B | gsap, ScrollTrigger | 52.1 KB |
| `wordmark` | 643 B | 1.2 KB | gsap, ScrollTrigger | 52.4 KB |
<!-- /weight:ported -->

"Its own code" is the module bundled alone, the libraries and the core
left out: what it adds to a site that already has them. Alone, gzip has
little to share, so it reads higher than its cost inside a site's bundle
(phase 0 found about 170 B per effect there).

## What it means

1. **The catalog itself is cheap.** An effect is a few hundred bytes of
   its own code; C's 48 effects together are 8.4 KB; the core is 2.3 KB.
2. **The fixed cost is the libraries.** About 53 KB gzip as soon as a
   page uses GSAP with ScrollTrigger, SplitText and Lenis, whether it has
   five effects or fifty. Plugins add their own (table above): load them
   only where they're used (D7).
3. **The real cost is at runtime, and it's per page.** It depends on what
   is on the page, not on what is in the engine: a module with nothing to
   do runs one `querySelectorAll` and returns. What weighs:
   - every live ScrollTrigger is checked on each scroll frame, and a
     scrubbed one also renders;
   - a GSAP pin adds a pin-spacer and makes every refresh dearer;
   - SplitText rewrites the DOM and splits again on resize, once per
     heading;
   - `filter: blur()` (split-blur) is expensive to paint;
   - ticker callbacks and loops run every frame: only while on screen;
   - parsing about 170 KB of minified JS on a mid-range phone.
4. **The design risk is bigger than the weight**: a big catalog tempts a
   page to use too much of it. One strong move per section; neighbours
   never repeat (CLAUDE.md).

A budget per page (how many pins, scrubbed triggers, split headings) is
an open question (O2), to be answered with phase 2's measurements.

## How to measure

`npm run weight` (or `-- --dry` to print without writing). Per entry it
bundles `export * from "src/engine/effects/<id>.ts"` with gsap, lenis and
`../core/*` external (its own code), lists what it imports (its needs),
and bundles the core with only that effect and every library (a page's
total). The libraries' baselines are entries that only import and
register them.

A site's whole engine, by hand, as phase 0 did:

```sh
mkdir measure && cd measure && npm init -y >/dev/null
npm i gsap@3.15.0 lenis@1.3.27 esbuild@0.27
# a file, bundled with everything it imports:
npx esbuild path/to/motion.ts --bundle --minify --format=esm --outfile=out.js
gzip -9c out.js | wc -c
```

An engine's own code is its bundle minus the baseline of the libraries it
imports.
