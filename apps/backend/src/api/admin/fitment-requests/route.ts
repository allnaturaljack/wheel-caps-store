import type { MedusaRequest, MedusaResponse } from "@medusajs/framework/http"

import { FITMENT_REQUEST_MODULE } from "../../../modules/fitment-request"
import type FitmentRequestModuleService from "../../../modules/fitment-request/service"

export async function GET(req: MedusaRequest, res: MedusaResponse) {
  const fitmentRequests = req.scope.resolve<FitmentRequestModuleService>(
    FITMENT_REQUEST_MODULE
  )
  const requests = await fitmentRequests.listFitmentRequests(
    {},
    { order: { created_at: "DESC" }, take: 500 }
  )

  res.json({ fitment_requests: requests })
}
