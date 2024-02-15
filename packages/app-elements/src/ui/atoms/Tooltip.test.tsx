import { act, fireEvent, render, waitFor } from '@testing-library/react'
import { Tooltip } from './Tooltip'

describe('Tooltip', () => {
  const originalResizeObserver = global.ResizeObserver
  beforeAll(() => {
    global.ResizeObserver = class ResizeObserver {
      observe(): void {}
      unobserve(): void {}
      disconnect(): void {}
    }
  })
  afterAll(() => {
    global.ResizeObserver = originalResizeObserver
  })

  test('render a tooltip', async () => {
    const { getByText } = render(
      <Tooltip id='my-tooltip' label='discover more' content='content...' />
    )
    expect(getByText('discover more')).toBeInTheDocument()
  })

  test('should open tooltip on mouse hover', async () => {
    const { getByText } = render(
      <Tooltip
        id='my-tooltip'
        label='Hover me'
        content={<div>This is a tooltip.</div>}
      />
    )

    act(() => {
      fireEvent.mouseEnter(getByText('Hover me'))
    })

    await waitFor(() => {
      expect(getByText('This is a tooltip.')).toBeInTheDocument()
    })
  })
})
