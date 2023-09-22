import cn from 'classnames'

export interface ContainerProps {
  /**
   * Set min height as screen size. Default is `true`.
   */
  minHeight?: boolean
}

interface Props extends ContainerProps {
  /**
   * CSS class name
   */
  className?: string
  /**
   * Content to be rendered inside the container
   */
  children: React.ReactNode
}

function Container({
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

Container.displayName = 'Container'
export { Container }
