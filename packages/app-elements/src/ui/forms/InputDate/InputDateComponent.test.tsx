import { fireEvent, render, type RenderResult } from '@testing-library/react'
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
    const setDate = vi.fn()

    const { element } = setup({
      id: 'date-picker',
      placeholder: 'select a date',
      format: 'dd-MM-yyyy',
      onChange: (date) => {
        setDate(date?.toISOString())
      }
    })
    const [input] = element.getElementsByTagName('input')
    assertToBeDefined(input)

    fireEvent.change(input, { target: { value: '2022-12-19T23:00:00.000Z' } })
    expect(setDate).toBeCalledTimes(1)
    expect(setDate).toHaveBeenCalledWith('2022-12-19T23:00:00.000Z')
  })
})
