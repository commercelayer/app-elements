import React, { type JSX, useEffect, useRef } from "react"

interface VisibilityTriggerProps extends React.HTMLAttributes<HTMLDivElement> {
  rootMargin?: string
  callback: (entry: IntersectionObserverEntry) => void
  enabled: boolean
}

export function VisibilityTrigger({
  rootMargin,
  enabled,
  callback,
  ...rest
}: VisibilityTriggerProps): JSX.Element {
  const triggerEl = useRef<HTMLDivElement | null>(null)
  const callbackRef = useRef(callback)
  const wasIntersectingRef = useRef(false)

  useEffect(() => {
    callbackRef.current = callback
  }, [callback])

  useEffect(() => {
    if (!enabled || triggerEl.current == null) {
      return
    }

    const observedElement = triggerEl.current
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry == null) {
          return
        }

        const didEnterViewport =
          entry.isIntersecting && !wasIntersectingRef.current
        wasIntersectingRef.current = entry.isIntersecting

        if (didEnterViewport) {
          callbackRef.current(entry)
        }
      },
      {
        rootMargin,
      },
    )

    observer.observe(observedElement)

    return () => {
      observer.unobserve(observedElement)
      observer.disconnect()
      wasIntersectingRef.current = false
    }
  }, [enabled, rootMargin])

  return (
    <div
      data-testid="visibility-trigger"
      ref={enabled ? triggerEl : undefined}
      {...rest}
    />
  )
}
