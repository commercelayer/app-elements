import isEqual from 'lodash-es/isEqual'
import { useEffect, useRef } from 'react'

/**
 * This hook is used to detect when a value has changed during new rendering.
 * It is useful to trigger an action when a value has changed.
 * @param value - the value to watch
 * @param onChange - the action to trigger when the value has changed
 * @returns - a boolean that is true when the value has changed
 */
export function useIsChanged<T>({
  value,
  onChange
}: {
  value: T
  onChange?: () => void
}): boolean {
  const previousValue = useRef<T>(value)
  const isValueChanged = !isEqual(value, previousValue.current)

  useEffect(() => {
    previousValue.current = value
    if (isValueChanged && onChange != null) {
      onChange()
    }
  }, [isValueChanged])

  return isValueChanged
}
