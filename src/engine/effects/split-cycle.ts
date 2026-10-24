/* ============================================================
   split-cycle — a heading that doesn't ask for a variant is dealt the
   next one in turn down the page, so two neighbouring sections never
   repeat the same move.
   Markup: data-split, with no value, on a heading. A site maps its own
   heading classes onto it (config.ts: "[data-split]"), the way
   alpacode deals every section title.
   The deck is the split-* entries the site copied: each adds its move
   as it loads (_headings.ts), and CYCLE says their order. Every heading
   below the fold takes a turn, in page order, the ones asked for by
   name too (they keep their own move); a bare one is dealt the move of
   its turn. Letter by letter reads well only on a few words, so a
   longer heading is dealt LONG instead. Both sources count the asked
   headings' turns, so a bare heading right after one could be dealt
   its neighbour's move again: the port deals it the next one instead.
   Sources: A src/lib/motion.ts:503, :513, :584;
   C src/scripts/motion.ts:350, :358, :415.
   ============================================================ */
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";
import { movesOf, splitHeading } from "./_headings";

export const hook = "[data-split]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const CYCLE = ["lines", "wipe", "words", "blur", "chars"]; // the order bare headings are dealt (A; C: lines, pop, wipe, drop, blur)
const SHORT = "chars"; // the move dealt only to a short heading (A and C)
const LETTERS = 26; // characters: a longer heading isn't dealt SHORT (A 26, C 28)
const LONG = "words"; // what a longer heading is dealt instead (A words, C pop)

/** The move for the heading at turn n, after one that moved `previous`. */
function deal(n: number, previous: string, length: number): string {
  const deck = movesOf();
  for (let k = 0; k < CYCLE.length; k++) {
    let name = CYCLE[(n + k) % CYCLE.length] ?? "";
    if (name === SHORT && length > LETTERS) name = LONG;
    if (deck.has(name) && name !== previous) return name;
  }
  // A deck of one move can't avoid repeating it.
  return CYCLE.find((name) => deck.has(name)) ?? "";
}

export function init(kit: Kit): void {
  const deck = movesOf();
  // The headings asked for by name, with the site's selectors for them.
  const asked = new Map<Element, string>();
  deck.forEach((entry, name) => kit.query(entry.hook).forEach((el) => asked.set(el, name)));
  const headings = [...new Set([...kit.query(hook), ...asked.keys()])]
    .sort((a, b) => (a.compareDocumentPosition(b) & Node.DOCUMENT_POSITION_FOLLOWING ? -1 : 1))
    .filter((el) => !skipIntro(el) && !inFirstView(el));
  let previous = "";
  headings.forEach((el, n) => {
    const own = asked.get(el);
    if (own) {
      previous = own; // its entry plays it
      return;
    }
    const name = deal(n, previous, (el.textContent ?? "").trim().length);
    const entry = deck.get(name);
    if (!entry) return;
    previous = name;
    splitHeading(el as HTMLElement, entry.move);
  });
}
