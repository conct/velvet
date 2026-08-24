import { ImageResponse } from "next/og";

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
          alignItems: "center",
          justifyContent: "center",
          background: "#0b0b0c",
          backgroundImage:
            "radial-gradient(ellipse 900px 500px at 82% -5%, rgba(212,175,55,0.16), transparent 60%)",
        }}
      >
        <div
          style={{
            fontSize: 128,
            fontWeight: 700,
            letterSpacing: 12,
            color: "#d4af37",
          }}
        >
          VELVET
        </div>
        <div style={{ width: 90, height: 2, background: "#d4af37", marginTop: 28, marginBottom: 28 }} />
        <div style={{ fontSize: 32, fontStyle: "italic", color: "#f4e5a1" }}>
          Zugang, der sich verdient anfühlt.
        </div>
        <div style={{ fontSize: 20, color: "#a79f8e", marginTop: 20, letterSpacing: 2 }}>
          GETEILTES VERTRAUENSNETZWERK FÜR DEN TÜRSTAND
        </div>
      </div>
    ),
    { ...size }
  );
}
