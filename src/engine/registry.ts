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
import * as clip from "./effects/clip";
import * as alternate from "./effects/alternate";
import * as bars from "./effects/bars";
import * as chat from "./effects/chat";
import * as count from "./effects/count";
import * as cursorThumb from "./effects/cursor-thumb";
import * as deal from "./effects/deal";
import * as draw from "./effects/draw";
import * as frameScroll from "./effects/frame-scroll";
import * as kicker from "./effects/kicker";
import * as markHighlight from "./effects/mark-highlight";
import * as markStrike from "./effects/mark-strike";
import * as markUnderline from "./effects/mark-underline";
import * as knoll from "./effects/knoll";
import * as pop from "./effects/pop";
import * as print from "./effects/print";
import * as reveal from "./effects/reveal";
import * as scrub from "./effects/scrub";
import * as stamp from "./effects/stamp";
import * as splitBlur from "./effects/split-blur";
import * as splitChars from "./effects/split-chars";
import * as splitCycle from "./effects/split-cycle";
import * as splitLines from "./effects/split-lines";
import * as splitPop from "./effects/split-pop";
import * as splitWipe from "./effects/split-wipe";
import * as splitWords from "./effects/split-words";
import * as strut from "./effects/strut";
import * as wordmark from "./effects/wordmark";

export const effects: Effect[] = [splitLines, splitWipe, splitWords, splitBlur, splitChars, splitPop, splitCycle, reveal, clip, strut, kicker, pop, stamp, count, print, wordmark, chat, draw, knoll, alternate, bars, deal, markHighlight, markUnderline, markStrike, scrub, frameScroll, cursorThumb];

export const lazy: LazyEffect[] = [
  { hook: '[data-mark="circle"]', load: () => import("./effects/mark-circle") },
  { hook: '[data-mark="box"]', load: () => import("./effects/mark-box") },
  { hook: "[data-hand]", load: () => import("./effects/hand") },
  { hook: "[data-flip-filter]", load: () => import("./effects/flip-filter") },
  { hook: '[data-scene="cases"]', load: () => import("./effects/cases") },
  { hook: '[data-scene="method"]', load: () => import("./effects/method") },
  { hook: '[data-scene="map"]', load: () => import("./effects/map") },
];
