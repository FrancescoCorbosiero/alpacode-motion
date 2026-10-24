/* ============================================================
   chat — a chat preview plays the message arriving: the typing dots,
   then the bubble pops from its corner.
   Markup: data-chat on the preview's screen, the message in it a
   [data-chat-bubble].
   Below the fold only, once, as the screen enters: three dots appear
   where the message will be and bounce in turn, as if someone were
   typing; then they go, and the bubble pops in from its corner with a
   spring. The dots are the script's (.chat-typing, styled by its CSS)
   and go with the page. The bubble waits hidden, marked
   data-motion-pending: focus inside it shows it at once.
   It plays where MEDIA matches (A from 1025px up, where its preview
   is shown: a layout's guard, the site's to set).
   Sources: A src/lib/motion.ts:1017; CSS A src/styles/motion.css:370.
   ============================================================ */
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { inFirstView, skipIntro } from "../core/guards";
import type { Kit } from "../core/kit";

gsap.registerPlugin(ScrollTrigger);

export const hook = "[data-chat]";

/* ---------- Settings: the site's voice, tuned when copying ---------- */
const MEDIA = "all"; // where it plays (A "(min-width: 1025px)", where its preview exists)
const TYPING = 1.15; // s the dots type before the message lands (A)
const ORIGIN = "100% 0%"; // the corner the bubble pops from: top right, a message sent (A)
const START = "top 78%"; // where a screen counts as entering (A)

export function init(kit: Kit): void {
  kit.query(hook).forEach((screen) => {
    const bubble = screen.querySelector<HTMLElement>("[data-chat-bubble]");
    if (!bubble || skipIntro(screen) || inFirstView(screen)) return;
    kit.media.add(MEDIA, () => {
      const dots = document.createElement("span");
      dots.className = "chat-typing";
      dots.setAttribute("aria-hidden", "true");
      dots.innerHTML = "<i></i><i></i><i></i>";
      screen.appendChild(dots);
      bubble.setAttribute("data-motion-pending", "");
      gsap.set(bubble, { opacity: 0, scale: 0.6, transformOrigin: ORIGIN });
      gsap.set(dots, { opacity: 0, scale: 0.5, transformOrigin: ORIGIN });
      gsap
        .timeline({ scrollTrigger: { trigger: screen, start: START, once: true } })
        .to(dots, { opacity: 1, scale: 1, duration: 0.35, ease: "back.out(2.2)" })
        .fromTo(dots.children, { y: 0 }, { y: -4, duration: 0.24, ease: "sine.inOut", yoyo: true, repeat: 3, stagger: 0.11 }, 0.15)
        .to(dots, { opacity: 0, scale: 0.5, duration: 0.2, ease: "power2.in" }, TYPING)
        .to(
          bubble,
          {
            opacity: 1,
            scale: 1,
            duration: 0.65,
            ease: "back.out(1.8)",
            clearProps: "opacity,transform,transformOrigin",
            onStart: () => bubble.removeAttribute("data-motion-pending"),
          },
          TYPING + 0.05,
        );
      return () => {
        dots.remove();
        bubble.removeAttribute("data-motion-pending");
      };
    });
  });
}
