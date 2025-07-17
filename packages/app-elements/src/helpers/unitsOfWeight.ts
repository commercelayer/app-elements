const unitsOfWeight = ["gr", "lb", "oz"] as const

const unitsOfWeightNames = {
  gr: "Grams",
  lb: "Pounds",
  oz: "Ounces",
} as const

export type UnitOfWeight = (typeof unitsOfWeight)[number]
type UnitOfWeightLabel =
  (typeof unitsOfWeightNames)[keyof typeof unitsOfWeightNames]

interface UnitOfWeightForSelect {
  label: UnitOfWeightLabel
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
      label: unitsOfWeightNames[unitOfWeight],
    }
  })
}

export function getUnitOfWeightName(
  unitOfWeight: UnitOfWeight,
): UnitOfWeightLabel {
  return unitsOfWeightNames[unitOfWeight]
}
