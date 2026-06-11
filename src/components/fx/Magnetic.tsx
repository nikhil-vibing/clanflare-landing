"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * Magnetic pull (Cuberto pattern, v14 §3) — the one "loud" pointer move,
 * reserved for the primary CTA. gsap.quickTo lerps toward the pointer and
 * ALWAYS resets to {0,0} on leave/blur, so the button can never strand
 * off-centre (the v13 §8 stuck-cursor failure mode). Gated to a fine hover
 * pointer; inert under reduced motion and on touch.
 */
export default function Magnetic({
  children,
  className = "",
  strength = 0.3,
}: {
  children: ReactNode;
  className?: string;
  strength?: number;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useGSAP(
    () => {
      const el = ref.current;
      if (!el) return;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || reduced) return;

      const xTo = gsap.quickTo(el, "x", { duration: 0.45, ease: "power3" });
      const yTo = gsap.quickTo(el, "y", { duration: 0.45, ease: "power3" });
      let rect: DOMRect | null = null;

      const enter = () => {
        rect = el.getBoundingClientRect();
      };
      const move = (e: PointerEvent) => {
        if (!rect) rect = el.getBoundingClientRect();
        xTo((e.clientX - (rect.left + rect.width / 2)) * strength);
        yTo((e.clientY - (rect.top + rect.height / 2)) * strength);
      };
      const reset = () => {
        rect = null;
        xTo(0);
        yTo(0);
      };

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", reset);
      el.addEventListener("blur", reset, true);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", reset);
        el.removeEventListener("blur", reset, true);
      };
    },
    { scope: ref, dependencies: [strength] }
  );

  return (
    <span ref={ref} className={`magnetic inline-flex ${className}`}>
      {children}
    </span>
  );
}
