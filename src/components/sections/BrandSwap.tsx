"use client";

import Image from "next/image";
import { useId, useState } from "react";

export type Skin = {
  id: string;
  name: string;
  tag: string;
  url: string;
  accent: string;
  /** resolved screenshot path, or null when the file isn't present */
  src: string | null;
};

/**
 * The category-wedge moment: the SAME app wearing two real brands. Picking a
 * brand repaints the whole device — proof of white-label, not a claim.
 *
 * Both screenshots are stacked and cross-faded by opacity (transform/opacity
 * only; instant under prefers-reduced-motion). With JS off, the first skin
 * renders as a clean static shot — the message survives without interactivity.
 */
export default function BrandSwap({ skins }: { skins: Skin[] }) {
  const [active, setActive] = useState(0);
  const groupId = useId();
  const current = skins[active] ?? skins[0];

  return (
    <div className="mt-12">
      {/* brand picker */}
      <div
        role="radiogroup"
        aria-label="Choose a brand to preview"
        className="flex flex-wrap items-center justify-center gap-3"
      >
        {skins.map((s, i) => {
          const on = i === active;
          return (
            <button
              key={s.id}
              type="button"
              role="radio"
              aria-checked={on}
              id={`${groupId}-${s.id}`}
              onClick={() => setActive(i)}
              className="raised group flex items-center gap-3 rounded-full px-4 py-2.5 text-left transition-[transform,border-color,background] duration-200 ease-out hover:-translate-y-0.5 focus-visible:-translate-y-0.5"
              style={
                on
                  ? {
                      borderColor: `${s.accent}66`,
                      background: `${s.accent}1f`,
                      boxShadow: `0 0 0 1px ${s.accent}55, var(--shadow-raise)`,
                    }
                  : undefined
              }
            >
              <span
                className="h-5 w-5 shrink-0 rounded-full transition-transform duration-200 ease-out group-hover:scale-110"
                style={{
                  background: `linear-gradient(135deg, ${s.accent}, ${s.accent}99)`,
                  boxShadow: on ? `0 0 12px ${s.accent}` : "none",
                }}
                aria-hidden="true"
              />
              <span className="leading-tight">
                <span className="block text-[14px] font-bold tracking-tight text-ink">
                  {s.name}
                </span>
                <span className="block text-[10.5px] font-medium uppercase tracking-wider text-ink-faint">
                  {s.tag}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {/* device — browser chrome with both skins stacked, cross-faded */}
      <div className="mx-auto mt-9 max-w-[920px]">
        <div className="glass-device overflow-hidden rounded-2xl shadow-[var(--shadow-stage),0_60px_120px_-40px_rgba(72,166,167,0.24)]">
          <div
            className="flex h-11 items-center gap-2 border-b border-hairline bg-white/45 px-4"
            aria-hidden="true"
          >
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
            <span className="h-2.5 w-2.5 rounded-full bg-hairline-2" />
            <span className="ml-3 flex h-6 max-w-[380px] flex-1 items-center rounded-md border border-hairline bg-white/5 px-3 text-[11.5px] tracking-wide text-ink-faint">
              {current.url}/community
            </span>
            <span
              className="ml-auto inline-flex items-center gap-1.5 text-[11px] font-semibold uppercase tracking-wider transition-colors duration-300"
              style={{ color: current.accent }}
            >
              <i
                className="h-[7px] w-[7px] rounded-full transition-colors duration-300"
                style={{ background: current.accent, boxShadow: `0 0 10px ${current.accent}` }}
              />
              live
            </span>
          </div>

          <div className="relative aspect-[16/10] w-full">
            {skins.map((s, i) =>
              s.src ? (
                <Image
                  key={s.id}
                  src={s.src}
                  alt={`The same community app, branded as ${s.name}`}
                  fill
                  sizes="(min-width: 768px) 920px, 100vw"
                  className={`object-cover object-top transition-opacity duration-500 ease-out motion-reduce:transition-none ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                  aria-hidden={i === active ? undefined : true}
                />
              ) : (
                // graceful fallback if the file is missing — a tinted panel
                <div
                  key={s.id}
                  className={`absolute inset-0 grid place-items-center transition-opacity duration-500 motion-reduce:transition-none ${
                    i === active ? "opacity-100" : "opacity-0"
                  }`}
                  style={{
                    background: `radial-gradient(70% 80% at 50% 30%, ${s.accent}22, transparent 70%), #0a0d0c`,
                  }}
                >
                  <span className="text-sm font-bold" style={{ color: s.accent }}>
                    {s.name}
                  </span>
                </div>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
