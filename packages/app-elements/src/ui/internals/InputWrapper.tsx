import cn from "classnames"
import { Fragment, useId } from "react"
import { Hint, type HintProps } from "#ui/atoms/Hint"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { InputFeedback, type InputFeedbackProps } from "#ui/forms/InputFeedback"
import { Label } from "#ui/forms/Label"
import { Legend } from "#ui/forms/Legend"

export interface InputWrapperBaseProps {
  /**
   * Optional input label
   */
  label?: string
  /**
   * Optional hint to be rendered below
   */
  hint?: {
    icon?: HintProps["icon"]
    text: HintProps["children"]
  }
  /**
   * Optional hint to be rendered below
   */
  feedback?: Omit<InputFeedbackProps, "className">
  /**
   * Show label and input on the same line
   * @default false
   */
  inline?: boolean
}

export interface InputWrapperProps extends InputWrapperBaseProps {
  /**
   * Optional CSS class names used for the input element
   */
  className?: string
  /**
   * The id of the field: the label points to it, and the feedback and the hint
   * take theirs from it. Use `useInputWrapperField` to get it together with the
   * attributes the input needs.
   */
  fieldId?: string
  children: React.ReactNode
  fieldset?: boolean
}

export const InputWrapper = withSkeletonTemplate<InputWrapperProps>(
  ({
    label,
    children,
    className,
    hint,
    feedback,
    fieldId,
    fieldset = false,
    inline = false,
    isLoading,
    delayMs,
    ...rest
  }) => {
    // a group has no field id of its own: the ids only link the fieldset to its
    // feedback and hint
    const generatedId = useId()
    const { feedbackId, hintId, describedBy } = getFieldDescriptionIds(
      fieldId ?? generatedId,
      { feedback, hint },
    )

    const Fieldset = fieldset ? "fieldset" : Fragment
    return (
      <Fieldset {...(fieldset ? { "aria-describedby": describedBy } : {})}>
        <div
          className={cn(
            {
              "grid grid-cols-[1fr_2fr] gap-2 justify-between items-baseline":
                inline,
            },
            className,
          )}
          {...rest}
        >
          {label != null &&
            (fieldset ? (
              <Legend gap={!inline}>{label}</Legend>
            ) : (
              <Label gap={!inline} htmlFor={fieldId}>
                {label}
              </Label>
            ))}
          <div
            className={cn({
              "w-full flex justify-end text-right": inline,
            })}
          >
            {children}
          </div>
          <div className="col-span-2">
            {feedback != null && (
              <InputFeedback
                id={feedbackId}
                data-testid="input-feedback"
                className={cn({
                  "mt-2": true,
                })}
                {...feedback}
              />
            )}
            {hint != null && (
              <Hint
                id={hintId}
                className={cn({
                  "mt-2": !inline || feedback != null,
                })}
                icon={hint.icon}
              >
                {hint.text}
              </Hint>
            )}
          </div>
        </div>
      </Fieldset>
    )
  },
)

InputWrapper.displayName = "InputWrapper"

/**
 * The ids `InputWrapper` gives to the feedback and the hint of a field, and the
 * `aria-describedby` that links the field to them.
 */
function getFieldDescriptionIds(
  fieldId: string,
  { feedback, hint }: Pick<InputWrapperBaseProps, "feedback" | "hint">,
): { feedbackId?: string; hintId?: string; describedBy?: string } {
  const feedbackId = feedback != null ? `${fieldId}-feedback` : undefined
  const hintId = hint != null ? `${fieldId}-hint` : undefined
  const describedBy =
    [feedbackId, hintId].filter((id) => id != null).join(" ") || undefined
  return { feedbackId, hintId, describedBy }
}

interface UseInputWrapperFieldOptions
  extends Pick<InputWrapperBaseProps, "feedback" | "hint"> {
  /**
   * The id passed to the input: when set, it is used as it is.
   */
  id?: string
  /**
   * The name of the input, kept in the generated id to make it readable.
   */
  name?: string
  required?: boolean
  /**
   * An `aria-describedby` passed to the input, kept before the feedback and the hint.
   */
  "aria-describedby"?: string
}

/**
 * Wires an input to the `InputWrapper` around it, so that assistive technology
 * gets what the wrapper only shows: the label, the feedback and the hint, the
 * invalid state and the required state.
 *
 * The id is generated unless one is passed, so that two fields with the same
 * `name` on one page never share it.
 *
 * Spread `wrapperProps` on the `InputWrapper` and `inputProps` on the input.
 * `feedbackId` is for an input that cannot take `aria-describedby`.
 */
export function useInputWrapperField({
  id,
  name,
  feedback,
  hint,
  required,
  "aria-describedby": ariaDescribedBy,
}: UseInputWrapperFieldOptions): {
  wrapperProps: Pick<InputWrapperProps, "fieldId">
  feedbackId?: string
  inputProps: {
    id: string
    "aria-describedby"?: string
    "aria-invalid"?: true
    "aria-required"?: true
  }
} {
  const generatedId = useId()
  const fieldId =
    id ?? (name != null && name !== "" ? `${name}-${generatedId}` : generatedId)
  const { feedbackId, describedBy } = getFieldDescriptionIds(fieldId, {
    feedback,
    hint,
  })

  return {
    wrapperProps: { fieldId },
    feedbackId,
    inputProps: {
      id: fieldId,
      "aria-describedby":
        [ariaDescribedBy, describedBy].filter((v) => v != null).join(" ") ||
        undefined,
      // `InputFeedback` falls back to `danger` when no variant is set
      "aria-invalid":
        feedback != null && (feedback.variant ?? "danger") === "danger"
          ? true
          : undefined,
      "aria-required": required === true ? true : undefined,
    },
  }
}

export function getFeedbackStyle(
  feedback?: Omit<InputFeedbackProps, "className">,
): Record<string, boolean> {
  return {
    // with feedback
    "focus:ring-0!": feedback != null,
    "shadow-inputfocus! shadow-red! ": feedback?.variant === "danger",
    "shadow-inputfocus! shadow-green!": feedback?.variant === "success",
    "shadow-inputfocus! shadow-orange!": feedback?.variant === "warning",
  }
}

export function getFeedbackCssInJs(
  variant?: InputFeedbackProps["variant"],
): Pick<CSSStyleDeclaration, "boxShadow"> & {
  "&:focus-within": {
    boxShadow: string
  }
} {
  switch (variant) {
    case "danger":
      return {
        boxShadow: "inset 0 0 0 2px #FF656B",
        "&:focus-within": {
          boxShadow: "inset 0 0 0 2px #FF656B",
        },
      }

    case "success":
      return {
        boxShadow: "inset 0 0 0 2px #1FDA8A",
        "&:focus-within": {
          boxShadow: "inset 0 0 0 2px #1FDA8A",
        },
      }

    case "warning":
      return {
        boxShadow: "inset 0 0 0 2px #FFAB2E",
        "&:focus-within": {
          boxShadow: "inset 0 0 0 2px #FFAB2E",
        },
      }

    default:
      return {
        boxShadow: "inset 0 0 0 1px #E6E7E7",
        "&:focus-within": {
          boxShadow: "inset 0 0 0 2px #101111",
        },
      }
  }
}
