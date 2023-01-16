import cn from 'classnames'

interface InputProps {
  /**
   * controlled value
   */
  value?: string
  /**
   * controlled type
   */
  type?: string
  /**
   * optional css class names used for the input element
   */
  inputClassName?: string
  /**
   * Optional callback that will be called when onChange event is triggered
   */
  onChange: (value: string) => void
}

export function Input({
  value,
  type = 'text',
  inputClassName,
  onChange,
  ...rest
}: InputProps): JSX.Element {
  return (
    <input
      {...rest}
      className={cn(
        'block w-full border-gray-200 p-3 h-10 font-medium',
        'rounded outline-0',
        inputClassName
      )}
      onChange={(e) => {
        onChange(e.currentTarget.value)
      }}
      type={type}
      value={value}
    />
  )
}

export default Input
