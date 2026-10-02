import { Metadata } from "next"

import { BRAND } from "@lib/brand"
import InfoPage, {
  Blank,
  InfoSection,
} from "@modules/content/templates/info-page"

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: `How ${BRAND.name} handles your information.`,
}

export default function PrivacyPolicyPage() {
  return (
    <InfoPage
      eyebrow="Legal"
      title="Privacy policy"
      intro={
        <>
          Last updated: <Blank>date</Blank>
        </>
      }
      draft
    >
      <InfoSection title="What we collect">
        <p>
          When you place an order or create an account we collect your name,
          email address, shipping and billing address, and order history. Card
          details are handled by our payment processor and never reach our
          servers.
        </p>
      </InfoSection>
      <InfoSection title="How we use it">
        <ul>
          <li>To make, ship and support your order</li>
          <li>To send order confirmations and account emails</li>
          <li>
            <Blank>Marketing emails, if any, and how to opt out</Blank>
          </li>
        </ul>
      </InfoSection>
      <InfoSection title="Who we share it with">
        <p>
          Only the services needed to run the store:{" "}
          <Blank>payment processor, email provider, shipping carrier, hosting</Blank>
          . We don&apos;t sell your information.
        </p>
      </InfoSection>
      <InfoSection title="Cookies">
        <p>
          We use cookies needed for the cart and sign-in to work.{" "}
          <Blank>Any analytics or advertising cookies</Blank>
        </p>
      </InfoSection>
      <InfoSection title="Your choices">
        <p>
          You can ask us to show, correct or delete the information we hold
          about you by emailing{" "}
          <a href={`mailto:${BRAND.supportEmail}`}>{BRAND.supportEmail}</a>.
        </p>
      </InfoSection>
      <InfoSection title="Who we are">
        <p>
          <Blank>Legal business name and mailing address</Blank>
        </p>
      </InfoSection>
    </InfoPage>
  )
}
