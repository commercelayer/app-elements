import React, { useEffect, useRef } from 'react'

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
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry !== undefined) {
          callback(entry)
        }
      },
      {
        rootMargin
      }
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
      data-testid='visibility-trigger'
      ref={enabled ? triggerEl : undefined}
      {...rest}
    />
  )
}
