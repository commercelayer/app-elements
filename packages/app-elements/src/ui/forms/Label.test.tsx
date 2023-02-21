import { Label } from './Label'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  text: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, text }: SetupProps): SetupResult => {
  const utils = render(
    <Label data-test-id={id} gap>
      {text}
    </Label>
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Label', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'some-label', text: 'My label' })
    expect(element.innerHTML).toBe('My label')
    expect(element.tagName).toBe('LABEL')
  })
})
