import { ListSimpleItem, ListSimpleItemProps } from './ListSimpleItem'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps extends Omit<ListSimpleItemProps, 'children'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...props }: SetupProps): SetupResult => {
  const utils = render(<ListSimpleItem data-test-id={id} {...props} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('ListSimpleItem', () => {
  test('Should be rendered', () => {
    const { element, getByText } = setup({
      id: 'my-list-item',
      label: 'Item #1'
    })
    expect(element).toBeInTheDocument()
    expect(getByText('Item #1')).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
  })

  test('Should rendered optional description', () => {
    const { element, getByText, getByTestId } = setup({
      id: 'my-list-item-with-desc',
      label: 'Item #2',
      description: 'Lorem ipsum dolor sit'
    })
    expect(getByText('Item #2')).toBeInTheDocument()
    expect(getByTestId('list-simple-item-description')).toBeInTheDocument()
    expect(getByText('Lorem ipsum dolor sit')).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
  })

  test('Should rendered optional icon', () => {
    const { element, getByText, getByTestId } = setup({
      id: 'my-list-item-with-icon',
      label: 'Item #3',
      icon: <div>icon</div>
    })
    expect(getByText('Item #3')).toBeInTheDocument()
    expect(getByTestId('list-simple-item-icon')).toBeInTheDocument()
    expect(element.tagName).toBe('DIV')
  })
})
