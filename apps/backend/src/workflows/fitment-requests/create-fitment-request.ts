import {
  createStep,
  createWorkflow,
  StepResponse,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk"

import { FITMENT_REQUEST_MODULE } from "../../modules/fitment-request"
import type FitmentRequestModuleService from "../../modules/fitment-request/service"

export type CreateFitmentRequestInput = {
  name: string
  email: string
  vehicle_year: string
  vehicle_make: string
  vehicle_model: string
  method: "photos" | "mail"
  notes?: string
  product_handle?: string
}

const createFitmentRequestStep = createStep(
  "create-fitment-request",
  async (input: CreateFitmentRequestInput, { container }) => {
    const service = container.resolve<FitmentRequestModuleService>(
      FITMENT_REQUEST_MODULE
    )
    const request = await service.createFitmentRequests(input)

    return new StepResponse(request, request.id)
  },
  async (id, { container }) => {
    if (!id) {
      return
    }
    await container
      .resolve<FitmentRequestModuleService>(FITMENT_REQUEST_MODULE)
      .deleteFitmentRequests([id])
  }
)

export const createFitmentRequestWorkflow = createWorkflow(
  "create-fitment-request",
  (input: CreateFitmentRequestInput) => {
    const request = createFitmentRequestStep(input)

    return new WorkflowResponse(request)
  }
)
