# Status

Where the work stands. Updated at the end of every session.

## Now — phase 0 done (2026-10-23)

- **The catalog** (`catalog.md`): 85 effects — 62 tier-1 primitives, 8
  tier-2 scenes, 15 tier-3 showcase entries — plus 13 core pieces and 61
  CSS keyframes. Every entry points at its code in the sites, at pinned
  commits (alpacode-website `0876836`, comunicazionecinofila `505c8c6`),
  with its hook, its cost and notes on how the sources differ.
- **The decisions** (`docs/decisions.md`): D1–D12, the naming registry,
  the pending defaults, the open questions O1–O7.
- **The weight** (`docs/weight.md`), measured.
- **The prompts** for the next phases (`docs/prompts.md`).

Nothing is built yet: no gallery, no code ported. The repo itself was
created by the owner (public): Claude's GitHub integration can't create
repositories (403).

## Phases

| Phase | What | Done when |
| --- | --- | --- |
| 0 | catalog, decisions, weight, prompts | done, 2026-10-23 |
| 1 | the gallery (Astro), the core, the effect contract, the weight and screenshot scripts; `reveal`, `split-lines`, `scrub` end to end; the add-effect skill | those three entries are `demo` |
| 2a | tier 1: headings, reveals, the pen (31) | all `demo`; their pending defaults decided |
| 2b | tier 1: scroll-linked, pointer, functions (31) | all `demo`; their porting notes fixed |
| 3 | tier 2 (8), on the sticky stage where the demo agrees (D6) | all `demo`, every stage fits 390×664 |
| 4 | tier 3: recipes for the 12 landing scenes, the alpaca's rig and moves, demos for a few | recipes written, demos up |
| 5 | adoption: the sites point at the catalog | a line in each site's CLAUDE.md |

## Assumptions to validate

Made without the owner's confirmation:

- Sources by pinned link instead of copies (D3).
- The canonical names in the registry are proposals: veto any.
- Astro 6 for the gallery (O6); demo copy in Italian.
- `iris` stays in tier 3, though it could be tier 2.
- Counting: one entry per canonical effect. Merged variants count once;
  the alpaca, with its moves and its six uses, is one entry.

## Next

Phase 1, in a new chat: the prompt is in `docs/prompts.md`.
