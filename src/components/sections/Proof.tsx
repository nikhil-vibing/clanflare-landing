import { Building2, GraduationCap, Quote, Target, type LucideIcon } from "lucide-react";
import CountUp from "@/components/fx/CountUp";
import DrawBorder from "@/components/fx/DrawBorder";
import Reveal from "@/components/fx/Reveal";
import TiltSpotlight from "@/components/fx/TiltSpotlight";
import { copy } from "@/lib/copy";

const TILTS = ["-rotate-[1.4deg]", "rotate-1", "-rotate-[0.8deg]"];

// Role → glyph. We do NOT show a face on a result card: our sample portraits
// aren't cleared customers, and a synthetic face beside a real claim destroys
// credibility (v13 §4/§6.4). An honest, evidence-led case card instead — a
// role glyph + falsifiable result, never a bare initials circle / placeholder.
const ROLE_GLYPH: Record<string, LucideIcon> = {
  Coach: Target,
  Brand: Building2,
  Educator: GraduationCap,
};

/**
 * Proof. Until real client photos are cleared, each card is a designed
 * "case file" — taped, tilted glass surface carrying the falsifiable result
 * itself (v13 §6.4). Never a fake face, never an instruction-text box.
 */
export default function Proof() {
  const c = copy.proof;
  return (
    <section
      id="proof"
      aria-labelledby="proof-heading"
      className="band glow-anchor border-b border-hairline bg-surface py-24 md:py-[120px] [--glow-x:78%]"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <Reveal as="p" className="eyebrow">
          {c.eyebrow}
        </Reveal>
        <Reveal delay={0.08}>
          <h2 id="proof-heading" className="text-section mt-4 max-w-[20ch]">
            {c.heading}
          </h2>
        </Reveal>
        <Reveal as="p" delay={0.16} className="mt-4 max-w-[54ch] text-lg text-ink-dim">
          {c.sub}
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {c.niches.map((n, i) => {
            const Glyph = ROLE_GLYPH[n.role] ?? Target;
            return (
              <Reveal key={n.role} delay={i * 0.08}>
                <TiltSpotlight tilt={3} className="raised group relative h-full p-5 pb-6 transition-[border-color,box-shadow] duration-200 ease-out hover:border-white/[0.14] hover:shadow-[var(--shadow-raise-lg)]">
                  {/* taped, slightly-tilted "case file" */}
                  <span
                    aria-hidden="true"
                    className="absolute -top-2 left-1/2 z-[3] h-6 w-[84px] -translate-x-1/2 -rotate-3 rounded-sm border border-teal-hi/20 bg-teal-hi/15 shadow-[0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-[2px]"
                  />
                  <div
                    className={`glass-device overflow-hidden rounded-xl shadow-[var(--shadow-raise-lg)] ${TILTS[i]}`}
                  >
                    <div className="relative flex aspect-[4/3] w-full flex-col items-center justify-center gap-3 bg-[radial-gradient(70%_80%_at_50%_25%,rgba(72,166,167,0.16),transparent_75%),linear-gradient(160deg,#161A18,#0E1110)]">
                      <div className="dot-grid absolute inset-0 opacity-60" aria-hidden="true" />
                      <span className="absolute left-4 top-4 text-[10px] font-bold uppercase tracking-widest text-ink-faint">
                        Case file
                      </span>
                      <span className="absolute inset-x-8 top-12 h-px bg-[linear-gradient(90deg,transparent,rgba(255,255,255,0.28),transparent)]" />
                      <span
                        className="relative grid h-16 w-16 place-items-center rounded-2xl border border-teal-hi/25 bg-teal/12 text-teal-hi shadow-[inset_0_1px_0_rgba(255,255,255,0.14)]"
                        aria-hidden="true"
                      >
                        <Glyph size={26} strokeWidth={1.7} />
                      </span>
                      <span className="glass-chip relative px-3 py-1 text-[11px] font-bold uppercase tracking-widest text-teal-hi">
                        {n.role}
                      </span>
                      <span className="absolute bottom-3 right-4 text-[9px] font-semibold uppercase tracking-wider text-ink-faint">
                        Built &amp; run by Clanflare
                      </span>
                    </div>
                  </div>
                  <p className="mt-5 text-[12.5px] font-bold uppercase tracking-widest text-teal-hi">
                    {n.role}
                  </p>
                  <p className="mt-2 text-[clamp(21px,2.2vw,26px)] font-bold leading-tight tracking-tight">
                    {n.result.pre}
                    <em className="not-italic text-teal-hi">
                      <CountUp value={n.result.value} decimals={n.result.decimals} />
                      {n.result.unit}
                    </em>
                    {n.result.post}
                  </p>
                  <p className="mt-3 text-sm leading-normal text-ink-dim">
                    <b className="font-semibold text-ink">{n.who}</b> · {n.whoSub}
                  </p>
                </TiltSpotlight>
              </Reveal>
            );
          })}
        </div>

        {/* testimonial blockquote — teal border draws in on view */}
        <Reveal delay={0.1} className="mt-16">
          <figure className="raised relative mx-auto max-w-[760px] p-9 text-center md:p-12">
            <DrawBorder />
            <span
              aria-hidden="true"
              className="glass-chip absolute -top-5 left-1/2 grid h-11 w-11 -translate-x-1/2 place-items-center text-teal-hi"
            >
              <Quote size={18} fill="currentColor" strokeWidth={0} />
            </span>
            <blockquote className="text-[clamp(19px,2.2vw,25px)] font-medium leading-snug tracking-tight">
              “{c.testimonial.q}”
            </blockquote>
            <figcaption className="mt-7 text-[13px] text-ink-faint">
              <span className="font-semibold text-ink">{c.testimonial.name}</span> ·{" "}
              {c.testimonial.role}
            </figcaption>
          </figure>
        </Reveal>
      </div>
    </section>
  );
}
