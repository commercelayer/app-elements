import { useCallback, useEffect, useRef, type RefObject } from 'react'

export const useClickAway = (
  onClickAway?: () => void
): RefObject<HTMLDivElement> | undefined => {
  if (onClickAway != null) {
    const ref = useRef<HTMLDivElement>(null)

    const escapeListener = useCallback((event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        onClickAway()
      }
    }, [])

    const clickListener = useCallback(
      (event: MouseEvent) => {
        if (
          ref.current != null &&
          !ref?.current.contains(event.target as Node)
        ) {
          onClickAway()
        }
      },
      [ref.current]
    )

    useEffect(() => {
      document.addEventListener('click', clickListener)
      document.addEventListener('keyup', escapeListener)
      return () => {
        document.removeEventListener('click', clickListener)
        document.removeEventListener('keyup', escapeListener)
      }
    }, [])

    return ref
  }
}
