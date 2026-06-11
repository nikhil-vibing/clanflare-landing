"use client";

import { motion, useReducedMotion } from "motion/react";

/** Faint teal left-border that draws in on view (v12 P2-12). */
export default function DrawBorder() {
  const reduced = useReducedMotion();
  return (
    <motion.span
      aria-hidden="true"
      className="absolute inset-y-4 left-0 w-[3px] origin-top rounded-full bg-teal-hi/60"
      initial={reduced ? false : { scaleY: 0 }}
      whileInView={{ scaleY: 1 }}
      viewport={{ once: true, amount: 0.5 }}
      transition={{ duration: 0.7, ease: "easeOut" }}
    />
  );
}
