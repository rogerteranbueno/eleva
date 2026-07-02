import { ImageResponse } from "next/og"

export const runtime = "edge"
export const alt = "ELEVA, El sistema operativo para centros de transformación"
export const size = { width: 1200, height: 630 }
export const contentType = "image/png"

export default function OGImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          alignItems: "flex-start",
          justifyContent: "space-between",
          background: "linear-gradient(135deg, #0a0a0f 0%, #0f0a1e 50%, #0a0f1a 100%)",
          padding: "72px 80px",
          fontFamily: "system-ui, -apple-system, sans-serif",
        }}
      >
        {/* Decorative glow */}
        <div
          style={{
            position: "absolute",
            top: -80,
            right: -80,
            width: 480,
            height: 480,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(124,58,237,0.25) 0%, transparent 70%)",
          }}
        />
        <div
          style={{
            position: "absolute",
            bottom: -60,
            left: 200,
            width: 360,
            height: 360,
            borderRadius: "50%",
            background: "radial-gradient(circle, rgba(6,182,212,0.12) 0%, transparent 70%)",
          }}
        />

        {/* Logo */}
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: "#7c3aed",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <span style={{ color: "white", fontWeight: 900, fontSize: 28 }}>E</span>
          </div>
          <span style={{ color: "white", fontWeight: 900, fontSize: 36, letterSpacing: "-1px" }}>ELEVA</span>
        </div>

        {/* Main content */}
        <div style={{ display: "flex", flexDirection: "column", gap: 24, maxWidth: 800 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              padding: "8px 20px",
              borderRadius: 99,
              background: "rgba(124,58,237,0.15)",
              border: "1px solid rgba(124,58,237,0.3)",
              width: "fit-content",
            }}
          >
            <span style={{ color: "#a78bfa", fontSize: 14, fontWeight: 700, letterSpacing: "0.12em", textTransform: "uppercase" }}>
              Sistema operativo para centros de transformación
            </span>
          </div>

          <h1
            style={{
              color: "white",
              fontSize: 72,
              fontWeight: 900,
              lineHeight: 1.0,
              margin: 0,
              letterSpacing: "-2px",
            }}
          >
            Tu centro puede{" "}
            <span style={{ color: "#a78bfa" }}>crecer 2.4x</span>{" "}
            en 12 meses.
          </h1>

          <p
            style={{
              color: "rgba(255,255,255,0.6)",
              fontSize: 26,
              margin: 0,
              lineHeight: 1.4,
              fontWeight: 400,
            }}
          >
            Adquirir, activar, retener y escalar, en un solo sistema.
          </p>
        </div>

        {/* Bottom stats row */}
        <div style={{ display: "flex", gap: 40, alignItems: "center" }}>
          {[
            { value: "+240%", label: "crecimiento promedio" },
            { value: "40+", label: "centros activos" },
            { value: "3x", label: "más retención" },
          ].map((s) => (
            <div key={s.label} style={{ display: "flex", flexDirection: "column", gap: 4 }}>
              <span style={{ color: "#a78bfa", fontSize: 32, fontWeight: 900, lineHeight: 1 }}>{s.value}</span>
              <span style={{ color: "rgba(255,255,255,0.45)", fontSize: 16, fontWeight: 500 }}>{s.label}</span>
            </div>
          ))}
          <div style={{ flex: 1 }} />
          <div
            style={{
              padding: "14px 32px",
              borderRadius: 12,
              background: "#7c3aed",
              color: "white",
              fontSize: 18,
              fontWeight: 700,
            }}
          >
            elevaapp.io →
          </div>
        </div>
      </div>
    ),
    size,
  )
}
