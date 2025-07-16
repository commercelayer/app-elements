import { useCallback } from "react"

type OnBlur = (event: React.FocusEvent<HTMLElement, Element>) => void

/**
 * Check if the new focused element is a child of the element and trigger the `onBlur` callback.
 * @param onBlur Function that will be triggered when the new focused element is a child of the element.
 * @returns
 */
export const useOnBlurFromContainer = (onBlur: () => void): OnBlur => {
  return useCallback(
    (event) => {
      const currentTarget = event.currentTarget

      requestAnimationFrame(() => {
        if (!currentTarget.contains(document.activeElement)) {
          onBlur()
        }
      })
    },
    [onBlur],
  )
}
