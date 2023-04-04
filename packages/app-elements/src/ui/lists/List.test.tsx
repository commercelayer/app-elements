import { type RenderResult, render } from '@testing-library/react'
import { List, type ListProps } from './List'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListProps): SetupResult => {
  const utils = render(<List data-test-id='my-task-list' {...props} />)
  const element = utils.getByTestId('my-task-list')
  return {
    element,
    ...utils
  }
}

describe('List', () => {
  test('Should be rendered', () => {
    const { element, getByTestId } = setup({})
    expect(element).toBeInTheDocument()
    expect(getByTestId('my-task-list')).toBeInTheDocument()
  })

  test('Should render optional title', () => {
    const title = 'This is a title'
    const { element, getByText } = setup({
      title
    })
    expect(element).toBeInTheDocument()
    expect(getByText(title)).toBeInTheDocument()
    expect(getByText(title).tagName).toBe('H2')
  })
})

describe('List with pagination', () => {
  const pagination = {
    pageCount: 3,
    recordCount: 148,
    recordsPerPage: 50,
    onChangePageRequest: () => undefined
  }

  test('Should render total records as title in first page', () => {
    const { element, getByText } = setup({
      title: 'My paged list',
      pagination: {
        ...pagination,
        currentPage: 1
      }
    })
    expect(element).toBeInTheDocument()
    expect(getByText('My paged list · 148')).toBeInTheDocument()
  })

  test('Should render paginated count as title in other pages', () => {
    const { element, getByText, getByTestId } = setup({
      title: 'My paged list',
      pagination: {
        ...pagination,
        currentPage: 2
      }
    })
    expect(element).toBeInTheDocument()
    expect(getByText('My paged list · 51-100 of 148')).toBeInTheDocument()
    expect(getByTestId('list-pagination')).toBeInTheDocument()
  })
})

describe('List with only one page', () => {
  test('Should not render the pagination details block', () => {
    const { element, queryByTestId } = setup({
      title: 'My paged list',
      pagination: {
        pageCount: 1,
        recordCount: 20,
        recordsPerPage: 25,
        currentPage: 1,
        onChangePageRequest: () => undefined
      }
    })
    expect(element).toBeInTheDocument()
    expect(queryByTestId('list-pagination')).not.toBeInTheDocument()
  })
})
