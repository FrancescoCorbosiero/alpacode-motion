/* ============================================================
   The page's motion script. The layout loads it once, with
   <script>import "../engine";</script>; the ClientRouter keeps it
   across page swaps and the core rebuilds each page.
   ============================================================ */
import { start } from "./core";
import { effects, lazy } from "./registry";

start(effects, lazy);
