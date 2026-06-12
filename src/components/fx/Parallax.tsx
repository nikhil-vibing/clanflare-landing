"use client";

import {
  motion,
  useReducedMotion,
  useScroll,
  useTransform,
} from "motion/react";
import { useRef, type ReactNode } from "react";

/**
 * v18.1 §3 — imagery drift, "≤8px parallax, nothing more". Motion v12
 * useScroll/useTransform runs scroll-linked work on the native ScrollTimeline
 * (off main thread when supported) — ideal with no-Lenis / memory limits.
 * Peak displacement is `amount` px from center. Static under reduced motion.
 */
export default function Parallax({
  children,
  amount = 8,
  className,
}: {
  children: ReactNode;
  amount?: number;
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const reduced = useReducedMotion();
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start end", "end start"],
  });
  const y = useTransform(scrollYProgress, [0, 1], [amount, -amount]);

  if (reduced) {
    return <div className={className}>{children}</div>;
  }
  return (
    <motion.div ref={ref} style={{ y, willChange: "transform" }} className={className}>
      {children}
    </motion.div>
  );
}
