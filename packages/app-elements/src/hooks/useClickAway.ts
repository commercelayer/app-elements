import { type RefObject, useCallback, useEffect, useRef } from "react"

export const useClickAway = (
  onClickAway: () => void,
): RefObject<HTMLDivElement> | undefined => {
  const ref = useRef<HTMLDivElement>(null)

  const escapeListener = useCallback((event: KeyboardEvent) => {
    if (event.key === "Escape") {
      onClickAway()
    }
  }, [])

  const clickListener = useCallback(
    (event: MouseEvent) => {
      if (ref.current != null && !ref?.current.contains(event.target as Node)) {
        onClickAway()
      }
    },
    [ref.current],
  )

  useEffect(() => {
    document.addEventListener("click", clickListener)
    document.addEventListener("keyup", escapeListener)
    return () => {
      document.removeEventListener("click", clickListener)
      document.removeEventListener("keyup", escapeListener)
    }
  }, [])

  if (ref.current == null) {
    return undefined
  }

  // @ts-expect-error ref.current is never null
  return ref
}
