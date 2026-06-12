"use client";

import { useReducedMotion } from "motion/react";
import { useRef, type ElementType, type ReactNode, type Ref } from "react";
import { gsap, SplitText, useGSAP } from "@/lib/gsap";

/**
 * v18.1 §3 — the one restrained entrance primitive. Splits a heading into
 * lines, each in an overflow-clip mask, and reveals them y:100%→0 on scroll
 * (0.6s, power2.out, staggered). `toggleActions: play none none reverse` reads
 * more premium than replay-on-every-pass. Fully deletable: under
 * prefers-reduced-motion it renders a plain, static element — zero info loss.
 *
 * Use on plain-text headings only; decorated headings (SquiggleWord, the
 * scrubbed Vision line) keep their own treatment so masks never clip an SVG.
 */
export default function MaskReveal({
  children,
  as,
  id,
  className,
  start = "top 85%",
}: {
  children: ReactNode;
  as?: ElementType;
  id?: string;
  className?: string;
  start?: string;
}) {
  const Tag = (as ?? "h2") as ElementType;
  const ref = useRef<HTMLElement>(null);
  const reduced = useReducedMotion();

  useGSAP(
    () => {
      const el = ref.current;
      if (reduced || !el) return;

      // autoSplit re-splits on font-load + resize; mask:"lines" wraps each line
      // in an overflow-clip container so the rise reads as a true mask reveal.
      let tween: gsap.core.Tween | undefined;
      const split = SplitText.create(el, {
        type: "lines",
        mask: "lines",
        autoSplit: true,
        onSplit: (self) =>
          (tween = gsap.from(self.lines, {
            yPercent: 100,
            duration: 0.6,
            ease: "power2.out",
            stagger: 0.08,
            scrollTrigger: {
              trigger: el,
              start,
              toggleActions: "play none none reverse",
            },
          })),
      });

      // Failsafe: a masked line must never strand a heading invisible. If the
      // heading is on-screen but the reveal hasn't run (ScrollTrigger refresh
      // race / stalled fonts), settle the lines to their rest state.
      const failsafe = window.setTimeout(() => {
        if (!tween || tween.progress() > 0) return;
        const r = el.getBoundingClientRect();
        if (r.top < window.innerHeight && r.bottom > 0) {
          gsap.set(split.lines, { yPercent: 0 });
        }
      }, 2000);

      return () => {
        window.clearTimeout(failsafe);
        split.revert();
      };
    },
    { scope: ref, dependencies: [reduced] }
  );

  return (
    <Tag ref={ref as Ref<HTMLElement>} id={id} className={className}>
      {children}
    </Tag>
  );
}
