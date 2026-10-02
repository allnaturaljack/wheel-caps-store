import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import InfoPage, {
  Blank,
  InfoSection,
} from "@modules/content/templates/info-page"

export const metadata: Metadata = {
  title: "Contact",
  description: `Get in touch with ${BRAND.name}.`,
}

export default function ContactPage() {
  return (
    <InfoPage
      eyebrow="Help"
      title="Contact us"
      intro="Questions about fitment, an order, or a cap that isn't right? Send us an email and a real person will get back to you."
      draft
    >
      <InfoSection title="Email">
        <p>
          <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>
        </p>
        <p>
          We usually reply within <Blank>1-2 business days</Blank>.
        </p>
      </InfoSection>
      <InfoSection title="What to include">
        <ul>
          <li>Your order number, if you have one</li>
          <li>Your truck&apos;s make, model and year</li>
          <li>A photo of the wheel or cap if something doesn&apos;t fit</li>
        </ul>
      </InfoSection>
      <InfoSection title="Business details">
        <p>
          <Blank>Legal business name</Blank>
          <br />
          <Blank>Mailing address</Blank>
        </p>
      </InfoSection>
    </InfoPage>
  )
}
