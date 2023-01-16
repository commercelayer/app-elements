import cn from 'classnames'

export interface InputProps
  extends Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    'type' | 'onChange'
  > {
  /**
   * controlled type
   */
  type?: 'text' | 'number' | 'password' | 'tel' | 'url' | 'email'
  /**
   * optional css class names used for the input element
   */
  className?: string
  /**
   * Optional callback that will be called when onChange event is triggered
   */
  onChange?: (value: string) => void
}

export function Input({
  type = 'text',
  className,
  onChange,
  ...rest
}: InputProps): JSX.Element {
  return (
    <input
      {...rest}
      className={cn(
        'block w-full border-gray-200 px-4 h-10 font-medium',
        'rounded outline-0',
        className
      )}
      onChange={(e) => {
        onChange?.(e.currentTarget.value)
      }}
      type={type}
    />
  )
}

export default Input
