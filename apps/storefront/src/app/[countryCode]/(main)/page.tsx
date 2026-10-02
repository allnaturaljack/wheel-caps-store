import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import { getRegion } from "@lib/data/regions"
import ColorShowcase from "@modules/home/components/color-showcase"
import FitmentGrid from "@modules/home/components/fitment-grid"
import Hero from "@modules/home/components/hero"
import ProductLineup from "@modules/home/components/product-lineup"
import ValueProps from "@modules/home/components/value-props"

export const metadata: Metadata = {
  title: { absolute: `${BRAND.name} | Heavy-duty truck wheel caps` },
  description: BRAND.tagline,
}

export default async function Home(props: {
  params: Promise<{ countryCode: string }>
}) {
  const params = await props.params

  const { countryCode } = params

  const region = await getRegion(countryCode)

  if (!region) {
    return null
  }

  return (
    <>
      <Hero />
      <ValueProps />
      <ProductLineup region={region} />
      <FitmentGrid />
      <ColorShowcase />
    </>
  )
}
