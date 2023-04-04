import { InputReadonly } from './InputReadonly'
import { render, type RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  value: string
}

type SetupResult = RenderResult & {
  element: HTMLInputElement
}

const setup = ({ id, value }: SetupProps): SetupResult => {
  const utils = render(<InputReadonly data-test-id={id} value={value} />)
  const element = utils.getByTestId(id) as HTMLInputElement
  return {
    element,
    ...utils
  }
}

describe('InputReadonly', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'my-input-readonly',
      value: ''
    })
    expect(element).toBeInTheDocument()
  })
  test('Should has value', () => {
    const { element } = setup({
      id: 'my-input-readonly',
      value: 'NAx1zYM55_B3Eq2wiFg'
    })
    expect(element.getElementsByTagName('input')[0].value).toBe(
      'NAx1zYM55_B3Eq2wiFg'
    )
  })
})
