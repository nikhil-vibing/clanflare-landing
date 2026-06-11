"use client";

import { useRef, type HTMLAttributes, type ReactNode } from "react";
import { gsap, useGSAP } from "@/lib/gsap";

/**
 * v14 micro-interaction primitive (Saffer: feedback confirms a real trigger).
 * - Card-scoped pointer spotlight: writes --mx/--my on THIS element only, so
 *   it never triggers a tree-wide style recalc (v14 §3).
 * - Optional 3D tilt on an inner layer via gsap.quickTo (never tween-per-move).
 * The rect is cached once on enter; listeners are gated to a fine hover pointer
 * and killed under reduced motion. useGSAP reverts the quickTo on unmount, so
 * no stuck cursor / detached-node updates (v13 §8).
 */
export default function TiltSpotlight({
  children,
  className = "",
  tilt = 0,
  spotlight = true,
  ...rest
}: Omit<HTMLAttributes<HTMLDivElement>, "children"> & {
  children: ReactNode;
  /** max tilt in degrees; 0 disables tilt */
  tilt?: number;
  spotlight?: boolean;
}) {
  const wrap = useRef<HTMLDivElement>(null);
  const inner = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const el = wrap.current;
      if (!el) return;
      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (!fine || reduced) return;

      const inEl = inner.current;
      const rotX = tilt && inEl ? gsap.quickTo(inEl, "rotationX", { duration: 0.4, ease: "power3" }) : null;
      const rotY = tilt && inEl ? gsap.quickTo(inEl, "rotationY", { duration: 0.4, ease: "power3" }) : null;
      let rect: DOMRect | null = null;

      const enter = () => {
        rect = el.getBoundingClientRect();
        el.style.willChange = "transform";
        if (spotlight) el.style.setProperty("--spot-op", "1");
      };
      const move = (e: PointerEvent) => {
        if (!rect) rect = el.getBoundingClientRect();
        const px = (e.clientX - rect.left) / rect.width;
        const py = (e.clientY - rect.top) / rect.height;
        if (spotlight) {
          el.style.setProperty("--mx", `${(px * 100).toFixed(2)}%`);
          el.style.setProperty("--my", `${(py * 100).toFixed(2)}%`);
        }
        if (rotX && rotY) {
          rotY((px - 0.5) * tilt * 2);
          rotX((0.5 - py) * tilt * 2);
        }
      };
      const leave = () => {
        rect = null;
        el.style.willChange = "auto";
        if (spotlight) el.style.setProperty("--spot-op", "0");
        if (rotX && rotY) {
          rotX(0);
          rotY(0);
        }
      };

      el.addEventListener("pointerenter", enter);
      el.addEventListener("pointermove", move);
      el.addEventListener("pointerleave", leave);
      return () => {
        el.removeEventListener("pointerenter", enter);
        el.removeEventListener("pointermove", move);
        el.removeEventListener("pointerleave", leave);
      };
    },
    { scope: wrap, dependencies: [tilt, spotlight] }
  );

  return (
    <div
      ref={wrap}
      className={`${spotlight ? "spotlight " : ""}${tilt ? "tilt-scene " : ""}${className}`}
      {...rest}
    >
      {tilt ? (
        <div ref={inner} className="tilt-inner h-full">
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}
