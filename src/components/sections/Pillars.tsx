import Reveal from "@/components/fx/Reveal";
import SquiggleWord from "@/components/fx/SquiggleWord";
import { copy } from "@/lib/copy";

/**
 * v19: de-templatized from a 3-up identical card grid into an editorial
 * layout — a sticky heading island on the left, big-number stacked rows on the
 * right with hairline dividers. Breaks the canonical SaaS feature-grid.
 */
export default function Pillars() {
  const c = copy.pillars;
  return (
    <section
      id="pillars"
      aria-labelledby="pillars-heading"
      className="band glow-anchor border-b border-hairline bg-surface py-24 md:py-[130px] [--glow-x:50%]"
    >
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[0.82fr_1.18fr] lg:gap-20">
          {/* left — editorial heading, sticky on desktop */}
          <div className="lg:sticky lg:top-28 lg:self-start">
            <p className="eyebrow">{c.eyebrow}</p>
            <Reveal delay={0.08}>
              <h2 id="pillars-heading" className="text-section mt-4 max-w-[11ch]">
                {c.heading.pre} <SquiggleWord>{c.heading.own}</SquiggleWord>
              </h2>
            </Reveal>
            <p className="caption mt-7">fig. 01 — what we do</p>
          </div>

          {/* right — big-number stacked rows */}
          <div className="flex flex-col">
            {c.items.map((p, i) => (
              <Reveal key={p.title} delay={i * 0.06}>
                <div className="group flex gap-6 border-t border-hairline py-8 first:border-t-0 first:pt-0 md:gap-9">
                  <span className="font-display text-[40px] font-black leading-[0.9] tabular-nums text-teal/35 transition-colors duration-300 group-hover:text-teal-hi md:text-[56px]">
                    0{i + 1}
                  </span>
                  <div className="pt-1.5">
                    <h3 className="text-[22px] font-bold tracking-tight md:text-[26px]">
                      {p.title}
                    </h3>
                    <p className="mt-3 max-w-[54ch] text-[16px] leading-relaxed text-ink-dim">
                      {"rev" in p && p.rev ? (
                        <>
                          {p.body.split(p.rev)[0]}
                          <span className="font-semibold text-teal-hi">{p.rev}</span>
                          {p.body.split(p.rev)[1]}
                        </>
                      ) : (
                        p.body
                      )}
                    </p>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
