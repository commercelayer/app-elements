import type { JSX } from "react"
import { useFormContext } from "react-hook-form"
import { HookedValidationError } from "../ReactHookForm"
import { InputSwitch, type InputSwitchProps } from "./InputSwitch"

export interface HookedInputSwitchProps extends InputSwitchProps {
  /**
   * field name to match hook-form state
   */
  name: string
  /**
   * show validation error message underneath
   */
  showValidation?: boolean
}

/**
 * `InputToggleBox` component ready to be used with the `react-hook-form` context.
 * @see InputSwitch
 */
export function HookedInputSwitch({
  name,
  showValidation,
  ...props
}: HookedInputSwitchProps): JSX.Element {
  const { register } = useFormContext()

  return (
    <>
      <InputSwitch {...props} {...register(name)} />
      {showValidation === true && <HookedValidationError name={name} />}
    </>
  )
}

HookedInputSwitch.displayName = "HookedInputSwitch"
