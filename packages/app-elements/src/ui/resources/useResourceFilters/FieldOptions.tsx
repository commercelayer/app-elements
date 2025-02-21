import { HookedInputResourceGroup } from '#ui/forms/InputResourceGroup'
import { HookedInputToggleButton } from '#ui/forms/InputToggleButton'
import { type JSX } from 'react'
import { useFormContext } from 'react-hook-form'
import { type FilterItemOptions } from './types'
import { computeFilterLabel } from './utils'

interface FieldProps {
  item: FilterItemOptions
}

export function FieldOptions({ item }: FieldProps): JSX.Element | null {
  const { watch } = useFormContext()

  switch (item.render.component) {
    case 'inputToggleButton':
      return (
        <HookedInputToggleButton
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
