import cn from 'classnames'

export interface ContainerProps {
  /**
   * Set min height as screen size. Default is `true`.
   */
  minHeight?: boolean
  /**
   * CSS class name
   */
  className?: string
  /**
   * Content to be rendered inside the container
   */
  children: React.ReactNode
}

/** This component can be used to constrain a content's width to the current breakpoint, while keeping it fluid. */
export const Container: React.FC<ContainerProps> = ({
  children,
  className,
  minHeight = true,
  ...rest
}) => {
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
