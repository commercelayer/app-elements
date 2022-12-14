import { ListSimple, ListSimpleProps } from './ListSimple'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps extends Omit<ListSimpleProps, 'children'> {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...props }: SetupProps): SetupResult => {
  const utils = render(
    <ListSimple data-test-id={id} {...props}>
      <div>Item 1</div>
      <div>Item 2</div>
      <div>Item 3</div>
    </ListSimple>
  )
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('ListSimple', () => {
  test('Should be rendered', () => {
    const { element } = setup({
      id: 'my-list'
    })
    expect(element).toBeInTheDocument()
  })

  test('Should render a title', () => {
    const { element, getByTestId } = setup({
      id: 'my-simple-list',
      title: 'My simple list'
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('list-simple-legend')).toBeInTheDocument()
  })

  test('Should render total records as title in first page', () => {
    const { element, getByText, getByTestId } = setup({
      id: 'paginated-simple-list',
      title: 'My paged list',
      pagination: {
        currentPage: 1,
        pageCount: 3,
        recordCount: 148,
        recordsPerPage: 50,
        onChangePageRequest: () => undefined
      }
    })
    expect(element).toBeInTheDocument()
    expect(getByText('My paged list · 148')).toBeInTheDocument()
    expect(getByTestId('list-simple-pagination')).toBeInTheDocument()
  })
})
