import { ArrowRight, Play } from "lucide-react";
import GlowBg from "@/components/fx/GlowBg";
import Magnetic from "@/components/fx/Magnetic";
import { AppMock, HumanAvatar, PhoneMock } from "@/components/fx/mocks";
import Reveal from "@/components/fx/Reveal";
import ShaderBg from "@/components/fx/ShaderBg";
import TiltSpotlight from "@/components/fx/TiltSpotlight";
import { copy } from "@/lib/copy";
import { getScreenshots } from "@/lib/screenshots";
import CredibilityBar from "./CredibilityBar";
import Float from "./Float";
import HeroHeadline from "./HeroHeadline";
import TrustedBy from "./TrustedBy";

export default function Hero() {
  const c = copy.hero;
  const shots = getScreenshots();
  return (
    <section
      id="top"
      aria-labelledby="hero-heading"
      className="relative overflow-hidden pb-20 pt-[100px] md:pt-[116px] lg:pb-14"
    >
      <ShaderBg />
      <GlowBg position="44% 20%" size="58% 46%" />
      {/* product "stage" — a strong focal teal glow the mockups sit on, so they
          read placed/lit, not pasted on a flat page (cool-direction fix) */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute right-[-10%] top-[8%] hidden h-[52rem] w-[52rem] rounded-full bg-[radial-gradient(closest-side,rgba(127,168,163,0.46),rgba(243,236,221,0.22)_50%,transparent)] blur-[90px] lg:block"
      />
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid items-center gap-8 lg:grid-cols-[1.08fr_0.92fr]">
          <div className="max-w-[760px] text-left">
            <span id="hero-heading" className="sr-only">
              Gather your clan. Own your world.
            </span>
            {/* clarity kicker — the 5-second test the slogan H1 alone misses */}
            <Reveal as="p" className="mb-6">
              <span className="caption inline-flex items-center gap-2 rounded-full border border-hairline bg-surface/70 px-3.5 py-1.5 text-teal-hi backdrop-blur-sm">
                <span className="h-1.5 w-1.5 rounded-full bg-teal" />
                Own a branded app · web · iOS · Android
              </span>
            </Reveal>
            <HeroHeadline />
            <Reveal as="p" delay={0.1} className="mt-8 max-w-[54ch] text-[19px] leading-relaxed text-ink-dim">
              Your people, your content, your data — on your own branded app,
              not rented from an algorithm that can bury you overnight.{" "}
              <strong className="font-semibold text-ink">
                Clanflare builds it, runs it with you, and hands you the keys.
              </strong>
            </Reveal>
            <Reveal delay={0.2} className="mt-8 flex flex-wrap items-center gap-3.5">
              <Magnetic strength={0.4}>
                <a href="#contact" className="btn-teal btn-sheen">
                  {c.ctaPrimary}
                  <ArrowRight size={17} className="arrow" aria-hidden="true" />
                </a>
              </Magnetic>
              <a href="#product" className="btn-ghost">
                <Play size={14} fill="currentColor" strokeWidth={0} aria-hidden="true" />
                See it in action
              </a>
            </Reveal>
            <Reveal as="p" delay={0.3} className="mt-4 text-[13.5px] text-ink-dim">
              15-min call · no commitment · the app, data &amp; audience leave with you.
            </Reveal>
          </div>

          {/* layered device composition — swap mocks for real screenshots
              (next/image priority = the LCP) when they're captured */}
          <Reveal delay={0.25} className="relative flex flex-col items-center lg:block lg:min-w-0">
            {/* floating proof cards breaking the frame — premium depth +
                "your members, your revenue" wordlessly (research §d/§f) */}
            <div className="pointer-events-none absolute -left-10 -top-3 z-[5] hidden animate-floaty xl:block">
              <div className="glass-panel flex items-center gap-2.5 rounded-2xl px-3.5 py-2.5 shadow-[var(--shadow-raise-lg)]">
                <HumanAvatar index={4} className="h-8 w-8" />
                <div className="leading-tight">
                  <p className="text-[12px] font-bold text-ink">Priya joined</p>
                  <p className="text-[10px] text-ink-faint">New member · just now</p>
                </div>
              </div>
            </div>
            {/* one "payout" stat card parked in the LEFT margin, clear of the
                dashboard data (research: callouts never cover the product UI) */}
            <div className="pointer-events-none absolute -left-7 bottom-12 z-[5] hidden xl:block" style={{ animation: "floaty 7s ease-in-out 1.5s infinite" }}>
              <div className="glass-panel rounded-2xl px-4 py-3 shadow-[var(--shadow-raise-lg)]">
                <p className="caption text-teal-hi">payout · 100% yours</p>
                <p className="font-display text-[20px] font-black tabular-nums text-ink">+$2,480</p>
              </div>
            </div>
            <Float className="relative w-[min(760px,100%)] lg:w-[1000px] lg:max-w-none">
              <TiltSpotlight spotlight tilt={0} className="glass-device overflow-hidden rounded-2xl shadow-[var(--shadow-stage),0_60px_120px_-46px_rgba(40,67,63,0.34)]">
                <div className="flex h-11 items-center gap-2 border-b border-hairline bg-white/45 px-4" aria-hidden="true">
                  <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                  <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                  <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
                  <span className="ml-3 flex h-6 max-w-[380px] flex-1 items-center rounded-md border border-hairline bg-white/45 px-3 text-[11.5px] tracking-wide text-ink-faint">
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
            <Float delay={1.3} className="relative z-[2] -mt-12 w-[206px] lg:absolute lg:bottom-[-18px] lg:right-1 lg:mt-0 lg:w-[224px]">
              <div className="glass-device rounded-[28px] p-2.5 shadow-[var(--shadow-stage),0_40px_70px_-34px_rgba(40,67,63,0.28)]">
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
        </div>

        <CredibilityBar />
        <TrustedBy />

        {/* one founder quote with a real face (trust) */}
        <Reveal delay={0.1} className="mt-14 flex items-center gap-4 lg:max-w-[600px]">
          <HumanAvatar index={2} className="h-12 w-12 ring-2 ring-white/60" priority />
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
