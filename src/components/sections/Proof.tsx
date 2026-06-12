import { ArrowRight, Quote, Star } from "lucide-react";
import CountUp from "@/components/fx/CountUp";
import DrawBorder from "@/components/fx/DrawBorder";
import { HumanAvatar } from "@/components/fx/mocks";
import MaskReveal from "@/components/fx/MaskReveal";
import Reveal from "@/components/fx/Reveal";
import TiltSpotlight from "@/components/fx/TiltSpotlight";
import { copy } from "@/lib/copy";

function Stars() {
  return (
    <div className="flex items-center gap-0.5 text-teal-hi" aria-hidden="true">
      {[0, 1, 2, 3, 4].map((s) => (
        <Star key={s} size={15} fill="currentColor" strokeWidth={0} />
      ))}
    </div>
  );
}

/**
 * Proof — warm light testimonial cards: a star rating, the falsifiable result
 * as the quote, and a real human face + name + niche. (Faces are placeholder
 * stock portraits on this dummy site; swap for cleared customer photos at
 * launch.) Replaces the old dark, sparse "case file" cards.
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
        <MaskReveal as="h2" id="proof-heading" className="text-section mt-4 max-w-[20ch]">
          {c.heading}
        </MaskReveal>
        <Reveal as="p" delay={0.16} className="mt-4 max-w-[54ch] text-lg text-ink-dim">
          {c.sub}
        </Reveal>

        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {c.niches.map((n, i) => (
            <Reveal key={n.role} delay={i * 0.08}>
              <TiltSpotlight
                tilt={0}
                className="raised group flex h-full flex-col p-6 transition-[transform,border-color,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:border-white/[0.14] hover:shadow-[var(--shadow-raise-lg)]"
              >
                <div className="flex items-center justify-between">
                  <Stars />
                  <span className="text-[10.5px] font-bold uppercase tracking-widest text-ink-faint">
                    {n.role}
                  </span>
                </div>

                <p className="mt-5 text-[clamp(18px,1.95vw,22px)] font-semibold leading-snug tracking-tight text-ink">
                  &ldquo;{n.result.pre}
                  <em className="not-italic text-teal-hi">
                    <CountUp value={n.result.value} decimals={n.result.decimals} />
                    {n.result.unit}
                  </em>
                  {n.result.post}&rdquo;
                </p>

                <div className="mt-auto flex items-center gap-3 pt-7">
                  <HumanAvatar index={i} className="h-12 w-12 ring-2 ring-white/70" />
                  <div className="min-w-0">
                    <p className="text-[14.5px] font-semibold text-ink">{n.who}</p>
                    <p className="truncate text-[12.5px] text-ink-faint">{n.whoSub}</p>
                  </div>
                </div>
              </TiltSpotlight>
            </Reveal>
          ))}
        </div>

        {/* featured testimonial — teal border draws in on view */}
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
              &ldquo;{c.testimonial.q}&rdquo;
            </blockquote>
            <figcaption className="mt-7 flex items-center justify-center gap-3">
              <HumanAvatar index={4} className="h-11 w-11 ring-2 ring-white/70" />
              <div className="text-left">
                <p className="text-[14px] font-semibold text-ink">{c.testimonial.name}</p>
                <p className="text-[12.5px] text-ink-faint">{c.testimonial.role}</p>
              </div>
            </figcaption>
          </figure>
        </Reveal>

        {/* proof sits at peak intent — give it an adjacent action (behavioral P0) */}
        <Reveal delay={0.1} className="mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
          <a href="#contact" className="btn-teal btn-sheen">
            Start your brief
            <ArrowRight size={17} className="arrow" aria-hidden="true" />
          </a>
          <span className="text-[13.5px] text-ink-dim">Live on web + mobile in about 2 weeks.</span>
        </Reveal>
      </div>
    </section>
  );
}
