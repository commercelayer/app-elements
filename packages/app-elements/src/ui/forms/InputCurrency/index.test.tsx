import { fireEvent, render } from '@testing-library/react'
import { InputCurrency, formatCentsToCurrency } from './index'

describe('InputCurrency', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('should render', () => {
    const { getByTestId, getByPlaceholderText } = render(
      <InputCurrency currencyCode='EUR' onChange={() => {}} />
    )
    expect(getByTestId('inputCurrency-input')).toBeVisible()
    expect(getByTestId('inputCurrency-symbol').innerHTML).toBe('€')
    expect(getByPlaceholderText('0,00')).toBeVisible()
  })

  it('should change value', () => {
    const onChange = vi.fn()
    const { getByTestId } = render(
      <InputCurrency currencyCode='USD' onChange={onChange} />
    )

    const input = getByTestId('inputCurrency-input')
    fireEvent.change(input, { target: { value: '10' } })
    expect(onChange).toHaveBeenCalledWith(1000, '$10.00')
  })

  it('should change value with custom decimal', () => {
    const onChange = vi.fn()
    const { getByTestId } = render(
      <InputCurrency currencyCode='EUR' onChange={onChange} />
    )

    const input = getByTestId('inputCurrency-input')
    fireEvent.change(input, { target: { value: '200,34' } })
    expect(onChange).toHaveBeenCalledWith(20034, '€200,34')
  })

  it('should accept a default value', () => {
    const onChange = vi.fn()
    const { getByTestId } = render(
      <InputCurrency currencyCode='EUR' onChange={onChange} cents={10052} />
    )

    expect(getByTestId('inputCurrency-symbol').innerHTML).toBe('€')
    const input = getByTestId('inputCurrency-input')
    expect(input).toHaveValue('100,52')
  })

  it('should fail to render when default value is not in full cents', () => {
    const onChange = vi.fn()
    const { queryByTestId } = render(
      <InputCurrency currencyCode='EUR' onChange={onChange} cents={100.52} />
    )
    expect(queryByTestId('inputCurrency-input')).not.toBeInTheDocument()
  })
})

describe('formatCentsToCurrency', () => {
  it('should format cents with decimal separator, group separator and prefix in EUR', () => {
    expect(formatCentsToCurrency(1, 'EUR')).toBe('€0,01')
    expect(formatCentsToCurrency(100, 'EUR')).toBe('€1,00')
    expect(formatCentsToCurrency(1020, 'EUR')).toBe('€10,20')
    expect(formatCentsToCurrency(1033, 'EUR')).toBe('€10,33')
    expect(formatCentsToCurrency(30000, 'EUR')).toBe('€300,00')
    expect(formatCentsToCurrency(100000, 'EUR')).toBe('€1.000,00')
  })

  it('should format cents with decimal separator, group separator and prefix in USD', () => {
    expect(formatCentsToCurrency(1, 'USD')).toBe('$0.01')
    expect(formatCentsToCurrency(100, 'USD')).toBe('$1.00')
    expect(formatCentsToCurrency(1020, 'USD')).toBe('$10.20')
    expect(formatCentsToCurrency(1033, 'USD')).toBe('$10.33')
    expect(formatCentsToCurrency(30000, 'USD')).toBe('$300.00')
    expect(formatCentsToCurrency(100000, 'USD')).toBe('$1,000.00')
  })

  it('should format cents with decimal separator, group separator and prefix in JPY', () => {
    expect(formatCentsToCurrency(1, 'JPY')).toBe('¥1')
    expect(formatCentsToCurrency(100, 'JPY')).toBe('¥100')
    expect(formatCentsToCurrency(1020, 'JPY')).toBe('¥1,020')
    expect(formatCentsToCurrency(1033, 'JPY')).toBe('¥1,033')
    expect(formatCentsToCurrency(30000, 'JPY')).toBe('¥30,000')
    expect(formatCentsToCurrency(100000, 'JPY')).toBe('¥100,000')
  })

  it('should format cents with decimal separator, group separator and prefix in CLF', () => {
    expect(formatCentsToCurrency(1, 'CLF')).toBe('UF0,0001')
    expect(formatCentsToCurrency(100, 'CLF')).toBe('UF0,0100')
    expect(formatCentsToCurrency(1020, 'CLF')).toBe('UF0,1020')
    expect(formatCentsToCurrency(1033, 'CLF')).toBe('UF0,1033')
    expect(formatCentsToCurrency(30000, 'CLF')).toBe('UF3,0000')
    expect(formatCentsToCurrency(100200, 'CLF')).toBe('UF10,0200')
  })

  it('should format cents with decimal separator, group separator and suffix in HUF', () => {
    expect(formatCentsToCurrency(1, 'HUF')).toBe('1Ft')
    expect(formatCentsToCurrency(100, 'HUF')).toBe('100Ft')
    expect(formatCentsToCurrency(1020, 'HUF')).toBe('1 020Ft')
    expect(formatCentsToCurrency(1033, 'HUF')).toBe('1 033Ft')
    expect(formatCentsToCurrency(30000, 'HUF')).toBe('30 000Ft')
    expect(formatCentsToCurrency(100200, 'HUF')).toBe('100 200Ft')
  })

  it('Should strip decimals when requested and cents are 0', () => {
    expect(formatCentsToCurrency(3400, 'USD', false)).toBe('$34.00')
    expect(formatCentsToCurrency(3400, 'USD', true)).toBe('$34')
    expect(formatCentsToCurrency(1033, 'EUR', true)).toBe('€10,33')
    expect(formatCentsToCurrency(30000, 'EUR', true)).toBe('€300')
  })
})
