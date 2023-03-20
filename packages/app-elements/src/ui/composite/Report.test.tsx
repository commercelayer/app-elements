import { act, render, RenderResult } from '@testing-library/react'
import { afterEach, beforeEach, vi } from 'vitest'
import { Report, ReportProps } from './Report'

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
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

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
    expect(getByTestId('report-item-Record imported')).toBeVisible()
    expect(getByTestId('report-item-Record imported-count').innerHTML).toBe(
      '423'
    )
    const firstItemLink = getByTestId('report-item-Record imported-link')
    expect(firstItemLink).toBeVisible()
    expect(firstItemLink.innerHTML).toBe('Download CSV file')
    expect(firstItemLink.getAttribute('href')).toBe('https://url-to-file.csv')

    // second item
    expect(getByTestId('report-item-Errors')).toBeVisible()
    expect(getByTestId('report-item-Errors-count').innerHTML).toBe('2')
    const secondItemButton = getByTestId('report-item-Errors-button')
    expect(secondItemButton).toBeVisible()
    expect(secondItemButton.innerHTML).toBe('Download logs')
  })

  test('Should display `isLoading` state with the specified number of `loadingLines`', async () => {
    const { element } = setup({
      id: 'my-report',
      isLoading: true,
      loadingLines: 4,
      items: []
    })
    expect(element).not.toBeVisible()
    await act(() => {
      vi.advanceTimersByTime(500)
    })
    expect(element).toBeVisible()
    expect(
      element.querySelector(
        "[data-test-id='report-item-Record imported-count'] span"
      )
    ).toHaveClass('animate-pulse')
  })
})
