import LocalizedClientLink from "@modules/common/components/localized-client-link"
import WheelArt from "@modules/common/components/wheel-art"

const STATS = [
  { value: "8-lug", label: "Heavy-duty fitments" },
  { value: "3", label: "Truck platforms" },
  { value: "3", label: "Colors to start" },
]

const Hero = () => {
  return (
    <section className="relative w-full overflow-hidden bg-ink-950 text-white">
      <div
        className="absolute inset-0 opacity-[0.07]"
        style={{
          backgroundImage:
            "linear-gradient(to right, #fff 1px, transparent 1px), linear-gradient(to bottom, #fff 1px, transparent 1px)",
          backgroundSize: "64px 64px",
        }}
        aria-hidden
      />
      <div
        className="absolute -right-40 top-1/2 h-[720px] w-[720px] -translate-y-1/2 rounded-full bg-brand/25 blur-[140px]"
        aria-hidden
      />

      <div className="content-container relative grid items-center gap-12 py-16 small:grid-cols-2 small:py-24">
        <div className="flex flex-col items-start gap-y-7">
          <span className="eyebrow">Heavy-duty wheel caps</span>
          <h1 className="display-heading text-6xl small:text-7xl medium:text-8xl">
            Caps built
            <br />
            for trucks
            <br />
            <span className="text-brand">that work.</span>
          </h1>
          <p className="max-w-md text-base leading-7 text-white/70 small:text-lg">
            3D-printed center caps and lug nut covers for Ford Super Duty, Ram
            HD and GM HD. Pick your fitment, pick your color, and we print it
            to order.
          </p>
          <div className="flex flex-wrap gap-4">
            <LocalizedClientLink href="/store" className="btn-brand">
              Shop caps
            </LocalizedClientLink>
            <a href="#fitment" className="btn-outline">
              Find your fitment
            </a>
          </div>
          <dl className="mt-4 grid w-full max-w-md grid-cols-3 gap-6 border-t border-white/10 pt-7">
            {STATS.map((stat) => (
              <div key={stat.label}>
                <dd className="font-display text-4xl font-bold uppercase leading-none">
                  {stat.value}
                </dd>
                <dt className="mt-2 text-xs uppercase tracking-wider text-white/50">
                  {stat.label}
                </dt>
              </div>
            ))}
          </dl>
        </div>

        <div className="relative mx-auto w-full max-w-[560px]">
          <WheelArt className="w-full drop-shadow-[0_40px_60px_rgba(0,0,0,0.7)]" />
        </div>
      </div>
    </section>
  )
}

export default Hero
