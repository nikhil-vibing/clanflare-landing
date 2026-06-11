"use server";

import { z } from "zod";
import { Resend } from "resend";

const schema = z.object({
  name: z.string().trim().min(1, "Tell us your name.").max(200),
  email: z.email("That email doesn't look right."),
  about: z.string().trim().min(1, "A few words is plenty.").max(5000),
  // honeypot — humans never fill this
  company: z.string().max(0).optional().or(z.literal("")),
});

export type ContactState = {
  status: "idle" | "success" | "error";
  message?: string;
  fieldErrors?: Partial<Record<"name" | "email" | "about", string>>;
};

export async function submitContact(
  _prev: ContactState,
  formData: FormData
): Promise<ContactState> {
  const parsed = schema.safeParse({
    name: formData.get("name"),
    email: formData.get("email"),
    about: formData.get("about"),
    company: formData.get("company"),
  });

  if (!parsed.success) {
    // a filled honeypot silently "succeeds" — don't tip off the bot
    if (parsed.error.issues.some((i) => i.path[0] === "company")) {
      return { status: "success" };
    }
    const fieldErrors: ContactState["fieldErrors"] = {};
    for (const issue of parsed.error.issues) {
      const key = issue.path[0] as "name" | "email" | "about";
      if (!fieldErrors[key]) fieldErrors[key] = issue.message;
    }
    return { status: "error", fieldErrors };
  }

  const { name, email, about } = parsed.data;

  try {
    if (process.env.RESEND_API_KEY) {
      const resend = new Resend(process.env.RESEND_API_KEY);
      await resend.emails.send({
        from: process.env.CONTACT_FROM ?? "Clanflare <onboarding@resend.dev>",
        to: process.env.CONTACT_TO ?? "hello@clanflare.com",
        replyTo: email,
        subject: `New inquiry from ${name}`,
        text: `Name: ${name}\nEmail: ${email}\n\nWhat they're building:\n${about}`,
      });
    } else {
      // No RESEND_API_KEY configured yet — log so submissions aren't lost in dev
      console.log("[contact] (Resend not configured)", { name, email, about });
    }
    return { status: "success" };
  } catch (err) {
    console.error("[contact] send failed", err);
    return {
      status: "error",
      message: "Something went wrong sending your message — email us directly instead.",
    };
  }
}
