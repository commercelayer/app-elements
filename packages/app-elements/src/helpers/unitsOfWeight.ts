const unitsOfWeight = ['gr', 'lb', 'oz'] as const

const unitsOfWeightLabels = {
  gr: 'Grams',
  lb: 'Pounds',
  oz: 'Ounces'
} as const

export type UnitOfWeight = (typeof unitsOfWeight)[number]

interface UnitOfWeightForSelect {
  label: (typeof unitsOfWeightLabels)[keyof typeof unitsOfWeightLabels]
  value: UnitOfWeight
}

/**
 * Get a units of weight list suitable for select options usage
 * @returns an array of objects with `value` and `label` props
 */
export const getUnitsOfWeightForSelect = (): UnitOfWeightForSelect[] => {
  return unitsOfWeight.map((unitOfWeight) => {
    return {
      value: unitOfWeight,
      label: unitsOfWeightLabels[unitOfWeight]
    }
  })
}
