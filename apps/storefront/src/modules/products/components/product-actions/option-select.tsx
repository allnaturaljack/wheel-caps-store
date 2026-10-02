import { CAP_COLORS } from "@lib/util/product-art"
import { HttpTypes } from "@medusajs/types"
import { clx } from "@modules/common/components/ui"
import React from "react"

type OptionSelectProps = {
  option: HttpTypes.StoreProductOption
  current: string | undefined
  updateOption: (title: string, value: string) => void
  title: string
  disabled: boolean
  "data-testid"?: string
}

const OptionSelect: React.FC<OptionSelectProps> = ({
  option,
  current,
  updateOption,
  title,
  "data-testid": dataTestId,
  disabled,
}) => {
  const filteredOptions = (option.values ?? []).map((v) => v.value)
  // Long labels (e.g. truck fitments) get a full-width row each.
  const stacked = filteredOptions.some((v) => v.length > 16)

  return (
    <div className="flex flex-col gap-y-3">
      <span className="flex items-baseline gap-x-2 font-display text-base font-semibold uppercase tracking-[0.14em] text-ink-900">
        {title}
        {current && (
          <span className="font-sans text-sm font-normal normal-case tracking-normal text-grey-50">
            {current}
          </span>
        )}
      </span>
      <div
        className={clx("grid gap-2", stacked ? "grid-cols-1" : "grid-cols-3")}
        data-testid={dataTestId}
      >
        {filteredOptions.map((v) => {
          return (
            <button
              onClick={() => updateOption(option.id, v)}
              key={v}
              className={clx(
                "flex min-h-11 items-center gap-x-2.5 rounded-md border px-3 py-2 text-left text-sm transition-colors duration-150",
                {
                  "border-ink-900 bg-ink-900 text-white": v === current,
                  "border-grey-20 bg-white text-ink-900 hover:border-ink-900":
                    v !== current,
                }
              )}
              disabled={disabled}
              data-testid="option-button"
            >
              {CAP_COLORS[v] && (
                <span
                  className="h-4 w-4 shrink-0 rounded-full ring-1 ring-white/40"
                  style={{ backgroundColor: CAP_COLORS[v] }}
                />
              )}
              {v}
            </button>
          )
        })}
      </div>
    </div>
  )
}

export default OptionSelect
