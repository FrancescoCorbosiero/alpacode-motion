# Status

Where the work stands. Updated at the end of every session.

## Now — phase 1 done (2026-10-23)

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
| 2a | tier 1: headings, reveals, the pen (32) | all `demo`; their pending defaults decided |
| 2b | tier 1: scroll-linked, pointer, functions (31) | all `demo`; their porting notes fixed |
| 3 | tier 2 (8), on the sticky stage where the demo agrees (D6) | all `demo`, every stage fits 390×664 |
| 4 | tier 3: recipes for the 12 landing scenes, the alpaca's rig and moves, demos for a few | recipes written, demos up |
| 5 | adoption: the sites point at the catalog | a line in each site's CLAUDE.md |

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
  (decisions.md, pending defaults).
- The proof (D16): screenshots as six-frame sheets plus a reduced-motion
  sheet, WebP, committed (O8); weight measured per module alone, 1 KB =
  1000 B; esbuild 0.27 (Astro's) instead of phase 0's 0.25.
- `playwright-core` pinned to 1.56.1, which matches the Chromium cloud
  sessions ship; elsewhere the scripts use `$CHROMIUM_PATH` or the
  installed Chrome.
- Pages at `/<id>/`; `noindex` until publishing is decided (O1).

## Known limits

- The lazy path (`registry.lazy`) is built but no entry uses it yet: the
  first that needs a plugin (2a: `mark-circle`, `mark-box`, `hand`) will,
  with a smoke check.
- The heading cycle (a bare `data-split` dealt the next variant down the
  page) comes with the other variants in 2a; until then only
  `data-split="lines"` is handled.
- CI runs check and build; the smoke test and the screenshots run in a
  session (O9).

## Next

Phase 2a, in a new chat: the prompt is in `docs/prompts.md`; the loop is
the add-effect skill.
