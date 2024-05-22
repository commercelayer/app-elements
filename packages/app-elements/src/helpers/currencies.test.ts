import { currencyInputSelectOptions } from '#helpers/currencies'

describe('currencyInputSelectOptions', () => {
  test('should return two groups of currencies', () => {
    expect(currencyInputSelectOptions.length).toBe(2)
  })

  test('both groups should have no label', () => {
    expect(
      currencyInputSelectOptions.every((group) => group.label == null)
    ).toBe(true)
  })

  test('first group should return USD, EUR, GBP only', () => {
    expect(currencyInputSelectOptions[0]).toEqual({
      label: undefined,
      options: [
        { label: 'USD', value: 'USD' },
        { label: 'EUR', value: 'EUR' },
        { label: 'GBP', value: 'GBP' }
      ]
    })
  })

  test('second group should not contain the top currencies from the first group', () => {
    const topCurrencies =
      currencyInputSelectOptions[0]?.options.map((o) => o.value as string) ?? []
    const otherCurrencies =
      currencyInputSelectOptions[1]?.options.map((o) => o.value as string) ?? []

    expect(
      otherCurrencies.some((currencyCode) =>
        topCurrencies.includes(currencyCode)
      )
    ).toBe(false)
  })
})
