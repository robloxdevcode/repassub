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
          background: "#ff0040",
          border: "12px solid #0a0a0a",
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
              background: "#ffd600",
              border: "4px solid #0a0a0a",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "36px",
              fontWeight: 900,
            }}
          >
            L
          </div>
          <span
            style={{
              fontSize: "48px",
              fontWeight: 900,
              color: "#ffd600",
              letterSpacing: "-0.02em",
            }}
          >
            LINKLOCK
          </span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
          <div
            style={{
              fontSize: headline.length > 40 ? "52px" : "64px",
              fontWeight: 900,
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
              fontWeight: 600,
              color: "#ffd600",
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
          <span style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff" }}>
            linklock.org
          </span>
          <div
            style={{
              background: "#ffd600",
              color: "#0a0a0a",
              padding: "12px 24px",
              fontSize: "20px",
              fontWeight: 800,
              border: "4px solid #0a0a0a",
            }}
          >
            START FREE
          </div>
        </div>
      </div>
    ),
    OG_SIZE
  );
}
