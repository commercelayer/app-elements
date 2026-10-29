import cn from "classnames"
import type { JSX, ReactNode } from "react"
import { Icon, type IconProps } from "./Icon"

export interface EmptyStateProps {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
  /**
   * Small icon shown above the title.
   */
  icon?: IconProps["name"]
}

function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  ...rest
}: EmptyStateProps): JSX.Element {
  return (
    <div
      className={cn(
        "bg-gray-50 border-gray-50 rounded-md overflow-hidden w-full",
        className,
      )}
      {...rest}
    >
      <div className="flex flex-col items-center text-center px-6 py-14 md:py-24">
        {icon != null && (
          <Icon name={icon} size={32} className="text-gray-300 mb-4" />
        )}
        <h4 className="text-black text-sm font-semibold">{title}</h4>

        {description != null ? (
          <div className="text-gray-500 text-[13px] text-balance mt-1 max-w-md">
            {description}
          </div>
        ) : null}

        {/* actions always render as `size="mini"`, whatever their `size` */}
        {action != null ? (
          <div className="mt-4 [&_:is(a,button)]:text-[13px] [&_:is(a,button)]:h-[30px] [&_:is(a,button)]:min-w-[30px] [&_:is(a,button)]:px-2.5">
            {action}
          </div>
        ) : null}
      </div>
    </div>
  )
}

EmptyState.displayName = "EmptyState"

export { EmptyState }
