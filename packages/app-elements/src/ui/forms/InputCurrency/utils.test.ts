import { currencies } from './currencies'
import { addCurrencySymbol, getDecimalLength, makePlaceholder } from './utils'

describe('getDecimalLength', () => {
  it('should return the number of decimals for a given currency', () => {
    expect(getDecimalLength(currencies.eur)).toBe(2)
    expect(getDecimalLength(currencies.usd)).toBe(2)
    expect(getDecimalLength(currencies.gbp)).toBe(2)
    expect(getDecimalLength(currencies.jpy)).toBe(0)
    expect(getDecimalLength(currencies.jod)).toBe(3)
    expect(getDecimalLength(currencies.clf)).toBe(4)
  })
})

describe('addCurrencySymbol', () => {
  it('should add currency symbol before for EUR', () => {
    expect(
      addCurrencySymbol({
        formattedValue: '10.000,00',
        currency: currencies.eur
      })
    ).toBe('€10.000,00')
  })

  it('should add currency symbol after for LRD', () => {
    expect(
      addCurrencySymbol({
        formattedValue: '10.000,00',
        currency: currencies.lrd
      })
    ).toBe('10.000,00$')
  })
})

describe('makePlaceholder', () => {
  it('should return a placeholder with the currency symbol', () => {
    expect(makePlaceholder(currencies.eur)).toBe('0,00')
    expect(makePlaceholder(currencies.usd)).toBe('0.00')
    expect(makePlaceholder(currencies.jpy)).toBe('0')
  })
})
