import { type InputSelectValue } from './InputSelect'
import {
  flatSelectValues,
  getDefaultValueFromFlatten,
  isGroupedSelectValues
} from './utils'

const singleValue: InputSelectValue = {
  value: 'sku001',
  label: 'Sku Item 001',
  meta: {
    color: 'red',
    shippable: true
  }
}
const multiValue: InputSelectValue[] = [
  {
    value: 'sku001',
    label: 'Sku Item 001',
    meta: {
      color: 'red',
      shippable: true
    }
  },
  {
    value: 'sku002',
    label: 'Sku Item 002',
    meta: {
      color: 'yellow'
    }
  }
]

describe('flatSelectValues - single mode', () => {
  test('should return single value for default path', () => {
    expect(flatSelectValues(singleValue)).toBe('sku001')
  })

  test('should return single value for specific path', () => {
    expect(flatSelectValues(singleValue, 'label')).toBe('Sku Item 001')
  })

  test('should return what it gets when path is reached', () => {
    expect(flatSelectValues(singleValue, 'meta')).toEqual({
      color: 'red',
      shippable: true
    })
  })

  test('should return single value using dot-notation', () => {
    expect(flatSelectValues(singleValue, 'meta.shippable')).toBe(true)
  })

  test('should return undefined for non existing path path', () => {
    expect(flatSelectValues(singleValue, 'not.existing.path')).toBe(undefined)
  })
})

describe('flatSelectValues - multi mode', () => {
  test('should return multiple values for default path', () => {
    expect(flatSelectValues(multiValue)).toEqual(['sku001', 'sku002'])
  })

  test('should return multiple values for specific path', () => {
    expect(flatSelectValues(multiValue, 'label')).toEqual([
      'Sku Item 001',
      'Sku Item 002'
    ])
  })

  test('should return multiple values using dot-notation as path', () => {
    expect(flatSelectValues(multiValue, 'meta.color')).toEqual([
      'red',
      'yellow'
    ])
  })

  test('should return some undefined where path is not always found', () => {
    expect(flatSelectValues(multiValue, 'meta.shippable')).toEqual([
      true,
      undefined
    ])
  })
})

describe('isGroupedSelectValues', () => {
  test('should return TRUE when pass valid GroupedSelectValues', () => {
    expect(
      isGroupedSelectValues([
        {
          label: 'Lombardy',
          options: [
            { value: 'MI', label: 'Milan' },
            { value: 'BG', label: 'Bergamo' }
          ]
        },
        {
          label: 'Tuscany',
          options: [
            { value: 'PO', label: 'Prato' },
            { value: 'FI', label: 'Florence' }
          ]
        }
      ])
    ).toBe(true)
  })

  test('should return FALSE when pass simple Array<SelectValue>', () => {
    expect(
      isGroupedSelectValues([
        { value: 'MI', label: 'Milan' },
        { value: 'BG', label: 'Bergamo' },
        { value: 'PO', label: 'Prato' },
        { value: 'FI', label: 'Florence' }
      ])
    ).toBe(false)
  })
})

describe('getDefaultValueFromFlatten', () => {
  const initialValues = [
    { value: 'MI', label: 'Milan', meta: { zipCode: '20100' } },
    { value: 'BG', label: 'Bergamo', meta: { zipCode: '24100' } },
    { value: 'PO', label: 'Prato', meta: { zipCode: '59100' } },
    { value: 'FI', label: 'Florence', meta: { zipCode: '50100' } }
  ]

  test('should return a single value when working as single select', () => {
    expect(
      getDefaultValueFromFlatten({
        initialValues,
        currentValue: 'PO'
      })
    ).toStrictEqual({ value: 'PO', label: 'Prato', meta: { zipCode: '59100' } })
  })

  test('should match the current value with a custom pathToValue', () => {
    expect(
      getDefaultValueFromFlatten({
        initialValues,
        currentValue: '20100',
        pathToValue: 'meta.zipCode'
      })
    ).toStrictEqual({ value: 'MI', label: 'Milan', meta: { zipCode: '20100' } })
  })

  test('should return a new option generated from `currentValue` when this is not included in `initialValues`', () => {
    expect(
      getDefaultValueFromFlatten({
        initialValues,
        currentValue: '000000',
        pathToValue: 'meta.zipCode'
      })
    ).toStrictEqual({
      value: '000000',
      label: '000000'
    })
  })

  test('should return an array when working as multi select', () => {
    expect(
      getDefaultValueFromFlatten({
        initialValues,
        currentValue: ['MI', 'BG']
      })
    ).toStrictEqual(initialValues.slice(0, 2))
  })

  test('should return an array with the new option generated from `currentValue` when this is not included in `initialValues` (isMulti)', () => {
    expect(
      getDefaultValueFromFlatten({
        initialValues,
        currentValue: ['TO']
      })
    ).toStrictEqual([
      {
        value: 'TO',
        label: 'TO'
      }
    ])
  })

  test('should undefined when current value does not exist', () => {
    expect(
      getDefaultValueFromFlatten({
        initialValues,
        pathToValue: 'meta.zipCode'
      })
    ).toStrictEqual(undefined)
  })
})
