import { HookedInputResourceGroup } from '#ui/forms/InputResourceGroup'
import { HookedToggleButtons } from '#ui/forms/ToggleButtons'
import { useFormContext } from 'react-hook-form'
import { type FilterItemOptions, type FilterItemTextSearch } from './types'
import { computeFilterLabel } from './utils'

interface FieldProps {
  item: FilterItemOptions | FilterItemTextSearch
}

export function FieldItem({ item }: FieldProps): JSX.Element | null {
  const { watch } = useFormContext()

  if (item.hidden === true) {
    return null
  }

  switch (item.render.component) {
    case 'searchBar':
      return null

    case 'toggleButtons':
      return (
        <HookedToggleButtons
          label={
            item.render.props.mode === 'multi'
              ? computeFilterLabel({
                  label: item.label,
                  selectedCount: watch(item.sdk.predicate)?.length,
                  totalCount: item.render.props.options.length
                })
              : item.label
          }
          name={item.sdk.predicate}
          mode={item.render.props.mode}
          options={item.render.props.options.filter(
            (opt) => opt.isHidden !== true
          )}
        />
      )

    case 'inputResourceGroup':
      return (
        <HookedInputResourceGroup
          name={item.sdk.predicate}
          title={item.label}
          {...item.render.props}
        />
      )
  }
}
