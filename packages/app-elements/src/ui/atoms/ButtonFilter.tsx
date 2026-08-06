import cn from "classnames"
import type { JSX } from "react"
import { Icon } from "./Icon"
import { StatusIcon, type StatusIconProps } from "./StatusIcon"

export interface ButtonFilterProps
  extends React.HTMLAttributes<HTMLDivElement> {
  onClick?: () => void
  onRemoveRequest?: () => void
  icon?: StatusIconProps["name"]
  label: string
  /**
   * Visual style.
   * - `button` (default): compact grey button where the whole label is clickable
   *   to re-open the filter.
   * - `pill`: rounded chip rendering `label: value` with the value in bold, where
   *   only the remove (`x`) button is interactive. Matches the style used by the
   *   dashboard metrics pages.
   */
  variant?: "button" | "pill"
  /**
   * Value(s) rendered in bold next to the label. Long values are truncated and
   * shown in full through the native tooltip.
   *
   * Only used by the `pill` variant.
   */
  value?: string
}

function ButtonFilter({
  onClick,
  onRemoveRequest,
  label,
  icon,
  className,
  variant = "button",
  value,
  ...rest
}: ButtonFilterProps): JSX.Element {
  if (variant === "pill") {
    return (
      <div
        className={cn(
          "flex items-center gap-2 px-3 py-1 leading-5",
          "bg-gray-100 border border-gray-100 rounded-[8px] text-[13px] max-w-75",
          className,
        )}
        // the value is truncated when too long, so keep it reachable on hover
        title={value}
        {...rest}
      >
        <span className="truncate">
          {value == null ? (
            label
          ) : (
            <>
              {label}: <span className="font-semibold">{value}</span>
            </>
          )}
        </span>
        {onRemoveRequest != null ? (
          <button
            type="button"
            data-testid="ButtonFilter-remove"
            className="flex items-center justify-center hover:opacity-70 shrink-0"
            onClick={onRemoveRequest}
            aria-label={`Remove ${label}`}
          >
            <Icon name="x" size={14} />
          </button>
        ) : null}
      </div>
    )
  }

  return (
    <div
      className={cn(
        "flex flex-nowrap text-xs text-gray-500 transition duration-300 ease-in-out",
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
          "font-semibold",
          "flex items-center gap-1",
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
            className="px-0.5 text-sm"
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
