"use client"

import { useActionState, useState } from "react"

import { submitFitmentRequest } from "@lib/data/fitment-requests"
import ErrorMessage from "@modules/checkout/components/error-message"
import { SubmitButton } from "@modules/checkout/components/submit-button"
import Input from "@modules/common/components/input"
import { clx } from "@modules/common/components/ui"

const DISCOUNT_PERCENT = 20

const METHODS = [
  {
    value: "photos",
    label: "Email photos",
    hint: "Front, back, and a tape measure across it",
  },
  {
    value: "mail",
    label: "Mail my cap",
    hint: "We'll return it with your order",
  },
]

const FitmentRequest = ({ productHandle }: { productHandle?: string | null }) => {
  const [open, setOpen] = useState(false)
  const [method, setMethod] = useState("photos")
  const [message, formAction] = useActionState(submitFitmentRequest, null)

  return (
    <div
      className="rounded-xl border border-grey-20 bg-white p-5"
      data-testid="fitment-request"
    >
      <div className="flex flex-col gap-y-1">
        <h3 className="font-display text-xl font-semibold uppercase tracking-wide text-ink-900">
          Don&apos;t see your truck?
        </h3>
        <p className="text-sm leading-6 text-grey-60">
          Send us your cap, or photos of it, and we&apos;ll make one to fit.
          You&apos;ll get{" "}
          <strong className="text-ink-900">{DISCOUNT_PERCENT}% off</strong> your
          order for helping us add your truck.
        </p>
      </div>

      {message?.state === "sent" ? (
        <p
          className="mt-4 rounded-md bg-grey-5 p-4 text-sm text-ink-900"
          data-testid="fitment-request-sent"
        >
          Thanks! We&apos;ve emailed <strong>{message.email}</strong> with the
          next steps. Your {DISCOUNT_PERCENT}% code follows once your{" "}
          {method === "mail" ? "cap" : "photos"} arrive.
        </p>
      ) : !open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="mt-4 font-display text-base font-semibold uppercase tracking-wider text-brand hover:text-brand-dark"
          data-testid="fitment-request-open"
        >
          Request your fitment &rarr;
        </button>
      ) : (
        <form action={formAction} className="mt-4 flex flex-col gap-y-3">
          <input type="hidden" name="product_handle" value={productHandle ?? ""} />
          <input type="hidden" name="method" value={method} />
          <div className="grid grid-cols-[5.5rem_1fr_1fr] gap-2">
            <Input label="Year" name="vehicle_year" required inputMode="numeric" />
            <Input label="Make" name="vehicle_make" required />
            <Input label="Model" name="vehicle_model" required />
          </div>
          <div className="grid grid-cols-1 gap-2 xsmall:grid-cols-2">
            <Input label="Name" name="name" autoComplete="name" required />
            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              required
            />
          </div>
          <fieldset className="flex flex-col gap-y-2">
            <legend className="mb-2 text-sm font-medium text-ink-900">
              How will you send it?
            </legend>
            <div className="grid grid-cols-2 gap-2">
              {METHODS.map((option) => (
                <button
                  key={option.value}
                  type="button"
                  aria-pressed={method === option.value}
                  onClick={() => setMethod(option.value)}
                  className={clx(
                    "flex flex-col items-start gap-y-0.5 rounded-md border px-3 py-2 text-left text-sm transition-colors",
                    method === option.value
                      ? "border-ink-900 bg-ink-900 text-white"
                      : "border-grey-20 bg-white text-ink-900 hover:border-ink-900"
                  )}
                >
                  <span className="font-medium">{option.label}</span>
                  <span
                    className={clx(
                      "text-xs",
                      method === option.value ? "text-white/70" : "text-grey-50"
                    )}
                  >
                    {option.hint}
                  </span>
                </button>
              ))}
            </div>
          </fieldset>
          <label className="flex flex-col gap-y-1 text-sm text-ink-900">
            Anything else? (optional)
            <textarea
              name="notes"
              rows={2}
              maxLength={2000}
              placeholder="Wheel model, bolt pattern, cap size..."
              className="rounded-md border border-grey-20 px-3 py-2 text-sm focus:border-ink-900 focus:outline-none"
            />
          </label>
          <ErrorMessage
            error={message?.state === "error" ? message.error : null}
            data-testid="fitment-request-error"
          />
          <SubmitButton
            className="h-11 w-full font-display text-base font-semibold uppercase tracking-wider"
            data-testid="fitment-request-submit"
          >
            Send request
          </SubmitButton>
        </form>
      )}
    </div>
  )
}

export default FitmentRequest
