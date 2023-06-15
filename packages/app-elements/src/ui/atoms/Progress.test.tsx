import { render } from '@testing-library/react'
import { Progress } from './Progress'

describe('Progress', () => {
  test('Should be rendered with indeterminate state', () => {
    const { container } = render(<Progress>Indeterminate</Progress>)
    expect(container).toContainHTML(
      '<progress class="progress" max="1">Indeterminate</progress>'
    )
  })

  test('Should be rendered with defined max attribute', () => {
    const { container } = render(<Progress max={20}>Indeterminate</Progress>)
    expect(container).toContainHTML(
      '<progress class="progress" max="20">Indeterminate</progress>'
    )
  })

  test('Should be rendered with defined value attribute', () => {
    const { container } = render(
      <Progress max={20} value={12}>
        20%
      </Progress>
    )
    expect(container).toContainHTML(
      '<progress class="progress" max="20" value="12">20%</progress>'
    )
  })
})
