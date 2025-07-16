import { useEffect, useRef, useState } from "react"
import { Controller, useFormContext } from "react-hook-form"
import type { GroupBase, SelectInstance } from "react-select"
import { useValidationFeedback } from "../ReactHookForm"
import {
  InputSelect,
  type InputSelectProps,
  type InputSelectValue,
  type PossibleSelectValue,
} from "./InputSelect"
import { flatSelectValues, getDefaultValueFromFlatten } from "./utils"

export interface HookedInputSelectProps
  extends Omit<InputSelectProps, "onSelect" | "defaultValue"> {
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
  /**
   * Optional callback executed when a value is selected to allow custom behavior and re-use the selected value.
   * This does not effect the field value neither the form state that always contains the value defined by `pathToValue`.
   * It's useful when you need to perform some action when a value is selected and accessing the `meta` key of the `InputSelectValue`
   */
  onSelect?: (value: PossibleSelectValue) => void
}

/**
 * `InputSelect` component ready to be used with the `react-hook-form` context.
 * Value to be stored in the field can be controlled from the `pathToValue` prop.
 * @see InputSelect
 */
export const HookedInputSelect: React.FC<HookedInputSelectProps> = ({
  name,
  pathToValue = "value",
  onSelect,
  ...props
}: HookedInputSelectProps) => {
  const { control, watch, getValues, formState } = useFormContext()
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
    [watched, ref],
  )

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value, onBlur } }) => (
        <InputSelect
          {...props}
          name={name}
          ref={ref}
          onBlur={onBlur}
          defaultValue={getDefaultValueFromFlatten({
            initialValues: props.initialValues,
            currentValue: value,
            pathToValue,
          })}
          value={
            formState.dirtyFields[name] !== true
              ? getDefaultValueFromFlatten({
                  initialValues: props.initialValues,
                  currentValue: value,
                  pathToValue,
                })
              : undefined
          }
          onSelect={(values) => {
            onChange(flatSelectValues(values, pathToValue))
            onSelect?.(values)
          }}
          feedback={feedback}
        />
      )}
    />
  )
}

HookedInputSelect.displayName = "HookedInputSelect"
