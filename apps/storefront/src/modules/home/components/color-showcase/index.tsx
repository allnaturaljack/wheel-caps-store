import { CAP_COLORS } from "@lib/util/product-art"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WheelArt from "@modules/common/components/wheel-art"

const ColorShowcase = () => {
  return (
    <section className="bg-ink-950 text-white">
      <div className="content-container grid items-center gap-12 py-16 small:grid-cols-[1fr_1.4fr] small:py-24">
        <div className="flex flex-col items-start gap-y-5">
          <span className="eyebrow">Color</span>
          <h2 className="display-heading text-4xl small:text-6xl">
            Make your
            <br />
            wheels pop
          </h2>
          <p className="max-w-md text-white/60">
            Keep it stealth in matte black or go loud in orange or red. Order
            the 4-pack and all four caps are printed together so the color
            matches on every wheel.
          </p>
          <LocalizedClientLink href="/store" className="btn-brand mt-2">
            Choose your color
          </LocalizedClientLink>
          <p className="mt-2 border-l-2 border-brand pl-4 text-sm text-white/50">
            Coming soon: full custom hubcaps in your own colors.
          </p>
        </div>
        <ul className="grid grid-cols-3 gap-4 small:gap-8">
          {Object.entries(CAP_COLORS).map(([label, hex]) => (
            <li key={label} className="flex flex-col items-center gap-y-4">
              <WheelArt
                color={hex}
                className="w-full drop-shadow-[0_24px_30px_rgba(0,0,0,0.6)]"
              />
              <span className="flex items-center gap-2 text-center text-xs uppercase tracking-wider text-white/70 small:text-sm">
                <span
                  className="h-3 w-3 shrink-0 rounded-full ring-1 ring-white/30"
                  style={{ backgroundColor: hex }}
                />
                {label}
              </span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default ColorShowcase
