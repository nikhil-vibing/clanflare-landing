import { Star } from "lucide-react";

/**
 * Above-the-fold trust strip — a rating/metric + a "trusted by" wordmark wall.
 * PLACEHOLDER DATA for the dummy site (swap the brands + numbers for real ones
 * at launch). Real social proof above the fold is the single biggest trust
 * lever a hero can carry (LPA hero benchmark; NN/g credibility).
 */
const BRANDS = ["Northwind", "Lumen", "Vela Club", "Studio Atlas", "Highline", "Orbit"];

export default function TrustedBy() {
  return (
    <div className="mx-auto mt-10 flex max-w-[900px] flex-col items-center gap-x-7 gap-y-4 sm:flex-row sm:justify-center">
      <div className="flex shrink-0 items-center gap-2">
        <span className="flex text-teal-hi" aria-hidden="true">
          {[0, 1, 2, 3, 4].map((i) => (
            <Star key={i} size={15} fill="currentColor" strokeWidth={0} />
          ))}
        </span>
        <span className="text-[13.5px] font-bold text-ink">4.9</span>
        <span className="text-[13px] text-ink-dim">· 120+ communities launched</span>
      </div>

      <span className="hidden h-6 w-px shrink-0 bg-hairline-2 sm:block" aria-hidden="true" />

      <ul className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2.5" aria-label="Trusted by">
        {BRANDS.map((b) => (
          <li
            key={b}
            className="font-display text-[16px] font-bold uppercase tracking-wide text-ink-faint opacity-80"
          >
            {b}
          </li>
        ))}
      </ul>
    </div>
  );
}
