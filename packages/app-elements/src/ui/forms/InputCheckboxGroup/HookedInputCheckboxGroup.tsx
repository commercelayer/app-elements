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
  const { control, getValues } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputCheckboxGroup
          {...props}
          feedback={feedback}
          defaultValues={Array.isArray(field.value) ? field.value : []}
          onChange={(values) => {
            // Preserve any extra fields (e.g. `reason`) that the consumer
            // stored on existing items via setValue. We need the latest form
            // snapshot here because field.value can lag behind nested updates.
            const currentValue = getValues(name)
            const current: Array<{ value: string }> = Array.isArray(
              currentValue,
            )
              ? currentValue.filter(
                  (v): v is { value: string } =>
                    typeof v === "object" &&
                    v !== null &&
                    "value" in v &&
                    typeof (v as { value: unknown }).value === "string",
                )
              : []
            field.onChange(
              values.map((item) => {
                const existing = current.find((v) => v.value === item.value)
                return existing != null ? { ...existing, ...item } : item
              }),
            )
          }}
        />
      )}
    />
  )
}

HookedInputCheckboxGroup.displayName = "HookedInputCheckboxGroup"
