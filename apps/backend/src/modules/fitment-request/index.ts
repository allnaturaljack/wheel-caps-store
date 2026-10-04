import { Module } from "@medusajs/framework/utils"

import FitmentRequestModuleService from "./service"

export const FITMENT_REQUEST_MODULE = "fitmentRequest"

export default Module(FITMENT_REQUEST_MODULE, {
  service: FitmentRequestModuleService,
})
