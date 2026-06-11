import { ImageResponse } from "next/og";

export const alt = "Clanflare — Gather your clan. Own your world.";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "80px",
          background:
            "radial-gradient(58% 46% at 50% 20%, rgba(72,166,167,0.25), transparent 70%), #0C0E0D",
          color: "#F4F5F4",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            fontSize: 26,
            fontWeight: 600,
            letterSpacing: "0.08em",
            textTransform: "uppercase",
            color: "#48A6A7",
          }}
        >
          Own your community · Built and run with you
        </div>
        <div
          style={{
            marginTop: 28,
            fontSize: 84,
            fontWeight: 800,
            lineHeight: 1.05,
            letterSpacing: "-0.03em",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <span>Gather your clan.</span>
          <span style={{ color: "#5FC9CA" }}>Own your world.</span>
        </div>
        <div style={{ marginTop: 40, fontSize: 30, color: "#9BA3A0" }}>
          clanflare.com
        </div>
      </div>
    ),
    size
  );
}
