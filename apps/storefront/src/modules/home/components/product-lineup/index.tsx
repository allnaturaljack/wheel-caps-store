import { listProducts } from "@lib/data/products"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import ProductPreview from "@modules/products/components/product-preview"

export default async function ProductLineup({
  region,
}: {
  region: HttpTypes.StoreRegion
}) {
  const {
    response: { products },
  } = await listProducts({
    regionId: region.id,
    queryParams: { limit: 6 },
  })

  if (!products?.length) {
    return null
  }

  return (
    <section className="content-container py-16 small:py-24">
      <div className="mb-10 flex items-end justify-between gap-6">
        <div className="flex flex-col gap-y-3">
          <span className="eyebrow">The lineup</span>
          <h2 className="display-heading text-4xl text-ink-900 small:text-5xl">
            Caps and covers
          </h2>
        </div>
        <LocalizedClientLink
          href="/store"
          className="font-display text-base font-semibold uppercase tracking-wider text-ink-900 hover:text-brand"
        >
          View all &rarr;
        </LocalizedClientLink>
      </div>
      <ul className="grid grid-cols-1 gap-x-6 gap-y-12 xsmall:grid-cols-2 small:grid-cols-3">
        {products.map((product) => (
          <li key={product.id}>
            <ProductPreview product={product} region={region} />
          </li>
        ))}
      </ul>
    </section>
  )
}
