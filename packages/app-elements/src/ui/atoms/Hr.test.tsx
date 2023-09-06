import { render } from '@testing-library/react'
import { Hr } from './Hr'

describe('Hr', () => {
  test('Should be rendered', () => {
    const { getByTestId } = render(<Hr data-testid='hr' />)
    const element = getByTestId('hr')
    expect(element).toBeVisible()
    expect(element.tagName).toBe('HR')
    expect(element.classList).toContain(['border-t', 'border-gray-100'])
  })
})
