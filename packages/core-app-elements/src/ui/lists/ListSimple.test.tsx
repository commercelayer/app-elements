import { ListSimple } from './ListSimple'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (): SetupResult => {
  const utils = render(
    <ListSimple data-test-id='my-list'>
      <div>Content...</div>
    </ListSimple>
  )
  const element = utils.getByTestId('my-list')
  return {
    element,
    ...utils
  }
}

describe('ListSimple', () => {
  test('Should be rendered', () => {
    const { element } = setup()
    expect(element).toBeInTheDocument()
  })
})
