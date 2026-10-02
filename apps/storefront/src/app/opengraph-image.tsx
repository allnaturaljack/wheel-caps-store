import { BRAND } from "@lib/brand"
import { renderShareImage, shareImageSize } from "@lib/share-image"

export const alt = BRAND.name
export const size = shareImageSize
export const contentType = "image/png"

export default function Image() {
  return renderShareImage()
}
