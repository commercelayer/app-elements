import {
  fireEvent,
  render,
  waitFor,
  type RenderResult
} from '@testing-library/react'
import { useState, type JSX } from 'react'
import { type MaybeDate } from '../InputDate/InputDateComponent'
import { InputDateRange, type InputDateRangeProps } from './InputDateRange'

interface SetupProps extends Omit<InputDateRangeProps, 'onChange'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

function ComponentWithState({ id, value, ...rest }: SetupProps): JSX.Element {
  const [dates, dateDates] = useState<[MaybeDate, MaybeDate]>(value)

  return (
    <InputDateRange
      data-testid={id}
      {...rest}
      value={dates}
      onChange={dateDates}
    />
  )
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<ComponentWithState id={id} {...rest} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputDateRange', () => {
  test('Should be rendered', async () => {
    const { element, getByPlaceholderText } = setup({
      id: 'date-picker',
      fromPlaceholder: 'select starting date',
      toPlaceholder: 'select ending date',
      value: [null, null]
    })
    expect(element).toBeInTheDocument()

    // waiting for lazy load component
    await waitFor(
      () => {
        expect(getByPlaceholderText('select starting date')).toBeInTheDocument()
      },
      {
        timeout: 5000
      }
    )

    const inputFrom = getByPlaceholderText('select starting date')
    const inputTo = getByPlaceholderText('select ending date')
    expect(inputFrom).toBeInTheDocument()
    expect(inputTo).toBeInTheDocument()
    expect(inputFrom.getAttribute('placeholder')).toBe('select starting date')
    expect(inputTo.getAttribute('placeholder')).toBe('select ending date')
  })

  test('Should sync to date when from date is higher', async () => {
    const { element } = setup({
      id: 'date-picker-sync',
      format: 'dd-MM-yyyy',
      value: [null, null]
    })
    expect(element).toBeInTheDocument()

    // waiting for lazy load component
    await waitFor(() => {
      expect(element.getElementsByTagName('input')[0]).toBeInTheDocument()
    })

    const [inputFrom, inputTo] = element.getElementsByTagName('input')
    assertToBeDefined(inputFrom)
    assertToBeDefined(inputTo)

    fireEvent.change(inputFrom, { target: { value: '20-12-2022' } })
    await waitFor(() => {
      expect(inputFrom.value).toBe('20-12-2022')
    })

    fireEvent.change(inputTo, { target: { value: '13-01-2023' } })
    await waitFor(() => {
      expect(inputTo.value).toBe('13-01-2023')
    })

    // change `from` to be higher then actual `to` value
    fireEvent.change(inputFrom, { target: { value: '20-02-2023' } })
    await waitFor(() => {
      expect(inputFrom.value).toBe('20-02-2023')
    })
    await waitFor(() => {
      expect(inputTo.value).toBe(inputFrom.value)
    })
  })
})
