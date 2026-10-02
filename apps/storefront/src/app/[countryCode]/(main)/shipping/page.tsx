import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoPage, {
  Blank,
  InfoSection,
} from "@modules/content/templates/info-page"

export const metadata: Metadata = {
  title: "Shipping",
  description: `Shipping options and timing for ${BRAND.name} orders.`,
}

export default function ShippingPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Shipping"
      intro="Every cap is printed after you order it, so shipping times include the time it takes to print."
      draft
    >
      <InfoSection title="Options">
        <ul>
          <li>
            <strong>Standard:</strong> <Blank>$8 flat</Blank>, ships in{" "}
            <Blank>3-5 business days</Blank>
          </li>
          <li>
            <strong>Express:</strong> <Blank>$18 flat</Blank>, jumps the print
            queue and ships in <Blank>1-2 business days</Blank>
          </li>
        </ul>
        <p>
          Transit time after it ships depends on the carrier:{" "}
          <Blank>carrier and typical transit time</Blank>.
        </p>
      </InfoSection>
      <InfoSection title="Where we ship">
        <p>We currently ship within the United States only.</p>
      </InfoSection>
      <InfoSection title="Tracking">
        <p>
          <Blank>
            How customers get tracking, e.g. emailed when the order ships
          </Blank>
        </p>
      </InfoSection>
      <InfoSection title="Problems with a delivery">
        <p>
          If an order arrives damaged or doesn&apos;t arrive,{" "}
          <LocalizedClientLink href="/contact">contact us</LocalizedClientLink>{" "}
          and we&apos;ll sort it out.
        </p>
      </InfoSection>
    </InfoPage>
  )
}
