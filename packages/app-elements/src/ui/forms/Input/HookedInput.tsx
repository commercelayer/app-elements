import type { JSX } from "react"
import { useFormContext } from "react-hook-form"
import { useValidationFeedback } from "../ReactHookForm"
import { Input, type InputProps } from "./Input"

export interface HookedInputProps extends InputProps {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `Input` component ready to be used with the `react-hook-form` context.
 * @see InputSelect
 */
export function HookedInput({ name, ...props }: HookedInputProps): JSX.Element {
  const { register } = useFormContext()
  const feedback = useValidationFeedback(name)

  return (
    <Input
      {...props}
      {...register(name, {
        valueAsNumber: props.type === "number",
      })}
      feedback={feedback}
    />
  )
}

HookedInput.displayName = "HookedInput"
