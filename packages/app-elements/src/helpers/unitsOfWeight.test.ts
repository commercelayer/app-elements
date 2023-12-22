import { getUnitOfWeightName, getUnitsOfWeightForSelect } from './unitsOfWeight'

describe('getUnitsOfWeightForSelect', () => {
  test('Should return the array of units of weight suitable for a select', () => {
    expect(getUnitsOfWeightForSelect()).toStrictEqual([
      {
        value: 'gr',
        label: 'Grams'
      },
      {
        value: 'lb',
        label: 'Pounds'
      },
      {
        value: 'oz',
        label: 'Ounces'
      }
    ])
  })
})

describe('getUnitOfWeightName', () => {
  test('Should return `Grams`', () => {
    expect(getUnitOfWeightName('gr')).toBe('Grams')
  })
  test('Should return `Pounds`', () => {
    expect(getUnitOfWeightName('lb')).toBe('Pounds')
  })
  test('Should return `Ounces`', () => {
    expect(getUnitOfWeightName('oz')).toBe('Ounces')
  })
})
