import type { JSX } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useValidationFeedback } from "../ReactHookForm"
import {
  InputToggleButton,
  type InputToggleButtonProps,
} from "./InputToggleButton"

export type HookedInputToggleButtonProps = Omit<
  InputToggleButtonProps,
  "value" | "onChange"
> & {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputToggleButton` component ready to be used with the `react-hook-form` context.
 * Stored value will be a string when used as `mode="single"` or an array of strings when `mode="multiple"`.
 * @see InputToggleButton
 */
export function HookedInputToggleButton({
  name,
  ...props
}: HookedInputToggleButtonProps): JSX.Element {
  const { control } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Controller
      name={name}
      control={control}
      render={({ field: { onChange, value } }) => (
        <InputToggleButton
          {...props}
          value={value}
          onChange={onChange}
          feedback={feedback}
        />
      )}
    />
  )
}

HookedInputToggleButton.displayName = "HookedInputToggleButton"
