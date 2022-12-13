import { A } from './A'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
  text: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, text }: SetupProps): SetupResult => {
  const utils = render(<A data-test-id={id}>{text}</A>)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Anchor', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'some-anchor', text: 'My anchor tag' })
    expect(element).toBeVisible()
    expect(element.innerHTML).toBe('My anchor tag')
    expect(element.tagName).toBe('A')
  })
})
