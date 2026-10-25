/* ============================================================
   stage — the base of every pinned story: a tall section whose stage
   sticks while one scrubbed timeline plays over it.
   Markup: data-scene on the tall section (--len: how many screens of
   scroll it lasts, 2.5 by default), its [data-scene-stage] inside (it
   sticks), the text in [data-scene-beats] as [data-scene-beat]s, and
   an optional [data-scene-progress] rule. data-scene-at="0.36 0.7"
   sets when each beat hands over (shares of the scene; evenly spaced
   without it). data-scene="<name>" is a named scene (tier 3): its own
   module builds it on these helpers.
   For a scene the script runs (below the fold, not in an intro) it
   marks the section data-scene-live: the CSS gives it its length and
   sticks the stage (no pin-spacer, D6). One timeline runs from the
   section's top at the top of the screen to its foot at the foot of
   the screen; the beats hand over, the one leaving rising out as the
   next rises in, the rule fills (--p), and the section is .is-pinned
   meanwhile (alpacode hides its phone's sticky button on it). Without
   it (no JS, reduced motion, a chunk that didn't load, a scene in the
   first view) it's an ordinary section, its beats one after another:
   the stage switches on the live attribute, never on .has-motion alone
   (alpacode's did, so a failed chunk would have left its beats stacked
   on each other).
   Exported for the scenes: scrubbed(kit, root, extra) the timeline,
   beats(tl, root, at) the handover, centre(el, within) an element's
   centre from layout, so targets measured mid-scene stay right.
   Sources: A src/lib/landing/scenes.ts:253, :266, :285;
   CSS A src/styles/landing.css:422.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-scene]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const SMOOTH = 0.6; // s the scene takes to catch up with the scroll (A)
const SHIFT = 36; // px a beat rises as it leaves, and the next as it arrives (A)
const LEAVE = 0.05; // the share of the scene a beat takes to leave (A)
const ARRIVE = 0.06; // and the next to arrive (A)

/** An element's centre within an ancestor, from layout alone
 *  (transforms don't count), so it holds whatever the scrub has done. */
export function centre(el: HTMLElement, within: HTMLElement): { x: number; y: number } {
  let x = 0;
  let y = 0;
  let n: HTMLElement | null = el;
  while (n && n !== within) {
    x += n.offsetLeft;
    y += n.offsetTop;
    n = n.offsetParent as HTMLElement | null;
  }
  return { x: x + el.offsetWidth / 2, y: y + el.offsetHeight / 2 };
}

/** The scene's scrubbed timeline over its tall section; it goes live
 *  (its stage sticks) and back with the page. */
export function scrubbed(kit: Kit, root: HTMLElement, extra: ScrollTrigger.Vars = {}): gsap.core.Timeline {
  const bar = root.querySelector<HTMLElement>("[data-scene-progress]");
  root.setAttribute("data-scene-live", "");
  kit.cleanup(() => {
    root.removeAttribute("data-scene-live");
    root.classList.remove("is-pinned");
    bar?.style.removeProperty("--p");
  });
  return gsap.timeline({
    defaults: { ease: "none" },
    scrollTrigger: {
      trigger: root,
      start: "top top",
      end: "bottom bottom",
      scrub: SMOOTH,
      invalidateOnRefresh: true,
      toggleClass: { targets: root, className: "is-pinned" },
      onUpdate: (st) => bar?.style.setProperty("--p", st.progress.toFixed(3)),
      ...extra,
    },
  });
}

/** The beats: the scene's text, one at a time, handed over at at[i]
 *  (shares of the scene), evenly spaced where at says nothing. Every
 *  start is the timeline's own (fromTo). */
export function beats(tl: gsap.core.Timeline, root: HTMLElement, at: number[] = []): void {
  const list = gsap.utils.toArray<HTMLElement>(root.querySelectorAll("[data-scene-beat]"));
  list.forEach((beat, i) => {
    const before = list[i - 1];
    if (!before) return;
    const t = at[i - 1] ?? i / list.length;
    tl.fromTo(before, { autoAlpha: 1, y: 0 }, { autoAlpha: 0, y: -SHIFT, duration: LEAVE, ease: "power1.in", immediateRender: false }, t - LEAVE).fromTo(
      beat,
      { autoAlpha: 0, y: SHIFT },
      { autoAlpha: 1, y: 0, duration: ARRIVE, ease: "power2.out" },
      t,
    );
  });
}

export function init(kit: Kit): void {
  kit.query(hook).forEach((root) => {
    // A named scene is its own module's; a stage the page doesn't show
    // yet scrolled is left as it was painted.
    if (root.dataset.scene || !root.querySelector("[data-scene-stage]")) return;
    if (skipIntro(root) || inFirstView(root)) return;
    const at = (root.dataset.sceneAt ?? "").trim().split(/\s+/).map(parseFloat).filter(Number.isFinite);
    const tl = scrubbed(kit, root);
    beats(tl, root, at);
    tl.set({}, {}, 1); // the timeline spans the scene: its times are shares of it
  });
}
