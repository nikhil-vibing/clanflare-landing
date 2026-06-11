"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Menu, X } from "lucide-react";
import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";

export default function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-[90] border-b pt-[env(safe-area-inset-top)] transition-colors duration-300 ${
        scrolled
          ? "border-hairline-2 bg-base/70 backdrop-blur-xl"
          : "border-transparent"
      }`}
    >
      <div className="mx-auto max-w-[1180px] px-6 md:px-10">
        <nav className="flex h-[72px] items-center justify-between" aria-label="Main">
          <a href="#top" className="flex items-center gap-3" aria-label="Clanflare home">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src="/assets/clanflare-mark.png" alt="" className="h-[26px] w-auto" />
            <span className="text-lg font-bold tracking-tight">Clanflare</span>
          </a>
          <div className="flex items-center gap-8">
            <div className="hidden items-center gap-7 md:flex">
              {copy.nav.links.map((l) => (
                <a
                  key={l.href}
                  href={l.href}
                  className="nav-link text-[14.5px] font-medium text-ink-dim transition-colors hover:text-ink"
                >
                  {l.label}
                </a>
              ))}
            </div>
            <a href="#contact" className="btn-teal !h-[42px] !px-5 text-sm max-md:hidden">
              {copy.nav.cta}
            </a>

            {/* Mobile sheet menu — 44px target */}
            <Dialog.Root open={open} onOpenChange={setOpen}>
              <Dialog.Trigger asChild>
                <button
                  type="button"
                  aria-label="Open menu"
                  className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline-2 text-ink md:hidden"
                >
                  <Menu size={20} />
                </button>
              </Dialog.Trigger>
              <Dialog.Portal>
                <Dialog.Overlay className="fixed inset-0 z-[190] bg-black/70 backdrop-blur-sm" />
                <Dialog.Content
                  className="fixed inset-y-0 right-0 z-[200] w-[78vw] max-w-sm border-l border-hairline bg-surface p-7"
                  aria-describedby={undefined}
                >
                  <div className="flex items-center justify-between">
                    <Dialog.Title className="text-base font-bold">Clanflare</Dialog.Title>
                    <Dialog.Close asChild>
                      <button
                        type="button"
                        aria-label="Close menu"
                        className="flex h-11 w-11 items-center justify-center rounded-xl border border-hairline-2 text-ink-dim"
                      >
                        <X size={20} />
                      </button>
                    </Dialog.Close>
                  </div>
                  <div className="mt-8 flex flex-col gap-2">
                    {copy.nav.links.map((l) => (
                      <a
                        key={l.href}
                        href={l.href}
                        onClick={() => setOpen(false)}
                        className="flex h-11 items-center rounded-lg px-3 text-[17px] font-medium text-ink-dim hover:bg-card hover:text-ink"
                      >
                        {l.label}
                      </a>
                    ))}
                    <a
                      href="#contact"
                      onClick={() => setOpen(false)}
                      className="btn-teal mt-4"
                    >
                      {copy.nav.cta}
                    </a>
                  </div>
                </Dialog.Content>
              </Dialog.Portal>
            </Dialog.Root>
          </div>
        </nav>
      </div>
    </header>
  );
}
