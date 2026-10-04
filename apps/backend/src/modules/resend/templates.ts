type EmailContent = {
  subject: string
  html: string
  text: string
}

type Address = {
  first_name?: string | null
  last_name?: string | null
  address_1?: string | null
  address_2?: string | null
  city?: string | null
  province?: string | null
  postal_code?: string | null
  country_code?: string | null
}

export type OrderPlacedData = {
  store_name: string
  display_id: number | string
  currency_code: string
  items: {
    title: string
    variant_title?: string | null
    quantity: number
    total: number
  }[]
  subtotal: number
  shipping_total: number
  tax_total: number
  total: number
  shipping_address?: Address | null
}

export type PasswordResetData = {
  store_name: string
  reset_url: string
}

const BRAND_COLOR = "#ff5a1f"
const INK = "#0e0f11"

const escapeHtml = (value: unknown) =>
  String(value ?? "")
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")

const money = (amount: number, currencyCode: string) =>
  new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: currencyCode.toUpperCase(),
  }).format(amount)

const addressLines = (address?: Address | null) =>
  address
    ? [
        [address.first_name, address.last_name].filter(Boolean).join(" "),
        address.address_1,
        address.address_2,
        [
          [address.city, address.province].filter(Boolean).join(", "),
          address.postal_code,
        ]
          .filter(Boolean)
          .join(" "),
        address.country_code?.toUpperCase(),
      ].filter((line): line is string => Boolean(line))
    : []

const layout = (storeName: string, body: string) => `<!doctype html>
<html>
  <body style="margin:0;padding:0;background:#f3f4f6;font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Roboto,Helvetica,Arial,sans-serif;color:${INK};">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background:#f3f4f6;padding:24px 12px;">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:560px;background:#ffffff;border-radius:8px;overflow:hidden;">
            <tr>
              <td style="background:${INK};padding:20px 28px;border-bottom:4px solid ${BRAND_COLOR};color:#ffffff;font-size:20px;font-weight:700;letter-spacing:0.08em;text-transform:uppercase;">
                ${escapeHtml(storeName)}
              </td>
            </tr>
            <tr>
              <td style="padding:28px;font-size:15px;line-height:1.6;">
                ${body}
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  </body>
</html>`

const orderPlaced = (data: OrderPlacedData): EmailContent => {
  const format = (amount: number) => money(amount, data.currency_code)
  const address = addressLines(data.shipping_address)

  const itemRows = data.items
    .map(
      (item) => `<tr>
                    <td style="padding:10px 0;border-bottom:1px solid #e5e7eb;">
                      <strong>${escapeHtml(item.title)}</strong>${
                        item.variant_title
                          ? `<br /><span style="color:#6b7280;font-size:13px;">${escapeHtml(
                              item.variant_title
                            )}</span>`
                          : ""
                      }
                    </td>
                    <td align="center" style="padding:10px 8px;border-bottom:1px solid #e5e7eb;color:#6b7280;">&times;${escapeHtml(
                      item.quantity
                    )}</td>
                    <td align="right" style="padding:10px 0;border-bottom:1px solid #e5e7eb;">${format(
                      item.total
                    )}</td>
                  </tr>`
    )
    .join("")

  const totalRow = (label: string, amount: number, bold = false) =>
    `<tr>
                    <td colspan="2" style="padding:4px 0;${
                      bold ? "font-weight:700;font-size:17px;padding-top:12px;" : "color:#6b7280;"
                    }">${label}</td>
                    <td align="right" style="padding:4px 0;${
                      bold ? "font-weight:700;font-size:17px;padding-top:12px;" : ""
                    }">${format(amount)}</td>
                  </tr>`

  const html = layout(
    data.store_name,
    `<h1 style="margin:0 0 8px;font-size:24px;">Thanks for your order</h1>
                <p style="margin:0 0 24px;color:#6b7280;">Order #${escapeHtml(
                  data.display_id
                )}. Your caps are printed to order, and we'll email you again when they ship.</p>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">
                  ${itemRows}
                  ${totalRow("Subtotal", data.subtotal)}
                  ${totalRow("Shipping", data.shipping_total)}
                  ${totalRow("Tax", data.tax_total)}
                  ${totalRow("Total", data.total, true)}
                </table>${
                  address.length
                    ? `
                <h2 style="margin:28px 0 6px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND_COLOR};">Shipping to</h2>
                <p style="margin:0;">${address.map(escapeHtml).join("<br />")}</p>`
                    : ""
                }`
  )

  const text = [
    `Thanks for your order from ${data.store_name}`,
    `Order #${data.display_id}`,
    "",
    ...data.items.map(
      (item) =>
        `${item.quantity} x ${item.title}${
          item.variant_title ? ` (${item.variant_title})` : ""
        } - ${format(item.total)}`
    ),
    "",
    `Subtotal: ${format(data.subtotal)}`,
    `Shipping: ${format(data.shipping_total)}`,
    `Tax: ${format(data.tax_total)}`,
    `Total: ${format(data.total)}`,
    ...(address.length ? ["", "Shipping to:", ...address] : []),
  ].join("\n")

  return {
    subject: `Order #${data.display_id} confirmed`,
    html,
    text,
  }
}

const passwordReset = (data: PasswordResetData): EmailContent => {
  const html = layout(
    data.store_name,
    `<h1 style="margin:0 0 8px;font-size:24px;">Reset your password</h1>
                <p style="margin:0 0 24px;color:#6b7280;">Someone asked to reset the password for this account. If that was you, use the button below. If not, you can ignore this email.</p>
                <a href="${escapeHtml(
                  data.reset_url
                )}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:6px;">Reset password</a>`
  )

  return {
    subject: `Reset your ${data.store_name} password`,
    html,
    text: `Reset your ${data.store_name} password:\n${data.reset_url}\n\nIf you didn't ask for this, you can ignore this email.`,
  }
}

