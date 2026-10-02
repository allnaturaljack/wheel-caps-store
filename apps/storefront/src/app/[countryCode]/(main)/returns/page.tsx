import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoPage, {
  Blank,
  InfoSection,
} from "@modules/content/templates/info-page"

export const metadata: Metadata = {
  title: "Returns & Exchanges",
  description: `Returns and exchanges for ${BRAND.name} orders.`,
}

export default function ReturnsPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Returns & exchanges"
      intro="Caps are printed to order, so please check your truck's bolt pattern before you buy. If something still isn't right, here's how we handle it."
      draft
    >
      <InfoSection title="Wrong fitment">
        <p>
          If the cap doesn&apos;t fit the truck you ordered it for, contact us
          within <Blank>30 days</Blank> of delivery. We&apos;ll{" "}
          <Blank>exchange it for the right fitment / refund it</Blank>.
        </p>
        <p>
          Return shipping is paid by <Blank>us / the customer</Blank>.
        </p>
      </InfoSection>
      <InfoSection title="Defects and damage">
        <p>
          If a cap arrives damaged or has a printing defect, send a photo within{" "}
          <Blank>14 days</Blank> of delivery and we&apos;ll{" "}
          <Blank>reprint and reship it at no charge</Blank>.
        </p>
      </InfoSection>
      <InfoSection title="Changed your mind">
        <p>
          <Blank>
            Whether unused caps can be returned for a refund, the time limit,
            and any restocking fee
          </Blank>
        </p>
      </InfoSection>
      <InfoSection title="Refunds">
        <p>
          Approved refunds go back to the original payment method within{" "}
          <Blank>5-10 business days</Blank>.
        </p>
      </InfoSection>
      <InfoSection title="Start a return">
        <p>
          <LocalizedClientLink href="/contact">Contact us</LocalizedClientLink>{" "}
          with your order number and what went wrong.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
