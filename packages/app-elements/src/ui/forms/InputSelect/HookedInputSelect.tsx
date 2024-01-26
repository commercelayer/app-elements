import { useEffect, useRef, useState } from 'react'
import { Controller, useFormContext } from 'react-hook-form'
import { type GroupBase, type SelectInstance } from 'react-select'
import { useValidationFeedback } from '../ReactHookForm'
import {
  InputSelect,
  type InputSelectProps,
  type InputSelectValue
} from './InputSelect'
import { flatSelectValues, getDefaultValueFromFlatten } from './utils'

export interface HookedInputSelectProps
  extends Omit<InputSelectProps, 'onSelect' | 'defaultValue'> {
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

/**
 * `InputSelect` component ready to be used with the `react-hook-form` context.
 * Value to be stored in the field can be controlled from the `pathToValue` prop.
 * @see InputSelect
 */
export const HookedInputSelect: React.FC<HookedInputSelectProps> = ({
  name,
  pathToValue = 'value',
  ...props
}: HookedInputSelectProps) => {
  const { control, watch, getValues } = useFormContext()
  const feedback = useValidationFeedback(name)
  const [prevWatched, setPrevWatched] = useState(getValues(name))

  const watched = watch(name)

  const ref =
    useRef<
      SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>
    >(null)

  useEffect(
    function resetInput() {
      if (ref.current != null && watched == null && prevWatched !== watched) {
        ref.current.clearValue()
      }
      setPrevWatched(watched)
    },
    [watched, ref]
  )

  const isAsync = props.loadAsyncValues != null

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <InputSelect
          {...props}
          ref={ref}
          onBlur={onBlur}
          defaultValue={
            isAsync
              ? getDefaultValueFromFlatten({
                  initialValues: props.initialValues,
                  currentValue: value,
                  pathToValue
                })
              : undefined
          }
          value={
            !isAsync
              ? getDefaultValueFromFlatten({
                  initialValues: props.initialValues,
                  currentValue: value,
                  pathToValue
                })
              : undefined
          }
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
