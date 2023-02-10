import cn from 'classnames'
import { ForwardedRef, forwardRef } from 'react'

interface InputTextAreaProps
  extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

function InputTextArea(
  { className, ...rest }: InputTextAreaProps,
  ref: ForwardedRef<HTMLTextAreaElement>
): JSX.Element {
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

export default forwardRef<HTMLTextAreaElement, InputTextAreaProps>(
  InputTextArea
)
