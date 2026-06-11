"use client";

import { useRef } from "react";
import GlowBg from "@/components/fx/GlowBg";
import { copy } from "@/lib/copy";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * Vision crescendo (dopamine moment #2, v11 §3.6) — read-as-you-scroll:
 * words scrubbed from 0.15 → 1 opacity via ScrollTrigger + SplitText,
 * "Yours." oversized in teal landing last. Static under reduced motion.
 */
export default function Vision() {
  const ref = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add("(prefers-reduced-motion: no-preference)", () => {
        const el = ref.current;
        if (!el) return;
        const targets = el.querySelectorAll<HTMLElement>("[data-scrub]");
        document.fonts.ready.then(() => {
          if (!ref.current) return;
          const words: Element[] = [];
          targets.forEach((t) => {
            const split = SplitText.create(t, { type: "words" });
            words.push(...split.words);
          });
          const final = el.querySelector("[data-final]");
          if (final) words.push(final);
          gsap.set(words, { opacity: 0.15 });
          gsap.to(words, {
            opacity: 1,
            stagger: 0.06,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top 75%",
              end: "center 45%",
              scrub: 0.5,
            },
          });
        });
      });
    },
    { scope: ref }
  );

  return (
    <section
      ref={ref}
      id="vision"
      aria-labelledby="vision-heading"
      className="band relative overflow-hidden py-32 text-center md:py-[210px]"
    >
      <h2 id="vision-heading" className="sr-only">
        Our vision
      </h2>
      <GlowBg position="50% 50%" size="55% 45%" />
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <p
          data-scrub
          className="mx-auto max-w-[32ch] text-[clamp(19px,2.3vw,27px)] font-medium leading-snug tracking-tight text-ink-dim"
        >
          {copy.vision.pre}
        </p>
        <p className="mx-auto mt-9 max-w-[22ch] text-[clamp(42px,6.4vw,88px)] font-extrabold leading-[1.04] tracking-[-0.045em] [text-wrap:balance]">
          <span data-scrub>{copy.vision.big}</span>{" "}
          <span
            data-final
            className="inline-block text-[1.18em] text-teal-hi [text-shadow:0_0_40px_rgba(95,201,202,0.5)]"
          >
            {copy.vision.final}
          </span>
        </p>
      </div>
    </section>
  );
}
