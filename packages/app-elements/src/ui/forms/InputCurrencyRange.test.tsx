import { fireEvent, render, waitFor } from '@testing-library/react'
import {
  InputCurrencyRange,
  type InputCurrencyRangeProps
} from './InputCurrencyRange'

const currencyList = [
  'EUR',
  'USD',
  'HUF',
  'JPY'
] as const satisfies InputCurrencyRangeProps['currencyList']

describe('InputCurrencyRange', () => {
  test('Should be rendered', () => {
    const { container } = render(
      <InputCurrencyRange currencyList={currencyList} onChange={() => {}} />
    )
    expect(container).toBeInTheDocument()
  })

  test('Should show formatted values with default currency as USD', () => {
    const { getByPlaceholderText } = render(
      <InputCurrencyRange
        currencyList={currencyList}
        onChange={() => {}}
        defaultCurrency='USD'
        placeholders={['min', 'max']}
        fromCents={56024}
        toCents={982301}
      />
    )
    expect(getByPlaceholderText('min')).toHaveValue('560.24')
    expect(getByPlaceholderText('max')).toHaveValue('9,823.01')
  })

  test('Should show formatted values with default currency as USD', () => {
    const { getByPlaceholderText } = render(
      <InputCurrencyRange
        currencyList={currencyList}
        onChange={() => {}}
        defaultCurrency='EUR'
        placeholders={['min', 'max']}
        fromCents={56024}
        toCents={982301}
      />
    )
    expect(getByPlaceholderText('min')).toHaveValue('560,24')
    expect(getByPlaceholderText('max')).toHaveValue('9.823,01')
  })

  test('Should properly fire onChange', () => {
    const mockedOnChange = vi.fn()
    const { getByPlaceholderText } = render(
      <InputCurrencyRange
        currencyList={currencyList}
        defaultCurrency='USD'
        placeholders={['min', 'max']}
        onChange={mockedOnChange}
      />
    )

    fireEvent.change(getByPlaceholderText('min'), {
      target: { value: '67.89' }
    })

    expect(mockedOnChange).toHaveBeenCalledWith(
      {
        cents: 6789,
        formatted: '$67.89'
      },
      {
        cents: undefined,
        formatted: ''
      },
      'USD'
    )

    fireEvent.change(getByPlaceholderText('max'), {
      target: { value: '120.20' }
    })

    expect(mockedOnChange).toHaveBeenCalledWith(
      {
        cents: 6789,
        formatted: '$67.89'
      },
      {
        cents: 12020,
        formatted: '$120.20'
      },
      'USD'
    )
  })

  test('Should update value', async () => {
    const { getByPlaceholderText, getByText } = render(
      <InputCurrencyRange
        currencyList={currencyList}
        onChange={() => {}}
        defaultCurrency='EUR'
        placeholders={['min', 'max']}
        fromCents={56024}
        toCents={982301}
      />
    )
    // update min
    const minInput = getByPlaceholderText('min')
    fireEvent.change(minInput, { target: { value: '200,34' } })
    expect(minInput).toHaveValue('200,34')

    // update max
    const maxInput = getByPlaceholderText('max')
    fireEvent.change(maxInput, { target: { value: '501,12' } })
    expect(maxInput).toHaveValue('501,12')

    // update currency and expect values to be formatted with the new currency
    await waitFor(() => {
      // await InputSelect to be lazy loaded
      expect(getByText('EUR')).toBeInTheDocument()
    })

    // open select dropdown
    fireEvent.keyDown(getByText('EUR'), { key: 'ArrowDown' })

    await waitFor(() => {
      expect(getByText('USD')).toBeInTheDocument()
    })
    fireEvent.click(getByText('USD'))
    expect(minInput).toHaveValue('200.34')
    expect(maxInput).toHaveValue('501.12')
  })
})
