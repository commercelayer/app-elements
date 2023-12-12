import { useEffect, type FC } from 'react'

/**
 * This component lets the window scrolls back to top once the window.location.pathname is changed
 */
export const ScrollToTop: FC = () => {
  useEffect(() => {
    window.scrollTo(0, 0)
  }, [window.location.pathname])

  return null
}
