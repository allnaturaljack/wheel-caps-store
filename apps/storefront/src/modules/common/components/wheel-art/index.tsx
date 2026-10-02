import { useId } from "react"

import {
  DEFAULT_CAP_COLOR,
  WheelHighlight,
} from "@lib/util/product-art"

type WheelArtProps = {
  color?: string
  highlight?: WheelHighlight
  className?: string
}

const LUG_COUNT = 8
const STEEL = "#b9bec6"

const polar = (radius: number, index: number, offset = 0) => {
  const angle = ((index + offset) / LUG_COUNT) * Math.PI * 2 - Math.PI / 2
  return {
    x: 200 + radius * Math.cos(angle),
    y: 200 + radius * Math.sin(angle),
    deg: (angle * 180) / Math.PI + 90,
  }
}

const hexagon = (cx: number, cy: number, r: number) =>
  Array.from({ length: 6 }, (_, i) => {
    const a = (i / 6) * Math.PI * 2
    return `${(cx + r * Math.cos(a)).toFixed(2)},${(cy + r * Math.sin(a)).toFixed(2)}`
  }).join(" ")

// Illustrated 8-lug truck wheel. `highlight` picks which part takes the color.
const WheelArt = ({
  color = DEFAULT_CAP_COLOR,
  highlight = "cap",
  className,
}: WheelArtProps) => {
  const id = useId()
  const capColor = highlight === "cap" ? color : "#3a3d43"
  const lugColor = highlight === "lugs" ? color : STEEL
  const slots = Array.from({ length: LUG_COUNT }, (_, i) => i)

  return (
    <svg
      viewBox="0 0 400 400"
      className={className}
      role="img"
      aria-label="Truck wheel with center cap"
    >
      <defs>
        <radialGradient id={`${id}-tire`} cx="50%" cy="50%" r="50%">
          <stop offset="70%" stopColor="#1b1c1f" />
          <stop offset="88%" stopColor="#0d0e10" />
          <stop offset="100%" stopColor="#050506" />
        </radialGradient>
        <linearGradient id={`${id}-lip`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#f2f4f7" />
          <stop offset="45%" stopColor="#8d939c" />
          <stop offset="100%" stopColor="#4a4e55" />
        </linearGradient>
        <linearGradient id={`${id}-face`} x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stopColor="#d9dce1" />
          <stop offset="55%" stopColor="#9a9fa8" />
          <stop offset="100%" stopColor="#63686f" />
        </linearGradient>
        <radialGradient id={`${id}-hub`} cx="40%" cy="35%" r="75%">
          <stop offset="0%" stopColor="#c8ccd2" />
          <stop offset="100%" stopColor="#6d727a" />
        </radialGradient>
        <radialGradient id={`${id}-gloss`} cx="35%" cy="28%" r="70%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.45" />
          <stop offset="45%" stopColor="#fff" stopOpacity="0.06" />
          <stop offset="100%" stopColor="#000" stopOpacity="0.28" />
        </radialGradient>
      </defs>

      {/* Tire */}
      <circle cx="200" cy="200" r="196" fill={`url(#${id}-tire)`} />
      <circle
        cx="200"
        cy="200"
        r="188"
        fill="none"
        stroke="#232529"
        strokeWidth="10"
        strokeDasharray="5 9"
      />
      <circle cx="200" cy="200" r="168" fill="none" stroke="#26282c" strokeWidth="1.5" />
      <circle cx="200" cy="200" r="156" fill="none" stroke="#1f2124" strokeWidth="1" />

      {/* Rim */}
      <circle cx="200" cy="200" r="146" fill={`url(#${id}-lip)`} />
      <circle cx="200" cy="200" r="136" fill="#2b2d31" />
      <circle cx="200" cy="200" r="131" fill={`url(#${id}-face)`} />

      {/* Hand holes */}
      {slots.map((i) => {
        const p = polar(104, i, 0.5)
        return (
          <ellipse
            key={`hole-${i}`}
            cx={p.x}
            cy={p.y}
            rx="15"
            ry="19"
            fill="#131416"
            stroke="#5a5e65"
            strokeWidth="1.5"
            transform={`rotate(${p.deg} ${p.x} ${p.y})`}
          />
        )
      })}

      {/* Hub plate and lug nuts */}
      <circle cx="200" cy="200" r="82" fill={`url(#${id}-hub)`} stroke="#4f535a" strokeWidth="1.5" />
      {slots.map((i) => {
        const p = polar(64, i)
        return (
          <g key={`lug-${i}`}>
            <polygon
              points={hexagon(p.x, p.y, 9.5)}
              fill={lugColor}
              stroke="rgba(0,0,0,0.45)"
              strokeWidth="1"
            />
            <circle cx={p.x} cy={p.y} r="4" fill="rgba(0,0,0,0.28)" />
          </g>
        )
      })}

      {/* Center cap */}
      <circle cx="200" cy="200" r="46" fill="#17181a" />
      <circle cx="200" cy="200" r="43" fill={capColor} />
      <circle cx="200" cy="200" r="43" fill={`url(#${id}-gloss)`} />
      <circle cx="200" cy="200" r="33" fill="none" stroke="rgba(0,0,0,0.3)" strokeWidth="1.5" />
      <polygon
        points={hexagon(200, 200, 15)}
        fill="none"
        stroke="rgba(255,255,255,0.55)"
        strokeWidth="2.5"
        strokeLinejoin="round"
      />
      <circle cx="200" cy="200" r="4" fill="rgba(255,255,255,0.55)" />
    </svg>
  )
}

export default WheelArt
