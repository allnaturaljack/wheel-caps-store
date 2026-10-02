import { getCapColor, getWheelHighlight } from "@lib/util/product-art"
import { HttpTypes } from "@medusajs/types"
import { Container } from "@modules/common/components/ui"
import WheelArt from "@modules/common/components/wheel-art"
import Image from "next/image"

type ImageGalleryProps = {
  images: HttpTypes.StoreProductImage[]
  handle?: string | null
  selectedColor?: string
}

const ImageGallery = ({ images, handle, selectedColor }: ImageGalleryProps) => {
  if (!images.length) {
    return (
      <div className="relative flex aspect-square w-full items-center justify-center overflow-hidden rounded-2xl bg-gradient-to-br from-ink-700 to-ink-950 p-[12%]">
        <div
          className="absolute left-1/2 top-1/2 h-2/3 w-2/3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-brand/20 blur-[90px]"
          aria-hidden
        />
        <WheelArt
          color={getCapColor(selectedColor)}
          highlight={getWheelHighlight(handle)}
          className="relative h-full w-full drop-shadow-[0_30px_40px_rgba(0,0,0,0.6)]"
        />
        <span className="absolute bottom-4 left-5 text-xs uppercase tracking-wider text-white/40">
          Illustration
        </span>
      </div>
    )
  }

  return (
    <div className="flex items-start relative">
      <div className="flex flex-col flex-1 gap-y-4">
        {images.map((image, index) => {
          return (
            <Container
              key={image.id}
              className="relative aspect-square w-full overflow-hidden rounded-2xl bg-ui-bg-subtle"
              id={image.id}
            >
              {!!image.url && (
                <Image
                  src={image.url}
                  priority={index <= 2 ? true : false}
                  className="absolute inset-0"
                  alt={`Product image ${index + 1}`}
                  fill
                  sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
                  style={{
                    objectFit: "cover",
                  }}
                />
              )}
            </Container>
          )
        })}
      </div>
    </div>
  )
}

export default ImageGallery
