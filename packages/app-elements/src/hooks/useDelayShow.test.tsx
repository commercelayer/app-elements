import { act, render } from '@testing-library/react'
import { type ReactNode } from 'react'
import { useDelayShow } from './useDelayShow'

interface Props {
  delayMs: number
  children: ReactNode
}

function DelayShow({ delayMs = 1000, children }: Props): JSX.Element | null {
  const [show] = useDelayShow(delayMs)

  return (
    <div data-test-id='delay-show' style={{ opacity: show ? 1 : 0 }}>
      {children}
    </div>
  )
}

describe('useDelayShow', () => {
  beforeEach(() => {
    vi.useFakeTimers()
  })

  afterEach(() => {
    vi.useRealTimers()
  })

  test('Show set show equal to `true` after X delayMs', async () => {
    const { getByTestId } = render(
      <DelayShow delayMs={500}>Hello, I am some delayed content</DelayShow>
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
