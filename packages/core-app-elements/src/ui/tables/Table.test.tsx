import { Table, TableProps } from './Table'
import { render, RenderResult } from '@testing-library/react'

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = (props: TableProps): SetupResult => {
  const utils = render(<Table data-test-id='my-table' {...props} />)
  const element = utils.getByTestId('my-table')
  return {
    element,
    ...utils
  }
}

describe('Table', () => {
  test('Should be rendered', () => {
    const { element, getAllByTestId } = setup({
      data: [
        {
          first_name: 'George',
          last_name: 'Harrison'
        },
        {
          first_name: 'Ringo',
          last_name: 'Start'
        }
      ]
    })
    expect(element).toBeInTheDocument()
    expect(getAllByTestId('table-row-header').length).toBe(1)
    expect(getAllByTestId('table-row-content').length).toBe(2)
  })

  test('Should show a title', () => {
    const { element, getByText } = setup({
      title: 'This is a title',
      data: [
        {
          first_name: 'George',
          last_name: 'Harrison'
        },
        {
          first_name: 'Ringo',
          last_name: 'Start'
        }
      ]
    })
    expect(element).toBeInTheDocument()
    expect(getByText('This is a title')).toBeInTheDocument()
  })

  test('Should show total count', () => {
    const { getByTestId } = setup({
      data: [
        {
          first_name: 'George',
          last_name: 'Harrison'
        },
        {
          first_name: 'Ringo',
          last_name: 'Start'
        }
      ],
      showTotal: true
    })
    expect(getByTestId('table-total-string')).toBeInTheDocument()
  })

  test('Should render all headers', () => {
    const { element, getByTestId } = setup({
      data: [
        {
          first_name: 'George',
          last_name: 'Harrison'
        },
        {
          first_name: 'Ringo',
          last_name: 'Start',
          key_that_exists_only_here: 'Foobar'
        }
      ]
    })
    expect(element).toBeInTheDocument()
    expect(getByTestId('table-row-header').querySelectorAll('th').length).toBe(
      3
    )
  })

  test('Should limit results', () => {
    const { getAllByTestId, getByText } = setup({
      data: [
        {
          first_name: 'George',
          last_name: 'Harrison'
        },
        {
          first_name: 'Ringo',
          last_name: 'Start'
        },
        {
          first_name: 'Paul',
          last_name: 'McCartney'
        },
        {
          first_name: 'John',
          last_name: 'Lennon'
        }
      ],
      limit: 2,
      showOthers: true
    })
    expect(getAllByTestId('table-row-content').length).toBe(2)
    expect(getByText('and others 2 records')).toBeVisible()
  })
})
