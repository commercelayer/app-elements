import { render } from '@testing-library/react'
import { List } from './List'

describe('List', () => {
  it('Should be rendered', () => {
    const { container } = render(<List />)
    expect(container.children.length).toEqual(1)
    expect(container.children[0]?.tagName).toEqual('DIV')
    expect(container.children[0]).toBeVisible()
  })

  it('Should render optional title', () => {
    const title = 'This is a title'
    const { container, getByText } = render(<List title={title} />)

    expect(container.children.length).toEqual(1)
    expect(container.children[0]?.tagName).toEqual('SECTION')
    expect(container.children[0]).toBeVisible()

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

  it('Should render total records as title in first page', () => {
    const { getByText } = render(
      <List
        title='My paged list'
        pagination={{ ...pagination, currentPage: 1 }}
      />
    )

    expect(getByText('My paged list · 148')).toBeInTheDocument()
  })

  it('Should render paginated count as title in other pages', () => {
    const { getByText, getByTestId } = render(
      <List
        title='My paged list'
        pagination={{ ...pagination, currentPage: 2 }}
      />
    )

    expect(getByText('My paged list · 51-100 of 148')).toBeInTheDocument()
    expect(getByTestId('list-pagination')).toBeInTheDocument()
  })
})

describe('List with only one page', () => {
  it('Should not render the pagination details block', () => {
    const { getByText, queryByTestId } = render(
      <List
        title='My paged list'
        pagination={{
          pageCount: 1,
          recordCount: 20,
          recordsPerPage: 25,
          currentPage: 1,
          onChangePageRequest: () => undefined
        }}
      />
    )

    expect(getByText('My paged list · 20')).toBeInTheDocument()
    expect(queryByTestId('list-pagination')).not.toBeInTheDocument()
  })
})
