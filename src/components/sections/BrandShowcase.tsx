import MaskReveal from "@/components/fx/MaskReveal";
import Parallax from "@/components/fx/Parallax";
import Reveal from "@/components/fx/Reveal";
import { copy } from "@/lib/copy";
import { getScreenshots, type ScreenshotKey } from "@/lib/screenshots";
import BrandSwap, { type Skin } from "./BrandSwap";

/**
 * White-label is Clanflare's category wedge (white-label-first, vs Circle/Skool
 * bolting branding on). The research is unanimous: a wedge earns a dedicated,
 * interactive section, not a grid tile. This is that section — the same app in
 * two real brands, with a live brand-swap (BrandSwap, client).
 *
 * Server component: resolves the real screenshots (node:fs) and passes paths
 * down so the client toggle stays a thin interactive shell.
 */
export default function BrandShowcase() {
  const c = copy.brand;
  const shots = getScreenshots();
  const skins: Skin[] = c.skins.map((s) => ({
    id: s.id,
    name: s.name,
    tag: s.tag,
    url: s.url,
    accent: s.accent,
    src: shots[s.shot as ScreenshotKey],
  }));

  return (
    <section
      id="brand"
      aria-labelledby="brand-heading"
      className="band glow-anchor py-24 md:py-[120px] [--glow-x:72%]"
    >
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="mx-auto max-w-[720px] text-center">
          <Reveal as="p" className="eyebrow">
            {c.eyebrow}
          </Reveal>
          <MaskReveal as="h2" id="brand-heading" className="text-section mt-4">
            {c.heading}
          </MaskReveal>
          <Reveal as="p" delay={0.16} className="mx-auto mt-5 max-w-[54ch] text-[19px] leading-relaxed text-ink-dim">
            {c.body}
          </Reveal>
          <Reveal as="p" delay={0.22} className="mt-4 text-[13px] font-semibold uppercase tracking-wider text-teal-hi">
            {c.hint}
          </Reveal>
        </div>

        <Reveal delay={0.1}>
          <Parallax amount={6}>
            <BrandSwap skins={skins} />
          </Parallax>
        </Reveal>

        <Reveal as="p" delay={0.1} className="mt-10 text-center text-lg font-medium text-ink-dim">
          {c.caption}
        </Reveal>
      </div>
    </section>
  );
}
