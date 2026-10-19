import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/opengraph";

export function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          height: "100%",
          width: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          backgroundColor: "#0f172a",
          color: "#f8fafc",
          padding: "80px",
        }}
      >
        <div style={{ fontSize: 72 }}>{SITE_NAME}</div>
        <div style={{ fontSize: 32, marginTop: 24, color: "#cbd5e1" }}>
          {SITE_DESCRIPTION}
        </div>
      </div>
    ),
    { width: 1200, height: 630 },
  );
}
