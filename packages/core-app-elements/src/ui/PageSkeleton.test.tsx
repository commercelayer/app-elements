import { PageSkeleton } from './PageSkeleton'
import { render } from '@testing-library/react'

describe('PageSkeleton', () => {
  test('Should be rendered', () => {
    const { getByTestId } = render(<PageSkeleton delayMs={0} />)
    const element = getByTestId('page-skeleton')
    expect(element).toBeVisible()
    expect(
      element.querySelector('loading-header-description')
    ).not.toBeInTheDocument()
  })

  test('Should have skeleton for header description ', () => {
    const { getByTestId } = render(
      <PageSkeleton hasHeaderDescription delayMs={0} />
    )
    expect(getByTestId('loading-header-description')).toBeVisible()
  })

  test('Should render a skeleton for list page', () => {
    const { getByTestId } = render(<PageSkeleton layout='list' delayMs={0} />)
    expect(getByTestId('page-skeleton')).toBeVisible()
    expect(getByTestId('loading-list')).toBeVisible()
  })

  test('Should render a skeleton for list page', () => {
    const { getByTestId } = render(
      <PageSkeleton layout='details' delayMs={0} />
    )
    expect(getByTestId('page-skeleton')).toBeVisible()
    expect(getByTestId('loading-details')).toBeVisible()
  })
})
