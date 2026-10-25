/* ============================================================
   coin — on change, the chosen option's icon flips like a coin and
   swells.
   Markup: data-coin on a group of radios or checkboxes (a fieldset);
   in each option, its icon marked [data-coin-icon], inside the input's
   label (or the input's closest [data-coin-option]).
   When an option is chosen (by click, tap or arrow keys), its icon turns
   round once on its vertical axis, in perspective, and swells and
   settles meanwhile; then its transform is the stylesheet's again.
   Unchecking a checkbox doesn't flip it. Under reduced motion the
   choice simply shows.
   Sources: A src/lib/motion.ts:1040 (data-payout-picker).
   ============================================================ */
import { gsap } from "gsap";
import type { Kit } from "../core/kit";

export const hook = "[data-coin]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const TURN = 360; // degrees it turns round (A)
const FLIP = 0.85; // s the turn takes (A)
const PERSPECTIVE = 500; // px (A)
const SWELL = 1.14; // how much it swells, then back (A)
const SWELL_TIME = 0.3; // s each way (A)

/** The chosen input's icon: in its label, else in its option. */
function iconOf(input: HTMLInputElement): HTMLElement | null {
  for (const label of input.labels ?? []) {
    const icon = label.querySelector<HTMLElement>("[data-coin-icon]");
    if (icon) return icon;
  }
  return input.closest("[data-coin-option]")?.querySelector<HTMLElement>("[data-coin-icon]") ?? null;
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((group) => {
    kit.on(group, "change", (e) => {
      const input = e.target instanceof HTMLInputElement ? e.target : null;
      const icon = input?.checked ? iconOf(input) : null;
      if (!icon) return;
      gsap.fromTo(icon, { scale: 1 }, { scale: SWELL, duration: SWELL_TIME, ease: "power2.out", yoyo: true, repeat: 1 });
      gsap.fromTo(
        icon,
        { rotationY: 0 },
        { rotationY: TURN, transformPerspective: PERSPECTIVE, duration: FLIP, ease: "power3.out", clearProps: "transform" },
      );
    });
    kit.cleanup(() => {
      const icons = group.querySelectorAll("[data-coin-icon]");
      gsap.killTweensOf(icons);
      gsap.set(icons, { clearProps: "transform" });
    });
  });
}
