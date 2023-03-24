import { useEffect, useRef, useState } from 'react'

export const useDelayShow = (delayMs = 500): readonly [boolean] => {
  const [show, setShow] = useState(delayMs === 0)
  const timeoutId = useRef<number | null>(null)

  useEffect(() => {
    if (!show) {
      timeoutId.current = window.setTimeout(() => {
        setShow(true)
      }, delayMs)
    }

    return () => {
      if (timeoutId.current != null) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [delayMs])

  return [show] as const
}
