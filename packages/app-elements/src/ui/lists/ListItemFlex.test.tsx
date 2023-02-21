import { ListItemFlex, ListItemFlexProps } from './ListItemFlex'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListItemFlexProps): SetupResult => {
  const utils = render(<ListItemFlex data-test-id='my-item' {...props} />)
  const element = utils.getByTestId('my-item')
  return {
    element,
    ...utils
  }
}

describe('ListItemFlex', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      onClick: () => undefined,
      icon: {
        name: 'arrowDown',
        background: 'orange'
      },
      children: <div>Content</div>
    })
    expect(element).toBeInTheDocument()
  })
})
