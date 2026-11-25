import { fireEvent, render } from "@testing-library/react"
import { CodeBlock } from "./CodeBlock"

describe("CodeBlock", () => {
  test("Should has value", () => {
    const { container } = render(<CodeBlock>NAx1zYM55_B3Eq2wiFg</CodeBlock>)
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent,
    ).toBe("NAx1zYM55_B3Eq2wiFg")
  })

  test("Should handle secret value", () => {
    const { container, getByTestId } = render(
      <CodeBlock showSecretAction>abc-123</CodeBlock>,
    )
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent,
    ).toContain("****")

    fireEvent.click(getByTestId("toggle-secret"))
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent,
    ).toBe("abc-123")

    fireEvent.click(getByTestId("toggle-secret"))
    expect(
      container.querySelector('[data-testid="codeblock-content"]')?.textContent,
    ).toContain("****")
  })

  test("Should set JSON at 13px, or at 12px when small", () => {
    const { getByTestId, rerender } = render(
      <CodeBlock>{{ source: "storefront" }}</CodeBlock>,
    )
    expect(getByTestId("codeblock-content")).toHaveClass("text-xs")

    rerender(<CodeBlock size="small">{{ source: "storefront" }}</CodeBlock>)
    expect(getByTestId("codeblock-content")).toHaveClass("text-2xs")
    expect(getByTestId("codeblock-content")).not.toHaveClass("text-xs")
  })

  test("Should set plain text at 14px, or at 12px when small", () => {
    const { getByTestId, rerender } = render(<CodeBlock>abc-123</CodeBlock>)
    expect(getByTestId("codeblock-content")).toHaveClass("text-sm")

    rerender(<CodeBlock size="small">abc-123</CodeBlock>)
    expect(getByTestId("codeblock-content")).toHaveClass("text-2xs")
    expect(getByTestId("codeblock-content")).not.toHaveClass("text-sm")
  })
})
