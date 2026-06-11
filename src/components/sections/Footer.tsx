import { copy } from "@/lib/copy";

export default function Footer() {
  return (
    <footer className="border-t border-hairline bg-surface px-6 pb-10 pt-16 md:px-10">
      <div className="mx-auto max-w-[1180px]">
        <div className="flex flex-wrap items-start justify-between gap-11">
          <div>
            <a href="#top" className="flex items-center gap-3" aria-label="Clanflare home">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/assets/clanflare-mark.png" alt="" className="h-[26px] w-auto" />
              <span className="text-lg font-bold tracking-tight">Clanflare</span>
            </a>
            <p className="mt-3.5 max-w-[36ch] text-[15px] leading-relaxed text-ink-dim">
              {copy.footer.line}
            </p>
          </div>
          <nav className="flex gap-7" aria-label="Footer">
            {copy.nav.links.map((l) => (
              <a
                key={l.href}
                href={l.href}
                className="text-[15px] text-ink-dim transition-colors hover:text-ink"
              >
                {l.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="mt-14 flex flex-col justify-between gap-2.5 border-t border-hairline pt-6 md:flex-row md:items-center">
          <span className="text-[13px] text-ink-faint">{copy.footer.copyright}</span>
          <a
            href={`mailto:${copy.contact.email}`}
            className="text-[13px] text-ink-faint transition-colors hover:text-ink"
          >
            {copy.contact.email}
          </a>
        </div>
      </div>
    </footer>
  );
}
