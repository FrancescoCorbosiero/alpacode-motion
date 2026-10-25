/* ============================================================
   cursor-thumb — over an index, a frame follows the pointer and shows
   the picture of the row under it.
   Markup: data-cursor-thumb on the list; its rows
   [data-cursor-thumb-row], each with its picture in
   [data-cursor-thumb-pic] (an <img>) and, optionally,
   data-cursor-thumb-label (the text for the frame's bar) and
   data-cursor-thumb-vt (the view-transition name its picture carries).
   The frame is the site's, next to the list: [data-cursor-thumb-frame],
   hidden, with an empty [data-cursor-thumb-slot] and, optionally,
   [data-cursor-thumb-bar].
   A mouse only, and only where the list is laid out as rows (WHERE):
   elsewhere the pictures are the list's own. The effect unhides the
   frame and fills it with copies of the pictures, sized to the frame
   so the srcset gives a sharper file and fetched when the pointer
   first comes in, and marks the list data-cursor-thumb-on. The frame
   trails the pointer (quickTo), on its right, or on its left near the
   right edge; it leans with the pointer's speed; each row's picture
   wipes in from the side the pointer came from. A click hands the
   row's view-transition name from its picture to the frame: what the
   visitor was looking at is what grows into the next page.
   C's thumbs live one per row and pop in from nothing, tilted at
   random: here one frame serves the list (a row's own picture stays
   its layout), and C's pop is the settings ENTER_SCALE and ENTER_TILT.
   Sources: A src/components/pages/Lavori.astro (new, /lavori);
   C src/scripts/motion.ts:1227 (data-path-row).
   ============================================================ */
import { gsap } from "gsap";
import type { Kit } from "../core/kit";

export const hook = "[data-cursor-thumb]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const WHERE = "(min-width: 1025px)"; // where the list is rows (A; below it, cards with their own pictures)
const GAP = 36; // px between the pointer and the frame (A; C centres the thumb on it: 0)
const FOLLOW = 0.55; // s the frame takes to catch the pointer (A and C)
const LEAN = 0.12; // degrees of lean per px of pointer travel between two moves (A; C none)
const MAX_LEAN = 7; // degrees: the most it leans (A)
const ENTER_SCALE = 0.92; // the frame's scale as it comes in (A 0.92; C 0, from nothing)
const ENTER_TILT = 0; // degrees: a random tilt either way as it comes in (A 0; C 9)
const SHOW = 0.35; // s the frame takes to come in or go (A; C 0.55 in, 0.35 out)
const WIPE = 0.6; // s a row's picture takes to wipe in (A)

