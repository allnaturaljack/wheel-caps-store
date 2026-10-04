"use server"

import { sdk } from "@lib/config"

export type FitmentRequestState =
  | { state: "sent"; email: string }
  | { state: "error"; error: string }
  | null

// Asks the store to make a cap for a truck the catalog doesn't cover yet.
export async function submitFitmentRequest(
  _currentState: unknown,
  formData: FormData
): Promise<FitmentRequestState> {
  const field = (name: string) => ((formData.get(name) as string) || "").trim()

  const body = {
    name: field("name"),
    email: field("email"),
    vehicle_year: field("vehicle_year"),
    vehicle_make: field("vehicle_make"),
    vehicle_model: field("vehicle_model"),
    method: field("method"),
    notes: field("notes") || undefined,
    product_handle: field("product_handle") || undefined,
  }

  try {
    await sdk.client.fetch("/store/fitment-requests", {
      method: "POST",
      body,
    })
  } catch {
    return {
      state: "error",
      error: "We couldn't send your request. Check the form and try again.",
    }
  }

  return { state: "sent", email: body.email }
}
