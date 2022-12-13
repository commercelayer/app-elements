import cn from 'classnames'

interface Props extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {}

export function InputTextArea({ className, ...rest }: Props): JSX.Element {
  return (
    <textarea
      {...rest}
      className={cn(
        'h-52 p-3 w-full border border-gray-200 bg-white rounded-md',
        className
      )}
    />
  )
}

export default InputTextArea
