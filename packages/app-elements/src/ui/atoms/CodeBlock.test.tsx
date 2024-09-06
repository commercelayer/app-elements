import { fireEvent, render } from '@testing-library/react'
import { CodeBlock } from './CodeBlock'

describe('CodeBlock', () => {
  test('Should has value', () => {
    const { container } = render(<CodeBlock>NAx1zYM55_B3Eq2wiFg</CodeBlock>)
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent
    ).toBe('NAx1zYM55_B3Eq2wiFg')
  })

  test('Should handle secret value', () => {
    const { container, getByTestId } = render(
      <CodeBlock showSecretAction>abc-123</CodeBlock>
    )
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent
    ).includes('****')

    fireEvent.click(getByTestId('toggle-secret'))
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent
    ).toBe('abc-123')

    fireEvent.click(getByTestId('toggle-secret'))
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent
    ).includes('****')
  })
})
