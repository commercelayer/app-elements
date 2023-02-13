import cn from 'classnames'
import { forwardRef } from 'react'
import { Label } from '#ui/forms/Label'

export interface InputProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * optional input label
   */
  label?: string
  /**
   * controlled type
   */
  type?: 'text' | 'number' | 'password' | 'tel' | 'url' | 'email'
  /**
   * optional css class names used for the input element
   */
  className?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ type = 'text', className, label, ...rest }, ref): JSX.Element => {
    return (
      <div>
        {label != null && <Label gap>{label}</Label>}
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
      </div>
    )
  }
)

Input.displayName = 'Input'
export { Input }
