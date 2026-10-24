/* ============================================================
   Seeded randomness, for the moves that should look hand-made and be
   the same on every visit: knoll's scatter, the pen's loops (each
   seeded by its word). Not an entry: copied with the entries that
   import it.
   Source: A src/lib/landing/scenes.ts:95.
   ============================================================ */

/** A random number generator seeded by a text: the same text, the same
 *  sequence. */
export function rng(seedText: string): () => number {
  let h = 2166136261;
  for (let i = 0; i < seedText.length; i++) h = Math.imul(h ^ seedText.charCodeAt(i), 16777619);
  return () => {
    h += 0x6d2b79f5;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
