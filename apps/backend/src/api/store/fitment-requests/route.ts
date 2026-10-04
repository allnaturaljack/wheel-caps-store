import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { ContainerRegistrationKeys, MedusaError } from "@medusajs/framework/utils"
import { z } from "@medusajs/framework/zod"

import { sendFitmentRequestEmails } from "../../../lib/fitment-requests"
import { createFitmentRequestWorkflow } from "../../../workflows/fitment-requests/create-fitment-request"

const CreateFitmentRequestSchema = z.object({
  name: z.string().trim().min(1).max(200),
  email: z.email().max(320),
  vehicle_year: z.string().trim().min(2).max(10),
  vehicle_make: z.string().trim().min(1).max(100),
  vehicle_model: z.string().trim().min(1).max(100),
  method: z.enum(["photos", "mail"]),
  notes: z.string().trim().max(2000).optional(),
  product_handle: z.string().trim().max(200).optional(),
})

export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const parsed = CreateFitmentRequestSchema.safeParse(req.body)

  if (!parsed.success) {
    throw new MedusaError(
      MedusaError.Types.INVALID_DATA,
      `Please check: ${parsed.error.issues.map((issue) => issue.path.join(".")).join(", ")}`
    )
  }

  const { result: request } = await createFitmentRequestWorkflow(req.scope).run({
    input: parsed.data,
  })

  // The request is saved either way; a failed email shouldn't fail the form.
  await sendFitmentRequestEmails(req.scope, request).catch((error) => {
    req.scope
      .resolve(ContainerRegistrationKeys.LOGGER)
      .error(`Fitment request ${request.id}: email failed: ${error.message}`)
  })

  res.status(201).json({ fitment_request: { id: request.id } })
}
