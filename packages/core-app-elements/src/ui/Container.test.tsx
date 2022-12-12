import { Container } from './Container'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id }: SetupProps): SetupResult => {
  const utils = render(
    <Container data-test-id={id}>
      <div>my app</div>
    </Container>
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Label', () => {
  test('Should be rendered', () => {
    const { element } = setup({ id: 'my-container' })
    expect(element.tagName).toBe('DIV')
    expect(element.className).toContain('container')
  })
})
