import cn from "classnames"
import type { JSX } from "react"
import { StatusIcon, type StatusIconProps } from "./StatusIcon"

export interface ButtonFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void
  onRemoveRequest?: () => void
  icon?: StatusIconProps["name"]
  label: string
}

function ButtonFilter({
  onClick,
  onRemoveRequest,
  label,
  icon,
  className,
  ...rest
}: ButtonFilterProps): JSX.Element {
  return (
    <div
      className={cn(
        "flex flex-nowrap text-sm text-gray-500 transition duration-300 ease-in-out",
        "hover:bg-gray-200 bg-gray-100 rounded",
        className,
      )}
      {...rest}
    >
      <button
        type="button"
        data-testid="ButtonFilter-main"
        onClick={onClick}
        className={cn(
          "font-bold",
          "flex items-center gap-2",
          "pl-4 py-[10px]",
          {
            "pr-4": onRemoveRequest == null,
            "pr-1": onRemoveRequest != null,
          },
        )}
      >
        {icon != null ? (
          <StatusIcon
            name={icon}
            className="px-0.5 text-base"
            data-testid="ButtonFilter-icon"
          />
        ) : null}
        <span className="inline-block">{label}</span>
      </button>
      {onRemoveRequest != null ? (
        <button
          type="button"
          data-testid="ButtonFilter-remove"
          className="pl-1 pr-4 flex items-center"
          onClick={onRemoveRequest}
          aria-label={`Remove ${label}`}
        >
          <StatusIcon name="x" className="text-base" />
        </button>
      ) : null}
    </div>
  )
}

ButtonFilter.displayName = "ButtonFilter"
export { ButtonFilter }
