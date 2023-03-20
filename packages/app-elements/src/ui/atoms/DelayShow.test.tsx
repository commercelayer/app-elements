import { DelayShow } from './DelayShow'
import { render } from '@testing-library/react'
import { act } from 'react-dom/test-utils'

describe('DelayShow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Should render', async () => {
    const { getByTestId } = render(
      <DelayShow delayMs={500}>
        <div data-test-id='delay-show'>Hello, I am some delayed content</div>
      </DelayShow>
    )

    const element = getByTestId('delay-show')

    expect(element).toBeInTheDocument()
    expect(element.style).to.have.property('opacity', '0')

    await act(() => vi.advanceTimersByTime(499))
    expect(element.style).to.have.property('opacity', '0')

    await act(() => vi.advanceTimersByTime(1))
    expect(element.style).to.have.property('opacity', '1')
  })
})
