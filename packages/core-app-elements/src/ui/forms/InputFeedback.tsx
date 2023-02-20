import { CheckCircle, WarningCircle } from 'phosphor-react'
import cn from 'classnames'

export type FeedbackVariant = 'danger' | 'success' | 'warning'

export interface InputFeedbackProps {
  message: string
  variant?: FeedbackVariant
  className?: string
}

function InputFeedback({
  className,
  message,
  variant = 'danger',
  ...rest
}: InputFeedbackProps): JSX.Element {
  const icons: Record<FeedbackVariant, JSX.Element> = {
    danger: (
      <WarningCircle size={20} weight='bold' data-test-id='icon-danger' />
    ),
    success: (
      <CheckCircle size={20} weight='bold' data-test-id='icon-success' />
    ),
    warning: (
      <WarningCircle size={20} weight='bold' data-test-id='icon-warning' />
    )
  }

  return (
    <div
      className={cn([
        className,
        'flex items-center gap-[5px]',
        {
          'text-red': variant === 'danger',
          'text-green': variant === 'success',
          'text-orange': variant === 'warning'
        }
      ])}
      {...rest}
    >
      {icons[variant]}
      <div className='text-sm font-bold capitalize'>{message}</div>
    </div>
  )
}

InputFeedback.displayName = 'InputFeedback'
export { InputFeedback }
