"use client";

import * as Dialog from "@radix-ui/react-dialog";
import { Play, X } from "lucide-react";
import { AppMock } from "@/components/fx/mocks";
import { copy } from "@/lib/copy";

/**
 * 30-second tour behind a click (v11 §3.2) — zero hero weight. Radix
 * mounts the content only when opened. The Arcade/Storylane embed URL is
 * still pending (asset checklist); swap the mock block for the iframe
 * when it exists.
 */
export default function TourDialog({ screenshot }: { screenshot?: string | null }) {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild>
        <button type="button" className="btn-ghost">
          <span className="flex h-[22px] w-[22px] items-center justify-center rounded-full bg-teal-hi/15">
            <Play size={11} className="ml-px fill-teal-hi text-teal-hi" />
          </span>
          {copy.hero.ctaSecondary}
        </button>
      </Dialog.Trigger>
      <Dialog.Portal>
        <Dialog.Overlay className="fixed inset-0 z-[190] bg-[rgba(5,7,6,0.78)] backdrop-blur-md" />
        <Dialog.Content
          className="glass-device fixed left-1/2 top-1/2 z-[200] w-[min(980px,calc(100vw-40px))] -translate-x-1/2 -translate-y-1/2 overflow-hidden rounded-2xl shadow-[var(--shadow-stage)]"
          aria-describedby={undefined}
        >
          <div className="flex items-center justify-between border-b border-hairline px-5 py-4">
            <Dialog.Title className="text-sm font-semibold">
              Clanflare — <span className="text-teal-hi">30-second tour</span>
            </Dialog.Title>
            <Dialog.Close asChild>
              <button
                type="button"
                aria-label="Close tour"
                className="glass-chip flex h-11 w-11 items-center justify-center text-ink-dim transition-colors hover:text-ink"
              >
                <X size={18} />
              </button>
            </Dialog.Close>
          </div>
          {/* Designed stand-in until the Arcade/Storylane embed URL exists —
              replace this block with the lazy iframe when it does */}
          <div className="relative">
            <AppMock screenshot={screenshot} />
            <div className="absolute inset-0 flex items-center justify-center bg-[rgba(5,7,6,0.45)]">
              <span className="flex items-center gap-3 rounded-full border border-teal-hi/30 bg-[rgba(12,14,13,0.8)] px-6 py-3 text-sm font-semibold text-teal-hi backdrop-blur-sm">
                <Play size={15} className="fill-teal-hi" />
                Guided tour coming soon — email us for a live walkthrough
              </span>
            </div>
          </div>
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
}
