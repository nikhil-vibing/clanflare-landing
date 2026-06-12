"use client";

import { useEffect, useRef } from "react";
import { gsap } from "@/lib/gsap";

/**
 * v19 craft signature — a subtle teal follower that trails the pointer with a
 * little lag and swells over interactive targets. ADDITIVE (the native cursor
 * stays, so nothing breaks): an accent, not a replacement. Gated to fine
 * pointers with motion allowed; one pointermove listener + gsap.quickTo (no
 * per-move tween churn — scale changes only on enter/leave of targets).
 */
export default function CursorFlag() {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fine = window.matchMedia("(hover: hover) and (pointer: fine)");
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)");
    if (!fine.matches || reduced.matches) return;

    const xTo = gsap.quickTo(el, "x", { duration: 0.3, ease: "power3" });
    const yTo = gsap.quickTo(el, "y", { duration: 0.3, ease: "power3" });
    let shown = false;

    const move = (e: PointerEvent) => {
      xTo(e.clientX);
      yTo(e.clientY);
      if (!shown) {
        shown = true;
        gsap.to(el, { autoAlpha: 1, duration: 0.3 });
      }
    };
    const over = (e: PointerEvent) => {
      const t = e.target as HTMLElement | null;
      const interactive = !!t?.closest?.(
        "a,button,[role=button],input,textarea,label,.cursor-grab,[data-owned-frame]"
      );
      gsap.to(el, { scale: interactive ? 2.4 : 1, duration: 0.25, ease: "power2.out" });
    };
    const leave = () => {
      shown = false;
      gsap.to(el, { autoAlpha: 0, duration: 0.2 });
    };

    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("pointerover", over, { passive: true });
    document.addEventListener("pointerleave", leave);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("pointerover", over);
      document.removeEventListener("pointerleave", leave);
    };
  }, []);

  return (
    <div
      ref={ref}
      aria-hidden="true"
      className="pointer-events-none fixed left-0 top-0 z-[200] block h-2.5 w-2.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-teal opacity-0 mix-blend-multiply"
      style={{ willChange: "transform" }}
    />
  );
}
