import { readFile } from "node:fs/promises"
import { join } from "node:path"
import { ImageResponse } from "next/og"

import { BRAND } from "@lib/brand"

export const shareImageSize = { width: 1200, height: 630 }

// Image shown when a store link is shared on social media or in messages.
export const renderShareImage = async () => {
  const logo = await readFile(
    join(process.cwd(), "src/lib/share-logo.png"),
    "base64"
  )

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 64,
          background: "linear-gradient(135deg, #202328 0%, #08090a 70%)",
          color: "#ffffff",
        }}
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={`data:image/png;base64,${logo}`}
          alt={BRAND.name}
          width={360}
          height={81}
        />
        <div style={{ display: "flex", flexDirection: "column", gap: 16 }}>
          <div
            style={{
              fontSize: 84,
              fontWeight: 700,
              lineHeight: 1,
              textTransform: "uppercase",
            }}
          >
            Caps built for trucks
          </div>
          <div
            style={{
              fontSize: 84,
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
}
