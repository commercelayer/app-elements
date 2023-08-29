import { ToggleButtons, type ToggleButtonsProps } from '#ui/forms/ToggleButtons'
import { Controller, useFormContext } from 'react-hook-form'
import { useValidationFeedback } from './useValidationFeedback'

type Props = Omit<ToggleButtonsProps, 'value' | 'onChange'> & {
  /**
   * field name to match hook-form state
   */
  name: string
}

function HookedToggleButtons({ name, ...props }: Props): JSX.Element {
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
export { HookedToggleButtons }
