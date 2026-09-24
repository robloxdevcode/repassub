import { ImageResponse } from "next/og";

export const OG_SIZE = { width: 1200, height: 630 };

const DOT = "#ffe566";
const INK = "#0a0a0a";

function OgFourDotMark({ box = 72 }: { box?: number }) {
  const unit = Math.round(box * 0.22);
  const gap = Math.round(unit * 0.35);
  const arm = unit + gap;

  return (
    <div
      style={{
        width: box,
        height: box,
        background: "#faf8f5",
        border: `3px solid ${INK}`,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        boxShadow: "4px 4px 0 rgba(0,0,0,0.25)",
      }}
    >
      <div style={{ position: "relative", width: arm * 2 + unit, height: arm * 2 + unit }}>
        {[
          { left: arm, top: 0 },
          { left: 0, top: arm },
          { left: arm * 2, top: arm },
          { left: arm, top: arm * 2 },
        ].map((pos, i) => (
          <div
            key={i}
            style={{
              position: "absolute",
              left: pos.left,
              top: pos.top,
              width: unit,
              height: unit,
              background: DOT,
              border: `2px solid ${INK}`,
            }}
          />
        ))}
      </div>
    </div>
  );
}

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
          <OgFourDotMark box={72} />
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
