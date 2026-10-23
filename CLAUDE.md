# CLAUDE.md — alpacode-motion

The motion catalog of the Alpacode sites: every effect the studio has
built (GSAP, CSS, plain JS), indexed in [`catalog.md`](catalog.md) and —
phase by phase — rebuilt here as runnable demos. **Context, not a
dependency** (D1): no site installs or imports this repo; an effect's code
is copied into a site by hand and adapted.

**Start every session by reading [`docs/status.md`](docs/status.md)**,
then `catalog.md` and [`docs/decisions.md`](docs/decisions.md). The
prompts that start each phase are in [`docs/prompts.md`](docs/prompts.md).

## Working with the owner

- The owner writes in Italian: reply in Italian. Code, comments, commit
  messages and docs in English; demo copy in Italian.
- They want initiative: when they say "vedi tu", decide, build, and list
  what you decided. Record what you assume (in `docs/status.md`) instead
  of silently cementing it.
- They react badly to cheap-sounding copy and to generic "AI-template"
  design. Motion is bold and purposeful, never decoration.

## The sources

The code lives in the sites, at the commits pinned in catalog.md (D3):
`FrancescoCorbosiero/alpacode-website` (alpacode.it in `src/`, FAST in
`fast/`) and `FrancescoCorbosiero/comunicazionecinofila`. To read or port
an entry, attach them to the session read-only and check out the pinned
commit, so the line numbers in the catalog hold. Never edit those repos
from a session working on this one.

## Using the catalog on a site

1. **Start from the story, not the catalog.** What should the visitor
   understand from this section? Pick the one move that tells it (the
   "What" and "The story" columns). One strong move per section;
   neighbouring sections never repeat the same move.
2. **Check the cost** (Cost column, `docs/weight.md`) against what the
   page already does: pins, scrubbed triggers, split headings, loops.
3. **Copy, don't link**: core once per site, then the entry's module, its
   CSS (with the reduced-motion end state) and its markup contract.
   Until an entry is ported here, copy from its source link and adapt.
4. **Names**: use the canonical hooks unless the site has its own
   convention; then map them, as alpacode's selector lists do.
5. **Record it** in the site's own docs: which entries, from which commit
   of this repo.

## Growing the catalog

- A new effect built on a site gets an entry: id, hook, what it does,
  source link at a commit, cost, notes. A name that collides goes in the
  naming registry (decisions.md).
- Porting an entry (phases 1–4): its module, its CSS, its demo page, its
  measured weight, its screenshots — then its Status.
- Promotion: a bespoke move with a generic shape goes to tier 1; a scene
  used on a second site is a tier-2 candidate (D4).

## The rules of motion

The union of the two engines' house rules (D10). Every effect, ported or
copied, keeps them.

- **First paint never waits on JS.** Above the fold, motion is CSS
  keyframes; GSAP works below it.
- **Nothing is hidden by CSS.** Elements are hidden in JS, at init, and
  only below the fold (`inFirstView`, 92% of the first screen): a page
  whose script fails is a complete, static page.
- **Hand control back to the stylesheet** when a reveal ends
  (`clearProps`), so hover transforms keep working.
- **Scrubbed timelines own their start**: `fromTo`, never `to`/`from`
  alone. Measure from layout (`offsetLeft`, `offsetTop`), not from
  transformed boxes, with function values and `invalidateOnRefresh`, so a
  refresh mid-scene stays right.
- **Reduced motion**: no Lenis, no scroll animation; every scene is laid
  out in its end state by CSS (never `display: none`); exported effects
  become no-ops or write their end state.
- **Pointer play only with a mouse**: `(hover: hover) and (pointer: fine)`.
- **One lifecycle per page**: everything inside `gsap.context()` and
  `gsap.matchMedia()`, listeners through `on()`, reverted on
  `astro:before-swap`.
- **Loops run only on screen**: tickers, `repeat: -1`, idle moves pause
  when off screen or when the tab is hidden.
- **Keyboard first**: a block waiting to be revealed shows at once when
  focus lands inside it.
- **Keep triggers honest**: refresh when the page height changes and once
  the fonts are in; `ScrollTrigger.sort()` after out-of-order creation.
- **Never animate inside an island** (`astro-island`): wrap it instead.
- **A pinned stage fits a phone** (390×664).
- No emoji in UI.

## Verify (once the gallery exists, phase 1)

1. The repo's check and build.
2. Serve the build and look: Playwright with the pre-installed Chromium
   (`/opt/pw-browsers/chromium` in Claude Code cloud sessions) at
   1440×900 and 390×844, pinned stages at 390×664, plus a reduced-motion
   full-page shot.
3. Measure the entry's weight with the repo's script; write it in its
   page and in the catalog.

## Git

Work on the branch the session names (`claude/…`). Don't open PRs unless
asked; the owner merges. After a merge, continue from the merged `main`.
