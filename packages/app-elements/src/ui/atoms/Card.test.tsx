import { render } from "@testing-library/react"
import { Card } from "./Card"

describe("Card", () => {
  test("Should be rendered simply as DIV", () => {
    const { getByText, container } = render(
      <Card overflow="visible">
        <p>
          <strong>I am a Card</strong>
        </p>
      </Card>,
    )
    expect(getByText("I am a Card")).toBeVisible()
    expect(container.firstElementChild?.tagName).toBe("DIV")
  })

  test("Should be rendered as BUTTON when `onClick` is set", () => {
    const { getByText, container } = render(
      <Card overflow="visible" onClick={() => {}}>
        <p>
          <strong>I am a Card</strong>
        </p>
      </Card>,
    )
    expect(getByText("I am a Card")).toBeVisible()
    expect(container.firstElementChild?.tagName).toBe("BUTTON")
  })

  test("Should be rendered as BUTTON when `onClick` is set", () => {
    const { getByText, container } = render(
      <Card overflow="visible" href="https://example.com" onClick={() => {}}>
        <p>
          <strong>I am a Card</strong>
        </p>
      </Card>,
    )
    expect(getByText("I am a Card")).toBeVisible()
    expect(container.firstElementChild?.tagName).toBe("A")
    expect(container.firstElementChild?.getAttribute("href")).toBe(
      "https://example.com",
    )
  })

  test("Should have light gray background", () => {
    const { container } = render(
      <Card overflow="visible" backgroundColor="light">
        I am a Card
      </Card>,
    )
    expect(container.firstElementChild).toHaveClass("bg-gray-50")
  })

  test("Should have overflow hidden", () => {
    const { container } = render(
      <Card overflow="hidden" backgroundColor="light">
        I am a Card
      </Card>,
    )
    const mainDiv = container.firstElementChild
    const innerDiv = container.firstElementChild?.firstElementChild
    expect(mainDiv).toHaveClass("overflow-hidden")
    expect(innerDiv).toHaveClass("overflow-hidden")
  })

  test("Should NOT have overflow hidden", () => {
    const { container } = render(
      <Card overflow="visible" backgroundColor="light">
        I am a Card
      </Card>,
    )
    const mainDiv = container.firstElementChild
    const innerDiv = container.firstElementChild?.firstElementChild
    expect(mainDiv).not.toHaveClass("overflow-hidden")
    expect(innerDiv).not.toHaveClass("overflow-hidden")
  })
})
