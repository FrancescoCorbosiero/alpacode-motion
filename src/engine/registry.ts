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
import * as accordion from "./effects/accordion";
import * as alternate from "./effects/alternate";
import * as bars from "./effects/bars";
import * as celebrate from "./effects/celebrate";
import * as chat from "./effects/chat";
import * as clip from "./effects/clip";
import * as coin from "./effects/coin";
import * as count from "./effects/count";
import * as deal from "./effects/deal";
import * as draw from "./effects/draw";
import * as heroAway from "./effects/hero-away";
import * as heroSettle from "./effects/hero-settle";
import * as heroVideo from "./effects/hero-video";
import * as kicker from "./effects/kicker";
import * as kinetic from "./effects/kinetic";
import * as magnetic from "./effects/magnetic";
import * as markHighlight from "./effects/mark-highlight";
import * as marquee from "./effects/marquee";
import * as markStrike from "./effects/mark-strike";
import * as markUnderline from "./effects/mark-underline";
import * as knoll from "./effects/knoll";
import * as nudge from "./effects/nudge";
import * as panelEnter from "./effects/panel-enter";
import * as pop from "./effects/pop";
import * as print from "./effects/print";
import * as rail from "./effects/rail";
import * as reveal from "./effects/reveal";
import * as revealPanel from "./effects/reveal-panel";
import * as scramble from "./effects/scramble";
import * as scrub from "./effects/scrub";
import * as skew from "./effects/skew";
import * as stamp from "./effects/stamp";
import * as splitBlur from "./effects/split-blur";
import * as splitChars from "./effects/split-chars";
import * as splitCycle from "./effects/split-cycle";
import * as splitLines from "./effects/split-lines";
import * as splitPop from "./effects/split-pop";
import * as splitWipe from "./effects/split-wipe";
import * as splitWords from "./effects/split-words";
import * as strut from "./effects/strut";
import * as tilt from "./effects/tilt";
import * as wordmark from "./effects/wordmark";

export const effects: Effect[] = [splitLines, splitWipe, splitWords, splitBlur, splitChars, splitPop, splitCycle, reveal, clip, strut, kicker, pop, stamp, count, print, wordmark, chat, draw, knoll, alternate, bars, deal, markHighlight, markUnderline, markStrike, scrub, heroAway, heroSettle, heroVideo, kinetic, marquee, skew, rail, tilt, magnetic, coin, accordion, celebrate, scramble, panelEnter, revealPanel, nudge];

export const lazy: LazyEffect[] = [
  { hook: '[data-mark="circle"]', load: () => import("./effects/mark-circle") },
  { hook: '[data-mark="box"]', load: () => import("./effects/mark-box") },
  { hook: "[data-hand]", load: () => import("./effects/hand") },
];
