import { ListItem, ListItemProps } from './ListItem'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListItemProps): SetupResult => {
  const utils = render(<ListItem data-test-id='my-item' {...props} />)
  const element = utils.getByTestId('my-item')
  return {
    element,
    ...utils
  }
}

describe('ListItem', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      onClick: () => undefined,
      children: <div>Content</div>
    })
    expect(element).toBeInTheDocument()
  })
})
