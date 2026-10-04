import { MedusaService } from "@medusajs/framework/utils"

import FitmentRequest from "./models/fitment-request"

class FitmentRequestModuleService extends MedusaService({
  FitmentRequest,
}) {}

export default FitmentRequestModuleService
