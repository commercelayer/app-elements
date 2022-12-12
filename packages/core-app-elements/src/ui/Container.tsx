import cn from 'classnames'

interface Props {
  className?: string
  children: React.ReactNode
}

export function Container({
  children,
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      className={cn(
        'container mx-auto min-h-screen flex flex-col px-4 md:px-0',
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Container
