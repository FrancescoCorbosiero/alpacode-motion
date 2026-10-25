/* ============================================================
   scramble — text decodes itself: glyphs cycle and settle left to
   right, separators hold their place; works on inputs.
   Markup: data-scramble on a short text inside a link or a button (a
   keyword on a card): with a mouse, the pointer entering the link (or
   the button, else the text itself) decodes it again, from noise to its
   own words (FAST's cards). A page script calls scramble(el, text,
   duration) to write a new text that decodes itself (a link just made,
   a code): on an <input> it writes the value.
   The characters cycle through random glyphs (capitals for capitals,
   small letters for small) and settle in turn, left to right; spaces,
   dots, slashes, colons, dashes and @ hold their place, so a link's
   shape reads from the first frame. The noise is rolled again every
   third frame: a decoder, not a strobe. A new text takes over from one
   still decoding. Canonical: A's, hand-rolled (D8: FAST used the
   ScrambleText plugin). Under reduced motion the text is written at
   once.
   Sources: A src/lib/motion.ts:396; FAST fast/src/lib/motion.ts:57.
   ============================================================ */
import { gsap } from "gsap";
import { reduced } from "../core/guards";
import type { Kit } from "../core/kit";

export const hook = "[data-scramble]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1.1; // s a text takes to decode (A; its referral link 1.25, its code 1: the third argument)
const HOVER = 0.55; // s: data-scramble, decoding again as the pointer enters (FAST)
const UPPER = "ABCDEFGHJKMNPQRSTVWXYZ0123456789"; // the noise for capitals and digits: no I, L, O, U to misread (A)
const LOWER = "abcdefghjkmnpqrstvwxyz0123456789"; // the noise for small letters (A)
const FIXED = /[\s./:\-_@]/; // what holds its place from the first frame (A)

const decoding = new WeakMap<Element, gsap.core.Tween>();
const written = new WeakMap<Element, string>();

/** Text that decodes itself into `text`, left to right. Returns its
 *  tween (null under reduced motion: the text is written at once). */
export function scramble(el: HTMLElement | HTMLInputElement, text: string, duration = DURATION): gsap.core.Tween | null {
  const write = (s: string): void => {
    if (el instanceof HTMLInputElement) el.value = s;
    else el.textContent = s;
  };
  decoding.get(el)?.kill(); // a new text takes over from one still decoding
  written.set(el, text);
  if (reduced()) {
    write(text);
    return null;
  }
  const chars = [...text];
  const n = chars.length;
  const glyph = (c: string): string => {
    const set = c === c.toLowerCase() && c !== c.toUpperCase() ? LOWER : UPPER;
    return set.charAt(Math.floor(Math.random() * set.length));
  };
  const noise = chars.map(glyph);
  const state = { p: 0 };
  let frame = 0;
  const tween = gsap.to(state, {
    p: 1,
    duration,
    ease: "power1.inOut",
    onUpdate: () => {
      if (frame++ % 3 === 0) chars.forEach((c, i) => (noise[i] = glyph(c)));
      const settled = Math.floor(state.p * n);
      write(chars.map((c, i) => (i < settled || FIXED.test(c) ? c : noise[i])).join(""));
    },
    onComplete: () => write(text),
  });
  decoding.set(el, tween);
  return tween;
}

export function init(kit: Kit): void {
  if (!kit.fine) return;
  kit.query(hook).forEach((el) => {
    const own = el.textContent ?? "";
    if (!own.trim()) return;
    const host = el.closest<HTMLElement>("a, button") ?? el;
    // Its words: the last a script wrote, else its own.
    kit.on(host, "mouseenter", () => void scramble(el, written.get(el) ?? own, HOVER));
  });
}
