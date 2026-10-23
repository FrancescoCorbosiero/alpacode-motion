/* ============================================================
   core-fx-layer.
   A fixed, aria-hidden layer for transient bits (confetti), above
   everything, emptied when the page goes. Styled in core.css.
   Sources: A src/lib/motion.ts:330; C src/scripts/motion.ts:195.
   ============================================================ */

export function fxLayer(): HTMLElement {
  let layer = document.querySelector<HTMLElement>(".fx-layer");
  if (!layer) {
    layer = document.createElement("div");
    layer.className = "fx-layer";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
  }
  return layer;
}

export function clearFxLayer(): void {
  document.querySelector(".fx-layer")?.replaceChildren();
}
