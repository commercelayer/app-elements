import cn from "classnames"
import type { JSX, SVGAttributes } from "react"
import { StatusIcon, type StatusIconProps } from "./StatusIcon"

export interface RadialProgressProps extends SVGAttributes<SVGElement> {
  /**
   * How much is known about the progress, on a single axis:
   * - not specified: the work has not started, rendered as a dashed circle
   * - `"indeterminate"`: it has started, with no knowable end, rendered as a
   *   spinning arc
   * - a number from 0 to 100: it is measurable, rendered as a filled circle
   */
  percentage?: number | "indeterminate"
  /**
   * Size variant to match `Icon` dimension.
   * (small: 24px, medium: 36px, large: 42px, x-large: 56px)
   * @default 'large'
   */
  size?: "small" | "medium" | "large" | "x-large"
  /**
   * Optional icon to be rendered in the center of the circle
   */
  icon?: StatusIconProps["name"]

  /**
   * Optional alignment of the component
   */
  align?: "center"
}

/**
 * Used to render a radial progress with a pending, an indeterminate and a progress state. It also accepts an optional icon to be rendered in the center of the circle.
 * <span type="info">
 * When passing a `percentage` as number, it will show a progress circle, filled with the given percentage.
 * When passing `percentage="indeterminate"`, it will spin, for work that has started but has no knowable end (eg: a request handed to a background worker).
 * If `percentage` is not passed, it will be rendered as a dashed circle to represent the pending state.
 * </span>
 */
function RadialProgress({
  percentage,
  className,
  size = "large",
  icon,
  align,
  ...rest
}: RadialProgressProps): JSX.Element {
  const sizePixels =
    size === "small"
      ? 24
      : size === "medium"
        ? 36
        : size === "x-large"
          ? 56
          : 42
  const viewBox = `0 0 ${sizePixels * 2} ${sizePixels * 2}`
  const circumference = sizePixels * 2 * Math.PI
  const emptyOffset =
    circumference - (parsePercentageRange(percentage) / 100) * circumference

  const isIndeterminate = percentage === "indeterminate"
  // Inset by half the stroke, unlike the other two states: the arc has round
  // caps, and at r = sizePixels the viewBox would clip them flat.
  const arcRadius = sizePixels - INDETERMINATE_STROKE_WIDTH / 2
  const arcCircumference = arcRadius * 2 * Math.PI

  return (
    <div className="relative">
      <svg
        data-testid="radial-progress"
        viewBox={viewBox}
        xmlns="http://www.w3.org/2000/svg"
        className={cn(
          "rounded-full",
          isIndeterminate ? "animate-spin" : "transform -rotate-90",
          {
            "mx-auto": align === "center",
          },
          className,
        )}
        width={sizePixels}
        height={sizePixels}
        {...rest}
      >
        <title>{getTitle(percentage)}</title>
        {isIndeterminate ? (
          // indeterminate
          <circle
            data-testid="radial-progress-indeterminate"
            cx={sizePixels}
            cy={sizePixels}
            r={arcRadius}
            className="text-gray-200"
            stroke="currentColor"
            strokeWidth={INDETERMINATE_STROKE_WIDTH}
            strokeLinecap="round"
            // Three quarters drawn, one quarter left open, which is what makes
            // the rotation readable.
            strokeDasharray={`${arcCircumference * 0.75} ${arcCircumference}`}
            fill={icon != null ? "white" : "transparent"}
          />
        ) : percentage == null ? (
          // pending
          <circle
            data-testid="radial-progress-pending"
            cx={sizePixels}
            cy={sizePixels}
            r={sizePixels}
            className="text-gray-500"
            stroke="currentColor"
            strokeWidth="4"
            strokeDasharray="6"
            fill={icon != null ? "white" : "transparent"}
          />
        ) : (
          // progress
          <>
            <circle
              data-testid="radial-progress-base"
              cx={sizePixels}
              cy={sizePixels}
              r={sizePixels}
              className="text-gray-100"
              stroke="currentColor"
              strokeWidth="12"
              fill={icon != null ? "white" : "transparent"}
            />
            <circle
              data-testid="radial-progress-percentage"
              cx={sizePixels}
              cy={sizePixels}
              r={sizePixels}
              className="text-primary transition-all duration-500"
              stroke="currentColor"
              strokeWidth="12"
              fill="transparent" // always transparent or will cover the circle behind
              strokeDasharray={circumference}
              strokeDashoffset={emptyOffset} // this is the gray part, to not be filled (percentage left)
            />
          </>
        )}
      </svg>
      {icon != null && (
        <StatusIcon
          name={icon}
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          data-testid="radial-progress-icon"
        />
      )}
    </div>
  )
}

function getTitle(percentage: RadialProgressProps["percentage"]): string {
  if (percentage === "indeterminate") {
    return "In progress"
  }

  return percentage == null ? "Pending" : `${percentage}%`
}

/**
 * Stroke of the indeterminate arc, in viewBox units, so half this value is the
 * rendered thickness. Thinner than the measured circle's `12`, which would
 * read as a progress ring rather than a spinner.
 */
const INDETERMINATE_STROKE_WIDTH = 6

/**
 * Enforce a range between 0 and 100
 * @param percentage probably a number
 * @returns a number from 0 to 100
 */
function parsePercentageRange(percentage: any): number {
  if (
    typeof percentage !== "number" ||
    Number.isNaN(percentage) ||
    percentage < 0
  ) {
    return 0
  }

  if (percentage > 100) {
    return 100
  }

  return percentage
}

RadialProgress.displayName = "RadialProgress"

export { RadialProgress }
