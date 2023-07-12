import { Hint, type HintProps } from '#ui/atoms/Hint'
import { InputFeedback, type InputFeedbackProps } from '#ui/forms/InputFeedback'
import { Label } from '#ui/forms/Label'

export interface InputWrapperBaseProps {
  /**
   * optional input label
   */
  label?: string
  /**
   * optional hint to be rendered below
   */
  hint?: {
    icon?: HintProps['icon']
    text: HintProps['children']
  }
  /**
   * optional hint to be rendered below
   */
  feedback?: Omit<InputFeedbackProps, 'className'>
}

export interface InputWrapperProps extends InputWrapperBaseProps {
  /**
   * optional css class names used for the input element
   */
  className?: string
  name?: string
  children: React.ReactNode
}

function InputWrapper({
  label,
  children,
  className,
  hint,
  feedback,
  name,
  ...rest
}: InputWrapperProps): JSX.Element {
  return (
    <div className={className} {...rest}>
      {label != null && (
        <Label gap htmlFor={name}>
          {label}
        </Label>
      )}
      {children}
      {feedback != null && (
        <InputFeedback
          data-test-id='input-feedback'
          className='mt-2'
          {...feedback}
        />
      )}
      {hint != null && (
        <Hint className='mt-2' icon={hint.icon}>
          {hint.text}
        </Hint>
      )}
    </div>
  )
}

InputWrapper.displayName = 'InputWrapper'
export { InputWrapper }

export function getFeedbackStyle(
  feedback?: Omit<InputFeedbackProps, 'className'>
): Record<string, boolean> {
  return {
    // default ui state
    'border border-gray-200': feedback == null,
    // with feedback
    'focus:!ring-0': feedback != null,
    '!border-red border-2': feedback?.variant === 'danger',
    '!border-green border-2': feedback?.variant === 'success',
    '!border-orange border-2': feedback?.variant === 'warning'
  }
}

export function getFeedbackCssInJs(
  variant?: InputFeedbackProps['variant']
): Pick<CSSStyleDeclaration, 'borderColor' | 'borderWidth'> {
  switch (variant) {
    case 'danger':
      return {
        borderColor: '#FF656B',
        borderWidth: '2px'
      }

    case 'success':
      return {
        borderColor: '#1FDA8A',
        borderWidth: '2px'
      }

    case 'warning':
      return {
        borderColor: '#FFAB2E',
        borderWidth: '2px'
      }

    default:
      return {
        borderColor: 'rgb(230 231 231)',
        borderWidth: '1px'
      }
  }
}
