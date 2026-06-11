import type { Metadata, Viewport } from "next";
import { Inter } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import Grain from "@/components/fx/Grain";
import SmoothScroll from "@/components/providers/SmoothScroll";
import { copy } from "@/lib/copy";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
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
  colorScheme: "dark",
  themeColor: "#0c0e0d",
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
    <html lang="en" className={inter.variable}>
      <body>
        <a href="#main" className="skip-link">
          Skip to content
        </a>
        <SmoothScroll>{children}</SmoothScroll>
        <Grain />
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
