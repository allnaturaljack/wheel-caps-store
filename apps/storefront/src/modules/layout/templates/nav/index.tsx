import { Suspense } from "react"

import { listLocales } from "@lib/data/locales"
import { getLocale } from "@lib/data/locale-actions"
import { listRegions } from "@lib/data/regions"
import { StoreRegion } from "@medusajs/types"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import CartButton from "@modules/layout/components/cart-button"
import Logo from "@modules/layout/components/logo"
import Search from "@modules/layout/components/search"
import SideMenu from "@modules/layout/components/side-menu"

const NAV_LINKS = [
  { label: "Shop All", href: "/store" },
  { label: "Center Caps", href: "/categories/center-caps" },
  { label: "Lug Nut Covers", href: "/categories/lug-nut-covers" },
]

export default async function Nav() {
  const [regions, locales, currentLocale] = await Promise.all([
    listRegions().then((regions: StoreRegion[]) => regions),
    listLocales(),
    getLocale(),
  ])

  return (
    <div className="sticky top-0 inset-x-0 z-50 group">
      <div className="bg-brand text-white">
        <p className="content-container py-1.5 text-center font-display text-sm font-semibold uppercase tracking-[0.18em]">
          Printed to order &middot; Ships in 3&ndash;5 business days
        </p>
      </div>
      <header className="relative h-16 mx-auto bg-ink-900 border-b border-white/10">
        <nav className="content-container text-white/70 flex items-center justify-between w-full h-full text-sm">
          <div className="flex items-center gap-x-6 h-full flex-1 basis-0">
            <div className="h-full small:hidden">
              <SideMenu
                regions={regions}
                locales={locales}
                currentLocale={currentLocale}
              />
            </div>
            <LocalizedClientLink
              href="/"
              className="hidden small:flex text-white"
              data-testid="nav-store-link"
            >
              <Logo />
            </LocalizedClientLink>
          </div>

          <LocalizedClientLink href="/" className="small:hidden text-white">
            <Logo />
          </LocalizedClientLink>

          <ul className="hidden small:flex items-center gap-x-9 h-full">
            {NAV_LINKS.map((link) => (
              <li key={link.href} className="h-full">
                <LocalizedClientLink
                  href={link.href}
                  className="flex h-full items-center border-b-2 border-transparent font-display text-base font-semibold uppercase tracking-[0.14em] transition-colors hover:border-brand hover:text-white"
                >
                  {link.label}
                </LocalizedClientLink>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-x-4 small:gap-x-6 h-full flex-1 basis-0 justify-end whitespace-nowrap">
            <Search />
            <div className="hidden small:flex items-center gap-x-6 h-full">
              <LocalizedClientLink
                className="hover:text-white"
                href="/account"
                data-testid="nav-account-link"
              >
                Account
              </LocalizedClientLink>
            </div>
            <Suspense
              fallback={
                <LocalizedClientLink
                  className="hover:text-white flex gap-2"
                  href="/cart"
                  data-testid="nav-cart-link"
                >
                  Cart (0)
                </LocalizedClientLink>
              }
            >
              <CartButton />
            </Suspense>
          </div>
        </nav>
      </header>
    </div>
  )
}
