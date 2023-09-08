import { Hint, type HintProps } from '#ui/atoms/Hint'
import { InputFeedback, type InputFeedbackProps } from '#ui/forms/InputFeedback'
import { Label } from '#ui/forms/Label'
import cn from 'classnames'

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
  /**
   * optional direction
   * @default column
   */
  direction?: 'column' | 'row'
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
  direction = 'column',
  ...rest
}: InputWrapperProps): JSX.Element {
  return (
    <div
      className={cn(
        {
          'grid grid-cols-2 justify-between items-center': direction === 'row'
        },
        className
      )}
      {...rest}
    >
      {label != null && (
        <Label gap={direction === 'column'} htmlFor={name}>
          {label}
        </Label>
      )}
      <div className='justify-self-end'>{children}</div>
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
              'mt-2': direction === 'column' || feedback != null
            })}
            icon={hint.icon}
          >
            {hint.text}
          </Hint>
        )}
      </div>
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
