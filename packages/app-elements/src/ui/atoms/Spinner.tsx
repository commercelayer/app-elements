import cn from "classnames"
import type { ComponentPropsWithoutRef, JSX } from "react"

/**
 * One turn of `animate-spin`, whose duration is 1s and whose timing is linear.
 * Kept here because the spinner's phase is derived from it below.
 */
const SPIN_DURATION_MS = 1000

export type SpinnerProps = Omit<
  ComponentPropsWithoutRef<"div">,
  "children" | "style"
>

/**
 * The spinner of a wait with no knowable end, the one a loading page shows.
 * It is only the ring: when to show it, and what to tell assistive tech, is
 * up to the caller.
 */
export function Spinner({ className, ...rest }: SpinnerProps): JSX.Element {
  return (
    <div
      data-testid="spinner"
      {...rest}
      className={cn(
        "w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin",
        className,
      )}
      // A CSS animation starts from its first frame on every mount, so each
      // handoff would snap the spinner back to 0°. Offsetting it into the
      // rotation by where the wall clock currently sits puts every instance in
      // the same phase — the next one carries on from the angle the previous
      // one had reached. No shared state needed, which matters across the
      // dashboard/app bundle boundary, and `animate-spin` is linear so the
      // seam is not visible.
      style={{
        animationDelay: `-${Date.now() % SPIN_DURATION_MS}ms`,
      }}
    />
  )
}

Spinner.displayName = "Spinner"
