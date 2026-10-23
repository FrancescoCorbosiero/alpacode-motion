/* ============================================================
   The site's half of the core: its own selectors.
   core/ and effects/ are copied as they are; this file and
   registry.ts are written per site. A site's classes live here,
   never in an effect (D5): alpacode maps its 66 block selectors to
   [data-reveal] in `selectors`, C maps `.card` to [data-tilt].
   ============================================================ */

export const config = {
  /** The page header: `.scrolled` past 8px, `.is-hidden` while reading
   *  downwards (core-header). alpacode and C: ".site-header". */
  header: "[data-header]",
  /** While this matches, the header stays shown (an open mobile nav).
   *  C: "[data-nav].open". */
  navOpen: "[data-nav][data-open]",
  /** Panes that keep native scrolling under the pointer: Lenis stands
   *  down over them (modals, the mobile menu, a cookie panel). */
  scrollPanes: "[aria-modal='true']",
  /** What the CSS intro moves on first paint: effects leave everything
   *  inside alone (core-guards). alpacode adds "[data-hero]". */
  intro: ".intro-lines, [data-intro]",
  /** The site's own selectors for a hook, keyed by the hook exactly as
   *  the entry exports it (its page shows it): kit.query(hook) finds them
   *  too, e.g. { "[data-reveal]": [".section-head .lede", ".step"] }. */
  selectors: {} as Record<string, string[]>,
};
