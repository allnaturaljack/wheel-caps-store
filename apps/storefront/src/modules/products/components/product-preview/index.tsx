import { getProductPrice } from "@lib/util/get-product-price"
import { CAP_COLORS, getWheelHighlight } from "@lib/util/product-art"
import { HttpTypes } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Thumbnail from "../thumbnail"
import PreviewPrice from "./price"

export default async function ProductPreview({
  product,
  region: _region,
}: {
  product: HttpTypes.StoreProduct
  region: HttpTypes.StoreRegion
}) {
  const { cheapestPrice } = getProductPrice({
    product,
  })

  const colors = (
    product.options?.find((o) => o.title === "Color")?.values ?? []
  )
    .map((v) => v.value)
    .filter((value) => CAP_COLORS[value])

  return (
    <LocalizedClientLink href={`/products/${product.handle}`} className="group">
      <div data-testid="product-wrapper">
        <Thumbnail
          thumbnail={product.thumbnail}
          images={product.images}
          size="full"
          artHighlight={getWheelHighlight(product.handle)}
        />
        <div className="mt-4 flex items-start justify-between gap-x-4">
          <div className="flex flex-col gap-y-2">
            <h3
              className="font-display text-xl font-semibold uppercase leading-tight tracking-wide text-ink-900 transition-colors group-hover:text-brand"
              data-testid="product-title"
            >
              {product.title}
            </h3>
            {colors.length > 0 && (
              <ul className="flex items-center gap-1.5" aria-label="Colors">
                {colors.map((color) => (
                  <li
                    key={color}
                    title={color}
                    className="h-3.5 w-3.5 rounded-full ring-1 ring-grey-30"
                    style={{ backgroundColor: CAP_COLORS[color] }}
                  />
                ))}
              </ul>
            )}
          </div>
          <div className="flex items-center gap-x-2 pt-0.5 font-semibold">
            {cheapestPrice && <PreviewPrice price={cheapestPrice} />}
          </div>
        </div>
      </div>
    </LocalizedClientLink>
  )
}
