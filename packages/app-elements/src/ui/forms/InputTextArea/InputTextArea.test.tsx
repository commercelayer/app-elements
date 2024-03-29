import { fireEvent, render, type RenderResult } from '@testing-library/react'
import { InputTextArea } from './InputTextArea'

interface SetupProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id }: SetupProps): SetupResult => {
  const utils = render(<InputTextArea data-testid={id} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputTextArea', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'my-textarea' })
    expect(element).toBeInTheDocument()
  })
  test('Should update value', () => {
    const { element } = setup({ id: 'my-textarea' })
    expect(element.value).toBe('')
    fireEvent.change(element, { target: { value: 'I love Commerce Layer' } })
    expect(element.value).toBe('I love Commerce Layer')
  })
})
