import { ImageResponse } from "next/og"

import { BRAND } from "@lib/brand"

export const shareImageSize = { width: 1200, height: 630 }

// Image shown when a store link is shared on social media or in messages.
export const renderShareImage = () =>
  new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 72,
          background: "linear-gradient(135deg, #202328 0%, #08090a 70%)",
          color: "#ffffff",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 20 }}>
          <svg width="64" height="64" viewBox="0 0 32 32">
            <polygon
              points="16,1.5 28.6,8.75 28.6,23.25 16,30.5 3.4,23.25 3.4,8.75"
              fill="#ff5a1f"
            />
            <circle cx="16" cy="16" r="7.5" fill="#0e0f11" />
            <circle cx="16" cy="16" r="3" fill="#ff5a1f" />
          </svg>
          <div
            style={{
              fontSize: 44,
              fontWeight: 700,
              letterSpacing: 4,
              textTransform: "uppercase",
            }}
          >
            {BRAND.name}
          </div>
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Caps built for trucks
          </div>
          <div
            style={{
              fontSize: 96,
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
              color: "#ff5a1f",
            }}
          >
            that work.
          </div>
          <div style={{ fontSize: 34, color: "rgba(255,255,255,0.7)" }}>
            {BRAND.tagline}
          </div>
        </div>
      </div>
    ),
    shareImageSize
  )
