import { Controller, useFormContext } from "react-hook-form"
import { useValidationFeedback } from "#ui/forms/ReactHookForm"
import {
  InputCheckboxGroup,
  type InputCheckboxGroupProps,
} from "./InputCheckboxGroup"

export interface HookedInputCheckboxGroupProps
  extends Omit<InputCheckboxGroupProps, "onChange" | "defaultValues"> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputCheckboxGroupProps` component ready to be used with the `react-hook-form` context.
 * @see InputCheckboxGroupProps
 */
export const HookedInputCheckboxGroup: React.FC<
  HookedInputCheckboxGroupProps
> = ({ name, ...props }) => {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputCheckboxGroup
          {...props}
          feedback={feedback}
          defaultValues={field.value ?? []}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}

HookedInputCheckboxGroup.displayName = "HookedInputCheckboxGroup"
