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
})
