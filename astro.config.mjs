// @ts-check
import { defineConfig } from "astro/config";

// The gallery (D11): a static site, one page per ported entry and an index
// built from catalog.md. It runs the engine the way the sites do: one
// script per page, Astro's ClientRouter swapping pages, prefetch on hover.
// No `site` yet: whether the gallery is published is open (O1).
export default defineConfig({
  output: "static",
  prefetch: {
    prefetchAll: true,
    defaultStrategy: "hover",
  },
  devToolbar: {
    enabled: false,
  },
});
