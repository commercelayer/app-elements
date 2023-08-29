import {
  InputSelect,
  flatSelectValues,
  getDefaultValueFromFlatten,
  type InputSelectProps
} from '#ui/forms/InputSelect'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

interface Props extends Omit<InputSelectProps, 'onSelect' | 'defaultValue'> {
  /**
   * field name to match hook-form state
   */
  name: string
  /**
   * Specify the path (in the `SelectValue` object) to reach the value to store in field.
   * @default
   * "value"
   *
   * Example:
   * ```
   * // single mode
   * {value: 'ff0000', label: 'Red'} // set field value as 'ff0000'
   *
   * // multi mode
   * [{value: 'ff0000', label: 'Red'}, {value: 'ffff00', label: 'Yellow'}]
   * // set field value as ['ff0000', 'ffff00']
   * ```
   */
  pathToValue?: string
}

function HookedInputSelect({
  name,
  pathToValue = 'value',
  ...props
}: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <InputSelect
          {...props}
          onBlur={onBlur}
          defaultValue={getDefaultValueFromFlatten({
            initialValues: props.initialValues,
            currentValue: value,
            pathToValue
          })}
          onSelect={(values) => {
            onChange(flatSelectValues(values, pathToValue))
          }}
          feedback={feedback}
        />
      )}
    />
  )
}

HookedInputSelect.displayName = 'HookedInputSelect'
export { HookedInputSelect }
