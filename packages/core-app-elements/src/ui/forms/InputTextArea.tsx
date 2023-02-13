import cn from 'classnames'
import { forwardRef } from 'react'

interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

const InputTextArea = forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  ({ className, ...rest }, ref): JSX.Element => {
    return (
      <textarea
        {...rest}
        className={cn(
          'h-52 p-3 w-full border border-gray-200 bg-white rounded-md',
          className
        )}
        ref={ref}
      />
    )
  }
)

InputTextArea.displayName = 'InputTextArea'
export { InputTextArea }
