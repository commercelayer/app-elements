import { useState } from 'react'
import { Input } from './Input'
import { fireEvent, render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  value?: string
  type?: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, value, type }: SetupProps): SetupResult => {
  const [currentValue, setCurrentValue] = useState(value)
  const utils = render(
    <Input
      data-test-id={id}
      value={currentValue}
      type={type}
      onChange={setCurrentValue}
    />
  )
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('Input', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'my-input',
      type: 'text'
    })
    expect(element).toBeInTheDocument()
  })
  test('Should update value', () => {
    const { element } = setup({
      id: 'my-input',
      type: 'text'
    })
    expect(element.value).toBe('')
    fireEvent.change(element, { target: { value: 'I love Commerce Layer' } })
    expect(element.value).toBe('I love Commerce Layer')
  })
})
