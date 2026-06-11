"use client";

import { useEffect, useRef, type ReactNode } from "react";

/** Hand-drawn SVG underline that draws (stroke-dashoffset) on view. */
export default function SquiggleWord({
  children,
  className = "",
}: {
  children: ReactNode;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      el.classList.add("draw");
      return;
    }
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            el.classList.add("draw");
            io.disconnect();
          }
        });
      },
      { threshold: 0.6 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <span ref={ref} className={`squiggle ${className}`}>
      {children}
      <svg viewBox="0 0 200 16" preserveAspectRatio="none" aria-hidden="true">
        <path d="M3 11 C 45 4, 92 4, 132 9 S 188 13, 197 6" />
      </svg>
    </span>
  );
}
