import cn from "classnames";
import { forwardRef, type JSX } from "react";
import { Text } from "#ui/atoms/Text";
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper";

export interface InputProps
  extends
    InputWrapperBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, "type"> {
  /**
   * Controlled type
   */
  type?: "text" | "number" | "password" | "tel" | "url" | "email" | "hidden";
  /**
   * Optional CSS class names used for the input element
   */
  className?: string;
  /**
   * Optional suffix that renders close to the right-edge of the input
   */
  suffix?: React.ReactNode;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type = "text",
      className,
      label,
      hint,
      feedback,
      inline,
      suffix,
      ...rest
    },
    ref,
  ): JSX.Element => {
    const input = (
      <input
        {...rest}
        data-lpignore={rest.autoComplete === "off" && "true"}
        data-1p-ignore={rest.autoComplete === "off" && true}
        data-form-type={rest.autoComplete === "off" && "other"}
        id={rest.id ?? rest.name}
        className={cn(
          className,
          "block w-full px-4 py-2.5 font-normal text-sm",
          "rounded outline-0",
          {
            "[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none pr-1!":
              suffix != null,
            "bg-white!": rest.autoComplete === "off",
          },
          getFeedbackStyle(feedback),
        )}
        type={type}
        ref={ref}
      />
    );

    if (type === "hidden") {
      return input;
    }

    return (
      <InputWrapper
        label={label}
        hint={hint}
        feedback={feedback}
        name={rest.id ?? rest.name}
        inline={inline}
      >
        <div className="relative flex items-center">
          {input}
          {suffix != null && (
            <Text
              size="small"
              weight="medium"
              className="suffix shrink-0 border-l-0! border-y border-r h-[44px] border-gray-200 -left-[4px] pl-2 pr-3 flex items-center bg-white relative rounded-e"
            >
              {suffix}
            </Text>
          )}
        </div>
      </InputWrapper>
    );
  },
);

Input.displayName = "Input";
