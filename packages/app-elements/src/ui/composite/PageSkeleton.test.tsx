import { render } from '@testing-library/react'
import { PageSkeleton } from './PageSkeleton'

describe('PageSkeleton', () => {
  test('Should be rendered', () => {
    const { container } = render(<PageSkeleton />)
    expect(container).toBeVisible()
    expect(container).toMatchSnapshot()
  })
})
