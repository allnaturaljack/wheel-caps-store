import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

import { getStoreName } from "../lib/store-name"
import type { OrderPlacedData } from "../modules/resend/templates"

export default async function orderPlacedHandler({
  event: { data },
  container,
}: SubscriberArgs<{ id: string }>) {
  const query = container.resolve(ContainerRegistrationKeys.QUERY)
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)

  const {
    data: [order],
  } = await query.graph({
    entity: "order",
    fields: [
      "id",
      "display_id",
      "email",
      "currency_code",
      "item_subtotal",
      "shipping_total",
      "tax_total",
      "total",
      "items.title",
      "items.variant_title",
      "items.quantity",
      "items.total",
      "shipping_address.first_name",
      "shipping_address.last_name",
      "shipping_address.address_1",
      "shipping_address.address_2",
      "shipping_address.city",
      "shipping_address.province",
      "shipping_address.postal_code",
      "shipping_address.country_code",
    ],
    filters: { id: data.id },
  })

  if (!order?.email) {
    return
  }

  const emailData: OrderPlacedData = {
    store_name: await getStoreName(container),
    display_id: order.display_id!,
    currency_code: order.currency_code!,
    items: (order.items ?? []).map((item) => ({
      title: item!.title,
      variant_title: item!.variant_title,
      quantity: Number(item!.quantity),
      total: Number(item!.total),
    })),
    subtotal: Number(order.item_subtotal),
    shipping_total: Number(order.shipping_total),
    tax_total: Number(order.tax_total),
    total: Number(order.total),
    shipping_address: order.shipping_address,
  }

  await notificationModuleService.createNotifications({
    to: order.email,
    channel: "email",
    template: "order-placed",
    trigger_type: "order.placed",
    resource_id: order.id,
    resource_type: "order",
    data: emailData,
  })
}

export const config: SubscriberConfig = {
  event: "order.placed",
}