export function init(kit: Kit): void {
  if (!kit.fine) return;
  kit.query(hook).forEach((list) => {
    const host = list.parentElement;
    const frame = host?.querySelector<HTMLElement>("[data-cursor-thumb-frame]");
    const slot = frame?.querySelector<HTMLElement>("[data-cursor-thumb-slot]");
    const rows = gsap.utils.toArray<HTMLElement>("[data-cursor-thumb-row]", list);
    if (!host || !frame || !slot || !rows.length) return;
    const bar = frame.querySelector<HTMLElement>("[data-cursor-thumb-bar]");

    kit.media.add(WHERE, () => {
      frame.hidden = false;
      list.setAttribute("data-cursor-thumb-on", "");
      const pics = rows.map((row) => {
        const src = row.querySelector<HTMLImageElement>("[data-cursor-thumb-pic] img");
        const pic = document.createElement("img");
        pic.alt = "";
        pic.decoding = "async";
        if (src) {
          pic.sizes = `${Math.round(frame.offsetWidth)}px`;
          pic.dataset.srcset = src.srcset;
          pic.dataset.src = src.currentSrc || src.src;
        }
        slot.appendChild(pic);
        return pic;
      });
      gsap.set(frame, { autoAlpha: 0, scale: ENTER_SCALE, yPercent: -50 });
      gsap.set(pics, { clipPath: "inset(0% 0% 100% 0%)" });

      const toX = gsap.quickTo(frame, "x", { duration: FOLLOW, ease: "power3.out" });
      const toY = gsap.quickTo(frame, "y", { duration: FOLLOW, ease: "power3.out" });
      const toLean = gsap.quickTo(frame, "rotation", { duration: FOLLOW * 1.4, ease: "power3.out" });
      let current = -1;
      let lastX = 0;
      let lastY = 0;
      let loaded = false;
      let z = 1;

      const place = (e: PointerEvent, jump = false): void => {
        const box = host.getBoundingClientRect();
        const px = e.clientX - box.left;
        const py = e.clientY - box.top;
        const w = frame.offsetWidth;
        const x = px + GAP + w > box.width ? px - GAP - w : px + GAP;
        if (jump) gsap.set(frame, { x, y: py });
        else {
          toX(x);
          toY(py);
          toLean(gsap.utils.clamp(-MAX_LEAN, MAX_LEAN, (e.clientX - lastX) * LEAN));
        }
        lastX = e.clientX;
      };

      const show = (i: number, e: PointerEvent): void => {
        if (i === current) return;
        const down = e.clientY >= lastY;
        current = i;
        const pic = pics[i];
        if (!pic) return;
        if (bar) bar.textContent = rows[i]?.dataset.cursorThumbLabel ?? "";
        gsap.set(pic, { zIndex: ++z });
        gsap.fromTo(
          pic,
          { clipPath: down ? "inset(100% 0% 0% 0%)" : "inset(0% 0% 100% 0%)", scale: 1.12 },
          { clipPath: "inset(0% 0% 0% 0%)", scale: 1, duration: WIPE, ease: "expo.out", overwrite: true },
        );
      };

      const load = (): void => {
        if (loaded) return;
        loaded = true;
        pics.forEach((pic) => {
          if (pic.dataset.srcset) pic.srcset = pic.dataset.srcset;
          if (pic.dataset.src) pic.src = pic.dataset.src;
        });
      };

      kit.on(list, "pointerenter", (e) => {
        load();
        place(e, true);
        lastY = e.clientY;
        const tilt = ENTER_TILT ? gsap.utils.random(-ENTER_TILT, ENTER_TILT) : 0;
        gsap.to(frame, { autoAlpha: 1, scale: 1, rotation: tilt, duration: SHOW, ease: "power3.out", overwrite: "auto" });
      });
      kit.on(list, "pointerleave", () => {
        current = -1;
        gsap.to(frame, { autoAlpha: 0, scale: ENTER_SCALE, rotation: 0, duration: SHOW, ease: "power2.in", overwrite: "auto" });
      });
      kit.on(list, "pointermove", (e) => {
        place(e);
        const row = (e.target as Element).closest<HTMLElement>("[data-cursor-thumb-row]");
        const i = row ? rows.indexOf(row) : -1;
        if (i >= 0) show(i, e);
        lastY = e.clientY;
      });
      // The row's view-transition name goes with what the visitor sees.
      rows.forEach((row) => {
        const name = row.dataset.cursorThumbVt;
        if (!name) return;
        kit.on(row, "click", () => {
          row.querySelectorAll<HTMLElement>("[data-cursor-thumb-pic], [data-cursor-thumb-pic] *").forEach((el) => {
            if (el.style.viewTransitionName === name) el.style.viewTransitionName = "none";
          });
          frame.style.viewTransitionName = name;
        });
      });

      return () => {
        pics.forEach((pic) => pic.remove());
        frame.hidden = true;
        frame.style.removeProperty("view-transition-name");
        list.removeAttribute("data-cursor-thumb-on");
        rows.forEach((row) => {
          const name = row.dataset.cursorThumbVt;
          if (!name) return;
          row.querySelectorAll<HTMLElement>("[data-cursor-thumb-pic], [data-cursor-thumb-pic] *").forEach((el) => {
            if (el.style.viewTransitionName === "none") el.style.viewTransitionName = name;
          });
        });
      };
    });
  });
}
