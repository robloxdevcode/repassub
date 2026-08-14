import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

export function buildOgImage(title?: string, subtitle?: string) {
  const headline = title ?? "Linklock";
  const tagline =
    subtitle ?? "Free subscribe-to-download links for creators";

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          background: "#f03e3e",
          padding: "64px",
          fontFamily: "system-ui, sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "16px",
          }}
        >
          <div
            style={{
              width: "72px",
              height: "72px",
              background: "#ffffff",
              borderRadius: "16px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 900,
              color: "#f03e3e",
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 800,
              color: "#ffffff",
              letterSpacing: "-0.02em",
            }}
          >
            Linklock
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: headline.length > 40 ? "52px" : "64px",
              fontWeight: 800,
              color: "#ffffff",
              lineHeight: 1.05,
              maxWidth: "900px",
            }}
          >
            {headline}
          </div>
          <div
            style={{
              fontSize: "28px",
              fontWeight: 500,
              color: "rgba(255,255,255,0.85)",
              maxWidth: "800px",
            }}
          >
            {tagline}
          </div>
        </div>

        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
          }}
        >
          <span style={{ fontSize: "22px", fontWeight: 600, color: "rgba(255,255,255,0.9)" }}>
            linklock.org
          </span>
          <div
            style={{
              background: "#ffffff",
              color: "#f03e3e",
              padding: "12px 24px",
              fontSize: "20px",
              fontWeight: 700,
              borderRadius: "12px",
            }}
          >
            Start free
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
