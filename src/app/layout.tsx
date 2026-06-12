import type { Metadata, Viewport } from "next";
import localFont from "next/font/local";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import CursorFlag from "@/components/fx/CursorFlag";
import Grain from "@/components/fx/Grain";
import MobileCta from "@/components/sections/MobileCta";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { copy } from "@/lib/copy";
import "./globals.css";

// v19 type system — the modern premium Fontshare pairing (self-hosted):
// Satoshi (body) + Clash Display (headlines). Confident, contemporary, warm —
// matches the "gather the clan / own your world" vibe, no serif, no Inter.
const satoshi = localFont({
  src: [
    { path: "./fonts/satoshi-400.woff2", weight: "400", style: "normal" },
    { path: "./fonts/satoshi-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/satoshi-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-satoshi",
  display: "swap",
});

const clash = localFont({
  src: [
    { path: "./fonts/clash-display-500.woff2", weight: "500", style: "normal" },
    { path: "./fonts/clash-display-600.woff2", weight: "600", style: "normal" },
    { path: "./fonts/clash-display-700.woff2", weight: "700", style: "normal" },
  ],
  variable: "--font-clash",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://clanflare.com"),
  title: copy.meta.title,
  description: copy.meta.description,
};

// Explicit viewport: device-width + initial-scale=1 opts into the ideal
// viewport (so media queries measure real device width); viewport-fit=cover
// extends under notches/safe areas (paired with env(safe-area-inset-*) on the
// fixed nav). Zoom is left enabled — never disable user-scalable (WCAG).
export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  colorScheme: "light",
  themeColor: "#F4F1EB",
};

const orgJsonLd = {
  "@context": "https://schema.org",
  "@type": "Organization",
  name: "Clanflare",
  description: copy.meta.description,
  email: copy.contact.email,
  url: "https://clanflare.com",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${satoshi.variable} ${clash.variable}`}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <Grain />
        <CursorFlag />
        <MobileCta />
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(orgJsonLd) }}
        />
        <Analytics />
        <SpeedInsights />
      </body>
    </html>
  );
}
