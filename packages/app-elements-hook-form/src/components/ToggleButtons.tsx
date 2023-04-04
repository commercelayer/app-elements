import { useValidationFeedback } from '#components/useValidationFeedback'
import { ToggleButtons as ToggleButtonsUi } from '@commercelayer/app-elements'
import { type ToggleButtonsProps } from '@commercelayer/app-elements/dist/ui/forms/ToggleButtons'
import { Controller, useFormContext } from 'react-hook-form'

type Props = Omit<ToggleButtonsProps, 'value' | 'onChange'> & {
  /**
   * field name to match hook-form state
   */
  name: string
}

function ToggleButtons({ name, ...props }: Props): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <ToggleButtonsUi
          {...props}
          value={value}
          onChange={onChange}
          feedback={feedback}
        />
      )}
    />
  )
}

ToggleButtons.displayName = 'ToggleButtons'
export { ToggleButtons }
