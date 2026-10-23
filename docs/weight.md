# Weight

What motion costs a page. Measured on 2026-10-23 with esbuild 0.25
(bundled, minified, ESM; gzip -9), gsap 3.15.0 and lenis 1.3.27, on the
engines at the commits pinned in catalog.md. Gzip is what travels; the
browser parses and runs the minified size, about three times as much.

## The libraries

| Bundle | gzip |
| --- | --- |
| gsap core | 27.5 KB |
| + ScrollTrigger | 45.1 KB |
| + ScrollTrigger, SplitText and Lenis (what both engines load) | **53.2 KB** |
| + DrawSVG and MotionPath as well (alpacode's landings) | 63.8 KB |
| Lenis alone | 5.4 KB |

Each plugin on its own, over gsap core (deltas don't add up exactly:
compression is shared):

| Plugin | + gzip | Used by |
| --- | --- | --- |
| ScrollTrigger | 17.6 KB | both sites |
| SplitText | 3.1 KB | both sites |
| DrawSVG | 1.6 KB | alpacode's landings |
| MotionPath | 8.7 KB | alpacode's landings (`loop`) |
| ScrambleText | 3.5 KB | FAST |
| Flip | 8.7 KB | — |
| Draggable + Inertia | 15.5 KB | — |
| Observer | 3.7 KB | — |
| MorphSVG | 8.9 KB | — |
| CustomEase | 3.2 KB | — |
| Physics2D | 0.7 KB | — |
| ScrollSmoother | 4.7 KB over ScrollTrigger | — |

## The engines

| Engine | Total gzip | Its own code |
| --- | --- | --- |
| alpacode, `src/lib/motion.ts` (with `alpaca.ts`) | 61.7 KB | about 8.5 KB |
| alpacode, the landings' chunk (`scenes.ts`, `.lnd` pages only) | about 15 KB more | about 4.8 KB, plus DrawSVG and MotionPath |
| C, `src/scripts/motion.ts` (48 effects) | 61.6 KB | about 8.4 KB |
| FAST, `fast/src/lib/motion.ts` | 49.6 KB | under 1 KB |

For scale: alpacode's home hero video is 464 KB (webm) or 1.4 MB (mp4).

## What it means

1. **The catalog itself is cheap.** An effect costs about 170 bytes gzip
   of its own code; C's 48 effects together are 8.4 KB.
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

Until phase 1 adds a script, the way these numbers were taken:

```sh
mkdir measure && cd measure && npm init -y >/dev/null
npm i gsap@3.15.0 lenis@1.3.27 esbuild@0.25.0
# a file, bundled with everything it imports:
npx esbuild path/to/motion.ts --bundle --minify --format=esm --outfile=out.js
gzip -9c out.js | wc -c
# a library baseline: an entry that only imports and registers it
echo 'import {gsap} from "gsap"; import {ScrollTrigger} from "gsap/ScrollTrigger"; gsap.registerPlugin(ScrollTrigger);' > st.ts
npx esbuild st.ts --bundle --minify --format=esm --outfile=st.js && gzip -9c st.js | wc -c
```

An engine's own code is its bundle minus the baseline of the libraries it
imports.
