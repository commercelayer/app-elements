import { useEffect } from "react"
import { Controller, useFormContext } from "react-hook-form"
import { useValidationFeedback } from "#ui/forms/ReactHookForm"
import { isDefined } from "#utils/array"
import { filterByDisplayName } from "#utils/children"
import { InputRadioGroup, type InputRadioGroupProps } from "./InputRadioGroup"

export interface HookedInputRadioGroupProps
  extends Omit<InputRadioGroupProps, "onChange" | "defaultValues"> {
  /**
   * field name to match hook-form state
   */
  name: string
}

/**
 * `InputRadioGroup` component ready to be used with the `react-hook-form` context.
 * @see InputCheckboxGroupProps
 */
export const HookedInputRadioGroup: React.FC<HookedInputRadioGroupProps> = ({
  name,
  ...props
}) => {
  const { control, watch, resetField, setValue } = useFormContext()
  const feedback = useValidationFeedback(name)
  const selectedValue = watch(name)

  useEffect(() => {
    const options = props.options.flatMap((option) =>
      filterByDisplayName(option.checkedElement ?? null, /^Hooked/)
        .map((child) =>
          typeof child.props.name === "string"
            ? {
                isChecked: option.value === selectedValue,
                fieldName: child.props.name as string,
              }
            : undefined,
        )
        .filter(isDefined),
    )

    options.forEach(({ fieldName, isChecked }) => {
      if (isChecked) {
        resetField(fieldName)
      } else {
        setValue(fieldName, undefined)
      }
    })
  }, [selectedValue])

  return (
    <Controller
      name={name}
      control={control}
      render={({ field }) => (
        <InputRadioGroup
          {...props}
          name={name}
          feedback={feedback}
          defaultValue={field.value}
          onChange={(values) => {
            field.onChange(values)
          }}
        />
      )}
    />
  )
}

HookedInputRadioGroup.displayName = "HookedInputRadioGroup"
