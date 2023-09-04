import { useState } from 'react'

export function useToggleCheckboxValues(defaultValues: string[]): {
  values: string[]
  toggleValue: (value: string) => void
  setValues: (values: string[]) => void
} {
  const [state, setState] = useState<string[]>(defaultValues)

  const toggle = (value: string): void => {
    if (state.includes(value)) {
      setState(state.filter((item) => item !== value))
    } else {
      setState([...state, value])
    }
  }

  return {
    values: state,
    toggleValue: toggle,
    setValues: setState
  }
}

/**
 * Simple helper to add the counter for selected options to a label
 * or just the total of available options when nothing is selected
 * @param options
 * @returns string
 *
 * @example
 * "Markets · 2 of 4"
 * "Markets · 4"
 */
export function computeLabelWithSelected({
  label,
  selectedCount,
  totalCount
}: {
  label: string
  selectedCount: number
  totalCount?: number
}): string {
  if (totalCount == null) {
    return label
  }

  const counter =
    selectedCount > 0 ? `${selectedCount} of ${totalCount}` : totalCount
  return `${label} · ${counter}`
}
