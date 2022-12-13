import { ListTask, ListTaskProps } from './ListTask'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: ListTaskProps): SetupResult => {
  const utils = render(<ListTask data-test-id='my-task-list' {...props} />)
  const element = utils.getByTestId('my-task-list')
  return {
    element,
    ...utils
  }
}

describe('ListTask', () => {
  test('Should be rendered', () => {
    const { element, getByTestId } = setup({})
    expect(element).toBeInTheDocument()
    expect(getByTestId('my-task-list')).toBeInTheDocument()
  })

  test('Should render a title', () => {
    const title = 'This is a title'
    const { element, getByText } = setup({
      title
    })
    expect(element).toBeInTheDocument()
    expect(getByText(title)).toBeInTheDocument()
    expect(getByText(title).tagName).toBe('H2')
  })
})

describe('ListTask with pagination', () => {
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
    const { element, getByText } = setup({
      title: 'My paged list',
      pagination: {
        ...pagination,
        currentPage: 2
      }
    })
    expect(element).toBeInTheDocument()
    expect(getByText('My paged list · 51-100 of 148')).toBeInTheDocument()
  })
})
