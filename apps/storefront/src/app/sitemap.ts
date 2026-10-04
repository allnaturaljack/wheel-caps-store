import type { MetadataRoute } from "next"

import { listCategories } from "@lib/data/categories"
import { listProducts } from "@lib/data/products"
import { getBaseURL } from "@lib/util/env"

const COUNTRY_CODE = process.env.NEXT_PUBLIC_DEFAULT_REGION || "us"

const STATIC_PATHS = [
  "",
  "/store",
  "/contact",
  "/shipping",
  "/returns",
  "/content/privacy-policy",
  "/content/terms-of-use",
]

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const base = `${getBaseURL()}/${COUNTRY_CODE}`

  const [products, categories] = await Promise.all([
    listProducts({
      countryCode: COUNTRY_CODE,
      queryParams: { limit: 100, fields: "handle,updated_at" },
    })
      .then(({ response }) => response.products)
      .catch(() => []),
    listCategories().catch(() => []),
  ])

  return [
    ...STATIC_PATHS.map((path) => ({ url: `${base}${path}` })),
    ...categories.map((category) => ({
      url: `${base}/categories/${category.handle}`,
    })),
    ...products.map((product) => ({
      url: `${base}/products/${product.handle}`,
      lastModified: product.updated_at ?? undefined,
    })),
  ]
}
