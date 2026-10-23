/* ============================================================
   The effect contract.
   An effect is a module, src/engine/effects/<id>.ts, that exports its
   hook and an init(kit). The lifecycle calls init once per page, inside
   the page's gsap.context(): every tween, ScrollTrigger and SplitText it
   creates is reverted with the page. What a context can't revert
   (ticker callbacks, observers, attributes it sets) goes in
   kit.cleanup. The kit is the one alpacode's landing scenes get
   (A src/lib/landing/scenes.ts:54), plus the page's matchMedia and the
   query that honours the site's selector map.
   ============================================================ */

export type On = <K extends keyof HTMLElementEventMap>(
  el: HTMLElement,
  type: K,
  fn: (e: HTMLElementEventMap[K]) => void,
  opts?: AddEventListenerOptions,
) => void;

export interface Kit {
  /** The page's gsap.matchMedia(): parts that exist only at some sizes
   *  are built in media.add(query, fn) and undone when it stops matching. */
  media: gsap.MatchMedia;
  /** A listener, removed with the page. */
  on: On;
  /** A mouse: (hover: hover) and (pointer: fine). Pointer play only then. */
  fine: boolean;
  /** Teardown for what the context can't revert, run before it reverts. */
  cleanup: (fn: () => void) => void;
  /** The hook's elements plus the site's own selectors for it
   *  (config.ts), in document order. */
  query: <T extends Element = HTMLElement>(hook: string) => T[];
}

export interface Effect {
  /** What the markup asks for: a selector of data-* attributes (D5). */
  hook: string;
  /** Builds the effect on the page. */
  init: (kit: Kit) => void;
}

/** An effect fetched only by pages that have its hook (D7): tier 2 and 3,
 *  and anything that needs a plugin beyond ScrollTrigger and SplitText. */
export interface LazyEffect {
  hook: string;
  load: () => Promise<Effect>;
}
