import { render } from '@testing-library/react'
import { StatusIcon } from './StatusIcon'

describe('StatusIcon', () => {
  test('Should be rendered', () => {
    const { container } = render(<StatusIcon status='success' />)
    expect(container).toBeInTheDocument()
  })

  test('Should be rendered in progress 0%', () => {
    const { container } = render(
      <StatusIcon status='progress' percentage={0} />
    )
    expect(container).toBeInTheDocument()
  })

  test('Should be rendered in progress 30%', () => {
    const { container } = render(
      <StatusIcon status='progress' percentage={30} />
    )
    expect(container).toBeInTheDocument()
    expect(container.querySelector('svg')).toBeInTheDocument()
    // svg should contain two circles
    expect(container.querySelector('svg > circle ~ circle')).toBeInTheDocument()
  })

  test('Should be rendered in progress 100%', () => {
    const { container } = render(
      <StatusIcon status='progress' percentage={100} />
    )
    expect(container).toBeInTheDocument()
  })

  test('Should render the `success` status', () => {
    const { container } = render(<StatusIcon status='success' />)
    expect(
      container.querySelector('[data-test-id="icon-success"]')
    ).toBeInTheDocument()
  })

  test('Should render the `pending` status', () => {
    const { container } = render(<StatusIcon status='pending' />)
    expect(
      container.querySelector('[data-test-id="icon-pending"]')
    ).toBeInTheDocument()
  })

  test('Should render the `danger` status', () => {
    const { container } = render(<StatusIcon status='danger' />)
    expect(
      container.querySelector('[data-test-id="icon-danger"]')
    ).toBeInTheDocument()
  })
})
