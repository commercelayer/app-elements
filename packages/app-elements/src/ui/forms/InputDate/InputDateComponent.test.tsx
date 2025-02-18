import {
  act,
  fireEvent,
  render,
  type RenderResult
} from '@testing-library/react'
import { InputDateComponent, type InputDateProps } from './InputDateComponent'

interface SetupProps extends InputDateProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<InputDateComponent data-testid={id} {...rest} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputDateComponent', () => {
  beforeEach(() => {
    // tell vitest we use mocked time
    vi.useFakeTimers()
  })

  afterEach(() => {
    // restoring date after each test run
    vi.useRealTimers()
  })

  test('Should be rendered', () => {
    const { element } = setup({
      id: 'date-picker',
      placeholder: 'select a date',
      onChange: () => {}
    })
    const input = element.getElementsByTagName('input')[0]
    expect(element).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input?.getAttribute('placeholder')).toBe('select a date')
  })

  test('Should show initial value', () => {
    const { element } = setup({
      id: 'date-picker',
      placeholder: 'select a date',
      format: 'dd-MM-yyyy',
      value: new Date(2022, 11, 19),
      onChange: () => {}
    })
    const input = element.getElementsByTagName('input')[0]
    expect(element).toBeInTheDocument()
    expect(input).toBeInTheDocument()
    expect(input?.value).toBe('19-12-2022')
  })

  test('Should update value', () => {
    const date = new Date(2022, 0, 1)
    vi.setSystemTime(date)

    const setDate = vi.fn()

    const { element, getByRole } = setup({
      id: 'date-picker',
      placeholder: 'select a date',
      format: 'dd-MM-yyyy',
      onChange: (date) => {
        setDate(date?.toISOString())
      }
    })

    const [input] = element.getElementsByTagName('input')
    assertToBeDefined(input)

    act(() => {
      fireEvent.click(input)
    })

    act(() => {
      fireEvent.click(
        getByRole('option', { name: 'Choose Wednesday, January 5th, 2022' })
      )
    })

    expect(setDate).toBeCalledTimes(1)
    expect(setDate).toHaveBeenCalledWith('2022-01-05T00:00:00.000Z')
  })
})
