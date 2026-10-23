# alpacode-motion

The motion catalog of the Alpacode sites. Every effect the studio has
built — GSAP, CSS, plain JS — indexed, documented and, phase by phase,
rebuilt here as runnable demos.

It is **context, not a dependency**. No site installs or imports this
repo: when a site needs an effect, its code is copied in by hand and
adapted. A site ships only the effects it uses.

| | |
| --- | --- |
| [`catalog.md`](catalog.md) | the index: 85 effects (and the core they stand on), their hooks, costs, and where their code lives |
| [`docs/decisions.md`](docs/decisions.md) | how the catalog is organised, the naming registry, what's still open |
| [`docs/weight.md`](docs/weight.md) | what motion costs a page: the libraries, the engines, the runtime |
| [`docs/status.md`](docs/status.md) | where the work stands, the phases, the assumptions to validate |
| [`docs/prompts.md`](docs/prompts.md) | the prompts that start each phase in a new chat |
| [`CLAUDE.md`](CLAUDE.md) | how Claude works here, and the rules of motion |
| [`src/engine/`](src/engine) | the engine a site copies: the core, the effects, the registry |
| [`docs/shots/`](docs/shots) | each entry's screenshots, the proof of its demo |

## The tiers

- **Core** — the engine skeleton, not an effect: lifecycle, Lenis,
  scrolling, header, guards. Copied once per site.
- **Tier 1, primitives** (62) — a hook on any element, or a function:
  headings, reveals, the pen, scroll-linked effects, pointer play.
- **Tier 2, parametric scenes** (8) — sections with a markup contract:
  the sticky stage, Venn, fan, card stack, stories, horizontal gallery,
  rewrite, trail.
- **Tier 3, showcase** (15) — bespoke work kept as recipes: the alpaca
  and its moves, the campaign landings' scenes, the iris, the meter.

## Where it comes from

- `alpacode-website` — alpacode.it (`src/lib/motion.ts`, `alpaca.ts`,
  `landing/scenes.ts`) and fast.alpacode.it (`fast/src/lib/motion.ts`)
- `comunicazionecinofila` — `src/scripts/motion.ts`, built from
  alpacode's engine and grown in another direction

## The gallery

An Astro site at the root of the repo: the index, built from the catalog;
the core's page; one page per ported entry, with the effect live, the
markup to copy, its settings, its files, its weight and its sources.

```sh
npm install
npm run dev       # the gallery, at http://localhost:4321
npm run check     # types, and the catalog check
npm run build     # dist/
npm run smoke     # the lifecycle in a real browser (after build)
npm run shots     # each entry's screenshots (after build)
npm run weight    # each entry's weight, into the catalog and the docs
```

Status: phase 1 done — the gallery, the core, the effect contract and the
first three entries (`reveal`, `split-lines`, `scrub`). Next, tier 1
(`docs/status.md`).
