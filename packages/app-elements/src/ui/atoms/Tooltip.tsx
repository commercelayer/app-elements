import cn from "classnames"
import { forwardRef, type JSX, type ReactNode, useId } from "react"
import {
  type PlacesType,
  Tooltip as ReactTooltip,
  type TooltipRefProps,
} from "react-tooltip"
import { getInnerText } from "#utils/children"

export type { TooltipRefProps } from "react-tooltip"

export interface TooltipProps {
  /** Tooltip unique identifier  */
  id?: string
  /** Label that triggers the opening of the tooltip  */
  label: ReactNode
  /** Content to be rendered inside the tooltip box */
  content: ReactNode
  /**
   * Desired direction where the tooltip content will be opened in relation to the label.
   * If the tooltip is too close to the edge of the screen, it will be repositioned automatically.
   * @default 'top'
   */
  direction?: Extract<
    PlacesType,
    "top" | "top-start" | "top-end" | "bottom" | "bottom-start" | "bottom-end"
  >
  /**
   * If true, the tooltip will have a fixed width of 280px.
   * If false or undefined, the tooltip will have a max-width of 280px and no minimum width.
   */
  minWidth?: boolean
  /**
   * Class name to be applied to the tooltip wrapper.
   * Useful for custom styling.
   */
  className?: string
}

/**
 * Render a label that will open a tooltip box when hovered/focused.
 * Both label and content can be any ReactNode.
 *
 * This component is a wrapper around react-tooltip.
 */
export const Tooltip = forwardRef<TooltipRefProps, TooltipProps>(
  (
    {
      label,
      content,
      direction = "top",
      minWidth = false,
      id = `${getSanitizedInnerText(label)}-${getSanitizedInnerText(
        content,
      )}-${direction}`,
      className,
    },
    ref,
  ): JSX.Element => {
    const generatedId = useId()
    const tooltipId = id ?? generatedId

    return (
      <>
        <span
          aria-description={getInnerText(content)}
          data-tooltip-id={tooltipId}
          className={cn("cursor-pointer", className)}
        >
          {label}
        </span>
        <ReactTooltip
          id={tooltipId}
          ref={ref}
          place={direction}
          clickable
          imperativeModeOnly={ref != null}
          // Position strategy fixed to avoid issues with overflow hidden parents
          positionStrategy="fixed"
          // We are using our own styles, by applying tailwind classes
          // https://react-tooltip.com/docs/examples/styling#base-styles
          disableStyleInjection
          className={cn("rounded bg-black text-white px-4 py-3 text-sm w-max", {
            "max-w-[280px]": !minWidth,
            "min-w-[280px]": minWidth,
          })}
          classNameArrow={cn("w-2 h-2", {
            "rotate-45": direction.includes("top"),
            "rotate-225": direction.includes("bottom"),
          })}
        >
          {content}
        </ReactTooltip>
      </>
    )
  },
)

Tooltip.displayName = "Tooltip"

function getSanitizedInnerText(node: ReactNode): string {
  return getInnerText(node).replace(/\W+/g, "").toLowerCase()
}
