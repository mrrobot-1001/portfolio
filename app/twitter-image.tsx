import { ImageResponse } from "next/og";
import { profile } from "@/data/profile";

export const alt = `${profile.name} — ${profile.role}`;
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
          justifyContent: "space-between",
          background: "#f3f2ee",
          color: "#0a0a0a",
          padding: 56,
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 22, letterSpacing: 1, textTransform: "uppercase", color: "#6b6b67" }}>
          <span>Portfolio — 2026</span>
          <span>India → open to relocation</span>
        </div>
        <div style={{ display: "flex", flexDirection: "column" }}>
          <div style={{ fontSize: 190, fontWeight: 700, letterSpacing: -12, lineHeight: 0.85 }}>HARSH</div>
          <div style={{ fontSize: 190, fontWeight: 700, letterSpacing: -12, lineHeight: 0.85, paddingLeft: 180 }}>RANA</div>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-end", borderTop: "2px solid #0a0a0a", paddingTop: 20 }}>
          <span style={{ fontSize: 38, fontWeight: 600 }}>{profile.role}</span>
          <span style={{ fontSize: 22, color: "#6b6b67" }}>Next.js · TypeScript · PostgreSQL · Python · PyTorch</span>
        </div>
      </div>
    ),
    size,
  );
}
