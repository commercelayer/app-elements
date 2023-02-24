import { render } from '@testing-library/react'
import { Stack } from './Stack'

describe('Stack', () => {
  test('Should render', () => {
    const { container } = render(
      <Stack>
        <div>Element #1</div>
        <div>Element #2</div>
        <div>Element #3</div>
      </Stack>
    )

    expect(container).toBeVisible()
  })

  test('Should display `isLoading` state with the specified number of children.length', () => {
    const { container, getAllByTestId } = render(
      <Stack isLoading>
        <div>Element #1</div>
        <div>Element #2</div>
        <div>Element #3</div>
      </Stack>
    )

    expect(container).toBeVisible()
    expect(getAllByTestId('skeleton').length).toBe(1)
    expect(getAllByTestId('skeleton-item').length).toBe(6)
  })
})
