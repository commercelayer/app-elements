import cn from "classnames"

export interface ContainerProps {
  /**
   * Set min height as screen size. Default is `true`.
   */
  minHeight?: boolean
  /**
   * Let the content span all the available width instead of being constrained
   * to the standard readable column (632px from the `md` breakpoint up).
   *
   * Use it for data-dense pages such as tables. When the app runs inside the
   * dashboard, the horizontal breathing room comes from the dashboard layout,
   * which also needs to render the route without the legacy side column.
   * @default false
   */
  fullWidth?: boolean
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
  fullWidth = false,
  ...rest
}) => {
  return (
    <div
      className={cn(
        "container mx-auto flex flex-col px-4 md:px-0",
        { "min-h-screen": minHeight },
        // `md:max-w-none` opts out of the capped width set by the `container`
        // utility (see styles/global.css)
        { "w-full md:max-w-none": fullWidth },
        className,
      )}
      {...rest}
    >
      {children}
    </div>
  )
}

Container.displayName = "Container"
