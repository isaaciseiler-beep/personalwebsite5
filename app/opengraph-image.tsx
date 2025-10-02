import { ImageResponse } from "next/og";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%", height: "100%",
          display: "flex", flexDirection: "column", justifyContent: "center", padding: 80,
          background: "black",
          color: "#e7e7ea",
          fontFamily: "system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial"
        }}
      >
        <div style={{ fontSize: 56, fontWeight: 700 }}>isaac seiler</div>
        <div style={{ marginTop: 16, fontSize: 28, opacity: 0.8 }}>
          projects · photos · research
        </div>
      </div>
    ),
    { ...size }
  );
}
