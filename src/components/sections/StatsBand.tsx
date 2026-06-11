import CountUp from "@/components/fx/CountUp";
import { copy } from "@/lib/copy";

/**
 * Stats band (dopamine moment #3). Real numbers only — and the real
 * final values are server-rendered as static text (v12 P0-1), then
 * enhanced with a count-up on first view. A unit never ships without
 * its value.
 */
export default function StatsBand() {
  return (
    <section
      id="stats"
      aria-label="Results"
      className="holo-band border-y border-hairline-2 bg-[#0A0C0B] py-20 md:py-24"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid gap-x-8 gap-y-12 sm:grid-cols-2 lg:grid-cols-4 lg:gap-0">
          {copy.stats.items.map((s, i) => (
            <div
              key={s.label}
              className={
                i > 0
                  ? "relative lg:before:absolute lg:before:left-0 lg:before:top-[8%] lg:before:h-[84%] lg:before:w-px lg:before:bg-[linear-gradient(180deg,transparent,var(--color-hairline-2),transparent)]"
                  : undefined
              }
            >
              <div className="relative px-7 text-center">
                <div className="inline-flex items-baseline bg-[linear-gradient(180deg,#FFFFFF_0%,#D6E4E3_30%,#8FB8B7_55%,#FFFFFF_78%,#A9C7C6_100%)] bg-clip-text text-[clamp(54px,7vw,92px)] font-black leading-none tracking-[-0.04em] text-transparent">
                  {"prefix" in s && s.prefix && (
                    <span className="text-[0.5em] font-extrabold">{s.prefix}</span>
                  )}
                  <CountUp value={s.value} />
                  {"suffix" in s && s.suffix && (
                    <span className="ml-1 text-[0.42em] font-extrabold text-teal-hi">
                      {s.suffix}
                    </span>
                  )}
                </div>
                <div className="mt-3 text-sm font-semibold uppercase tracking-wide text-ink-dim">
                  {s.label}
                </div>
                <div className="mt-1.5 text-[13.5px] leading-normal text-ink-faint">{s.sub}</div>
              </div>
            </div>
          ))}
        </div>
        <p className="relative mt-10 text-center text-[13px] tracking-wide text-ink-faint">
          {copy.stats.foot}
        </p>
      </div>
    </section>
  );
}
