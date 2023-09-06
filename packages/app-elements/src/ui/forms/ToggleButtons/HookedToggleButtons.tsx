import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from '../ReactHookForm'
import { ToggleButtons, type ToggleButtonsProps } from './ToggleButtons'

type Props = Omit<ToggleButtonsProps, 'value' | 'onChange'> & {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `ToggleButtons` component ready to be used with the `react-hook-form` context.
 * Stored value will be a string when used as `mode="single"` or an array of strings when `mode="multiple"`.
 * @see ToggleButtons
 */
export function HookedToggleButtons({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <ToggleButtons
          {...props}
          value={value}
          onChange={onChange}
          feedback={feedback}
        />
      )}
    />
  )
}

HookedToggleButtons.displayName = 'HookedToggleButtons'
