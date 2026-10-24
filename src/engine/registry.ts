/* ============================================================
   The site's effects, written per site with config.ts.
   `effects` are in the main bundle and built on every page, in this
   order: pinned scenes first, in page order (their pins add space and
   everything below measures after them), then the rest. A module with
   nothing to do runs one query and returns.
   `lazy` ones are fetched only by pages that have their hook, then
   built in the page's context (D7): tier 2 and 3, and anything that
   needs a plugin beyond ScrollTrigger and SplitText (DrawSVG,
   MotionPath). Their CSS still goes in the site's stylesheet: it holds
   their end state, which must not wait for the chunk.
   ============================================================ */
import type { Effect, LazyEffect } from "./core/kit";
import * as reveal from "./effects/reveal";
import * as scrub from "./effects/scrub";
import * as splitBlur from "./effects/split-blur";
import * as splitChars from "./effects/split-chars";
import * as splitCycle from "./effects/split-cycle";
import * as splitLines from "./effects/split-lines";
import * as splitPop from "./effects/split-pop";
import * as splitWipe from "./effects/split-wipe";
import * as splitWords from "./effects/split-words";

export const effects: Effect[] = [splitLines, splitWipe, splitWords, splitBlur, splitChars, splitPop, splitCycle, reveal, scrub];

export const lazy: LazyEffect[] = [
  // { hook: "[data-mark]", load: () => import("./effects/mark-circle") },
];
