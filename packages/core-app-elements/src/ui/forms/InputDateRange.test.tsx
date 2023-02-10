import { useState } from 'react'
import InputDateRange, { InputDateRangeProps } from './InputDateRange'
import {
  render,
  RenderResult,
  waitFor,
  fireEvent
} from '@testing-library/react'
import { MaybeDate } from './InputDate/InputDateComponent'

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
      data-test-id={id}
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
    const { element } = setup({
      id: 'date-picker',
      fromPlaceholder: 'select starting date',
      toPlaceholder: 'select ending date',
      value: [null, null]
    })
    expect(element).toBeInTheDocument()

    // waiting for lazy load component
    await waitFor(() =>
      expect(element.getElementsByTagName('input')[0]).toBeInTheDocument()
    )

    const inputFrom = element.getElementsByTagName('input')[0]
    const inputTo = element.getElementsByTagName('input')[1]
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
    await waitFor(() =>
      expect(element.getElementsByTagName('input')[0]).toBeInTheDocument()
    )

    const inputFrom = element.getElementsByTagName('input')[0]
    const inputTo = element.getElementsByTagName('input')[1]

    fireEvent.change(inputFrom, { target: { value: '20-12-2022' } })
    await waitFor(() => expect(inputFrom.value).toBe('20-12-2022'))

    fireEvent.change(inputTo, { target: { value: '13-01-2023' } })
    await waitFor(() => expect(inputTo.value).toBe('13-01-2023'))

    // change `from` to be higher then actual `to` value
    fireEvent.change(inputFrom, { target: { value: '20-02-2023' } })
    await waitFor(() => expect(inputFrom.value).toBe('20-02-2023'))
    await waitFor(() => expect(inputTo.value).toBe(inputFrom.value))
  })
})
