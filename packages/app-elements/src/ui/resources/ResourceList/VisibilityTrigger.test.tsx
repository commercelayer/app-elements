import { render } from '@testing-library/react'
import { VisibilityTrigger } from './VisibilityTrigger'

describe('VisibilityTrigger', () => {
  test('Should render', async () => {
    const onCallback = vi.fn()
    const { getByTestId } = render(
      <VisibilityTrigger enabled callback={onCallback} />
    )
    expect(getByTestId('visibility-trigger')).toBeVisible()
    window.dispatchEvent(new Event('triggerIntersection'))
    expect(onCallback).toHaveBeenCalled()
  })
})
