"use client";

import { useEffect, useRef, useState } from "react";
import Reveal from "@/components/fx/Reveal";
import { copy } from "@/lib/copy";

/**
 * How it works. v12 P0-5: chips are consistent (all dark), and light up
 * in sequence as the section scrolls into view; the tracing line that
 * clipped through the cards is gone.
 */
export default function HowItWorks() {
  const ref = useRef<HTMLElement>(null);
  const [lit, setLit] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (!("IntersectionObserver" in window)) {
      const t = setTimeout(() => setLit(true), 0);
      return () => clearTimeout(t);
    }
    const io = new IntersectionObserver(
      (ents) => {
        ents.forEach((en) => {
          if (en.isIntersecting) {
            setLit(true);
            io.disconnect();
          }
        });
      },
      { threshold: 0.35 }
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const c = copy.how;
  return (
    <section
      ref={ref}
      id="how"
      aria-labelledby="how-heading"
      className="band glow-anchor py-24 md:py-[120px] [--glow-x:30%]"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <Reveal as="p" className="eyebrow">
          {c.eyebrow}
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="how-heading" className="text-section mt-4 max-w-[20ch]">
            {c.heading}
          </h2>
        </Reveal>

        <ol className="mt-14 grid list-none gap-5 p-0 md:grid-cols-3">
          {c.steps.map((s, i) => (
            <Reveal as="li" key={s.title} delay={i * 0.08}>
              <div className="raised h-full px-8 py-9 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[var(--shadow-raise-lg)]">
                <span
                  className={`inline-flex h-[38px] w-[38px] items-center justify-center rounded-xl text-[15px] font-bold transition-colors duration-500 ${
                    lit
                      ? "bg-teal-hi text-[#06100F] shadow-[0_0_18px_rgba(72,166,167,0.4)]"
                      : "bg-teal/12 text-teal-hi"
                  }`}
                  style={{ transitionDelay: `${i * 350}ms` }}
                >
                  {i + 1}
                </span>
                <h3 className="mt-6 text-[19px] font-bold tracking-tight">{s.title}</h3>
                <p className="mt-2.5 text-[15.5px] leading-relaxed text-ink-dim">{s.body}</p>
              </div>
            </Reveal>
          ))}
        </ol>
      </div>
    </section>
  );
}
