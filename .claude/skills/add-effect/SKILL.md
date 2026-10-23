---
name: add-effect
description: Port a catalog entry into the gallery end to end — its module and CSS in src/engine/effects, its place in the registry, its demo page, its measured weight, its screenshots, its Status. Use when asked to port, rebuild or demo an effect or a catalog entry ("porta la voce …", "porta le voci del tier …", "aggiungi l'effetto …", "fai la demo di …", the phase 2–4 prompts in docs/prompts.md), or to add to the catalog an effect newly built on a site.
---

# Add an effect

The loop that took `reveal`, `split-lines` and `scrub` from `src` to
`demo` in phase 1. Read CLAUDE.md (the rules of motion) and the entry's
row in `catalog.md` first; `/reveal/`, `/split-lines/` and `/scrub/` (and
their files) are the worked examples.

## 0. Read the sources

- Clone the sites read-only and check out the commits pinned in
  `catalog.md` (Sources), so the line numbers hold:
  `git clone --depth 1 https://github.com/FrancescoCorbosiero/alpacode-website`,
  then `git fetch --depth 1 origin <full sha> && git checkout <full sha>`
  (the full sha is in every source link); the same for
  `comunicazionecinofila`. Never edit them.
- Open every link in the row: each site's code, its CSS, its "Live"
  markup. Where the sources differ, the difference becomes a setting (D9)
  and a line in the row's Notes; the default waits for its phase's
  side-by-side demo (decisions.md, Pending defaults).
- An effect new to the catalog gets its row first (id, hook, what,
  sources at a commit, cost, notes); a name that collides goes in the
  naming registry (decisions.md).

## 1. The module — `src/engine/effects/<id>.ts`

- A header comment: `<id> — <what it does>.`, the markup, how it
  behaves, what the port changed from the sources, then `Sources:` with
  file:line per site.
- `export const hook = '<selector>';` — a plain `data-*` attribute
  selector (D5): it keys the site's selector map in `config.ts`. What
  another entry owns is left out in `init` (reveal skips
  `data-reveal="stagger"`).
- The settings, in exactly this shape (the entry page reads them into
  its table; the module is their one truth):
  ```ts
  /* ---------- Settings: the site's voice, tuned when copying ---------- */
  const RISE = 44; // px: how far a block rises (A 44, C 44, FAST 34)
  ```
  One per line, no blank line inside the block; the comment says the
  unit, what it is and what each source uses.
- `export function init(kit: Kit): void`. It runs once per page inside
  the page's `gsap.context()`, so its tweens, ScrollTriggers and
  SplitTexts are reverted with the page. Then:
  - elements through `kit.query(hook)` (it adds the site's own selectors);
  - before hiding anything, `skipIntro(el) || inFirstView(el)`: hide in
    JS, at init, below the fold only; mark what waits
    `data-motion-pending` (the core shows it on keyboard focus) and
    remove the mark in `kit.cleanup`;
  - `clearProps` when a reveal ends, so the stylesheet takes over again;
  - scrubbed timelines own their start (`fromTo`), measure from layout
    (`offsetLeft`, `offsetTop`) with function values and
    `invalidateOnRefresh`;
  - pointer play only when `kit.fine`; desktop or mobile parts in
    `kit.media.add(query, fn)`; listeners through `kit.on`; ticker
    callbacks, observers and attributes you set, undone in `kit.cleanup`;
  - loops run only on screen (`onToggle`, `document.hidden`);
  - never inside an island: `skipIntro` already skips `astro-island`.
- Register the plugins it uses at its top (`gsap.registerPlugin(…)`): a
  copied module must stand alone.
- Code shared by a family goes in `effects/_<family>.ts` (`_headings.ts`
  for the split-* entries); the entry page lists it with the entry.
- A function entry (tier 1, Functions) also exports the function; under
  reduced motion it is a no-op or writes its end state.

## 2. Its CSS — `src/engine/effects/<id>.css`

- A header: `<id>.`, a blank line, `Reduced motion: <the end state>`, a
  blank line, what the rules are for, `Sources:`. The page shows the
  end-state paragraph; `npm run check` requires it.
- Nothing is hidden by CSS. The rules lay out the end state; a scene
  switches to its stage only under `.has-motion` (set by the core when
  motion runs).
- No rules needed: the header and "No rules to copy."

## 3. The registry — `src/engine/registry.ts`

- A light primitive: `import * as x from "./effects/<id>"` in `effects`,
  in build order (pinned scenes first, in page order).
- Tier 2 and 3, and anything that needs a plugin beyond ScrollTrigger and
  SplitText: in `lazy`, `{ hook: "<hook>", load: () => import("./effects/<id>") }`
  — fetched only by pages that have the hook (D7). The first one in 2a
  is also the first test of that path: add a smoke check for it.

## 4. The demo — `src/demos/<id>.astro`

- It wraps itself in `<Entry id markup look>` (and `attributes` for
  per-element options, `replay` to override when the replay button
  shows); the slot is the live demo. `[id].astro` picks it up.
- `markup`: the least a page writes. `look`: one line, in Italian, on
  what to watch.
- Demo copy in Italian, neutral content (no client photos or texts, O1),
  in the studio's voice: plain, precise, never cheap. One strong move:
  the demo shows this effect, nothing else moves.
- The entry's head fills the first screen, so the demo starts below the
  fold and `once` effects play as they enter.
- Scoped `<style>` in the demo file; elements SplitText creates need
  `:global()`.
- Two sources, same move (pending defaults): the variants side by side,
  each section tuned by its own settings, and the default chosen and
  written down (decisions.md).
- A pinned stage fits a phone (390×664).

## 5. Verify

1. `npm run check` (types, then the catalog check) and `npm run build`.
2. `npm run smoke` — the lifecycle in a real browser (soft navigation,
   replay, reduced motion switched mid-visit, focus, scroll lock). Add a
   check when the entry has a behaviour worth guarding.
3. `npm run shots -- <id>` — six frames per viewport as the demo scrolls
   through (1440×900, 390×844, 390×664 if pinned) and the page under
   reduced motion, as sheets in `docs/shots/<id>/`; full-size frames in
   `.shots/<id>/`. Look at them: the move mid-way, the end state, the
   phone layout, reduced motion. Fix and shoot again.
4. `npm run weight` — writes `src/data/weight.json` and the row's Weight.
5. Status `demo` in the row (`port` while any of the above is missing);
   `npm run check` again: it holds a `demo` entry to all of it.

## 6. Record and deliver

- The row's Notes: what the port decided and fixed; new findings in
  Porting notes; a pending default decided goes in decisions.md.
- `docs/status.md`: what's done, the assumptions made on your own.
- Commit (`<id>: module, demo, weight, shots`) and push to the session's
  branch. Reply in Italian with the pages and what you decided.
