import { BRAND } from "@lib/brand"
import { clx } from "@modules/common/components/ui"

const Logo = ({ className }: { className?: string }) => {
  return (
    <span className={clx("inline-flex items-center gap-2.5", className)}>
      <svg viewBox="0 0 32 32" className="h-7 w-7 shrink-0" aria-hidden>
        <polygon
          points="16,1.5 28.6,8.75 28.6,23.25 16,30.5 3.4,23.25 3.4,8.75"
          className="fill-brand"
        />
        <circle cx="16" cy="16" r="7.5" className="fill-ink-900" />
        <circle cx="16" cy="16" r="3" className="fill-brand" />
      </svg>
      <span className="font-display text-2xl font-bold uppercase tracking-wider leading-none">
        {BRAND.name}
      </span>
    </span>
  )
}

export default Logo
