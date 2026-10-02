import type { SubscriberArgs, SubscriberConfig } from "@medusajs/framework"
import { ContainerRegistrationKeys, Modules } from "@medusajs/framework/utils"

import { getStoreName } from "../lib/store-name"
import type { PasswordResetData } from "../modules/resend/templates"

export default async function passwordResetHandler({
  event: { data },
  container,
}: SubscriberArgs<{ entity_id: string; actor_type: string; token: string }>) {
  const logger = container.resolve(ContainerRegistrationKeys.LOGGER)

  // Only admin users can reset by email for now: the storefront has no
  // reset-password page for a customer link to land on.
  if (data.actor_type !== "user") {
    logger.warn(
      `Password reset requested for actor type "${data.actor_type}", which has no reset page. No email sent.`
    )
    return
  }

  const notificationModuleService = container.resolve(Modules.NOTIFICATION)
  const backendUrl = process.env.MEDUSA_BACKEND_URL || "http://localhost:9000"
  const params = new URLSearchParams({
    token: data.token,
    email: data.entity_id,
  })

  const emailData: PasswordResetData = {
    store_name: await getStoreName(container),
    reset_url: `${backendUrl}/app/reset-password?${params}`,
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
