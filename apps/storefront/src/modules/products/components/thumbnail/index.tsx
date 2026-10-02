import { Container, clx } from "@modules/common/components/ui"
import Image from "next/image"
import React from "react"

import { WheelHighlight } from "@lib/util/product-art"
import WheelArt from "@modules/common/components/wheel-art"

type ThumbnailProps = {
  thumbnail?: string | null
  images?: { url?: string }[] | null
  size?: "small" | "medium" | "large" | "full" | "square"
  // Illustration used until the product has photos.
  artColor?: string
  artHighlight?: WheelHighlight
  className?: string
  "data-testid"?: string
}

const Thumbnail: React.FC<ThumbnailProps> = ({
  thumbnail,
  images,
  size = "small",
  artColor,
  artHighlight,
  className,
  "data-testid": dataTestid,
}) => {
  const initialImage = thumbnail || images?.[0]?.url

  return (
    <Container
      className={clx(
        "relative w-full overflow-hidden p-4 rounded-xl bg-gradient-to-br from-ink-700 to-ink-950 aspect-[1/1]",
        className,
        {
          "w-[180px]": size === "small",
          "w-[290px]": size === "medium",
          "w-[440px]": size === "large",
          "w-full": size === "full" || size === "square",
        }
      )}
      data-testid={dataTestid}
    >
      {initialImage ? (
        <Image
          src={initialImage}
          alt="Thumbnail"
          className="absolute inset-0 object-cover object-center"
          draggable={false}
          quality={50}
          sizes="(max-width: 576px) 280px, (max-width: 768px) 360px, (max-width: 992px) 480px, 800px"
          fill
        />
      ) : (
        <div className="absolute inset-0 flex items-center justify-center p-[10%]">
          <WheelArt
            color={artColor}
            highlight={artHighlight}
            className="h-full w-full transition-transform duration-500 ease-out group-hover:rotate-[22.5deg] group-hover:scale-105"
          />
        </div>
      )}
    </Container>
  )
}

export default Thumbnail
