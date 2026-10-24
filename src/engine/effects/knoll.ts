/* ============================================================
   knoll — tools tumble in from scattered places and line up side by
   side, like a knolled workbench.
   Markup: data-knoll on the group (a list): its children are the tools.
   Below the fold only, once, as the group enters: every tool starts
   scattered (pushed aside, dropped lower, turned) and they fall into
   their places, in random order. The scatter is seeded: the same on
   every visit. The tools wait marked data-motion-pending (focus inside
   one shows it at once), with opacity, not visibility, so focus can
   land in them (A hides them with autoAlpha).
   Sources: A src/lib/landing/scenes.ts:530 (the scene knoll).
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";
import { rng } from "./_seed";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-knoll]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SPREAD = 180; // px: how far sideways a tool can start, all told (A)
const DROP = 70; // px: how far below its place a tool starts, at least (A)
const DROP_MORE = 90; // px: and up to this much further (A)
const TURN = 34; // degrees: how far a tool can start turned, all told (A)
const DURATION = 1.1; // s: how long each tool takes to land (A)
const STAGGER = 0.08; // s between tools, in random order (A)
const START = "top 80%"; // where the group counts as entering (A)

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    if (skipIntro(root) || inFirstView(root)) return;
    const tools = gsap.utils.toArray<HTMLElement>(root.children);
    const r = rng("knoll");
    tools.forEach((tool) => {
      gsap.set(tool, { x: (r() - 0.5) * SPREAD, y: DROP + r() * DROP_MORE, rotation: (r() - 0.5) * TURN, opacity: 0 });
      tool.setAttribute("data-motion-pending", "");
    });
    kit.cleanup(() => tools.forEach((tool) => tool.removeAttribute("data-motion-pending")));
    ScrollTrigger.create({
      trigger: root,
      start: START,
      once: true,
      onEnter: () => {
        const waiting = tools.filter((tool) => tool.hasAttribute("data-motion-pending"));
        waiting.forEach((tool) => tool.removeAttribute("data-motion-pending"));
        gsap.to(waiting, {
          x: 0,
          y: 0,
          rotation: 0,
          opacity: 1,
          duration: DURATION,
          ease: "power3.out",
          stagger: { each: STAGGER, from: "random" },
          clearProps: "transform,opacity",
        });
      },
    });
  });
}
