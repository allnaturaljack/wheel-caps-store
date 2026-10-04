import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"
import { MedusaError } from "@medusajs/framework/utils"
import { randomBytes } from "node:crypto"

import {
  describeVehicle,
  sendFitmentDiscountEmail,
} from "../../../../../lib/fitment-requests"
import { sendFitmentDiscountWorkflow } from "../../../../../workflows/fitment-requests/send-fitment-discount"
import { FITMENT_REQUEST_MODULE } from "../../../../../modules/fitment-request"
import type FitmentRequestModuleService from "../../../../../modules/fitment-request/service"

// Creates a single-use discount code for the request and emails it.
export async function POST(req: MedusaRequest, res: MedusaResponse) {
  const fitmentRequests = req.scope.resolve<FitmentRequestModuleService>(
    FITMENT_REQUEST_MODULE
  )
  const request = await fitmentRequests.retrieveFitmentRequest(req.params.id)

  if (request.status === "code_sent") {
    throw new MedusaError(
      MedusaError.Types.NOT_ALLOWED,
      `A code (${request.discount_code}) was already sent for this request.`
    )
  }

  const code = `FIT-${randomBytes(3).toString("hex").toUpperCase()}`

  const { result: updated } = await sendFitmentDiscountWorkflow(req.scope).run({
    input: {
      fitment_request_id: request.id,
      code,
      vehicle: describeVehicle(request),
    },
  })

  await sendFitmentDiscountEmail(req.scope, updated, code)

  res.json({ fitment_request: updated })
}
