import { type ForwardedRef, forwardRef, type JSX } from "react"
import {
  InputWrapper,
  type InputWrapperBaseProps,
  useInputWrapperField,
} from "#ui/internals/InputWrapper"

interface InputSimpleSelectOption {
  value: string
  label: string
}

export interface InputSimpleSelectProps
  extends InputWrapperBaseProps,
    Omit<React.SelectHTMLAttributes<HTMLSelectElement>, "value" | "onSelect"> {
  value?: string
  options: InputSimpleSelectOption[]
  className?: string
}

export const InputSimpleSelect = forwardRef<
  HTMLSelectElement,
  InputSimpleSelectProps
>(
  (
    {
      className,
      value,
      options = [],
      label,
      hint,
      feedback,
      inline,
      ...rest
    }: InputSimpleSelectProps,
    ref: ForwardedRef<HTMLSelectElement>,
  ): JSX.Element => {
    const { wrapperProps, inputProps } = useInputWrapperField({
      id: rest.id,
      name: rest.name,
      feedback,
      hint,
      required: rest.required,
      "aria-describedby": rest["aria-describedby"],
    })
    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        {...wrapperProps}
        inline={inline}
      >
        <select
          value={value}
          className="appearance-none cursor-pointer border-0 py-0 pl-0 pr-9 text-sm leading-5 font-medium text-gray-500 align-[inherit] focus:outline-hidden focus:ring-0 focus:shadow-none"
          {...rest}
          {...inputProps}
          ref={ref}
        >
          {options.map((opt) => (
            <option value={opt.value} key={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </InputWrapper>
    )
  },
)

InputSimpleSelect.displayName = "InputSimpleSelect"
