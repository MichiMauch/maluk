import { ImageResponse } from "next/og";

export const runtime = "edge";
export const alt = "MALUK Racing - Schweizer Bergrennen mit Lukas Maurer";
export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          background: "linear-gradient(135deg, #0f0506 0%, #1a0f0a 50%, #0f0506 100%)",
          padding: "60px 80px",
          fontFamily: "sans-serif",
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: 400,
            height: 400,
            background: "radial-gradient(circle, rgba(255,214,0,0.15) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: 300,
            height: 300,
            background: "radial-gradient(circle, rgba(220,38,38,0.1) 0%, transparent 70%)",
            borderRadius: "50%",
          }}
        />

        {/* Top line */}
        <div
          style={{
            position: "absolute",
            top: 40,
            left: 80,
            right: 80,
            height: 2,
            background: "linear-gradient(90deg, #FFD600, transparent)",
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 10,
            color: "#FFD600",
            fontSize: 16,
            fontWeight: 700,
            textTransform: "uppercase",
            letterSpacing: "0.2em",
            marginBottom: 20,
          }}
        >
          ⚡ Schweizer Bergrennen Meisterschaft
        </div>

        {/* Title */}
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 0,
          }}
        >
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              color: "white",
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontStyle: "italic",
            }}
          >
            MALUK
          </div>
          <div
            style={{
              fontSize: 82,
              fontWeight: 900,
              lineHeight: 0.9,
              letterSpacing: "-0.03em",
              fontStyle: "italic",
              background: "linear-gradient(90deg, #FFD600, #DC2626)",
              backgroundClip: "text",
              color: "transparent",
            }}
          >
            RACING
          </div>
        </div>

        {/* Subtitle */}
        <div
          style={{
            fontSize: 24,
            color: "#9ca3af",
            marginTop: 30,
            maxWidth: 600,
            lineHeight: 1.4,
          }}
        >
          Bergrennen-Pilot Lukas Maurer und sein legendärer Opel Kadett C GT/E
        </div>

        {/* Stats */}
        <div
          style={{
            display: "flex",
            gap: 50,
            marginTop: 40,
          }}
        >
          {[
            { label: "Saisons", value: "3" },
            { label: "Rennen", value: "25+" },
            { label: "Top Speed", value: "197 km/h" },
          ].map((stat) => (
            <div key={stat.label} style={{ display: "flex", flexDirection: "column" }}>
              <div style={{ fontSize: 14, color: "#6b7280", textTransform: "uppercase", letterSpacing: "0.15em" }}>
                {stat.label}
              </div>
              <div style={{ fontSize: 32, fontWeight: 700, color: "white" }}>
                {stat.value}
              </div>
            </div>
          ))}
        </div>

        {/* Bottom line */}
        <div
          style={{
            position: "absolute",
            bottom: 40,
            left: 80,
            right: 80,
            height: 2,
            background: "linear-gradient(90deg, transparent, #FFD600)",
          }}
        />

        {/* URL */}
        <div
          style={{
            position: "absolute",
            bottom: 50,
            right: 80,
            fontSize: 16,
            color: "#FFD600",
            fontWeight: 600,
          }}
        >
          malukracing.ch
        </div>
      </div>
    ),
    { ...size }
  );
}
