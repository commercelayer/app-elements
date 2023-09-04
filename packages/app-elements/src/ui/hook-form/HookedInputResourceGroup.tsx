import {
  InputResourceGroup,
  type InputResourceGroupProps
} from '#ui/forms/InputResourceGroup'
import { Controller, useFormContext } from 'react-hook-form'

interface Props
  extends Omit<InputResourceGroupProps, 'onChange' | 'defaultValues'> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputResourceGroup` component ready to be used with the `react-hook-form` context.
 * Since it will perform api requests to fetch list of options, it also needs to access `CoreSdkProvider` context.
 * @see InputResourceGroup
 */
export const HookedInputResourceGroup: React.FC<Props> = ({
  name,
  ...props
}) => {
  const { control } = useFormContext()

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputResourceGroup
          {...props}
          defaultValues={field.value ?? []}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}

HookedInputResourceGroup.displayName = 'HookedInputResourceGroup'
