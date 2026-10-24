# Decisions

How the catalog is organised, and why. "Owner" marks what the owner
decided; the rest was decided while building it and can be overruled —
the ones that still need the owner are under [Open](#open).

## Decided

**D1 — Context, not a dependency** (owner, 2026-10-23). This repo is
documentation plus demos. No site installs or imports it: an effect's
code is copied into the site by hand and adapted. Each site ships only
what it uses; nothing here needs versioning like a package. A package
was considered and set aside: with small, bespoke sites, copying costs
less than keeping a package and its versions.

**D2 — The repo** (owner, 2026-10-23). `alpacode-motion`, public:
nothing here is secret, and the sources it points at are public repos.

**D3 — Sources by pinned link, not by copy.** The catalog points at the
code where it lives, at a pinned commit (catalog.md, Sources), instead of
keeping copies of the engines here. Reading them means attaching the
source repos to the session, read-only. To move to a newer commit: update
the commit in catalog.md and re-check the line numbers it cites.

**D4 — Core and three tiers.**
- *Core*: the engine skeleton (lifecycle, Lenis, scroll, header, guards,
  refresh). Not an effect; copied once per site.
- *Tier 1, primitives*: a hook on any element, or a function; no layout
  contract beyond the element.
- *Tier 2, parametric scenes*: a section with a markup contract; reusable
  as is once the markup is in place.
- *Tier 3, showcase*: bespoke work kept as a recipe (the story, the
  mechanism, the code) — to learn from and to make the next one.

A tier-3 move whose shape is generic is promoted to tier 1 (the landing
scenes `knoll`, `bars`, `stamp`, `trades`, `pact` already were). A
bespoke scene used on a second site is a candidate for tier 2.

**D5 — One name per effect; hooks are attributes.** Every effect has one
canonical id and `data-*` hooks (registry below). A site's own classes
(alpacode's lists of headings and blocks, C's `.card`, `.btn`, `.script`)
belong in that site's selector map, never in an effect. The sites keep
the names they use today until they're touched; the catalog maps them.

**D6 — Pinning: the CSS sticky stage by default.** A tall section with a
sticky stage and a scrubbed timeline over it (tier 2 `stage`, alpacode's
landings): no pin-spacer, no reparenting, plays well with Lenis and the
ClientRouter, and the end state is plain CSS. GSAP's `pin: true` only
where the demo shows a reason (C's horizontal gallery, stories and Venn
use it today); the entry records the reason.

**D7 — Loading by presence.** Core and the light tier-1 primitives go in
the main bundle. Tier-2 and tier-3 modules, and anything that needs a
plugin (DrawSVG, MotionPath), are dynamic imports fetched when their hook
is on the page, built inside the page's context (core-lazy-chunk).

**D8 — Plugins earn their weight.** A hand-rolled version wins when it is
small and does the same job: `scramble` (alpacode's decoder, 0 KB, works
on inputs) over ScrambleTextPlugin (+3.5 KB gzip); native
`strokeDasharray` for plain path draws. Plugins stay where they do what
hand-rolled code would do badly: SplitText (lines, masks, re-splitting),
MotionPath (following an SVG path), DrawSVG where its partial segments
are needed.

**D9 — Merges.** When two sources do the same move, they are one entry;
the differences in tuning become options. Which tuning is the default is
decided in phase 2, with both variants side by side in the demo (pending
defaults, below).

**D10 — The rules.** CLAUDE.md's rules of motion are the union of the
two engines' house rules (they were already the same architecture: C was
built from A's engine).

**D11 — The gallery** (phase 1). An Astro static site at the root of
this repo: one page per entry (the effect live, the markup, the options,
the measured cost, the source links), an index built from the catalog.
gsap 3.15 and lenis 1.3 as in the sites; Astro 6, the newest of the two
(alpacode is on 5, C on 6) — an assumption, see status.md. Code and docs
in English; demo copy in Italian.
Checked in phase 1: every Astro release up to 7.3.1 (all of 6.x, and both
sites' versions) carries advisories `npm audit` rates critical — XSS in
server rendering, RCE in AVIF image optimization. None applies to this
static build of first-party content, with no islands, MDX or image
processing; Astro 7.3.2 and later fix them, but move to Vite 8 and
Rolldown, and 7.4.2 needs Node 22.23 or later (O6).

**D12 — Proof.** An entry is `demo` only with its page, its weight
measured by the repo's script, and screenshots at 1440×900, 390×844
(pinned stages at 390×664) and under reduced motion.

**D13 — The effect contract** (phase 1). An effect is a module,
`src/engine/effects/<id>.ts`, that exports its `hook` (a selector of
`data-*` attributes) and `init(kit)`. The kit is the one alpacode's
landing scenes get (`on`, `fine`, `cleanup`: A `scenes.ts`) plus the
page's `media` (its `gsap.matchMedia()`) and `query(hook)`, which adds
the site's own selectors. `init` runs once per page inside the page's
context; what a context can't revert goes in `kit.cleanup`. The settings
— the site's voice — are constants at the top of the module, in a fixed
shape the gallery reads into the entry's page: the module is their one
truth. Its CSS, `<id>.css`, opens with its reduced-motion end state.
Code a family shares lives in `effects/_<family>.ts` (`_headings.ts`).

**D14 — What a site copies, what it writes.** `src/engine/core/` and an
entry's files are copied as they are; three files are written per site:
`config.ts` (its selectors: header, nav, scroll panes, intro containers,
the map of its classes onto the hooks), `registry.ts` (its effects:
`effects` in the main bundle, in build order; `lazy`, fetched by
presence, D7) and `index.ts` (start). The layout loads `index.ts` once;
overlays import only `core/scroll-lock.ts`.

**D15 — The port: the union, plus the rules.** Where the sources differ,
the port takes the union the catalog's Notes name. Where both break a
rule of motion, the port fixes it and the row says so: a scrubbed
statement in the first view is left alone; a block keyboard focus has
shown isn't re-tweened by its batch; each effect is built in a context
of its own, so one that throws is undone alone (GSAP's `Context.add()`
doesn't restore its state when its function throws); a change of the
reduced-motion preference mid-visit rebuilds the page. Tuning keeps A's
values until phase 2 decides the pending defaults.

**D16 — Proof, as scripts** (D12). `npm run check` is astro check plus
the catalog check: catalog.md, the modules, the registry, the demos, the
weights and the screenshots agree, and a `demo` entry has all of them.
`npm run weight` measures each entry's own code (the module bundled
alone, libraries and core left out; minified, gzip -9, 1 KB = 1000 B as
in phase 0), what it needs and a page with the core and only it, and
writes them into the catalog, `docs/weight.md` and the gallery.
`npm run shots` takes six frames per viewport while the demo scrolls
through — mid-move for what plays once, caught up for what is scrubbed —
and the page under reduced motion down to the end of its demo (the docs
below it never move); they are committed as WebP sheets in
`docs/shots/<id>/`, about 200 KB per entry. `npm run smoke` checks the
lifecycle in a real browser. CI runs check and build, as on alpacode.

**D17 — The gallery's voice.** The studio's, from alpacode's tokens:
blueprint paper, blue-black ink, the blue strut, Archivo Black over
Manrope, no round corners, labels in the body face (never mono
micro-labels; mono only for code). Its chrome is in English, like the
docs; demo copy is Italian (`lang="it"`) and speaks about the catalog's
own craft, so it stays neutral (O1). Speaking each site's voice is O5.
Pages live at `/<id>/`, the core at `/core/`; `noindex` until O1.

**D18 — The catalog's engine runs the sites** (owner, 2026-10-24).
alpacode.it and its subdomains (studio.alpacode.it first, more later)
drop their own engines and copy this one — copied, never installed (D1
holds) — and adopt the canonical `data-*` hooks: O4 is decided, yes. A
site's own classes stay only where it maps them, in its `config.ts`.
Every entry a site uses is ported here end to end before it switches.

**D19 — Defaults: A's tuning** (phase 2, 2026-10-24). With alpacode as
the consumer (D18), where the sources differ A's tuning is the default;
C's (or FAST's) becomes a setting or a per-element variant (D9). The
demo shows the variants side by side where a variant costs one
attribute; otherwise the setting's comment names the other source's
value, so a site in that voice tunes it once when copying. Each choice
and its reason:

| Entry | Default (A) | The other source | Side by side | Why |
| --- | --- | --- | --- | --- |
| reveal | 44px, 1.1s | C 44px, 1.0s; FAST 34px, 0.8s | no | the consumer's; FAST's shorter rise is FAST's voice, two settings |
| split-lines | stagger 0.085s | C 0.09s | no | a two-hundredth of a second doesn't show |
| scrub | lit by `bottom 48%` | C `bottom 50%` | no | the consumer's; two points of screen don't show |
| split-wipe | 1.3s | C 1.2s | no | a tenth of a second doesn't show |
| split-pop | ±10°, `back.out(2)` | C ±12°, `back.out(2.2)` | no | the consumer's; two degrees and a touch of spring don't read as another move |
| split-cycle | lines, wipe, words, blur, chars | C lines, pop, wipe, drop, blur | no | the consumer's; C's deck needs split-drop, not ported yet: one setting (`CYCLE`) when it is |

## Naming registry

The renames and the conflicts found while indexing. "Now" is the
canonical name.

| Was | In | Now | Why |
| --- | --- | --- | --- |
| `data-split="chars"` (letters fall and bounce) | C | `data-split="drop"` | alpacode's `chars` is a different move (letters rise) |
| `data-hero-zoom` (the photo settles closer) | A | `data-hero-settle` | C's `data-hero-zoom` is another effect |
| `data-hero-zoom` (the bowl opens to full screen) | C | `data-iris` | the film term for a circle opening; frees the name |
| scene `stack` (the codebase's layers) | A | `layers` | C's `data-stack` is the card stack |
| `data-strike` (pinned title rewritten) | C | `data-rewrite` | too close to the pen's `data-mark="strike"` |
| `data-progress` | A | `data-rail` | same effect as C's `data-rail` |
| `data-draw` / `data-drawn` (state for a CSS draw) | A (map) | `data-draw` (the trigger) | C's `data-draw` is the trigger; the map becomes an instance |
| scene `stamp` | A | `data-stamp` | same move as C's |
| scenes `knoll`, `bars`, `trades`, `pact` | A | `data-knoll`, `data-bars`, `data-alternate`, `data-draw` | generic moves |
| `data-hl[="scrub"]` | C | `data-mark="highlight"` (`data-mark-scrub`) | one pen |
| `.script` in a split heading | C | `data-accent` | attributes only |
| `[data-reveal].stagger` | C | `data-reveal="stagger"` | attributes only |
| `data-rise` | FAST | `data-reveal` | same move |
| `.fx-cards > li` | FAST | `data-deal` | attributes only |
| `data-band` | FAST | `data-skew` | says what it does |
| `data-paw-trail` | C | `data-cursor-trail` | brand-neutral; the glyph is the site's |
| `data-path-row` | C | `data-cursor-thumb` | says what it does |
| `.ticker--xl`, `.ticker--follow` | A | `data-marquee` | C's name |
| `.foot-wordmark` | A | `data-wordmark` | C's name |
| `.img-slot.is-filled`, `.post-cover`; `.split-media`, `.svc-block-media` | A; C | `data-clip` | C's name |
| `.sec-num` kickers | A | `data-kicker` | attributes only |
| `details.rf-faq-item` | A | `data-accordion` | attributes only |
| `[data-payout-picker]` | A | `data-coin` | says what it does |
| `.rf-preview-screen` | A | `data-chat` | attributes only |
| `.card` (tilt) | C | `data-tilt="card"` | attributes only |
| `.btn` (label roll) | C | `data-roll` | attributes only |
| `stepEnter()` | C | `panelEnter()` | same move |
| `lockScroll()`; event `alpa:scroll-lock` | C; A | event `motion:scroll-lock` | decoupled and brand-neutral |
| `.site-header` | A, C | `data-header` (the site maps it in `config.ts`) | attributes only |
| `[data-nav].open` | C | `[data-nav][data-open]` (`config.ts`) | attributes only |
| `.scroll-progress` | A | `data-read-progress` | attributes only |

## Pending defaults

Decided in phase 2 (D19), each with its entry; a decided row moves to
D19's table.

| Entry | A | C (or FAST) |
| --- | --- | --- |
| pop | ±90° alternating, delay 0.15s | −160° |
| clip | square, inner zoom from 1.16 | rounded 24px, no inner zoom |
| tilt | 5° | 10–12° plus a lift |
| magnetic | 16% of its box, leans 12° | 35% of the pointer's offset, no lean |
| marquee | 70 (xl) / 56 px/s | 60 px/s |
| rail | step i at i/n | step i at i/(n−1) |
| wordmark | letters rise; mascot rises | letters bounce, tilted; mascot drops |
| celebrate | brand bits (struts, squares, €, alpaca) | shapes (paws, hearts, bones) |

## Open

For the owner.

- **O1 — Publish the gallery?** As a showroom for the studio (a
  subdomain, say). It would show a client's site's effects (C): ask the
  client, or use neutral demo content.
- **O2 — A runtime budget per page** (pinned scenes, scrubbed triggers,
  split headings, loops). To propose after phase 2, from measurements
  (docs/weight.md).
- **O3 — Lenis by default on new sites?** Both sites use it; it costs
  5.4 KB gzip and a little main-thread time on every frame.
- **O5 — The demo theme.** Neutral, or switchable between the brands
  (studio, FAST, C) to show an effect in each voice.
- **O6 — Astro 6 for the gallery** (assumed, D11). Every 6.x release
  carries advisories that don't apply to this static build but show in
  `npm audit` and in GitHub's alerts; 7.3.2+ fixes them. Move the gallery
  to Astro 7 (and the sites, which are on 5 and 6)?
- **O7 — "The sticker you can tug".** alpacode's engine header promises
  it; there is no drag code. A stale comment, or an effect to build
  (Draggable + Inertia)?
- **O8 — Screenshots in git.** The sheets are committed (WebP, about
  200 KB per entry: some 17 MB once all 86 are `demo`, more with every
  reshoot). Keep them in the repo, or move them to CI artifacts?
- **O9 — The smoke test in CI.** `npm run smoke` needs a Chrome, which
  GitHub's runners have (about 30 s). Add it to CI next to check and
  build?
