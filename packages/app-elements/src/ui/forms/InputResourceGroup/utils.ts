import { type CommerceLayerClient } from '@commercelayer/sdk'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
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

type Resource = Awaited<
  ReturnType<CommerceLayerClient[ListableResourceType]['list']>
>[number]

/**
 * Helper to prepare the options for the checkbox group or mocked info to be used for skeleton.
 */
export function prepareCheckboxItemOrMock({
  resource,
  isLoading,
  fieldForLabel,
  fieldForValue
}: {
  resource?: Resource
  isLoading?: boolean
  fieldForValue: string
  fieldForLabel: string
}): { value: string; label: string } {
  const getAttribute = (attribute: string): string =>
    resource == null
      ? ''
      : ((resource[attribute as keyof Resource] ?? '') as string)

  return isLoading === true || resource == null
    ? // mock
      {
        value: '',
        label: 'Commerce Layer'
      }
    : // real
      {
        value: getAttribute(fieldForValue),
        label: getAttribute(fieldForLabel)
      }
}
