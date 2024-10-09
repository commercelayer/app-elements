import { computeTitleWithTotalCount } from './utils'

describe('computeTitleWithTotalCount', () => {
  test('Should display count formatted as US', () => {
    expect(
      computeTitleWithTotalCount({
        title: 'Total',
        recordCount: 10200,
        locale: 'en-US'
      })
    ).toBe('Total · 10,200')
  })

  test('Should display count formatted as IT', () => {
    expect(
      computeTitleWithTotalCount({
        title: 'Total',
        recordCount: 10200,
        locale: 'it-IT'
      })
    ).toBe('Total · 10.200')
  })

  test('should ignore interpolation when title is not a string', () => {
    const component = <div>Total</div>
    expect(
      computeTitleWithTotalCount({
        title: component,
        recordCount: 10200
      })
    ).toBe(component)
  })

  test('should ignore interpolation when recordCount is zero or undefined', () => {
    expect(
      computeTitleWithTotalCount({
        title: 'Records',
        recordCount: 0
      })
    ).toBe('Records')
    expect(
      computeTitleWithTotalCount({
        title: 'Records'
      })
    ).toBe('Records')
  })
})
