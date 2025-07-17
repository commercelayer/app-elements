import cn from "classnames"

export interface ProgressProps
  extends React.ProgressHTMLAttributes<HTMLProgressElement> {
  /**
   * This attribute describes how much work the task indicated by the `progress` element requires.
   * The `max` attribute, if present, must have a value greater than `0` and be a valid floating point number.
   * @default 1
   */
  max?: number
  /**
   * This attribute specifies how much of the task that has been completed.
   * It must be a valid floating point number between `0` and `max`.
   * If there is no `value` attribute, the progress bar is indeterminate;
   * this indicates that an activity is ongoing with no indication of how long it is expected to take.
   */
  value?: number
  /**
   * The display mode of the progress bar.
   * - `fraction` - Display the completion status as a fraction (default)
   * - `percentage` - Display the completion status as a percentage
   * - `none` - Do not display the completion
   */
  displayMode?: "fraction" | "percentage" | "none"
  children: React.ReactNode
}

/**
 * This component wraps a [`<progress>`](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/progress) HTML element.
 *
 * The `<progress>` HTML element displays an indicator showing the completion progress of a task.
 * <span type='info'>All the props are directly sent to the progress indicator element.</span>
 */
export const Progress: React.FC<ProgressProps> = ({
  max = 1,
  value,
  children,
  className,
  displayMode = "fraction",
  ...rest
}) => {
  return (
    <div className="flex items-center gap-3">
      <progress
        className={cn("progress", className)}
        max={max}
        value={value}
        {...rest}
      >
        {children}
      </progress>

      {value != null && (
        <span className="flex-nowrap text-gray-400 text-xs font-extrabold relative">
          {displayMode === "fraction" ? (
            <>
              <span className="absolute right-0">
                {value}/{max}
              </span>
              <span className="invisible" aria-hidden="true">
                {max}/{max}
              </span>
            </>
          ) : displayMode === "percentage" ? (
            <>
              <span className="absolute right-0">
                {Math.round((value / max) * 100)}%
              </span>
              <span className="invisible" aria-hidden="true">
                100%
              </span>
            </>
          ) : null}
        </span>
      )}
    </div>
  )
}

Progress.displayName = "Progress"
