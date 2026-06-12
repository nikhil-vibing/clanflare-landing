"use client";

import { ArrowRight } from "lucide-react";
import { useEffect, useState } from "react";
import { copy } from "@/lib/copy";

/**
 * Mobile sticky CTA bar (behavioral audit P0). The nav's "Get in touch" is
 * hidden below md, so a phone visitor had no persistent conversion path between
 * the hero and the bottom form. This appears once they scroll past the hero and
 * hides itself when the contact form is on screen (so it never doubles up).
 */
export default function MobileCta() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      const pastHero = window.scrollY > window.innerHeight * 0.85;
      const contact = document.getElementById("contact");
      const atContact = contact
        ? contact.getBoundingClientRect().top < window.innerHeight * 0.9
        : false;
      setShow(pastHero && !atContact);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      aria-hidden={!show}
      className={`fixed inset-x-0 bottom-0 z-[150] border-t border-hairline bg-surface/90 px-4 pb-[max(0.7rem,env(safe-area-inset-bottom))] pt-3 backdrop-blur-xl transition-transform duration-300 ease-out md:hidden ${
        show ? "translate-y-0" : "pointer-events-none translate-y-full"
      }`}
    >
      <a
        href="#contact"
        className="btn-teal btn-sheen w-full"
        tabIndex={show ? 0 : -1}
      >
        {copy.nav.cta}
        <ArrowRight size={17} className="arrow" aria-hidden="true" />
      </a>
      <p className="mt-1.5 text-center text-[11.5px] text-ink-faint">
        15-min call · no commitment · no lock-in
      </p>
    </div>
  );
}
