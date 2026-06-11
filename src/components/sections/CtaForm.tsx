"use client";

import { ArrowRight } from "lucide-react";
import { useActionState } from "react";
import { submitContact, type ContactState } from "@/app/actions";
import Reveal from "@/components/fx/Reveal";
import { copy } from "@/lib/copy";

const initial: ContactState = { status: "idle" };

const inputCls =
  "peer w-full rounded-xl border border-hairline-2 bg-surface px-3.5 pb-2.5 pt-6 text-base text-ink caret-teal-hi placeholder-transparent transition-[border-color,box-shadow] focus:border-teal focus:shadow-[0_0_0_3px_rgba(72,166,167,0.15)] focus:outline-none";

// label floats up on focus / when filled (v12 P2-12)
const labelCls =
  "pointer-events-none absolute left-3.5 top-4 text-[15px] text-ink-faint transition-all duration-150 peer-focus:top-2 peer-focus:text-[11px] peer-focus:font-semibold peer-focus:uppercase peer-focus:tracking-wider peer-focus:text-teal-hi peer-[:not(:placeholder-shown)]:top-2 peer-[:not(:placeholder-shown)]:text-[11px] peer-[:not(:placeholder-shown)]:font-semibold peer-[:not(:placeholder-shown)]:uppercase peer-[:not(:placeholder-shown)]:tracking-wider peer-[:not(:placeholder-shown)]:text-ink-dim";

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="mt-1.5 text-[13px] text-[#e08f8f]">{msg}</p>;
}

export default function CtaForm() {
  const [state, action, pending] = useActionState(submitContact, initial);
  const c = copy.contact;

  return (
    <section
      id="contact"
      aria-labelledby="contact-heading"
      className="band glow-anchor py-28 md:py-[130px] [--glow-x:70%]"
    >
      <div className="relative mx-auto max-w-[1180px] px-6 md:px-10">
        <div className="grid items-start gap-12 md:grid-cols-[1.1fr_1fr] md:gap-20">
          <div>
            <Reveal as="p" className="eyebrow">
              {c.eyebrow}
            </Reveal>
            <Reveal delay={0.08}>
              <h2
                id="contact-heading"
                className="mt-4 max-w-[14ch] text-[clamp(36px,5vw,62px)] font-extrabold leading-[1.02] tracking-[-0.03em]"
              >
                {c.heading}
              </h2>
            </Reveal>
            <Reveal as="p" delay={0.16} className="mt-5 max-w-[40ch] text-lg leading-relaxed text-ink-dim">
              {c.sub}
            </Reveal>
            <Reveal as="p" delay={0.16} className="mt-6 text-[15px] text-ink-dim">
              Or email{" "}
              <a href={`mailto:${c.email}`} className="font-semibold text-teal-hi hover:underline">
                {c.email}
              </a>
            </Reveal>
          </div>

          <Reveal delay={0.08}>
            {state.status === "success" ? (
              <div className="raised flex min-h-[420px] flex-col items-center justify-center p-10 text-center shadow-[var(--shadow-stage)]">
                <span className="flex h-16 w-16 items-center justify-center rounded-full bg-teal shadow-[0_0_30px_rgba(72,166,167,0.45)]">
                  <svg
                    className="check-draw"
                    width="30"
                    height="30"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="#06100F"
                    strokeWidth="2.6"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="M4 12.5 9.5 18 20 6.5" />
                  </svg>
                </span>
                <p className="mt-6 text-xl font-semibold">{c.success}</p>
              </div>
            ) : (
              <form action={action} className="raised p-9 shadow-[var(--shadow-stage)]" noValidate>
                {/* honeypot — hidden from humans, irresistible to bots */}
                <div className="absolute -left-[9999px] h-0 w-0 overflow-hidden" aria-hidden="true">
                  <label htmlFor="f-company">Company</label>
                  <input id="f-company" name="company" type="text" tabIndex={-1} autoComplete="off" />
                </div>

                <div className="relative mb-5">
                  <input
                    id="f-name"
                    name="name"
                    type="text"
                    required
                    placeholder={c.fields.name.label}
                    autoComplete="name"
                    className={inputCls}
                    aria-invalid={!!state.fieldErrors?.name}
                  />
                  <label htmlFor="f-name" className={labelCls}>
                    {c.fields.name.label}
                  </label>
                  <FieldError msg={state.fieldErrors?.name} />
                </div>
                <div className="relative mb-5">
                  <input
                    id="f-email"
                    name="email"
                    type="email"
                    required
                    placeholder={c.fields.email.label}
                    autoComplete="email"
                    className={inputCls}
                    aria-invalid={!!state.fieldErrors?.email}
                  />
                  <label htmlFor="f-email" className={labelCls}>
                    {c.fields.email.label}
                  </label>
                  <FieldError msg={state.fieldErrors?.email} />
                </div>
                <div className="relative mb-6">
                  <textarea
                    id="f-about"
                    name="about"
                    rows={3}
                    required
                    placeholder={c.fields.about.label}
                    className={`${inputCls} resize-none`}
                    aria-invalid={!!state.fieldErrors?.about}
                  />
                  <label htmlFor="f-about" className={labelCls}>
                    {c.fields.about.label}
                  </label>
                  <FieldError msg={state.fieldErrors?.about} />
                </div>

                <button type="submit" className="btn-teal btn-sheen w-full" disabled={pending}>
                  {pending ? "Sending…" : c.submit}
                  <ArrowRight size={17} className="arrow" aria-hidden="true" />
                </button>
                {state.status === "error" && state.message && (
                  <p role="alert" className="mt-3 text-center text-[13px] text-[#e08f8f]">
                    {state.message}
                  </p>
                )}
                <p className="mt-3.5 text-center text-[13px] text-ink-faint">{c.note}</p>
              </form>
            )}
          </Reveal>
        </div>
      </div>
    </section>
  );
}
