/* ============================================================
   count — a number counts up to its value; the static text stays the
   truth.
   Markup: data-count="86" on the element whose text holds the number
   (its first number is the one that counts); data-count-from="10"
   starts it there (else 0); data-count-template="{n} KB" sets the text
   it counts in (else the element's own, its number swapped for {n}).
   Below the fold only, once, as it enters: the number climbs to its
   value, written as the page writes numbers (its language's decimal
   comma; thousands grouped only if the text groups them, so a year
   stays a year), and the original text comes back at the end.
   Sources: C src/scripts/motion.ts:1046; A src/lib/voucher/landing.ts:79
   (the referral sticker's template), A src/lib/landing/calc.ts:25.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-count]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 1.8; // s: how long the count takes (C; A's sticker 1.1)
const EASE = "power2.out"; // quick at first, slowing to its value (C; A's sticker an exponential ease-out)
const START = "top 85%"; // where a number counts as entering (C)

/** The first number in a text: digits, maybe grouped, maybe decimal. */
const NUMBER = /\d(?:[\d.,   ]*\d)?/;

export function init(kit: Kit): void {
  kit.query(hook).forEach((el) => {
    if (skipIntro(el) || inFirstView(el)) return;
    const asked = el.dataset.count ?? "";
    const to = parseFloat(asked);
    if (Number.isNaN(to)) return;
    const from = parseFloat(el.dataset.countFrom ?? "") || 0;
    const original = el.textContent ?? "";
    const template = el.dataset.countTemplate ?? (NUMBER.test(original) ? original.replace(NUMBER, "{n}") : "{n}");
    const decimals = (asked.split(".")[1] ?? "").length;
    const format = new Intl.NumberFormat(el.closest("[lang]")?.getAttribute("lang") || undefined, {
      minimumFractionDigits: decimals,
      maximumFractionDigits: decimals,
      useGrouping: /\d[.,   ]\d{3}(?!\d)/.test(original),
    });
    const write = (v: number): void => void (el.textContent = template.replace("{n}", format.format(v)));
    const state = { v: from };
    write(from);
    kit.cleanup(() => void (el.textContent = original));
    gsap.to(state, {
      v: to,
      duration: DURATION,
      ease: EASE,
      onUpdate: () => write(state.v),
      onComplete: () => void (el.textContent = original),
      scrollTrigger: { trigger: el, start: START, once: true },
    });
  });
}
