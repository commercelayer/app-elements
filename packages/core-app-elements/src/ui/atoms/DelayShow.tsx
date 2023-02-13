import { ReactNode, useState, useRef, useEffect } from 'react'

interface Props {
  delayMs: number
  children: ReactNode
}

function DelayShow({ delayMs = 1000, children }: Props): JSX.Element | null {
  const [show, setShow] = useState(delayMs === 0)
  const timeoutId = useRef<number | null>(null)

  useEffect(() => {
    timeoutId.current = window.setTimeout(() => {
      setShow(true)
    }, delayMs)

    return () => {
      if (timeoutId.current != null) {
        clearTimeout(timeoutId.current)
      }
    }
  }, [delayMs])

  return (
    <div
      data-test-id='delay-show'
      style={{
        opacity: show ? 1 : 0
      }}
    >
      {children}
    </div>
  )
}

DelayShow.displayName = 'DelayShow'

export { DelayShow }
