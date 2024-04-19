import { fireEvent, render } from '@testing-library/react'
import { InputReadonly } from './InputReadonly'

describe('InputReadonly', () => {
  test('Should be rendered', () => {
    const { container } = render(<InputReadonly value='' />)
    expect(container.querySelector('input')).toBeInTheDocument()
  })

  test('Should has value', () => {
    const { container } = render(<InputReadonly value='NAx1zYM55_B3Eq2wiFg' />)
    expect(container.querySelector('input')?.value).toBe('NAx1zYM55_B3Eq2wiFg')
  })

  test('Should handle secret value', () => {
    const { container, getByTestId } = render(
      <InputReadonly value='abc-123' secret />
    )
    expect(container.querySelector('input')?.value).includes('****')

    fireEvent.click(getByTestId('toggle-secret'))
    expect(container.querySelector('input')?.value).toBe('abc-123')

    fireEvent.click(getByTestId('toggle-secret'))
    expect(container.querySelector('input')?.value).includes('****')
  })
})
