// Drives the illustrated wheel shown wherever a product has no photos yet.

export const CAP_COLORS: Record<string, string> = {
  "Matte Black": "#26282c",
  "Safety Orange": "#ff5a1f",
  "Signal Red": "#d3241c",
}

export const DEFAULT_CAP_COLOR = CAP_COLORS["Safety Orange"]

export type WheelHighlight = "cap" | "lugs"

export const getWheelHighlight = (handle?: string | null): WheelHighlight =>
  handle?.includes("lug") ? "lugs" : "cap"

export const getCapColor = (label?: string | null) =>
  (label && CAP_COLORS[label]) || DEFAULT_CAP_COLOR

// Line items only carry the variant title ("<fitment> / <color>"), so match
// the color label inside it.
export const getLineItemArt = (item: {
  product_handle?: string | null
  variant_title?: string | null
}) => ({
  artHighlight: getWheelHighlight(item.product_handle),
  artColor: getCapColor(
    Object.keys(CAP_COLORS).find((label) => item.variant_title?.includes(label))
  ),
})
