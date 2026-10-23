# Prompts

The messages that start each phase in a new chat. They are short on
purpose: the context is in this repo, not in the prompt. Paste one as it
is; attach the repos it names when the session starts.

Every phase ends the same way: `docs/status.md` updated (done, next,
assumptions), the Status of the entries in catalog.md, commit and push on
the session's branch.

## Phase 1 — the gallery and the core

> Lavoriamo su `FrancescoCorbosiero/alpacode-motion` (push). Allega in
> sola lettura `FrancescoCorbosiero/alpacode-website` e
> `FrancescoCorbosiero/comunicazionecinofila`: sono le fonti, ai commit
> fissati nel catalogo. Leggi CLAUDE.md, docs/status.md, catalog.md,
> docs/decisions.md e docs/weight.md.
>
> Fase 1: lo scheletro della galleria.
> - Un sito Astro statico alla radice del repo (D11).
> - Il core del catalogo portato in `src/engine/core/`, unendo le due
>   fonti come dice la colonna Notes (scroll-to con `done`, scroll-lock
>   via evento, caricamento per presenza, D7).
> - Il contratto di un effetto: un modulo per voce
>   (`src/engine/effects/<id>.ts`: hook e `init(kit)`), il suo CSS con lo
>   stato finale per reduced motion, un registro. Parti dal `Kit` delle
>   landing di alpacode (`scenes.ts`).
> - La pagina di una voce: l'effetto dal vivo, il markup da copiare, gli
>   hook e le opzioni, il peso misurato, i link alle fonti. Un indice
>   generato dal catalogo.
> - Gli script: il peso di ogni voce (come in docs/weight.md) e gli
>   screenshot (CLAUDE.md, Verify).
> - Tre voci fino in fondo, per validare il giro: `reveal`, `split-lines`,
>   `scrub`.
> - Quando il giro funziona, una skill `.claude/skills/add-effect` che lo
>   descrive passo passo. CI come su alpacode: check e build.
>
> Vedi tu sul resto, e annota cosa hai deciso.

## Phase 2a — tier 1: headings, reveals, the pen

> Lavoriamo su `alpacode-motion` (push); allega in sola lettura
> `alpacode-website` e `comunicazionecinofila`. Leggi CLAUDE.md e
> docs/status.md, poi segui la skill add-effect.
>
> Fase 2a: porta le voci del tier 1 nelle sezioni Headings, Reveals e The
> pen (31 voci). Dove due fonti fanno la stessa mossa, metti le varianti
> una accanto all'altra nella demo e scegli il default (docs/decisions.md,
> Pending defaults): scrivi cosa hai scelto e perché.

## Phase 2b — tier 1: scroll, pointer, functions

> Come la 2a, per le sezioni Scroll-linked and ambient, Pointer and input
> e Functions (31 voci). Correggi strada facendo i Porting notes del
> catalogo che toccano queste voci (i loop che girano fuori schermo, la
> lente).

## Phase 3 — tier 2, the scenes

> Lavoriamo su `alpacode-motion` (push); allega in sola lettura
> `alpacode-website` e `comunicazionecinofila`. Leggi CLAUDE.md e
> docs/status.md, poi segui la skill add-effect.
>
> Fase 3: il tier 2. Prima `stage` (il palco sticky con le battute delle
> landing di alpacode), poi venn, fan, stack, stories, hscroll, rewrite,
> trail. Per D6 porta le scene pinnate di cinofila sul palco sticky, a
> meno che la demo non mostri un motivo per tenere il pin (annotalo).
> Ogni palco deve stare in un telefono (390×664). Contenuti delle demo
> neutri: niente foto o testi del cliente (O1).

## Phase 4 — tier 3, the showcase

> Lavoriamo su `alpacode-motion` (push); allega in sola lettura
> `alpacode-website` e `comunicazionecinofila`. Leggi CLAUDE.md e
> docs/status.md.
>
> Fase 4: il tier 3, come ricette per farne di nuovi.
> - Una scheda per ogni scena delle landing di alpacode (12), in
>   `docs/recipes/`: la storia, il tipo, le battute con la loro posizione
>   nella timeline, il contratto col DOM, dove sta il CSS, lo stato finale
>   in reduced motion, cosa si generalizza.
> - L'alpaca: la ricetta del rig (come si rigga una sagoma nuova: un solo
>   path, i tagli, i dischi sui giunti, i pivot) e una demo con le sue
>   mosse.
> - Demo vere per alcune: il palco con `line` e `scale`, `loop`
>   (MotionPath), `iris`, `meter`.

## Phase 5 — adoption

> Lavoriamo su `alpacode-website` e `comunicazionecinofila` (push), con
> `alpacode-motion` in sola lettura. Aggiungi al CLAUDE.md di ciascun sito
> una riga che rimanda al catalogo (CLAUDE.md di alpacode-motion, "Using
> the catalog on a site"), e registra nei loro docs quali voci del
> catalogo vengono da quel sito. Nessun refactor dei nomi (O4).

## Animating a site with the catalog

> Allega `alpacode-motion` in sola lettura. Per animare [pagina/sezione],
> segui il suo CLAUDE.md, "Using the catalog on a site": parti dalla
> storia che la sezione deve raccontare, scegli una mossa, controllane il
> costo, copia e adatta. Annota nei docs del sito le voci copiate e il
> commit di alpacode-motion.

## Refreshing the sources

> In `alpacode-motion` (push), con i siti in sola lettura: porta i commit
> fissati del catalogo agli ultimi `main`, ricontrolla ogni numero di
> riga, aggiungi le voci nuove (o tolte) dei siti e aggiorna il registro
> dei nomi se c'è un conflitto.
