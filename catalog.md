# Catalog

Every motion effect of the Alpacode sites, one entry per canonical effect.
Every entry points at the code where it lives today, at a pinned commit;
phases 1–4 rebuild the entries here (`src/engine/`), each with a demo page
in the gallery, and the Status column follows them (see
[`docs/status.md`](docs/status.md)). The gallery's index is built from this
file, and `npm run check` keeps the two in step.

**85 effects**: 62 tier-1 primitives, 8 tier-2 scenes, 15 tier-3 showcase
entries — plus 13 core pieces (the engine, not effects) and 61 CSS
keyframes (listed at the end). When two sources do the same move, they are
one entry and the differences are in Notes.

## How to read it

- **id** — the canonical name. Renames and conflicts are in the naming
  registry ([`docs/decisions.md`](docs/decisions.md#naming-registry)); the
  name a site uses today is in Notes.
- **Hook** — what the markup asks for. `data-*` attributes only; a site's
  own classes go in that site's selector map (D5).
- **Sources** — where the code is today. Each link opens the line at the
  pinned commit. "Live" names a page where it can be seen.
- **Cost** — what it does at runtime:

  | Code | Means |
  | --- | --- |
  | `once` | one ScrollTrigger per element, fires once, then it's gone |
  | `batch` | `ScrollTrigger.batch` over all the matches |
  | `scrub` | a scrubbed ScrollTrigger: works on every scroll frame while in range |
  | `scroll` | listens to the scroll (onUpdate) without a scrubbed tween |
  | `pin` | GSAP `pin: true` (adds a pin-spacer, costs a refresh) |
  | `sticky` | CSS sticky stage in a tall section + a scrubbed timeline (no GSAP pin) |
  | `split` | SplitText: rewrites the DOM, re-splits on resize (`autoSplit`) |
  | `tick` | a `gsap.ticker` callback, every frame while active |
  | `loop` | `repeat: -1` or a chain of `delayedCall`s |
  | `ptr` | pointer play, fine pointers only (`hover: hover` and `pointer: fine`) |
  | `desk` / `dual` | desktop only / separate desktop and mobile builds (matchMedia) |
  | `DrawSVG`, `MotionPath`, `ScrambleText` | the GSAP plugin it needs (weights in [`docs/weight.md`](docs/weight.md)) |

- **Status** — `src` (only in the sources) → `port` (rebuilt here, in
  `src/engine/`) → `demo` (also has its demo page, a measured weight and
  screenshots, D12).
- **Weight** — the entry's own code, minified and gzipped, the libraries
  and the core left out: what it adds to a site that already has them.
  Written by `npm run weight` (how, in [`docs/weight.md`](docs/weight.md));
  `—` until the entry is ported.

Under `prefers-reduced-motion` nothing here runs (no Lenis, no scroll
animation); the CSS lays every scene out in its end state. Entries only
mention it when there's more to say.

### Sources

Pinned commits — the line numbers below are valid there:

- **A** — `FrancescoCorbosiero/alpacode-website` at `0876836` (2026-10-22): alpacode.it (`src/`) and fast.alpacode.it (`fast/`)
- **C** — `FrancescoCorbosiero/comunicazionecinofila` at `505c8c6` (2026-10-19)

| Key | File |
| --- | --- |
| AM | [`src/lib/motion.ts`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts) — the studio's engine |
| AL | [`src/lib/alpaca.ts`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts) — the alpaca's moves |
| AS | [`src/lib/landing/scenes.ts`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts) — the landings' chunk: the pen, the scenes |
| AF | [`fast/src/lib/motion.ts`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts) — FAST's engine |
| AV | [`src/lib/voucher/landing.ts`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/voucher/landing.ts) — the referral program's page script |
| AC | [`src/lib/landing/calc.ts`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/calc.ts) — the hosting calculator |
| AK | [`src/components/Alpaca.astro`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/components/Alpaca.astro) — the rigged silhouette |
| AMC | [`src/styles/motion.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css) — the studio's motion CSS: intros, states |
| ACC | [`src/styles/components.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css) |
| ABC | [`src/styles/base.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/base.css) |
| ALC | [`src/styles/landing.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css) — the landing kit, its scenes' CSS |
| AVC | [`src/styles/voucher.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css) — the referral program |
| APC | [`src/styles/product-pages.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/product-pages.css) |
| AFC | [`fast/src/styles/fast.css`](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css) — FAST |
| CM | [`src/scripts/motion.ts`](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts) — C's engine |
| CST | [`src/scripts/site.ts`](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/site.ts) — C's page scripts (forms, nav, modal) |
| CMC | [`src/styles/motion.css`](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css) — C's motion CSS: intros, states |
| CSC | [`src/styles/sections.css`](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css) — the pages' sections, the scenes' CSS |
| CFC | [`src/styles/effects.css`](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/effects.css) |
| CSI | [`src/styles/site.css`](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/site.css) |

---

## Core

Not effects: the skeleton every effect stands on. Copied once per site.
Ported in phase 1 to `src/engine/core/`; the core is 2.3 KB gzip of its own
code, all thirteen pieces together (`npm run weight`).

| id | Status | What | Sources | Notes |
| --- | --- | --- | --- | --- |
| core-lifecycle | `port` | Per page, everything is built inside `gsap.context()` and `gsap.matchMedia()`; listeners go through `on()`, extra teardown into `cleanups`; all of it is reverted on `astro:before-swap` and rebuilt on `astro:page-load` (or at DOMContentLoaded on the first visit); a `pageBody` guard stops a double init | [AM 487](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L487) [AM 1189](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1189) [AM 1244](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1244) [AM 1266](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1266) · [CM 334](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L334) [CM 1405](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1405) [CM 1457](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1457) [CM 1479](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1479) | Identical in A and C. A also hands its context to the lazy chunk (`ctx.add`, [AM 1238](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1238)). The port adds two things: each effect is built in a context of its own, so one that throws is undone alone and the page keeps the rest; and a change of the reduced-motion preference mid-visit rebuilds the page for it |
| core-lenis | `port` | Lenis for wheel and trackpad (touch keeps native scrolling), driven by GSAP's ticker with `lagSmoothing(0)`, synced to ScrollTrigger; `prevent` lets modal panes scroll natively; recreated after each swap | [AM 222](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L222) · [CM 130](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L130) | Identical but for the `prevent` selectors, which are the site's |
| core-scroll-to | `port` | `scrollToTarget(el or y, done?)`: smooth through Lenis, with room for the header when going up; same-page anchors glide (capture phase, so Astro's router stands down); `[data-scroll-top]` | [AM 253](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L253) [AM 273](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L273) · [CM 158](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L158) [CM 177](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L177) | Canonical: A's — its `done` fires confetti once the page has arrived ([AV 303](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/voucher/landing.ts#L303)). C has no `done` |
| core-scroll-lock | `port` | Overlays pause the page scroll | [AM 246](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L246) (event, sent by `src/lib/scroll-lock.ts`) · [CM 152](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L152) (`lockScroll()`) | Canonical: the event, `motion:scroll-lock` — overlays don't import the engine. Its sender is A's ref-counted lock, ported as `core/scroll-lock.ts` |
| core-header | `port` | Header `.scrolled` past 8px, `.is-hidden` while reading downwards; scroll-top button and floating button past the fold | [AM 300](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L300) · [CM 321](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L321) · CSS [ACC 24](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L24) | C keeps the header shown while the mobile nav is open; A adds `.scrolled`, `[data-scroll-top]`, `[data-fab]`. Canonical: the union. Threshold: A's 240px (C 260). It never hides while something inside it has focus (A's CSS) |
| core-guards | `port` | `inFirstView(el)`: starts within 92% of the first screen, leave it alone; `skipIntro(el)`: already moved by a CSS intro, or inside an island; `below(el)`: the inverse | [AM 211](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L211) [AM 217](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L217) · [CM 122](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L122) [CM 125](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L125) · [AS 92](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L92) · [AF 20](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L20) | The rule behind "nothing hidden by CSS". A also skips `astro-island` (React would see inline styles as hydration mismatches). The port skips islands too; the intro containers are the site's (`config.ts`) |
| core-focus-reveal | `port` | A block still waiting (`data-motion-pending`) shows at once when keyboard focus lands inside it | [AM 1182](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1182) · [CM 1398](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1398) | Identical but for the scale C also undoes (its stagger children start smaller): the port takes C's |
| core-refresh | `port` | Trigger positions kept honest: a debounced refresh when the page height changes (ResizeObserver), another after `document.fonts.ready`, `ScrollTrigger.sort()` after out-of-order creation | [AM 1221](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1221) [AM 1254](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1254) · [CM 1452](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1452) [CM 1467](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1467) | Identical. C creates its pinned sections first, in page order: pins add space, everything below measures after |
| core-fx-layer | `port` | A fixed, `aria-hidden` layer for transient bits (confetti), emptied on teardown | [AM 330](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L330) · [CM 195](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L195) | Identical |
| core-lazy-chunk | `port` | Heavy modules and their plugins are fetched only by pages that have them, then built inside the page's context and matchMedia | [AM 1232](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1232) | A only (`.lnd` pages load `landing/scenes.ts` with DrawSVG and MotionPath). Canonical for tiers 2–3 (D7). Ported as the registry's `lazy` list (`src/engine/registry.ts`); no entry uses it yet: the first that needs a plugin (2a) will |
| core-css-intro | `port` | Above the fold, motion is CSS keyframes: first paint never waits on JS | [AMC 114](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L114) · [CMC 7](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L7) · [ALC 367](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L367) · [AFC 425](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L425) | The keyframes are listed in [the CSS layer](#the-css-layer). The port keeps C's fill mode, `backwards` (A: `both`): once the intro is over, its properties go back to the stylesheet |
| core-view-transitions | `port` | The cross-page transition of Astro's `ClientRouter`, restyled | [AMC 389](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L389) · [CFC 21](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/effects.css#L21) | CSS only |
| core-read-progress | `port` | Reading progress bar | [AMC 302](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L302) (CSS `animation-timeline: scroll()`, no JS) · [CST 623](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/site.ts#L623) (JS, on scroll) | Canonical: the CSS scroll timeline (it's decorative: where unsupported, no bar). Hook: `[data-read-progress]` |

---

## Tier 1 — primitives

Drop-in: a hook on any element (or a function a page script calls), no
layout contract beyond the element itself.

### Headings (`data-split`)

Shared by every variant: SplitText with `autoSplit` (re-splits when
fonts or widths change), one ScrollTrigger at `top 88%`, once; skipped in
the first view and inside CSS intros. A heading that doesn't ask for a
variant gets the next one in turn down the page, so two neighbouring
sections never repeat the same move (A deals lines, wipe, words, blur,
chars; C deals lines, pop, wipe, chars, blur). Letter-by-letter falls back
to words beyond 26–28 characters. Sites also map their own heading
selectors ([AM 104](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L104), [CM 106](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L106)).

| id | Status | Hook | What | Sources | Cost | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| split-lines | `demo` | `data-split="lines"` | Each line rises out of its mask | [AM 573](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L573) · [CM 410](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L410) | once, split | 465 B | Identical but for the stagger: A 0.085s, C 0.09s (the port keeps A's). What every split-* entry shares is `effects/_headings.ts` |
| split-wipe | `demo` | `data-split="wipe"` | Each line is uncovered left to right | [AM 527](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L527) · [CM 383](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L383) | once, split | 502 B | A 1.3s, C 1.2s: the port keeps A's (D19). In the deck split-cycle deals from |
| split-words | `src` | `data-split="words"` | Words pop up out of their own masks, slightly tilted | [AM 533](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L533) | once, split | — | A only |
| split-blur | `src` | `data-split="blur"` | Lines come into focus while drifting up | [AM 542](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L542) · [CM 399](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L399) | once, split | — | Identical. The blur filter is the costliest variant to paint |
| split-chars | `src` | `data-split="chars"` | Letters rise and settle one by one | [AM 553](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L553) | once, split | — | A's `chars`. Short headings only |
| split-drop | `src` | `data-split="drop"` | Letters fall from above, tilted at random, and land with an elastic bounce | [CM 389](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L389) | once, split | — | C's `chars`, renamed: same name, other move |
| split-pop | `src` | `data-split="pop"` | Words jump in with a spring, a scale and a random tilt | [AM 562](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L562) · [CM 372](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L372) | once, split | — | One move: A `back.out(2)` ±10°, C `back.out(2.2)` ±12°. A uses it only when asked; C deals it in turn |
| split-accent | `src` | `data-accent`, inside a split heading | The accent word (the handwritten one) lands last, with its underline drawn by hand | [CM 428](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L428) · CSS [CMC 76](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L76) | once | — | C hooks it on `.script`, the Caveat class |

### Reveals

| id | Status | Hook | What | Sources | Cost | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| reveal | `demo` | `data-reveal` | Blocks fade up in staggered batches as they enter; a jump (anchor, find-in-page) shows the skipped ones at once and keeps the stagger short for the rest; control goes back to the stylesheet when done | [AM 600](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L600) · [CM 448](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L448) · [AF 23](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L23) | batch | 528 B | A also reveals 66 of its own selectors ([AM 117](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L117)). FAST's `data-rise` is the same move, shorter. Marks pending blocks for core-focus-reveal. The port leaves `data-reveal="stagger"` to reveal-stagger, and leaves a block keyboard focus has already shown to that (both sources re-tween it with its batch, slower) |
| reveal-stagger | `src` | `data-reveal="stagger"` | A grid's children land in a cascade, with a little bounce | [CM 451](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L451) | batch | — | C writes it `[data-reveal].stagger`. Live: [approccio.astro:125](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/approccio.astro#L125) |
| deal | `src` | `data-deal` | Cards land like a dealt hand, from alternate sides, tilted, with a bounce | [AF 35](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L35) | batch | — | FAST's `.fx-cards > li`. Close to `alternate` |
| clip | `src` | `data-clip` | A photo opens from a clip, its image settling from a slight zoom | [AM 679](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L679) · [CM 482](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L482) | once | — | A: square, the inner image from 1.16 (`.img-slot.is-filled`, `.post-cover`). C: rounded corners, no inner zoom (the image has its own parallax) (`.split-media`, `.svc-block-media`). Options: corners, inner zoom. C reads `data-clip` already, unused in its markup |
| strut | `src` | `data-strut` | A bar draws itself in from the left | [AM 633](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L633) | once | — | A also maps its strut classes ([AM 187](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L187)) |
| kicker | `src` | `data-kicker` | A kicker label fades in while its strut (a `::before`) draws in | [AM 645](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L645) · CSS [ABC 112](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/base.css#L112) | once | — | Driven through `--kick`, since a pseudo-element can't be tweened. A maps its `.sec-num` kickers ([AM 198](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L198)) |
| pop | `src` | `data-pop` | An icon stamps in: from nothing, with a twist and an elastic landing | [AM 664](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L664) · [CM 1069](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1069) | once | — | One move: A twists ±90° alternately, C −160°. The angle is an option |
| stamp | `src` | `data-stamp[="delay"]` | A stamp slams down (from 2.6×, accelerating) and the sheet takes the hit | [CM 1031](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1031) · [AS 621](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L621) | once | — | A's landing scene `stamp` is the same move. The value is a delay, for stamps in a row. Live: [approccio.astro:133](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/approccio.astro#L133), [OfferLanding.astro:254](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/components/landing/OfferLanding.astro#L254) |
| count | `src` | `data-count="2021"` (`data-count-from`) | A number counts up to its value; the static text stays the truth | [CM 1046](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1046) · [AV 79](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/voucher/landing.ts#L79) · [AC 25](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/calc.ts#L25) | once | — | A's referral sticker counts with rAF and a template (`data-count-to`, `data-count-template`); A's hosting calculator tweens its results as the sliders move. Canonical: C's API plus a template option |
| print | `src` | `data-print` | A QR (or any grid-like SVG) prints itself row by row under a scan bar | [AM 433](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L433) [AM 1132](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1132) · CSS [AMC 355](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L355) | once | — | Eased in `steps(rows)`. Also exported as `printQr()` |
| wordmark | `src` | `data-wordmark` | The footer's wordmark: the letters rise, then a mascot enters | [AM 1005](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1005) · [CM 1161](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1161) | once | — | A: letters rise out of their masks, the alpaca rises from behind the P a beat later. C: letters with a random tilt and a bounce, the dachshund drops onto them. Variants `rise` and `bounce`; the mascot is tier 3 |
| chat | `src` | `data-chat` | A chat preview plays the message arriving: the typing dots, then the bubble pops from its corner | [AM 1017](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1017) · CSS [AMC 370](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L370) | once, desk | — | A's referral studio (`.rf-preview-screen`) |
| draw | `src` | `data-draw` | An SVG's paths draw themselves in, one after another | [CM 1084](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1084) · [AM 984](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L984) · [AS 775](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L775) | once | — | C: native `strokeDasharray` (unused in its markup). A's map: JS only sets `data-draw`, CSS draws the routes ([ACC 3612](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L3612)). A's `pact` signature: DrawSVG |
| sticker-wall | `src` | `data-sticker-wall` (`[data-wall-item]`) | Stickers fall from above and bounce into place, in random order | [CM 1013](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1013) | once | — | Live: [lavora-con-noi.astro:209](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/lavora-con-noi.astro#L209) |
| knoll | `src` | `data-knoll` | Tools tumble in from scattered places and line up side by side, like a knolled workbench | [AS 530](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L530) | once | — | From A's landing scene `knoll`. Seeded randomness: the same scatter on every visit |
| alternate | `src` | `data-alternate` | Rows slide in from alternate sides | [AS 736](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L736) | batch | — | From A's landing scene `trades`. Close to `deal` |
| bars | `src` | `data-bars` | Each bar grows to its value (`--v`), in turn | [AS 601](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L601) | once | — | From A's landing scene `bars` |

### The pen

The studio's hand on the copy: marks drawn on words, notes in the margin.

| id | Status | Hook | What | Sources | Cost | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| mark-highlight | `src` | `data-mark="highlight"` (`data-mark-scrub`) | A highlighter sweeps across the words as they enter; scrubbed, it keeps pace with the scroll | [AS 172](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L172) [AS 198](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L198) · [CM 948](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L948) · CSS [CSC 578](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L578) | once (scrub) | — | A's `.lnd-mark` (heroes draw theirs in CSS, [ALC 381](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L381)); C's `data-hl[="scrub"]`, through `--hl`. Inside a `data-scrub` text, the scrubbed one arrives with its word |
| mark-underline | `src` | `data-mark="underline"` | An underline is drawn across | [AS 189](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L189) · CSS [ALC 217](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L217) | once | — | The same sweep as the highlight; the CSS decides it's a line |
| mark-strike | `src` | `data-mark="strike"` | A strike-through is drawn across | [AS 189](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L189) | once | — | Not the pinned `rewrite` scene |
| mark-circle | `src` | `data-mark="circle"` | A hand-drawn loop is redrawn at the word's real size, then drawn round it | [AS 125](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L125) [AS 157](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L157) [AS 172](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L172) | once, DrawSVG | — | A little more than one turn, never closed; seeded by the word, so each mark differs and stays the same on every visit. Redrawn on resize |
| mark-box | `src` | `data-mark="box"` | A box drawn in one stroke round the word, corners overshooting | [AS 144](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L144) [AS 172](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L172) | once, DrawSVG | — | Same seeded logic |
| hand | `src` | `data-hand` | A margin note is written in, then its arrow is drawn | [AS 229](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L229) [AS 241](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L241) | once, DrawSVG | — | Sibling: A's referral pages draw a brush stroke under a handwritten line with an IntersectionObserver and CSS ([AV 333](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/voucher/landing.ts#L333)) |

### Scroll-linked and ambient

| id | Status | Hook | What | Sources | Cost | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| scrub | `demo` | `data-scrub` | A statement's words light up as the scroll reads them | [AM 699](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L699) · [CM 499](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L499) | scrub, split | 353 B | Identical but for the end: A `bottom 48%`, C `bottom 50%` (the port keeps A's). The port leaves a statement in the first view alone, like every effect that hides: dimming painted words is hiding them (neither source checks) |
| parallax | `src` | `data-parallax[="40"]` | Vertical drift of a few pixels across the screen | [CM 524](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L524) | scrub | — |  |
| parallax-cover | `src` | `data-parallax-cover` | A cover image drifts inside its frame (pre-scaled in CSS) | [CM 526](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L526) · CSS [CFC 12](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/effects.css#L12) | scrub | — | Live: [CoverImage.astro:26](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/components/CoverImage.astro#L26) |
| speed | `src` | `data-speed="0.15"` | Drift as a fraction of the element's own height | [AM 720](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L720) · [CM 533](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L533) | scrub | — | Identical. A has it, but no markup uses it |
| hero-away | `src` | `data-hero-away[="14"]` (`data-hero-fade`) | Hero content drifts off and dims as the page scrolls away | [CM 1148](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1148) · [AM 925](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L925) | scrub | — | A's `[data-hero-content]` (up, dimmed) and `[data-hero-lockup]` (sinks) are two settings of it |
| hero-settle | `src` | `data-hero-settle` | A hero photo or video settles a little closer as the page scrolls away | [AM 927](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L927) | scrub | — | A's `[data-hero-zoom]`, renamed: C's `data-hero-zoom` is the iris |
| hero-video | `src` | `data-hero-video` (`[data-hero-video-toggle]`) | A background video gets its sources only when welcome (no reduced motion, no Save-Data), plays only on screen with the tab visible, and remembers the visitor's pause for the visit | [AM 898](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L898) [AM 931](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L931) | once | — | Behaviour more than motion (WCAG 2.2.2: a looping video needs a way to stop it) |
| kinetic | `src` | `data-kinetic` (`[data-kinetic-line="1"]`, `="-1"`) | A band's lines slide across in opposite directions while it crosses the screen | [AS 556](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L556) | scrub | — | Live: [SmmLanding.astro:109](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/components/landing/SmmLanding.astro#L109) |
| marquee | `src` | `data-marquee[="right"]` | A ticker drifts on its own, speeds up with the scroll and follows its direction; stops under the mouse | [AM 850](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L850) · [CM 1103](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1103) | tick | — | Ticks only while on screen. A's `.ticker--xl` and `.ticker--follow` also carry riders (the alpaca, tier 3). Base speed 56–70 px/s: an option |
| skew | `src` | `data-skew` | A band leans with the speed of the scroll | [AF 67](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L67) | scroll | — | FAST's `data-band` |
| peek | `src` | `data-peek` | A sticker peeks up from the bottom edge of its section as it enters | [CM 990](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L990) | scrub | — |  |
| spin | `src` | `data-spin` | A round badge turns with the scroll | [CM 1002](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1002) | scrub | — |  |
| rail | `src` | `data-rail` (`-fill`, `-step`, `-tile`) | A rail fills with the scroll (`--p`), the steps light up as it passes, each tile gives a little jolt | [AM 740](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L740) · [CM 968](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L968) · CSS [AMC 178](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L178) | scrub | — | A's `data-progress` (with the jolt and an optional runner, the alpaca); C's `data-rail`. Thresholds differ: A lights step i at i/n, C at i/(n−1), so C's last step lights only at the very end |
| float | `src` | `data-float` | Stickers bob slowly, each in its own time | [CM 544](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L544) | loop | — | Ambient. C's loops run off screen too: pause them there when ported |

### Pointer and input

| id | Status | Hook | What | Sources | Cost | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| tilt | `src` | `data-tilt[="card"]` | Leans toward the pointer in 3D; `card` also lifts | [AM 1097](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1097) · [CM 1177](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1177) | ptr | — | A: subtle (5°). C: 10–12° plus a lift, and it turns off the card's CSS transform transition while it plays. C applies it to every `.card` |
| magnetic | `src` | `data-magnetic` | Pulled toward the pointer, springs back on leave | [AM 1097](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1097) · [CM 1210](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1210) | ptr | — | A follows 16% of its own box and leans in 3D; C follows 35% of the pointer's offset, no lean. Strength and lean: options |
| coin | `src` | `data-coin` | On change, the chosen option's icon flips like a coin and swells | [AM 1040](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1040) | input | — | A's payout picker |
| accordion | `src` | `data-accordion` (on `<details>`) | Opens and closes with a height tween; clicked again while closing, it opens back up from where it is | [AM 1058](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1058) | click | — | Works without JS (native `<details>`). A's `details.rf-faq-item` |
| cursor-trail | `src` | `data-cursor-trail` | Prints follow the mouse, left and right in turn, facing the way it moves; on touch, one print per tap | [CM 1252](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1252) · CSS [CMC 107](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L107) | ptr, tap | — | C's `data-paw-trail`: the glyph is the brand's (paws) |
| cursor-thumb | `src` | `data-cursor-thumb` | An index row's thumbnail follows the pointer and pops in, tilted | [CM 1227](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1227) | ptr | — | C's `data-path-row`. Live: [index.astro:175](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/index.astro#L175) |
| lens | `src` | `data-lens="url"` | A magnifier follows the pointer over an image: the same image, zoomed, in a circle | [CM 1307](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1307) · CSS [CMC 140](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L140) | ptr, tick | — | Live: [lavora-con-noi.astro:100](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/lavora-con-noi.astro#L100) |
| pet | `src` | `data-pet` | Wags when the pointer passes; a burst of hearts on click | [CM 1365](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1365) | ptr, click | — | Uses `celebrate` with one shape |
| roll | `src` | `data-roll` | A button's label rolls: out at the top, back in from below | [CM 1380](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L1380) · CSS [CMC 126](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L126) | ptr | — | The JS only prepares the DOM, the hover is CSS. C does it to every `.btn` |

### Functions

Called by page scripts, which choreograph: the forms, the referral
program's panels ([AV 24](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/voucher/landing.ts#L24), [CST 10](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/site.ts#L10)).

| id | Status | Signature | What | Sources | Weight | Notes |
| --- | --- | --- | --- | --- | --- | --- |
| celebrate | `src` | `celebrate(el, {count, spread, shapes})` | A burst of confetti from an element: out in a ring, then falling | [AM 349](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L349) · [CM 207](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L207) | — | A's bits: struts, squares, euro signs, a tiny alpaca. C's: paws, hearts, bones (`shapes`). Canonical: C's signature, each brand's set as a preset |
| scramble | `src` | `scramble(el, text)`; `data-scramble` on hover | Text decodes itself: glyphs cycle and settle left to right, separators hold their place; works on inputs | [AM 396](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L396) · [AF 57](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L57) [AF 107](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L107) | — | A's is hand-rolled; FAST uses ScrambleTextPlugin. Canonical: A's (D8) |
| panel-enter | `src` | `panelEnter(panel, dir, fields?)` | A form step or tab comes in from the side it was asked from; its fields follow in a cascade | [AM 457](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L457) · [CM 256](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L256) | — | C's `stepEnter`. Same move, other field selectors |
| reveal-panel | `src` | `revealPanel(panel)` | A panel just swapped in (a thank-you, a share panel): its pieces drop in one after another | [AM 480](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L480) | — |  |
| nudge | `src` | `nudge(fields)` | The "no-no" shake on fields that need fixing | [AM 472](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L472) · [CM 301](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L301) | — | Identical |
| swing | `src` | `swing(el)` | A tag swings like a medallion on a collar | [CM 245](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L245) | — | Used at [CST 342](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/site.ts#L342) |
| step-progress | `src` | `stepProgress(form, i, animate)` | A runner glyph hops from step to step over a form's progress dots, the dot filling | [CM 275](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L275) · CSS [CMC 98](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L98) | — | The glyph is the brand's (a paw) |
| success-burst | `src` | `successBurst(el)` | Form sent: the check spins in and draws itself, then confetti | [CM 307](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L307) | — |  |

---

## Tier 2 — parametric scenes

Sections with a markup contract: reusable as they are, once their markup
is in place. All of them are laid out complete without JS.

| id | Status | Hook | The move | Sources | Cost | Weight | Contract and notes |
| --- | --- | --- | --- | --- | --- | --- | --- |
| stage | `src` | `data-scene` on a tall section (`--len`) with a sticky stage | The base of every pinned story: one scrubbed timeline over the tall section (`top top` → `bottom bottom`), a progress bar (`--p`), `beats()` handing the text over at set points, `centre()` measuring targets from layout | [AS 253](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L253) [AS 266](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L266) [AS 285](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L285) · CSS [ALC 422](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L422) | sticky, scrub | — | A's landing kit; the 8 scrubbed landing scenes stand on it. The model for D6. How-to: [landing-factory.md:92](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/docs/landing-factory.md#L92) |
| venn | `src` | `data-venn` | Three circles start far apart and slide until they overlap; their meeting point appears at the end | [CM 790](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L790) · CSS [CSC 683](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L683) | pin (desk), scrub (mobile), dual | — | `[data-venn-circle][data-from="x y"]` (offsets in % of their size), `[data-venn-core]`. Live: [approccio.astro:146](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/approccio.astro#L146) |
| fan | `src` | `data-fan` | Stacked photos open into a fan as the section enters | [CM 921](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L921) · CSS [CSC 806](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L806) | scrub | — | `[data-fan-item]`; distances measured from layout; each keeps its resting tilt. Live: [chi-sono.astro:138](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/chi-sono.astro#L138) |
| stack | `src` | `data-stack` | Sticky cards stack up: the one beneath shrinks, tilts and dims as the next covers it | [CM 737](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L737) · CSS [CSC 492](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L492) | scrub | — | `[data-stack-card]`, sticky in CSS (they stack without JS too). Live: [lavora-con-noi.astro:179](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/lavora-con-noi.astro#L179) |
| stories | `src` | `data-stories` | Like Instagram stories, driven by the scroll: the bars fill, each slide pushes the last one away, its pieces come in as it slides | [CM 690](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L690) · CSS [CSC 392](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L392) | pin, dual | — | `[data-story-phone]`, `[data-story-slide]`, `[data-story-bar]`, `[data-story-piece]`. Desktop pins the section, mobile pins the phone. Without JS: a list of cards. Live: [consulenza-gratuita.astro:228](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/consulenza-gratuita.astro#L228) |
| hscroll | `src` | `data-hscroll` | A horizontal gallery moved by the vertical scroll, with its progress bar | [CM 657](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L657) · CSS [CSC 223](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L223) | pin, desk | — | `[data-hscroll-track]`, `[data-hscroll-bar]`. On mobile: a native swipe carousel (scroll-snap). Live: [index.astro:245](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/index.astro#L245) |
| rewrite | `src` | `data-rewrite` | A pinned title: a hand-drawn scribble strikes out the old words, and the new word writes itself in | [CM 764](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L764) | pin | — | C's `data-strike` (`<del>`, `<ins>`, `[data-strike-path]`). Live: [lavora-con-noi.astro:145](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/lavora-con-noi.astro#L145) |
| trail | `src` | `data-trail` | A dotted path winds through the steps; prints walk it in step with the reader and light each step as they reach it | [CM 835](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L835) · CSS [CSC 844](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L844) | scroll | — | `[data-trail-svg]`, `[data-trail-path]`, `[data-trail-paws]`, `[data-trail-step]` with its `[data-trail-stop]`. Path rebuilt on every refresh (curves with vertical tangents: it never goes back up). Live: [chi-sono.astro:166](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/pages/chi-sono.astro#L166) |

---

## Tier 3 — showcase

Bespoke work, kept as recipes: the story, the mechanism, the code. Not
meant to be copied as is; meant to be learned from, and to make the next
one.

### The alpaca (A)

One flat silhouette, rigged. [AK 20](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/components/Alpaca.astro#L20) is a single path; clip paths cut it
into body, neck and head, ear, tail and four legs. Each limb is the part
past its joint plus a disc on the joint, centred on the pivot (`data-pivot`,
SVG units): the disc turns into itself, so a bent knee or a nodding neck
never opens a seam; joints sit where the outline runs straight across the
cut; neighbouring cuts overlap by half a unit ([AK 23](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/components/Alpaca.astro#L23)). `rigOf()` reads
the pieces and sets each one's `svgOrigin` ([AL 41](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L41)). The drawing faces
right; turning mirrors the whole `<svg>`, so x, y and scaleX on the
`<svg>` are its place on the page and everything inside is body language
([AL 1](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L1)).

Status: `src`.

| Move | What | Source |
| --- | --- | --- |
| face | Turns round: a squash through zero width, with a skip | [AL 63](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L63) |
| walker | The walk cycle, driven by ground covered (lateral sequence: hind, fore, far hind, far fore), written per frame through quickSetters: legs, nod, tail, bob | [AL 78](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L78) |
| marchers | Riders of a marquee: they face the way it runs and walk with it; when the scroll hurries the band, the stride lengthens into a trot instead of a blur | [AL 116](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L116) |
| flickEar, flickTail | An ear flick, a tail flick | [AL 145](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L145) [AL 153](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L153) |
| nod | Head down to graze, then back up | [AL 163](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L163) |
| alert | Head up, ear pricked | [AL 173](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L173) |
| lookAround | Looks the other way and back | [AL 182](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L182) |
| hop | A skip on the spot, legs tucked, an ear for balance | [AL 192](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L192) |
| leapTo | Leaps to a point in an arc, legs stretched like a gallop; lands, sinks into its legs and springs back | [AL 206](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L206) |
| walkIn | Walks into place over a distance, legs keyed to the ground; can come out of nothing | [AL 234](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L234) |
| idle | Signs of life at random intervals, while it's on screen | [AL 264](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L264) |
| playful | Leans in when hovered, skips when tapped | [AL 279](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/alpaca.ts#L279) |

| Where | What it does | Source |
| --- | --- | --- |
| `data-alpaca` | idle and playful (footer, referral pages) | [AM 1142](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1142) |
| `data-alpaca="walk-in"` | walks in from the dark once well in view (home manifesto, referral finale) | [AM 1153](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1153) |
| `data-alpaca="lost"` | looks around first (404) | [AM 1170](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1170) |
| `data-alpaca-walker` | rides the home marquee | [AM 855](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L855) |
| `data-steps-runner` | leaps from tile to tile along the referral program's rail (desktop), or waits on "Sei qui" and hops when it lights up | [AM 791](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L791) |
| footer mascot | rises from behind the P of the wordmark | [AM 1010](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L1010) |

### The campaign landings' scenes (A)

`data-scene="<name>"` inside `.lnd`, in the lazy chunk ([AS 61](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L61)). "Stage"
means the sticky stage of tier 2; "machine" plays on its own, pauses off
screen; "once" plays when it enters.

| id | Status | Page | Type | Weight | The story | Worth reusing | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| receipt | `src` | /per-chi-fa-siti/hosting, hero | machine | — | The hosting bill prints itself line by line, the total gets circled, a note is written in the margin; then it breathes | a clip that prints, the pen on a timeline, an idle yoyo paused off screen | [AS 300](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L300) |
| pack | `src` | /per-chi-fa-siti/hosting | stage | — | Twenty bills fly into one server; a light comes on for each site | flights to targets measured with `centre()`, a light per arrival | [AS 331](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L331) |
| layers | `src` | /per-chi-fa-siti/hosting | stage | — | The codebase's layers come apart, one at a time, each named as it lifts | CSS custom properties scrubbed on an isometric stack (`--gap`, `--rz`, `--lift`); state by progress | [AS 380](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L380) |
| press | `src` | /per-chi-fa-siti/ai, hero | machine | — | The press comes down and stamps out a site per client, card after card | a looping timeline built per card; a belt moved by `background-position` | [AS 417](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L417) |
| shift | `src` | /per-chi-fa-siti/ai | stage | — | The repetitive jobs move from the person's lane to the agents'; the time bar shrinks | chips fly to their twins' measured places and hand over | [AS 457](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L457) |
| line | `src` | /per-chi-fa-siti/ai | stage | — | A site rides the six stations of the assembly line and grows up | hold, move, hold: station state from the playhead; on phones it only lights the stations | [AS 490](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L490) |
| found | `src` | /offerta/* | stage | — | The search their clients make types itself, the usual results come in, then the one that's finally them | typing with a `steps(n)` clip, a row opening to `height: auto` | [AS 574](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L574) |
| mirror | `src` | /social-media-manager | once | — | The link-in-bio's links light up one by one, and the site assembles itself from them | a yoyo highlight, the parts flying in | [AS 641](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L641) |
| rent | `src` | /social-media-manager | stage | — | Rented land: a notification lands with each beat | drops timed to the beats | [AS 663](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L663) |
| loop | `src` | /partner, hero | machine | — | Clients go round from you to us and back; each token changes shape as it passes a node, and the node takes it | MotionPath along an SVG path, an offset per token, a state switch halfway | [AS 681](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L681) |
| channel | `src` | /partner | stage | — | The three models, one at a time; the tabs and the rails follow | state by progress (`data-on`), beats | [AS 719](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L719) |
| scale | `src` | /partner | stage | — | What each side gains drops into its pan; the beam dips under each one and ends level | a scrubbed custom property (`--tilt`), bounced drops | [AS 750](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/landing/scenes.ts#L750) |

Promoted to tier 1, since the move is generic: `knoll` → knoll, `bars` →
bars, `stamp` → stamp, `trades` → alternate, `pact` → draw. The scene
`stack` is listed as `layers` (C's `data-stack` is another effect).

### Two more

| id | Status | Where | Type | Weight | The story | Worth reusing | Source |
| --- | --- | --- | --- | --- | --- | --- | --- |
| iris | `src` | C, home hero (`data-hero-zoom`) | pin, desk | — | The hero photo sits in a peach circle, a bowl seen from above; scrolling, the circle grows to fill the screen while the photo returns to its full scale: you step into the photo | geometry read from CSS variables, a focal point (`data-focal`) kept centred through `object-fit` maths, `fromTo` because the CSS intro is still running at init | [CM 565](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/scripts/motion.ts#L565) · CSS [CSC 88](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L88) |
| meter | `src` | FAST, home | stage | — | A needle swings from PAURA to LEVA; the word scrambles into the next; the beats hand over | ScrambleText on a scrubbed timeline, a needle turned on its `svgOrigin` | [AF 81](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/lib/motion.ts#L81) |

`iris` is generalizable (any photo into full screen): a tier-2 candidate.

---

## The CSS layer

The keyframes, mostly above-the-fold intros (core-css-intro) and small
loops. Listed so the catalog knows they exist; documented as each phase
gets to them.

| Where | Keyframes | Used by |
| --- | --- | --- |
| A motion.css | introLine [AMC 114](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L114), introFade [AMC 122](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L122), introBar [AMC 132](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L132) | the first screen's lines, fades and bars |
| | caseSwap [AMC 189](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L189) | a case's media tag |
| | cmdkIn [AMC 267](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L267), cmdkBackdropIn [AMC 277](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L277) | the ⌘K palette |
| | scrollProgress [AMC 307](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L307) | the reading progress (scroll timeline) |
| | vtOut [AMC 396](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L396), vtIn [AMC 402](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/motion.css#L402) | the view transition |
| A components.css | mnavFade [ACC 459](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L459), mnavSlide [ACC 463](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L463) | the mobile menu |
| | cubeDrift [ACC 757](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L757) | the home hero's background |
| | tickerMove [ACC 1387](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L1387) | the marquee without JS |
| | mapPing [ACC 3584](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L3584), mapDraw [ACC 3621](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L3621) | the coverage map |
| | blogFade [ACC 4099](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/components.css#L4099) | the blog stream |
| A landing.css | lnd-mark [ALC 389](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L389), lnd-write [ALC 394](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L394), lnd-rise [ALC 402](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L402), lnd-line [ALC 408](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L408) | the landing heroes: marks, the correction written in, the machine, the display lines |
| | lnd-slap [ALC 2756](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L2756), lnd-feed [ALC 3348](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L3348), lnd-rail [ALC 4129](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/landing.css#L4129) | the price tag, a feed, a rail |
| A voucher.css | rfStamp [AVC 345](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L345), rfTag [AVC 354](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L354), rfBurst [AVC 360](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L360) | the referral sticker landing |
| | rfKitIn [AVC 2150](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L2150), rfKitPop [AVC 2156](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L2156) | the kit board |
| | rfSignFlip [AVC 2374](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L2374), rfSignSwing [AVC 2379](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/voucher.css#L2379) | the "open" sign |
| A product-pages.css | pp-pulse [APC 215](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/product-pages.css#L215), pp-bar [APC 243](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/product-pages.css#L243), pp-rise [APC 256](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/styles/product-pages.css#L256) | the product pages' hero |
| A fast.css | fx-caret [AFC 169](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L169), fx-drift [AFC 333](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L333) | FAST: the keyword caret, the ghost text |
| | fx-strike [AFC 391](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L391), fx-out [AFC 397](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L397), fx-in [AFC 403](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L403) | FAST: the hero's word turn |
| | fx-rise [AFC 429](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L429), fx-pop [AFC 541](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L541), fx-typing [AFC 547](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L547), fx-dot [AFC 557](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L557) | FAST: the hero intro, the chat |
| | fx-marquee [AFC 597](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/fast/src/styles/fast.css#L597) | FAST: the band |
| C motion.css | intro-line, intro-fade, intro-card, intro-pop, cover-unroll [CMC 59](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/motion.css#L59) | the first screen |
| C sections.css | marquee [CSC 48](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L48) | the marquee without JS |
| | draw-on, ring-in, photo-in, stk-drop [CSC 123](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L123) | the home hero (the bowl's intro) |
| | cta-pulse [CSC 446](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L446), stamp-in [CSC 535](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L535), tag-slap [CSC 795](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L795), tag-write [CSC 797](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/sections.css#L797) | sticky CTA, a pressed sticker, the name tag |
| C site.css | btn-spin [CSI 454](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/site.css#L454), fadeUp [CSI 553](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/site.css#L553), fade-in [CSI 627](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/site.css#L627), modal-pop [CSI 628](https://github.com/FrancescoCorbosiero/comunicazionecinofila/blob/505c8c66c85df1b4ad153c7fa601b1f2f6564c65/src/styles/site.css#L628) | sending, form steps and messages, the call modal |

---

## Not in the catalog yet

**GSAP plugins no site uses.** Since GSAP 3.13 every plugin ships free in
the `gsap` package. Measured weights in [`docs/weight.md`](docs/weight.md).

| Plugin | What it could bring |
| --- | --- |
| Flip | layout transitions: a filtered grid that rearranges, a card that becomes its page |
| Draggable + Inertia | things to tug and throw (see below) |
| Observer | gesture- and wheel-driven scenes, full-screen section swipes |
| MorphSVG | shapes turning into other shapes |
| CustomEase, CustomBounce, CustomWiggle | a house easing curve, a signature bounce |
| Physics2D | confetti with real velocity and gravity |
| ScrollSmoother | GSAP's own smooth scroll (the sites use Lenis) |

**A gap.** A's engine header promises "the sticker you can tug" ([AM 24](https://github.com/FrancescoCorbosiero/alpacode-website/blob/08768362c6f5e3042921ef3d173b0147369b62db/src/lib/motion.ts#L24)):
there is no drag code anywhere in A. Either the comment is stale or the
effect was never built (open question O7).

**CSS scroll-driven animations** (`view-timeline`) could take over the
simplest scrubbed effects at no JS cost. Support is still uneven across
browsers: to be checked per effect before relying on it.

## Porting notes

Found while indexing or porting. The open ones are fixed when their entry
is rebuilt here; the fixed ones say where.

Open:

- C's `float` loops and the stickers' tweens keep running off screen: loops
  should run only while on screen (A pauses its machines with `onToggle`).
- C's `lens` keeps a ticker callback per lens for the page's lifetime (it
  returns early when hidden): subscribe on enter instead.
- Unused hooks: A's `data-speed`; C's `data-draw` and `data-clip`.
- The rail's thresholds (A `i/n`, C `i/(n−1)`) and the other tuning
  differences listed in Notes are decided with the demos (decisions.md,
  pending defaults).

Fixed in the port (phase 1):

- C doesn't skip `astro-island` content in its guards; A does. The core's
  guards (`skipIntro`) skip it for every entry.
- Neither engine checks the first view for `data-scrub`: a statement there
  is dimmed after it was painted. `scrub` leaves it alone.
- In both engines, a block keyboard focus has shown is re-tweened by its
  batch when it scrolls in, slower. `reveal` leaves it to its focus tween.
- GSAP's `Context.add()` doesn't restore the current context when its
  function throws: one failing effect inside the page's context would
  leave GSAP's context set and its blocks hidden. The lifecycle builds
  each effect in a context of its own, catches inside it and undoes it
  alone.
