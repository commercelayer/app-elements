import cn from 'classnames'

interface FormFooterProps
  extends Omit<React.HTMLAttributes<HTMLElement>, 'children'> {
  buttonSubmit: JSX.Element
  buttonCancel?: JSX.Element
}

export function FormFooter({
  buttonSubmit,
  buttonCancel,
  className,
  ...rest
}: FormFooterProps): JSX.Element {
  return (
    <div {...rest} className={cn('flex justify-between', className)}>
      <div>{buttonSubmit}</div>
      <div>{buttonCancel}</div>
    </div>
  )
}

export default FormFooter
