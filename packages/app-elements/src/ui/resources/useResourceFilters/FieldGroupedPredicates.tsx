import type { JSX } from "react"
import { useFormContext } from "react-hook-form"
import { HookedInputSelect } from "#ui/forms/InputSelect"
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

  const visibleOptions = item.render.props.options
    .filter((opt) => opt.isHidden !== true)
    .map(({ label, value }) => ({ label, value }))

  const selectedValue = watch(item.urlParamKey) as string | string[] | undefined

  if (item.render.component === "inputSelect") {
    return (
      <HookedInputSelect
        name={item.urlParamKey}
        label={item.label}
        initialValues={visibleOptions}
        isMulti={false}
        isClearable={item.render.props.isClearable}
        placeholder={item.render.props.placeholder}
      />
    )
  }

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
      name={item.urlParamKey}
      mode={item.render.props.mode}
      options={visibleOptions}
    />
  )
}

FieldGroupedPredicates.displayName = "FieldGroupedPredicates"
