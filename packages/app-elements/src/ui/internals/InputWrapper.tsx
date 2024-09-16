import { Hint, type HintProps } from '#ui/atoms/Hint'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { InputFeedback, type InputFeedbackProps } from '#ui/forms/InputFeedback'
import { Label } from '#ui/forms/Label'
import { Legend } from '#ui/forms/Legend'
import cn from 'classnames'
import { Fragment } from 'react'

export interface InputWrapperBaseProps {
  /**
   * Optional input label
   */
  label?: string
  /**
   * Optional hint to be rendered below
   */
  hint?: {
    icon?: HintProps['icon']
    text: HintProps['children']
  }
  /**
   * Optional hint to be rendered below
   */
  feedback?: Omit<InputFeedbackProps, 'className'>
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
  name?: string
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
    name,
    fieldset = false,
    inline = false,
    isLoading,
    delayMs,
    ...rest
  }) => {
    const Fieldset = fieldset ? 'fieldset' : Fragment
    return (
      <Fieldset>
        <div
          className={cn(
            {
              'grid grid-cols-[1fr_2fr] gap-2 justify-between items-baseline':
                inline
            },
            className
          )}
          {...rest}
        >
          {label != null &&
            (fieldset ? (
              <Legend gap={!inline}>{label}</Legend>
            ) : (
              <Label gap={!inline} htmlFor={name}>
                {label}
              </Label>
            ))}
          <div
            className={cn('justify-self-end', {
              'w-full flex justify-end text-right': inline
            })}
          >
            {children}
          </div>
          <div className='col-span-2'>
            {feedback != null && (
              <InputFeedback
                data-testid='input-feedback'
                className={cn({
                  'mt-2': true
                })}
                {...feedback}
              />
            )}
            {hint != null && (
              <Hint
                className={cn({
                  'mt-2': !inline || feedback != null
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
  }
)

InputWrapper.displayName = 'InputWrapper'

export function getFeedbackStyle(
  feedback?: Omit<InputFeedbackProps, 'className'>
): Record<string, boolean> {
  return {
    // with feedback
    'focus:!ring-0': feedback != null,
    '!shadow-inputfocus !shadow-red ': feedback?.variant === 'danger',
    '!shadow-inputfocus !shadow-green': feedback?.variant === 'success',
    '!shadow-inputfocus !shadow-orange': feedback?.variant === 'warning'
  }
}

export function getFeedbackCssInJs(
  variant?: InputFeedbackProps['variant']
): Pick<CSSStyleDeclaration, 'boxShadow'> & {
  '&:focus-within': {
    boxShadow: string
  }
} {
  switch (variant) {
    case 'danger':
      return {
        boxShadow: 'inset 0 0 0 2px #FF656B',
        '&:focus-within': {
          boxShadow: 'inset 0 0 0 2px #FF656B'
        }
      }

    case 'success':
      return {
        boxShadow: 'inset 0 0 0 2px #1FDA8A',
        '&:focus-within': {
          boxShadow: 'inset 0 0 0 2px #1FDA8A'
        }
      }

    case 'warning':
      return {
        boxShadow: 'inset 0 0 0 2px #FFAB2E',
        '&:focus-within': {
          boxShadow: 'inset 0 0 0 2px #FFAB2E'
        }
      }

    default:
      return {
        boxShadow: 'inset 0 0 0 1px #E6E7E7',
        '&:focus-within': {
          boxShadow: 'inset 0 0 0 2px #101111'
        }
      }
  }
}
