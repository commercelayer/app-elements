import { flatSelectValues, SelectValue } from './index'

const singleValue: SelectValue = {
  value: 'sku001',
  label: 'Sku Item 001',
  meta: {
    color: 'red',
    shippable: true
  }
}
const multiValue: SelectValue[] = [
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