type FitmentRequestReceivedData = {
  store_name: string
  name: string
  vehicle: string
  method: "photos" | "mail"
  mailing_address: string[] | null
  discount_percent: number
}

const fitmentRequestReceived = (
  data: FitmentRequestReceivedData
): EmailContent => {
  const intro = `Thanks, ${data.name}. We got your request for a cap that fits your ${data.vehicle}.`
  const reward = `Once we have what we need, we'll email you a one-time code for ${data.discount_percent}% off your order.`

  const steps =
    data.method === "photos"
      ? [
          "Reply to this email with photos of your current cap: the front, the back, and one with a tape measure across it.",
          "Include your wheel's bolt pattern if you know it.",
        ]
      : [
          data.mailing_address
            ? `Mail your cap to: ${data.mailing_address.join(", ")}`
            : "We'll email you the address to mail your cap to.",
          "Put a note with your name and email in the box.",
          "We'll send your original cap back with your order.",
        ]

  const html = layout(
    data.store_name,
    `<h1 style="margin:0 0 8px;font-size:24px;">We're on it</h1>
                <p style="margin:0 0 16px;color:#6b7280;">${escapeHtml(intro)}</p>
                <h2 style="margin:0 0 6px;font-size:13px;letter-spacing:0.12em;text-transform:uppercase;color:${BRAND_COLOR};">Next steps</h2>
                <ul style="margin:0 0 16px;padding-left:20px;">${steps
                  .map((step) => `<li style="margin-bottom:6px;">${escapeHtml(step)}</li>`)
                  .join("")}</ul>
                <p style="margin:0;">${escapeHtml(reward)}</p>`
  )

  return {
    subject: `Your ${data.store_name} fitment request`,
    html,
    text: [intro, "", "Next steps:", ...steps.map((step) => `- ${step}`), "", reward].join("\n"),
  }
}

type FitmentRequestNewData = {
  store_name: string
  name: string
  email: string
  vehicle: string
  method: "photos" | "mail"
  notes: string | null
  product_handle: string | null
  admin_url: string
}

const fitmentRequestNew = (data: FitmentRequestNewData): EmailContent => {
  const rows: [string, string][] = [
    ["Customer", `${data.name} <${data.email}>`],
    ["Truck", data.vehicle],
    ["Sending", data.method === "photos" ? "Photos by email" : "Mailing the cap (return it with their order)"],
    ...(data.product_handle ? [["From product", data.product_handle] as [string, string]] : []),
    ...(data.notes ? [["Notes", data.notes] as [string, string]] : []),
  ]

  const html = layout(
    data.store_name,
    `<h1 style="margin:0 0 16px;font-size:22px;">New fitment request</h1>
                <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="font-size:15px;">${rows
                  .map(
                    ([label, value]) => `<tr>
                    <td style="padding:6px 12px 6px 0;color:#6b7280;vertical-align:top;white-space:nowrap;">${escapeHtml(label)}</td>
                    <td style="padding:6px 0;">${escapeHtml(value)}</td>
                  </tr>`
                  )
                  .join("")}</table>
                <p style="margin:20px 0 0;"><a href="${escapeHtml(data.admin_url)}" style="color:${BRAND_COLOR};font-weight:700;">Open fitment requests</a></p>`
  )

  return {
    subject: `New fitment request: ${data.vehicle}`,
    html,
    text: [...rows.map(([label, value]) => `${label}: ${value}`), "", data.admin_url].join("\n"),
  }
}

type FitmentDiscountCodeData = {
  store_name: string
  name: string
  vehicle: string
  code: string
  discount_percent: number
  store_url: string
  returns_original: boolean
}

const fitmentDiscountCode = (data: FitmentDiscountCodeData): EmailContent => {
  const intro = `Thanks for helping us make caps for the ${data.vehicle}, ${data.name}. Here's your ${data.discount_percent}% off code. It works once, on your next order.`
  const returnNote = data.returns_original
    ? "We'll send your original cap back with that order."
    : ""

  const html = layout(
    data.store_name,
    `<h1 style="margin:0 0 8px;font-size:24px;">Your ${data.discount_percent}% off code</h1>
                <p style="margin:0 0 20px;color:#6b7280;">${escapeHtml(intro)}</p>
                <p style="margin:0 0 20px;text-align:center;"><span style="display:inline-block;border:2px dashed ${BRAND_COLOR};padding:12px 24px;font-size:24px;font-weight:700;letter-spacing:0.12em;">${escapeHtml(data.code)}</span></p>
                <p style="margin:0 0 20px;color:#6b7280;">Enter it at checkout under "Add Promotion Code".${returnNote ? ` ${escapeHtml(returnNote)}` : ""}</p>
                <a href="${escapeHtml(data.store_url)}" style="display:inline-block;background:${BRAND_COLOR};color:#ffffff;text-decoration:none;font-weight:700;padding:12px 24px;border-radius:6px;">Shop now</a>`
  )

  return {
    subject: `Your ${data.discount_percent}% off code from ${data.store_name}`,
    html,
    text: [
      intro,
      "",
      `Code: ${data.code}`,
      'Enter it at checkout under "Add Promotion Code".',
      ...(returnNote ? [returnNote] : []),
      "",
      data.store_url,
    ].join("\n"),
  }
}

// Keyed by the `template` passed to `createNotifications`.
export const templates: Record<string, (data: any) => EmailContent> = {
  "order-placed": orderPlaced,
  "password-reset": passwordReset,
  "fitment-request-received": fitmentRequestReceived,
  "fitment-request-new": fitmentRequestNew,
  "fitment-discount-code": fitmentDiscountCode,
}
