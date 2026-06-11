import { ArrowRight } from "lucide-react";
import GlowBg from "@/components/fx/GlowBg";
import Magnetic from "@/components/fx/Magnetic";
import { AppMock, InitialsAvatar, PhoneMock } from "@/components/fx/mocks";
import Reveal from "@/components/fx/Reveal";
import ShaderBg from "@/components/fx/ShaderBg";
import TiltSpotlight from "@/components/fx/TiltSpotlight";
import { copy } from "@/lib/copy";
import { getScreenshots } from "@/lib/screenshots";
import CredibilityBar from "./CredibilityBar";
import Float from "./Float";
import HeroHeadline from "./HeroHeadline";
import TourDialog from "./TourDialog";

export default function Hero() {
  const c = copy.hero;
  const shots = getScreenshots();
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-24 pt-[132px] md:pt-[172px]"
    >
      <ShaderBg />
      <GlowBg position="50% 26%" size="58% 46%" />
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="mx-auto max-w-[900px] text-center">
          <p className="eyebrow tracking-[0.2em]">{c.eyebrow}</p>
          <span id="hero-heading" className="sr-only">
            Gather your clan. Own your world.
          </span>
          <HeroHeadline />
          <Reveal as="p" delay={0.1} className="mx-auto mt-7 max-w-[62ch] text-[19.5px] leading-relaxed text-ink-dim">
            Your people, your content, your data — on your own branded app,
            not rented from an algorithm that can bury you overnight.{" "}
            <strong className="font-semibold text-ink">
              Clanflare builds it, runs it with you, and hands you the keys.
            </strong>
          </Reveal>
          <Reveal delay={0.2} className="mt-10 flex flex-wrap items-center justify-center gap-3.5">
            <Magnetic strength={0.4}>
              <a href="#contact" className="btn-teal btn-sheen">
                {c.ctaPrimary}
                <ArrowRight size={17} className="arrow" aria-hidden="true" />
              </a>
            </Magnetic>
            <TourDialog screenshot={shots.appDesktop} />
          </Reveal>

          <CredibilityBar />
        </div>

        {/* layered device composition — swap mocks for real screenshots
            (next/image priority = the LCP) when they're captured */}
        <Reveal delay={0.25} className="relative mt-20 flex flex-col items-center justify-center lg:flex-row lg:items-end">
          <Float className="relative w-[min(900px,100%)]">
            <TiltSpotlight spotlight tilt={0} className="glass-device overflow-hidden rounded-2xl shadow-[var(--shadow-stage),0_60px_120px_-40px_rgba(72,166,167,0.28)]">
              <div className="flex h-11 items-center gap-2 border-b border-hairline bg-[rgba(8,10,9,0.4)] px-4" aria-hidden="true">
                <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                <span className="ml-3 flex h-6 max-w-[380px] flex-1 items-center rounded-md border border-hairline bg-white/5 px-3 text-[11.5px] tracking-wide text-ink-faint">
                  {c.url}
                </span>
                <span className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider text-teal-hi">
                  <i className="h-[7px] w-[7px] animate-breathe rounded-full bg-teal shadow-[0_0_10px_var(--color-teal)]" />
                  live
                </span>
              </div>
              <AppMock screenshot={shots.appDesktop} priority />
            </TiltSpotlight>
          </Float>
          <Float delay={1.3} className="relative z-[2] -mt-12 w-[208px] lg:-mb-6 lg:-ml-10 lg:mt-0">
            <div className="glass-device rounded-[32px] p-2.5 shadow-[var(--shadow-stage),0_40px_70px_-28px_rgba(72,166,167,0.25)]">
              <PhoneMock screenshot={shots.appPhone} />
            </div>
            <div
              className="glass-chip absolute -bottom-4 left-1/2 z-[3] flex -translate-x-1/2 items-center gap-2 whitespace-nowrap px-4 py-2 text-[12.5px] font-semibold text-ink-dim shadow-[var(--shadow-raise-lg)]"
              aria-hidden="true"
            >
              {c.badge.map((b, i) => (
                <span key={b} className="flex items-center gap-2">
                  {i > 0 && <span>·</span>}
                  <b className="font-bold text-teal-hi">{b}</b>
                </span>
              ))}
            </div>
          </Float>
        </Reveal>

        {/* one founder quote, small */}
        <Reveal delay={0.1} className="mt-16 flex items-center justify-center gap-4">
          <InitialsAvatar name={c.founderQuote.name} tone={0} />
          <div className="max-w-[52ch] text-left">
            <p className="text-[15px] leading-snug text-ink-dim">“{c.founderQuote.q}”</p>
            <p className="mt-1 text-[12.5px] font-medium text-ink-faint">
              {c.founderQuote.name} · {c.founderQuote.role}
            </p>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
