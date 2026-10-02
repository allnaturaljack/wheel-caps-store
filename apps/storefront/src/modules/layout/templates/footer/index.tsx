import { BRAND } from "@lib/brand"
import { listCategories } from "@lib/data/categories"
import LocalizedClientLink from "@modules/common/components/localized-client-link"
import Logo from "@modules/layout/components/logo"

const FITMENTS = [
  "Ford Super Duty (8x170)",
  "Ram 2500/3500 (8x165.1)",
  "GM 2500HD/3500HD (8x180)",
]

const ACCOUNT_LINKS = [
  { label: "My account", href: "/account" },
  { label: "Orders", href: "/account/orders" },
  { label: "Cart", href: "/cart" },
]

const columnTitle =
  "font-display text-base font-semibold uppercase tracking-[0.16em] text-white"

export default async function Footer() {
  const productCategories = await listCategories()
  const topLevelCategories = (productCategories ?? []).filter(
    (c) => !c.parent_category
  )

  return (
    <footer className="w-full bg-ink-900 text-white/60">
      <div className="content-container flex flex-col w-full">
        <div className="grid gap-12 py-16 small:grid-cols-[1.4fr_1fr_1fr_1fr] small:py-20">
          <div className="flex flex-col gap-y-4 max-w-xs">
            <LocalizedClientLink href="/" className="text-white">
              <Logo />
            </LocalizedClientLink>
            <p className="text-sm leading-6">{BRAND.tagline}</p>
          </div>

          <div className="flex flex-col gap-y-4">
            <span className={columnTitle}>Shop</span>
            <ul className="grid gap-y-2.5 text-sm" data-testid="footer-categories">
              <li>
                <LocalizedClientLink href="/store" className="hover:text-white">
                  All products
                </LocalizedClientLink>
              </li>
              {topLevelCategories.slice(0, 6).map((c) => (
                <li key={c.id}>
                  <LocalizedClientLink
                    className="hover:text-white"
                    href={`/categories/${c.handle}`}
                    data-testid="category-link"
                  >
                    {c.name}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-y-4">
            <span className={columnTitle}>Fitments</span>
            <ul className="grid gap-y-2.5 text-sm">
              {FITMENTS.map((fitment) => (
                <li key={fitment}>{fitment}</li>
              ))}
            </ul>
          </div>

          <div className="flex flex-col gap-y-4">
            <span className={columnTitle}>Account</span>
            <ul className="grid gap-y-2.5 text-sm">
              {ACCOUNT_LINKS.map((link) => (
                <li key={link.href}>
                  <LocalizedClientLink
                    href={link.href}
                    className="hover:text-white"
                  >
                    {link.label}
                  </LocalizedClientLink>
                </li>
              ))}
            </ul>
          </div>
        </div>
        <div className="flex w-full border-t border-white/10 py-6 text-xs text-white/40">
          © {new Date().getFullYear()} {BRAND.name}. All rights reserved.
        </div>
      </div>
    </footer>
  )
}
