import cn from 'classnames'

interface Props {
  /**
   * css class name
   */
  className?: string
  /**
   * set min height as screen size. Default is `true`.
   */
  minHeight?: boolean
  /**
   * content to be rendered inside the container
   */
  children: React.ReactNode
}

export function Container({
  children,
  className,
  minHeight = true,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      className={cn(
        'container mx-auto  flex flex-col px-4 md:!px-0',
        { 'min-h-screen': minHeight },
        className
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

export default Container
