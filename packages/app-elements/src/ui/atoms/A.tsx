import cn from 'classnames'

interface Props extends React.AnchorHTMLAttributes<HTMLAnchorElement> {}

function A({ className, children, ...rest }: Props): JSX.Element {
  return (
    <a
      className={cn([
        className,
        'text-primary font-bold outline-0 outline-offset-4 outline-primary-light hover:text-primary-light border-primary-light cursor-pointer'
      ])}
      {...rest}
    >
      {children}
    </a>
  )
}

A.displayName = 'A'
export { A }
