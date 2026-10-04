import type { MedusaContainer } from "@medusajs/framework/types"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

import { getStoreName } from "./store-name"

export const FITMENT_DISCOUNT_PERCENT = 20

type FitmentRequestRecord = {
  id: string
  name: string
  email: string
  vehicle_year: string
  vehicle_make: string
  vehicle_model: string
  method: "photos" | "mail"
  notes?: string | null
  product_handle?: string | null
}

export const describeVehicle = (request: FitmentRequestRecord) =>
  `${request.vehicle_year} ${request.vehicle_make} ${request.vehicle_model}`

// The address customers mail caps to: the first stock location with a street
// address (Admin > Settings > Locations & Shipping).
const getMailingAddress = async (container: MedusaContainer) => {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const { data } = await query.graph({
    entity: "stock_location",
    fields: ["name", "address.*"],
  })
  const address = data.find((location) => location.address?.address_1)?.address

  if (!address) {
    return null
  }

  return [
    address.company,
    address.address_1,
    address.address_2,
    [[address.city, address.province].filter(Boolean).join(", "), address.postal_code]
      .filter(Boolean)
      .join(" "),
  ].filter((line): line is string => Boolean(line))
}

// Confirmation to the customer and an alert to the store.
export const sendFitmentRequestEmails = async (
  container: MedusaContainer,
  request: FitmentRequestRecord
) => {
  const notifications = container.resolve(Modules.NOTIFICATION)
  const storeName = await getStoreName(container)
  const vehicle = describeVehicle(request)

  await notifications.createNotifications({
    to: request.email,
    channel: "email",
    template: "fitment-request-received",
    trigger_type: "fitment_request.created",
    resource_id: request.id,
    resource_type: "fitment_request",
    data: {
      store_name: storeName,
      name: request.name,
      vehicle,
      method: request.method,
      mailing_address: request.method === "mail" ? await getMailingAddress(container) : null,
      discount_percent: FITMENT_DISCOUNT_PERCENT,
    },
  })

  const storeEmail =
    process.env.STORE_NOTIFICATION_EMAIL || process.env.RESEND_REPLY_TO_EMAIL

  if (storeEmail) {
    await notifications.createNotifications({
      to: storeEmail,
      channel: "email",
      template: "fitment-request-new",
      trigger_type: "fitment_request.created",
      resource_id: request.id,
      resource_type: "fitment_request",
      data: {
        store_name: storeName,
        name: request.name,
        email: request.email,
        vehicle,
        method: request.method,
        notes: request.notes ?? null,
        product_handle: request.product_handle ?? null,
        admin_url: `${
          process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
        }/app/fitment-requests`,
      },
    })
  }
}

export const sendFitmentDiscountEmail = async (
  container: MedusaContainer,
  request: FitmentRequestRecord,
  code: string
) => {
  const notifications = container.resolve(Modules.NOTIFICATION)

  await notifications.createNotifications({
    to: request.email,
    channel: "email",
    template: "fitment-discount-code",
    trigger_type: "fitment_request.code_sent",
    resource_id: request.id,
    resource_type: "fitment_request",
    data: {
      store_name: await getStoreName(container),
      name: request.name,
      vehicle: describeVehicle(request),
      code,
      discount_percent: FITMENT_DISCOUNT_PERCENT,
      store_url: process.env.STOREFRONT_URL || "http://localhost:8000",
      returns_original: request.method === "mail",
    },
  })
}
