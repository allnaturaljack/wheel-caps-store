import LocalizedClientLink from "@modules/common/components/localized-client-link"

const FITMENTS = [
  { make: "Ford", model: "Super Duty", pattern: "8x170" },
  { make: "Ram", model: "2500 / 3500", pattern: "8x165.1" },
  { make: "GM", model: "2500HD / 3500HD", pattern: "8x180" },
]

const FitmentGrid = () => {
  return (
    <section id="fitment" className="scroll-mt-28 bg-ink-900 text-white">
      <div className="content-container py-16 small:py-20">
        <div className="mb-10 flex flex-col gap-y-3">
          <span className="eyebrow">Shop by truck</span>
          <h2 className="display-heading text-4xl small:text-5xl">
            Find your fitment
          </h2>
          <p className="max-w-xl text-white/60">
            Every cap is made for one bolt pattern. Match yours below, then
            choose the same fitment on the product page.
          </p>
        </div>
        <ul className="grid gap-4 small:grid-cols-3">
          {FITMENTS.map((fitment) => (
            <li key={fitment.pattern}>
              <LocalizedClientLink
                href="/categories/center-caps"
                className="group flex h-full flex-col justify-between gap-y-10 rounded-xl border border-white/10 bg-ink-800 p-7 transition-colors duration-150 hover:border-brand"
              >
                <div>
                  <span className="text-xs uppercase tracking-[0.2em] text-white/50">
                    {fitment.make}
                  </span>
                  <h3 className="display-heading mt-2 text-3xl">
                    {fitment.model}
                  </h3>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <span className="text-xs uppercase tracking-wider text-white/50">
                      Bolt pattern
                    </span>
                    <p className="font-display text-4xl font-bold leading-none text-brand">
                      {fitment.pattern}
                    </p>
                  </div>
                  <span className="font-display text-base font-semibold uppercase tracking-wider text-white/60 transition-colors group-hover:text-white">
                    Shop &rarr;
                  </span>
                </div>
              </LocalizedClientLink>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default FitmentGrid
