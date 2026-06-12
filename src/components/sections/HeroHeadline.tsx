"use client";

import { useRef } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";
import { copy } from "@/lib/copy";

/**
 * Kinetic H1 (v11 §3.2): two parallel verb-commands — "Gather your clan."
 * then "Own your world." The words rise/blur-in staggered; "Own your world."
 * lands last in teal with the hand-drawn squiggle. Runs once on load after
 * fonts are ready, < 1.2s.
 */
export default function HeroHeadline() {
  const ref = useRef<HTMLHeadingElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const ownEl = el.querySelector(".squiggle");
      const finish = () => {
        ownEl?.classList.add("draw");
      };
      if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        finish();
        return;
      }
      document.fonts.ready.then(() => {
        if (!ref.current) return;
        const split = SplitText.create(el, { type: "words", ignore: "svg" });
        gsap.fromTo(
          split.words,
          { opacity: 0, y: 24, filter: "blur(6px)" },
          {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 0.6,
            stagger: 0.04,
            ease: "power3.out",
            onComplete: () => {
              finish();
              split.revert();
            },
          }
        );
      });
      // failsafe: land the end state even if fonts.ready stalls (kept short so a
      // slow font never holds the largest element behind the rest of the hero)
      const t = setTimeout(finish, 800);
      return () => clearTimeout(t);
    },
    { scope: ref }
  );

  const { h1 } = copy.hero;
  // v18.2 FIX 1: explicit phrase breaks. Below lg the spans flow inline (natural
  // wrap, never one word per line); at lg+ each phrase becomes a whole,
  // non-wrapping line — "Gather your clan." / "Own your world."
  return (
    <h1 ref={ref} className="text-hero">
      <span className="block">{h1.lead}</span>
      <span className="squiggle block text-teal-hi">
        {h1.own}
        <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
          <path d="M3 11 C 45 4, 92 4, 132 9 S 188 13, 197 6" />
        </svg>
      </span>
    </h1>
  );
}
