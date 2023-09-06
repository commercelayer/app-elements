import { InputWrapper } from '#ui/internals/InputWrapper'
import { render, type RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id }: SetupProps): SetupResult => {
  const utils = render(
    <InputWrapper data-testid={id}>
      <input />
    </InputWrapper>
  )
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputWrapper', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'input-wrapper'
    })
    expect(element).toBeInTheDocument()
    expect(element.querySelector('input')).toBeInTheDocument()
  })
})
