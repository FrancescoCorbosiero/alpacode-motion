/* ============================================================
   The gallery's controls, not part of the engine: replaying a demo,
   copying a block of code, the core page's two live pieces. Listeners
   sit on the document, registered once, so they survive page swaps.
   ============================================================ */
import { restart, scrollToTarget } from "../engine/core";
import { lockScroll } from "../engine/core/scroll-lock";

let release: (() => void) | null = null;
let opener: HTMLElement | null = null;

/** Replay: back to the top, the page's motion rebuilt, then glide down to
 *  the demo so it plays as it enters again. */
function replay(stage: HTMLElement): void {
  window.scrollTo({ top: 0, behavior: "instant" });
  restart();
  requestAnimationFrame(() => scrollToTarget(stage));
}

function copy(button: HTMLButtonElement): void {
  const code = button.closest("figure")?.querySelector("pre")?.textContent ?? "";
  const say = (text: string): void => {
    button.textContent = text;
    window.setTimeout(() => (button.textContent = "Copy"), 1600);
  };
  if (!navigator.clipboard) return say("Select it");
  navigator.clipboard.writeText(code).then(
    () => say("Copied"),
    () => say("Select it"),
  );
}

function openSheet(from: HTMLElement): void {
  const sheet = document.querySelector<HTMLElement>("[data-try-sheet]");
  if (!sheet || release) return;
  opener = from;
  sheet.hidden = false;
  release = lockScroll();
  sheet.querySelector<HTMLElement>("[data-try-close]")?.focus();
}

function closeSheet(): void {
  const sheet = document.querySelector<HTMLElement>("[data-try-sheet]");
  if (sheet) sheet.hidden = true;
  release?.();
  release = null;
  opener?.focus();
  opener = null;
}

function glide(): void {
  const target = document.querySelector<HTMLElement>("[data-try-target]");
  if (!target) return;
  const done = target.querySelector<HTMLElement>(".target-done");
  target.classList.remove("is-arrived");
  if (done) done.textContent = "";
  scrollToTarget(target, () => {
    target.classList.add("is-arrived");
    if (done) done.textContent = "Arrivato: done è partito adesso.";
  });
}

document.addEventListener("click", (e) => {
  const el = e.target instanceof Element ? e.target : null;
  if (!el) return;
  const stage = el.closest("[data-replay]")?.closest<HTMLElement>("[data-stage]");
  if (stage) return replay(stage);
  const copyButton = el.closest<HTMLButtonElement>("[data-copy]");
  if (copyButton) return copy(copyButton);
  if (el.closest("[data-try-glide]")) return glide();
  const lock = el.closest<HTMLElement>("[data-try-lock]");
  if (lock) return openSheet(lock);
  if (el.closest("[data-try-close]") || el.matches("[data-try-sheet]")) return closeSheet();
});

document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && release) closeSheet();
});

// Leaving the page with the panel open: let the lock go with it.
document.addEventListener("astro:before-swap", () => {
  if (release) closeSheet();
});
