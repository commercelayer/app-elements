import { Report, ReportProps } from './Report'
import { render, RenderResult } from '@testing-library/react'

interface SetupProps extends ReportProps {
  id: string
}

type SetupResult = RenderResult & {
  element: HTMLElement
}

const setup = ({ id, ...rest }: SetupProps): SetupResult => {
  const utils = render(<Report data-test-id={id} {...rest} />)
  const element = utils.getByTestId(id)
  return {
    element,
    ...utils
  }
}

describe('Report', () => {
  test('Should render', () => {
    const { element, getByTestId } = setup({
      id: 'my-report',
      items: [
        {
          label: 'Record imported',
          count: 423,
          linkUrl: 'https://url-to-file.csv',
          linkLabel: 'Download CSV file'
        },
        {
          label: 'Errors',
          count: 2,
          downloadJsonAsFile: {},
          downloadJsonFilename: 'some_log',
          linkLabel: 'Download logs'
        }
      ]
    })
    expect(element).toBeVisible()

    // first item
    expect(getByTestId('report-item-0')).toBeVisible()
    expect(getByTestId('report-item-0-count').innerHTML).toBe('423')
    const firstItemLink = getByTestId('report-item-0-link')
    expect(firstItemLink).toBeVisible()
    expect(firstItemLink.innerHTML).toBe('Download CSV file')
    expect(firstItemLink.getAttribute('href')).toBe('https://url-to-file.csv')

    // second item
    expect(getByTestId('report-item-1')).toBeVisible()
    expect(getByTestId('report-item-1-count').innerHTML).toBe('2')
    const secondItemButton = getByTestId('report-item-1-button')
    expect(secondItemButton).toBeVisible()
    expect(secondItemButton.innerHTML).toBe('Download logs')
  })

  test('Should display `isLoading` state with the specified number of `loadingLines`', () => {
    const { element, getByTestId } = setup({
      id: 'my-report',
      isLoading: true,
      loadingLines: 4,
      items: []
    })
    expect(element).toBeVisible()
    expect(getByTestId('report-loading-items')?.childNodes?.length).toBe(4)
    expect(
      element.querySelector("[data-test-id='report-item-0']")
    ).not.toBeInTheDocument()
  })
})
