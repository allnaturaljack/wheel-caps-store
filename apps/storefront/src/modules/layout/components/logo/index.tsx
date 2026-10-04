import { BRAND } from "@lib/brand"
import { clx } from "@modules/common/components/ui"

// "light" is for dark backgrounds (header, footer); "dark" for light ones.
const LOGO_FILES = {
  light: "/brand/logo-light.webp",
  dark: "/brand/logo-dark.webp",
}

const Logo = ({
  variant = "light",
  className,
}: {
  variant?: keyof typeof LOGO_FILES
  className?: string
}) => {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={LOGO_FILES[variant]}
      alt={BRAND.name}
      width={480}
      height={108}
      className={clx("block h-8 w-auto small:h-10", className)}
    />
  )
}

export default Logo
