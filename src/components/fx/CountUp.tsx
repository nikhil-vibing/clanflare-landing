"use client";

import { useEffect, useRef, useState } from "react";

function fmt(v: number, decimals: number) {
  return v.toLocaleString("en-US", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
}

/**
 * Count-up that is correct without JS (v12 P0-1): the real final value is
 * server-rendered as static text, then enhanced — on first view (threshold
 * 0.5, once) it animates 0 → value. Static under reduced motion.
 */
export default function CountUp({
  value,
  decimals = 0,
  duration = 1200,
  className,
}: {
  value: number;
  decimals?: number;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  const [display, setDisplay] = useState<string>(() => fmt(value, decimals));

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (
      window.matchMedia("(prefers-reduced-motion: reduce)").matches ||
      !("IntersectionObserver" in window)
    ) {
      return; // keep the static real value
    }
    let raf = 0;
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (!en.isIntersecting) return;
          io.disconnect();
          let t0: number | null = null;
          const step = (ts: number) => {
            if (t0 === null) t0 = ts;
            const p = Math.min((ts - t0) / duration, 1);
            const eased = 1 - Math.pow(1 - p, 3);
            setDisplay(fmt(value * eased, decimals));
            if (p < 1) raf = requestAnimationFrame(step);
            else setDisplay(fmt(value, decimals));
          };
          raf = requestAnimationFrame(step);
        });
      },
      { threshold: 0.5 }
    );
    io.observe(el);
    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
    };
  }, [value, decimals, duration]);

  return (
    <span ref={ref} className={className}>
      {display}
    </span>
  );
}
