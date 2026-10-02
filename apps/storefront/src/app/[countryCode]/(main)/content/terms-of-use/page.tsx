import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import InfoPage, {
  Blank,
  InfoSection,
} from "@modules/content/templates/info-page"

export const metadata: Metadata = {
  title: "Terms of Use",
  description: `Terms for using the ${BRAND.name} store.`,
}

export default function TermsOfUsePage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Terms of use"
      intro={
        <>
          Last updated: <Blank>date</Blank>
        </>
      }
      draft
    >
      <InfoSection title="Orders and payment">
        <p>
          Prices are in US dollars. Payment is taken when you place your order,
          and each item is made after the order is placed.
        </p>
      </InfoSection>
      <InfoSection title="Fitment">
        <p>
          Each product lists the trucks and bolt pattern it is made for. It is
          your responsibility to choose the fitment that matches your vehicle.
        </p>
        <p>
          Truck makes and models are named only to describe fitment.{" "}
          {BRAND.name} is not affiliated with or endorsed by any vehicle
          manufacturer.
        </p>
      </InfoSection>
      <InfoSection title="Installation and use">
        <p>
          <Blank>
            Installation instructions, the customer&apos;s responsibility to
            check caps are secure, and any limits on use
          </Blank>
        </p>
      </InfoSection>
      <InfoSection title="Shipping and returns">
        <p>
          See our{" "}
          <LocalizedClientLink href="/shipping">shipping</LocalizedClientLink>{" "}
          and{" "}
          <LocalizedClientLink href="/returns">
            returns &amp; exchanges
          </LocalizedClientLink>{" "}
          pages.
        </p>
      </InfoSection>
      <InfoSection title="Warranty and liability">
        <p>
          <Blank>
            Warranty terms and limitation of liability, to be written with
            legal advice
          </Blank>
        </p>
      </InfoSection>
      <InfoSection title="Governing law">
        <p>
          <Blank>State whose law applies</Blank>
        </p>
      </InfoSection>
      <InfoSection title="Contact">
        <p>
          <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>
        </p>
      </InfoSection>
    </InfoPage>
  )
}
