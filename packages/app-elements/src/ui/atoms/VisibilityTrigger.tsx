import cn from "classnames"
import React, { type JSX, useEffect, useRef } from "react"

export interface VisibilityTriggerProps
  extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Grows or shrinks the area that counts as visible, e.g. `"200px"` to start
   * loading before the element actually reaches the viewport.
   */
  rootMargin?: string
  /** Invoked whenever the element enters or leaves the viewport. */
  callback: (entry: IntersectionObserverEntry) => void
  /** When `false` the element still renders, but is not observed. */
  enabled: boolean
}

/**
 * Renders an empty element and reports when it scrolls into view, so callers
 * can load the next page of a long list as the user approaches the end of it.
 *
 * Place it after the last item you have rendered.
 */
export function VisibilityTrigger({
  rootMargin,
  enabled,
  callback,
  className,
  ...rest
}: VisibilityTriggerProps): JSX.Element {
  const triggerEl = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry !== undefined) {
          callback(entry)
        }
      },
      {
        rootMargin,
      },
    )

    if (triggerEl?.current != null) {
      observer.observe(triggerEl.current)
    }

    return () => {
      if (triggerEl?.current != null) {
        observer.unobserve(triggerEl.current)
      }
    }
  }, [enabled])

  return (
    <div
      data-testid="visibility-trigger"
      // One pixel tall on purpose. With no height its rect collapses onto the
      // bottom edge of the scrollable content, and a zero-area rect sitting
      // exactly on the root boundary is not reliably reported as visible, so
      // the last page would never load.
      className={cn("h-px", className)}
      ref={enabled ? triggerEl : undefined}
      {...rest}
    />
  )
}
