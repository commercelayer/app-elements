import type { JSX } from "react"
import { useFormContext } from "react-hook-form"
import { HookedInputToggleButton } from "#ui/forms/InputToggleButton"
import type { FilterItemGroupedPredicates } from "./types"
import { computeFilterLabel } from "./utils"

interface FieldGroupedPredicatesProps {
  item: FilterItemGroupedPredicates
}

export function FieldGroupedPredicates({
  item,
}: FieldGroupedPredicatesProps): JSX.Element {
  const { watch } = useFormContext()

  const visibleOptions = item.render.props.options.filter(
    (opt) => opt.isHidden !== true,
  )

  const selectedValue = watch(item.sdk.predicate) as
    | string
    | string[]
    | undefined

  const selectedCount = Array.isArray(selectedValue)
    ? selectedValue.length
    : selectedValue != null
      ? 1
      : 0

  return (
    <HookedInputToggleButton
      label={
        item.render.props.mode === "multi"
          ? computeFilterLabel({
              label: item.label,
              selectedCount,
              totalCount: visibleOptions.length,
            })
          : item.label
      }
      name={item.sdk.predicate}
      mode={item.render.props.mode}
      options={visibleOptions.map(({ label, value }) => ({ label, value }))}
    />
  )
}

FieldGroupedPredicates.displayName = "FieldGroupedPredicates"
