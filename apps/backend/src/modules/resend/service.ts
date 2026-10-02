import type {
  Logger,
  ProviderSendNotificationDTO,
  ProviderSendNotificationResultsDTO,
} from "@medusajs/framework/types"
import {
  AbstractNotificationProviderService,
  MedusaError,
} from "@medusajs/framework/utils"

import { templates } from "./templates"

type ResendOptions = {
  api_key: string
  from: string
  reply_to?: string
}

type InjectedDependencies = {
  logger: Logger
}

const RESEND_API_URL = "https://api.resend.com/emails"

class ResendNotificationProviderService extends AbstractNotificationProviderService {
  static identifier = "notification-resend"

  protected options_: ResendOptions
  protected logger_: Logger

  static validateOptions(options: Record<any, any>) {
    for (const name of ["api_key", "from"]) {
      if (!options[name]) {
        throw new MedusaError(
          MedusaError.Types.INVALID_DATA,
          `Option \`${name}\` is required in the Resend notification provider.`
        )
      }
    }
  }

  constructor({ logger }: InjectedDependencies, options: ResendOptions) {
    super()
    this.options_ = options
    this.logger_ = logger
  }

  async send(
    notification: ProviderSendNotificationDTO
  ): Promise<ProviderSendNotificationResultsDTO> {
    if (!notification) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No notification information provided`
      )
    }

    const content = notification.content?.html
      ? notification.content
      : templates[notification.template]?.(notification.data ?? {})

    if (!content) {
      throw new MedusaError(
        MedusaError.Types.INVALID_DATA,
        `No email template named "${notification.template}"`
      )
    }

    const response = await fetch(RESEND_API_URL, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${this.options_.api_key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: notification.from?.trim() || this.options_.from,
        to: [notification.to],
        reply_to: this.options_.reply_to || undefined,
        subject: content.subject,
        html: content.html,
        text: content.text,
      }),
    })
    const body = await response.json().catch(() => null)

    if (!response.ok) {
      throw new MedusaError(
        MedusaError.Types.UNEXPECTED_STATE,
        `Failed to send email: ${response.status} - ${
          body?.message ?? "unknown error"
        }`
      )
    }

    return { id: body?.id }
  }
}

export default ResendNotificationProviderService
