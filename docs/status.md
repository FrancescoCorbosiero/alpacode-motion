# Status

Where the work stands. Updated at the end of every session.

## Now — phase 2: alpacode's tier 1 and the stage done (2026-10-25)

- **43 entries to `demo`** in this phase (46 with phase 1's), each with
  its module and CSS, its place in the registry, its page, its measured
  weight and its screenshots: every tier-1 entry alpacode (or FAST) has,
  in Headings (`split-wipe`, `split-words`, `split-blur`, `split-chars`,
  `split-pop`, and the new `split-cycle`, the deal), Reveals (`clip`,
  `strut`, `kicker`, `pop`, `stamp`, `count`, `print`, `wordmark`,
  `chat`, `draw`, `knoll`, `alternate`, `bars`, `deal`), The pen (the
  six), Scroll-linked (`hero-away`, `hero-settle`, `hero-video`,
  `kinetic`, `marquee`, `skew`, `rail`), Pointer and input (`tilt`,
  `magnetic`, `coin`, `accordion`), Functions (`celebrate`, `scramble`,
  `panel-enter`, `reveal-panel`, `nudge`), and tier 2's `stage`.
- **Left at `src`**, as asked: the tier-1 entries only cinofila has
  (`split-drop`, `split-accent`, `reveal-stagger`, `sticker-wall`,
  `parallax`, `parallax-cover`, `peek`, `spin`, `float`, `cursor-trail`,
  `lens`, `pet`, `roll`, `swing`, `step-progress`, `success-burst`),
  `speed` (no markup uses it), tier 3 and the rest of tier 2.
  `cursor-thumb` and `meter` are ported with the house's showcase (below).
- **Decisions**: D18 (O4 decided: the catalog's engine runs the sites,
  which adopt its hooks) and D19 (alpacode's tuning is the default; the
  other sources' become settings or one-attribute variants, shown side
  by side), its table one row per entry that differed. The pending
  defaults are all decided.
- **The lazy path is in use** (D7): `mark-circle`, `mark-box` and `hand`
  bring DrawSVG in their chunks, `stage` is tier 2; the smoke test checks
  both ways.
- **Port fixes beyond the sources** (catalog.md, Porting notes, and each
  row's Notes): the staggered `from()` flash of the split headings; batch
  order; jolts and keyframed shakes that left an inline transform; the
  marquee's ticker off screen and its jump back to the start; the hero
  video off screen; scrubs that read their start at build; first-view
  rails, bands and stages; FAST's skew on an animated element; the
  transition that fought the pointer play; the accordion's fold.
- **The smoke test** now also guards the heading deal and the letters'
  flash, the lazy chunks, the marquee and hero video off screen, the
  stage, and the pointer play (with a mouse, handed back; still on touch).
- **The gallery**: a heading demo layout (`HeadingDemo.astro`), seeded
  blueprint plates and a real QR for the demos (`src/demos/_shared/`),
  demo media drawn with ffmpeg (`public/media/hero-demo.*`), Caveat for
  the hand's notes, an entry page that can describe a function's hook
  (`hookWhat`).

## Adoption: alpacode.it and Alpacode Studio (2026-10-25)

Both alpacode sites run this engine, copied at `c19c357`
(`alpacode-website`, branch `claude/busy-noether-amfgzf`):

- **alpacode.it** (`src/engine/`): the core and 48 entries as they are
  (every alpacode one, the showcase's, `stage` and the five functions);
  its `config.ts` maps the house's classes onto the hooks (the section
  titles onto `data-split`, the blocks onto `data-reveal`, …) and its
  `registry.ts` loads them; its tier 3 is the alpaca (`alpaca.ts` on its
  rig) and the landings' scenes (`lib/landing/scenes.ts`, on `stage`'s
  helpers). The markup took the contract in the rows' Notes; the
  landing kit's scene CSS switches on `[data-scene-live]`. Its old
  `lib/motion.ts` is gone. `count` and `stamp` aren't copied: no page
  uses them.
- **Alpacode Studio** (`sites/studio/src/engine/`): the core (its
  `core.css` without the intro: the studio's hero is its own), `reveal`,
  `deal`, `skew`, and `meter` with `stage`.
- Verified against the engine they had: every page shot as it scrolls,
  frame by frame, at 1440×900, 390×844 and 390×664, and full pages under
  reduced motion: the same, but for what moves on its own (a marquee,
  a loop, a scramble).

## The house's showcase (2026-10-24, merged 2026-10-25)

Six entries born on alpacode.it's new showcase (the H source, commit
`0daaa1e` of `alpacode-website`), written in this repo's contract and
taken to `demo` here: module, CSS with its end state, registry, demo
page with neutral content (new plates: `site()`, `page()` in
`src/demos/_shared/plates.ts`), weight, screenshots.

- Tier 1: `cursor-thumb` (C's index thumb, ported with H's variant as
  the canonical one: one frame for the list; C's pop and tilt are
  settings), `frame-scroll`, `flip-filter` (the first entry on Flip,
  lazy).
- Tier 3, "The house's showcase (H)": `cases`, `method`, `map` (lazy);
  and `meter` (FAST's, now on Alpacode Studio's crash-course page),
  the first of "Two more" ported (lazy, ScrambleText).
  The map's dots are worked out at build (`_shared/italy-dots.ts`, from
  the site's `src/lib/italy-dots.ts`).
- The stage: `stage`, ported since, took the same hook
  (`data-scene-stage`), and `cases`, `method` and `meter` are built on
  its helpers: their layout switches on `[data-scene-live]`, set by
  `scrubbed()`, like every pinned scene's.
- Assumed, to validate: C's per-row thumbs become one list with its
  frame when C adopts `cursor-thumb`.

## Phase 1 (2026-10-23)

- **The gallery** (D11, D17): an Astro 6 static site at the root.
  `npm run dev`; pages: the index, built from `catalog.md` (`/`), the
  core (`/core/`), one page per entry with a demo (`/reveal/`,
  `/split-lines/`, `/scrub/`). An entry's page: the effect live, the
  markup to copy, its hook and settings (read from the module), its
  reduced-motion end state (read from its CSS), the files to copy, its
  measured weight, its sources at the pinned commits.
- **The core** (`src/engine/core/`, all thirteen pieces `port`): the two
  engines merged as the Notes say — scroll-to with `done`, the scroll lock
  as the `motion:scroll-lock` event (the overlays' side is
  `core/scroll-lock.ts`), loading by presence through the registry's
  `lazy` list (D7), the header's union. 2.3 KB gzip of its own code.
- **The contract** (D13, D14): `src/engine/effects/<id>.ts` exports `hook`
  and `init(kit)`, with its settings in a fixed block; `<id>.css` opens
  with its reduced-motion end state; `src/engine/registry.ts` lists the
  site's effects; `config.ts` holds the site's selectors.
- **Three entries `demo`**: `reveal` (528 B), `split-lines` (422 B, with
  `_headings.ts`, what every split-* shares), `scrub` (353 B), each with
  its page, weight and screenshots (`docs/shots/<id>/`).
- **The scripts** (D16): `npm run check` (types + the catalog check),
  `npm run weight`, `npm run shots`, `npm run smoke` (the lifecycle in a
  real browser: 32 checks, all passing).
- **The skill** `.claude/skills/add-effect`, the loop step by step.
- **CI** (`.github/workflows/ci.yml`): check and build, as on alpacode.
- **The catalog**: Status and Weight columns; Notes corrected where the
  port found the sources differ (`scrub`, `split-lines` weren't identical)
  or fixed them (D15, Porting notes).

## Phases

| Phase | What | Done when |
| --- | --- | --- |
| 0 | catalog, decisions, weight, prompts | done, 2026-10-23 |
| 1 | the gallery (Astro), the core, the effect contract, the weight and screenshot scripts; `reveal`, `split-lines`, `scrub` end to end; the add-effect skill | done, 2026-10-23 |
| 2a | tier 1: headings, reveals, the pen (32) | alpacode's and FAST's 26 `demo`, 2026-10-25 (with phase 1's); the 6 cinofila-only left; defaults decided (D19) |
| 2b | tier 1: scroll-linked, pointer, functions (31) | alpacode's and FAST's 16 `demo`, 2026-10-25, and the showcase's `cursor-thumb`, `frame-scroll`, `flip-filter`; the cinofila-only and `speed` left; porting notes fixed for the ported |
| 3 | tier 2 (8), on the sticky stage where the demo agrees (D6) | `stage` `demo`, 2026-10-25; the 7 scenes left; every stage fits 390×664 |
| 4 | tier 3: recipes for the 12 landing scenes, the alpaca's rig and moves, demos for a few | recipes written, demos up |
| 5 | adoption: the sites point at the catalog | alpacode.it and Alpacode Studio, 2026-10-25 (copied at `c19c357`, a line in each one's CLAUDE.md); comunicazionecinofila left |

## Assumptions to validate

Made without the owner's confirmation.

From phase 0:

- Sources by pinned link instead of copies (D3).
- The canonical names in the registry are proposals: veto any.
- Astro 6 for the gallery (O6); demo copy in Italian.
- `iris` stays in tier 3, though it could be tier 2.
- Counting: one entry per canonical effect. Merged variants count once;
  the alpaca, with its moves and its six uses, is one entry.

From phase 1:

- Astro 6 kept despite `npm audit`'s critical advisories, which don't
  apply to a static build (D11, O6). Astro 7.4.2 needs Node 22.23+.
- The gallery speaks the studio's voice (alpacode's tokens), its chrome
  in English, the demos in Italian about the catalog's own craft (D17).
- The engine's layout: core and entries copied as they are, three files
  written per site (D14); settings as constants in a fixed block at the
  top of each module, per-element options as attributes (D13).
- The port's fixes beyond the sources (D15): first view left alone by
  `scrub`, focus wins over the batch in `reveal`, one context per effect,
  the reduced-motion switch rebuilding the page.
- A's tuning kept for the three ported entries until 2a decides
  (decisions.md, pending defaults): decided in phase 2, D19.
- The proof (D16): screenshots as six-frame sheets plus a reduced-motion
  sheet, WebP, committed (O8); weight measured per module alone, 1 KB =
  1000 B; esbuild 0.27 (Astro's) instead of phase 0's 0.25.
- `playwright-core` pinned to 1.56.1, which matches the Chromium cloud
  sessions ship; elsewhere the scripts use `$CHROMIUM_PATH` or the
  installed Chrome.
- Pages at `/<id>/`; `noindex` until publishing is decided (O1).

From phase 2:

- `split-cycle` is an entry of its own (86 effects): the deal that hands
  bare headings the next move (alpacode's lines, wipe, words, blur,
  chars), the moves registered by their modules.
- The canonical sub-hooks the ports named, proposals like the rest
  (veto any): `data-marquee-track`, `data-marquee-speed`,
  `data-rail-step`, `data-rail-tile`, `data-rail-live`, `data-hero-fade`,
  `data-wordmark-char`, `data-wordmark-mascot`, `data-chat-bubble`,
  `data-bars-item`, `data-draw-path`, `data-mark-delay`,
  `data-mark-scrub`, `data-mark-manual`, `data-coin-icon`,
  `data-coin-option`, `data-panel-field`, `data-nudge-field`,
  `data-scene-stage`, `data-scene-beats`, `data-scene-beat`,
  `data-scene-progress`, `data-scene-aside`, `data-scene-at`,
  `data-scene-live`; the variants `data-clip="round still"`,
  `data-pop="<angle>"`, `data-wordmark="bounce"`, `data-tilt="card"`,
  `data-magnetic="flat"`, `data-marquee="right"`.
- Declarative hooks for three functions, beyond the sources:
  `data-celebrate` (a burst per click), `data-reveal-panel` (a panel
  shown by removing `hidden`), `data-nudge` (the fields the browser
  flags); the functions stay for page scripts.
- Live layouts switch on the script's own attribute (`data-rail-live`,
  `data-scene-live`), not on `.has-motion`; the state classes stay
  alpacode's (`.is-reached`, `.is-closing`, `.is-pinned`).
- `chat` plays at every width (alpacode's 1025px is its layout's guard:
  the setting `MEDIA`); the pen's sweep is a custom property
  (`--mark-sweep`, cinofila's mechanism) that a site's band must read.
- `stage` is lazy though light (822 B), as D7 says for tier 2.
- The demos' media are drawn here (blueprint plates, the hero clip with
  ffmpeg), never a client's (O1); Caveat is a dependency of the gallery
  for the hand's notes.

## Known limits

- Pointer, input and function entries can't be judged from the scroll
  shots (they need a pointer, a click, a submit): their sheets show the
  layout; probes in the session and the smoke test (pointer play) cover
  the behaviour.
- CI runs check and build; the smoke test and the screenshots run in a
  session (O9).

## Next

- Phase 3, the rest of tier 2 on the stage (D6).
- comunicazionecinofila's switch, with the cinofila-only tier-1 entries
  it needs (`split-drop`, `sticker-wall`, …).
- Phase 4: the recipes of tier 3 (the landings' scenes, the alpaca), now
  that the house's copies stand on `stage`.
