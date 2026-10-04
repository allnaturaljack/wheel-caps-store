import { model } from "@medusajs/framework/utils"

// A customer's request for a cap to fit a truck the catalog doesn't cover yet.
const FitmentRequest = model.define("fitment_request", {
  id: model.id({ prefix: "fitreq" }).primaryKey(),
  name: model.text(),
  email: model.text(),
  vehicle_year: model.text(),
  vehicle_make: model.text(),
  vehicle_model: model.text(),
  // How the customer will share their cap: photos by email, or the cap itself.
  method: model.enum(["photos", "mail"]),
  notes: model.text().nullable(),
  product_handle: model.text().nullable(),
  status: model.enum(["new", "code_sent"]).default("new"),
  discount_code: model.text().nullable(),
})

export default FitmentRequest
