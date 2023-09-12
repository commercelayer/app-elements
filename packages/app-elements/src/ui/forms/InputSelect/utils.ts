import get from 'lodash/get'
import {
  type GroupedSelectValues,
  type PossibleSelectValue,
  type SelectValue
} from './InputSelect'

/**
 * Helper function to understand and refine type of a single selected value
 * @param selectedValue possible value returned from select component
 * @returns true if selected value is single, from this point TypeScript will treat this as `SelectValue` type
 */
export function isSingleValueSelected(
  selectedValue: PossibleSelectValue
): selectedValue is SelectValue {
  return selectedValue != null && !Array.isArray(selectedValue)
}

/**
 * Helper function to understand and refine type of a set of selected values
 * @param selectedValue possible value returned from select component
 * @returns true if selected value is an array of selected values, from this point TypeScript will treat this as `SelectValue[]` type
 */
export function isMultiValueSelected(
  selectedValue: PossibleSelectValue
): selectedValue is SelectValue[] {
  return selectedValue != null && Array.isArray(selectedValue)
}

/**
 * Type-guard to check if prop `initialValues` is a GroupedSelectValues or SelectValue
 */
export function isGroupedSelectValues(
  initialValues?: GroupedSelectValues | SelectValue[]
): initialValues is GroupedSelectValues {
  if (initialValues == null || initialValues.length === 0) {
    return false
  }
  return (initialValues as []).every((v) => 'options' in v)
}

/**
 * Helper function to extract only a specific property from the `SelectValue`
 * @param selectedValue possible value returned from select component
 * @param pathToValue optional path.to.property. Default is `value`
 * @returns a string or an array of strings.
 * Examples:
 * ```
 * flatSelectValues({value: 'ABCD', label: 'T-Shirt XL'})
 * // returns 'ABCD'
 *
 * flatSelectValues([
 *   {value: 'ABCD', label: 'T-Shirt M'},
 *   {value: '1234', label: 'T-Shirt XL'},
 * ], 'label')
 * // returns ['T-Shirt M', 'T-Shirt XL']
 * ```
 */
export function flatSelectValues(
  selectedValue: PossibleSelectValue,
  pathToValue = 'value'
): null | string | Array<string | number> {
  if (selectedValue == null) {
    return selectedValue
  }

  return isSingleValueSelected(selectedValue)
    ? get(selectedValue, pathToValue)
    : selectedValue.map((item) => get(item, pathToValue))
}

/**
 * To be used when storing the flatten value and there is the need
 * to retrieve the `defaultValue` to pass as <InputSelect> prop
 * @param currentValue the current value that is being stored in app state
 * @param initialValues the array of SelectValue objects that should contain the `currentValue`
 * @param pathToValue optional path.to.property. Default is `value`
 * @returns the matched value or values, otherwise undefined.
 */
export function getDefaultValueFromFlatten({
  currentValue,
  initialValues = [],
  pathToValue = 'value'
}: {
  currentValue?: string | Array<string | number> | null
  initialValues?: GroupedSelectValues | SelectValue[]
  pathToValue?: string
}): SelectValue | SelectValue[] | undefined {
  if (currentValue == null) {
    return undefined
  }

  const options = isGroupedSelectValues(initialValues)
    ? initialValues.flatMap((v) => v.options)
    : initialValues

  if (Array.isArray(currentValue)) {
    return options.filter((v) => {
      const valueToCompare = get(v, pathToValue)
      return currentValue.includes(valueToCompare)
    })
  }

  return options.find((v) => {
    return currentValue === get(v, pathToValue)
  })
}
