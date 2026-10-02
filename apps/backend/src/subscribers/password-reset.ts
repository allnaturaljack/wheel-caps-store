import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { Modules } from "@medusajs/framework/utils"

import { getStoreName } from "../lib/store-name"
import type { PasswordResetData } from "../modules/resend/templates"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const params = new URLSearchParams({
    token: data.token,
    email: data.entity_id,
  })

  // Admin users reset in the dashboard; customers on the storefront, which
  // adds the country prefix to the path itself.
  const resetUrl =
    data.actor_type === "user"
      ? `${
          process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
        }/app/reset-password?${params}`
      : `${
          process.env.STOREFRONT_URL || "http://localhost:8000"
        }/reset-password?${params}`

  const emailData: PasswordResetData = {
    store_name: await getStoreName(container),
    reset_url: resetUrl,
  }

  await notificationModuleService.createNotifications({
    to: data.entity_id,
    channel: "email",
    template: "password-reset",
    trigger_type: "auth.password_reset",
    data: emailData,
  })
}

export const config: SubscriberConfig = {
  event: "auth.password_reset",
}
