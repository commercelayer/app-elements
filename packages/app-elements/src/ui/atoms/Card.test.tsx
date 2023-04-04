import { render, type RenderResult } from '@testing-library/react'
import { Card } from './Card'

interface SetupProps {
  id: string
  content: React.ReactElement
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, content }: SetupProps): SetupResult => {
  const utils = render(<Card data-test-id={id}>{content}</Card>)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Card', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'card',
      content: (
        <p>
          <strong>I'm a Card</strong>
        </p>
      )
    })
    expect(element.innerHTML).toContain("I'm a Card")
    expect(element.tagName).toBe('DIV')
  })
})
