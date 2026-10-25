/* ============================================================
   flip-filter — a filter that rearranges its list: what stays slides to
   its new place, what goes folds away, what comes back opens in.
   Markup: data-flip-filter on the block; its radio inputs (the value
   "all", or a kind); its items [data-flip-filter-item="kind …"].
   Laid out, the block filters itself with CSS alone (:has on the
   checked input, the site's rules), so it works with no script and
   under reduced motion, at once. The effect sets data-flip-filter-on (the CSS
   rules stand down) and takes the filtering over: on each change it
   records where every item is, applies the filter (display: none), and
   Flip animates from the old layout to the new one; the list's height
   eases from the old to the new, so what follows it doesn't jump.
   Sources: A src/components/pages/Lavori.astro (new, /lavori).
   ============================================================ */
import { gsap } from "gsap";
import { Flip } from "gsap/Flip";
import type { Kit } from "../core/kit";

gsap.registerPlugin(Flip);

export const hook = "[data-flip-filter]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const DURATION = 0.7; // s the items take to reach their new places
const EASE = "power3.inOut"; // how they travel
const STAGGER = 0.025; // s between one item and the next
const RISE = 28; // px an item that comes back rises from

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    const inputs = gsap.utils.toArray<HTMLInputElement>('input[type="radio"]', root);
    const items = gsap.utils.toArray<HTMLElement>("[data-flip-filter-item]", root);
    if (!inputs.length || !items.length) return;
    const shows = (value: string, el: HTMLElement): boolean =>
      value === "all" || (el.dataset.flipFilterItem ?? "").split(/\s+/).includes(value);
    const apply = (value: string): void =>
      items.forEach((el) => (el.style.display = shows(value, el) ? "" : "none"));

    root.setAttribute("data-flip-filter-on", "");
    apply(inputs.find((input) => input.checked)?.value ?? "all");
    kit.cleanup(() => {
      root.removeAttribute("data-flip-filter-on");
      items.forEach((el) => el.style.removeProperty("display"));
    });

    inputs.forEach((input) =>
      kit.on(input, "change", () => {
        if (!input.checked) return;
        const state = Flip.getState(items);
        // The list keeps its height while the items travel, then eases to
        // the new one: the leaving items are taken out of the flow at once.
        const list = items[0]?.parentElement;
        const from = list?.offsetHeight ?? 0;
        apply(input.value);
        if (list) {
          gsap.fromTo(
            list,
            { height: from, overflow: "clip" },
            { height: list.offsetHeight, duration: DURATION, ease: EASE, overwrite: true, clearProps: "height,overflow" },
          );
        }
        Flip.from(state, {
          duration: DURATION,
          ease: EASE,
          stagger: STAGGER,
          absolute: true,
          nested: true,
          onEnter: (els) =>
            gsap.fromTo(els, { opacity: 0, y: RISE }, { opacity: 1, y: 0, duration: DURATION, ease: "power3.out" }),
          onLeave: (els) => gsap.to(els, { opacity: 0, scale: 0.96, duration: DURATION * 0.5, ease: "power2.in" }),
          onComplete: () => gsap.set(items, { clearProps: "opacity,transform" }),
        });
      }),
    );
  });
}
