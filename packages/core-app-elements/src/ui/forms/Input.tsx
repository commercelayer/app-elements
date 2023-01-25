import cn from 'classnames'
import { forwardRef } from 'react'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * controlled type
   */
  type?: 'text' | 'number' | 'password' | 'tel' | 'url' | 'email'
  /**
   * optional css class names used for the input element
   */
  className?: string
}

function Input(
  { type = 'text', className, ...rest }: InputProps,
  ref: React.ForwardedRef<HTMLInputElement>
): JSX.Element {
  return (
    <input
      {...rest}
      className={cn(
        'block w-full border-gray-200 px-4 h-10 font-medium',
        'rounded outline-0',
        className
      )}
      type={type}
      ref={ref}
    />
  )
}

export default forwardRef<HTMLInputElement, InputProps>(Input)
