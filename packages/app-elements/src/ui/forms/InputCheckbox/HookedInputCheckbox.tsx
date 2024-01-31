import { useValidationFeedback } from '#ui/forms/ReactHookForm'
import { isDefined } from '#utils/array'
import { filterByDisplayName } from '#utils/children'
import { useEffect, useMemo } from 'react'
import { useFormContext } from 'react-hook-form'
import { InputCheckbox, type InputCheckboxProps } from './InputCheckbox'

export interface HookedInputCheckboxProps
  extends Omit<
    InputCheckboxProps,
    'onChange' | 'checked' | 'feedback' | 'defaultValue' | 'defaultChecked'
  > {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputCheckbox` component ready to be used with the `react-hook-form` context.
 * @see InputCheckbox
 */
export function HookedInputCheckbox({
  name,
  ...props
}: HookedInputCheckboxProps): JSX.Element {
  const { register, getValues, watch, resetField, setValue } = useFormContext()
  const feedback = useValidationFeedback(name)
  const isChecked = Boolean(watch(name))

  /** Array of all `Hooked*` components from `checkedElement` */
  const childrenFieldNames = useMemo<string[]>(() => {
    if (props.checkedElement != null) {
      return filterByDisplayName(props.checkedElement, /^Hooked/)
        .map((child) => child.props.name as string | undefined)
        .filter(isDefined)
    }
    return []
  }, [props.checkedElement])

  useEffect(() => {
    if (childrenFieldNames.length > 0) {
      childrenFieldNames.forEach((fieldName) => {
        if (isChecked) {
          resetField(fieldName)
        } else {
          setValue(fieldName, undefined)
        }
      })
    }
  }, [isChecked])

  return (
    <InputCheckbox
      {...props}
      defaultChecked={getValues(name)}
      {...register(name)}
      feedback={feedback}
    />
  )
}

HookedInputCheckbox.displayName = 'HookedInputCheckbox'
