import { HttpTypes } from "@medusajs/types"
import { Text } from "@modules/common/components/ui"
import LocalizedClientLink from "@modules/common/components/localized-client-link"

type ProductInfoProps = {
  product: HttpTypes.StoreProduct
}

const ProductInfo = ({ product }: ProductInfoProps) => {
  const category = product.categories?.[0]

  return (
    <div id="product-info">
      <div className="flex flex-col gap-y-4">
        {category && (
          <LocalizedClientLink
            href={`/categories/${category.handle}`}
            className="eyebrow hover:text-brand-dark"
          >
            {category.name}
          </LocalizedClientLink>
        )}
        <h1
          className="display-heading text-5xl text-ink-900 small:text-6xl"
          data-testid="product-title"
        >
          {product.title}
        </h1>

        <Text
          className="text-base leading-7 text-grey-60 whitespace-pre-line"
          data-testid="product-description"
        >
          {product.description}
        </Text>
      </div>
    </div>
  )
}

export default ProductInfo
