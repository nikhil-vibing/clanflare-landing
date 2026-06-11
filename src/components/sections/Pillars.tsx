import Reveal from "@/components/fx/Reveal";
import SquiggleWord from "@/components/fx/SquiggleWord";
import { copy } from "@/lib/copy";

export default function Pillars() {
  const c = copy.pillars;
  return (
    <section
      id="pillars"
      aria-labelledby="pillars-heading"
      className="band glow-anchor border-b border-hairline bg-surface py-24 md:py-[120px] [--glow-x:50%]"
    >
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <Reveal as="p" className="eyebrow">
          {c.eyebrow}
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="pillars-heading" className="text-section mt-4 max-w-[20ch]">
            {c.heading.pre} <SquiggleWord>{c.heading.own}</SquiggleWord>
          </h2>
        </Reveal>
        <div className="mt-14 grid gap-5 md:grid-cols-3">
          {c.items.map((p, i) => (
            <Reveal key={p.title} delay={i * 0.08}>
              <div className="raised group h-full px-8 py-9 transition-all duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.14] hover:bg-card-hover hover:shadow-[var(--shadow-raise-lg)]">
                <span className="inline-flex h-10 w-10 items-center justify-center rounded-xl bg-teal/15 text-base font-bold text-teal-hi shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]">
                  {p.n}
                </span>
                <h3 className="mt-5 text-[21px] font-bold tracking-tight">{p.title}</h3>
                <p className="mt-3 text-[15.5px] leading-relaxed text-ink-dim">
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
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
