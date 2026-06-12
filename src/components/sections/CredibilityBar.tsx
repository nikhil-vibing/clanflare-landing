import { Fragment } from "react";
import PlatformLogo, {
  PLATFORM_ORDER,
  platformLabel,
} from "@/components/brand/PlatformLogo";
import Reveal from "@/components/fx/Reveal";
import { copy } from "@/lib/copy";

/**
 * Above-the-fold credibility strip (v14 §4 — YC: proof under the hero lifts the
 * CTA ~20-43%). Left: the rented platforms members are imported FROM (real
 * marks, association > volume). Right: three real, falsifiable proof points.
 * No invented metrics. Logos sit in glass chips; effects stay on the chip.
 */
export default function CredibilityBar() {
  const c = copy.credibility;
  return (
    <Reveal delay={0.28} className="mx-auto mt-12 max-w-[800px]">
      <div className="glass-panel flex flex-col items-center justify-center gap-x-7 gap-y-4 rounded-2xl px-6 py-4 sm:flex-row md:px-8">
        {/* left cluster — label + the platforms you import FROM, one tight row */}
        <div className="flex items-center gap-3">
          <span className="max-w-[8.5ch] text-[10.5px] font-semibold uppercase leading-tight tracking-wider text-ink-faint">
            {c.label}
          </span>
          <ul className="flex flex-nowrap items-center gap-1.5" aria-label="Platforms you can import from">
            {PLATFORM_ORDER.map((p) => {
              // TikTok + X are white-on-transparent marks → invisible on the
              // light chip. Render those two dark; keep the rest full-colour.
              const mono = p === "tiktok" || p === "x";
              return (
                <li
                  key={p}
                  className="glass-chip flex h-7 w-7 items-center justify-center text-ink transition-transform duration-200 hover:-translate-y-0.5"
                >
                  <PlatformLogo
                    platform={p}
                    title={platformLabel(p)}
                    monochrome={mono}
                    className="relative h-3 w-3"
                  />
                </li>
              );
            })}
          </ul>
        </div>

        <div className="hidden h-9 w-px shrink-0 bg-hairline-2 sm:block" aria-hidden="true" />

        {/* right cluster — three real proof points, one row, hairline-separated */}
        {/* a11y: a <dl> may only directly contain dt/dd or <div> groups — so the
            separators are <div>s and each metric is one <div> wrapping dt+dd. */}
        <dl className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 sm:flex-nowrap sm:gap-x-5">
          {c.proof.map((m, i) => (
            <Fragment key={m.l}>
              {i > 0 && (
                <div className="hidden h-7 w-px shrink-0 bg-hairline-2 sm:block" aria-hidden="true" />
              )}
              <div className="text-center">
                <dt className="whitespace-nowrap text-[14px] font-black leading-none tracking-normal text-teal-hi">
                  {m.v}
                </dt>
                <dd className="mt-1 whitespace-nowrap text-[10px] font-semibold uppercase tracking-wider text-ink-faint">
                  {m.l}
                </dd>
              </div>
            </Fragment>
          ))}
        </dl>
      </div>
    </Reveal>
  );
}
