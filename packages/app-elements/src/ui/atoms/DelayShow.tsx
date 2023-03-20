import {
  Children,
  cloneElement,
  isValidElement,
  ReactNode,
  useEffect,
  useRef,
  useState
} from 'react'

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
    <>
      {Children.map(children, (child) => {
        if (!isValidElement<any>(child)) {
          return child
        }

        return cloneElement(child, {
          style: {
            ...(child.props.style ?? {}),
            opacity: show ? 1 : 0
          }
        })
      })}
    </>
  )
}

DelayShow.displayName = 'DelayShow'

export { DelayShow }
