import { render } from "@testing-library/react"
import { Progress } from "./Progress"

describe("Progress", () => {
  test("Should be rendered with indeterminate state", () => {
    const { container } = render(<Progress>Indeterminate</Progress>)
    expect(container).toContainHTML(
      '<progress class="progress" max="1">Indeterminate</progress>',
    )
  })

  test("Should be rendered with defined max attribute", () => {
    const { container } = render(<Progress max={20}>Indeterminate</Progress>)
    expect(container).toContainHTML(
      '<progress class="progress" max="20">Indeterminate</progress>',
    )
  })

  test("Should be rendered with defined value attribute", () => {
    const { container } = render(
      <Progress max={20} value={12}>
        20%
      </Progress>,
    )
    expect(container).toContainHTML(
      '<progress class="progress" max="20" value="12">20%</progress>',
    )
  })

  test("Should display the completion status as fraction by default", () => {
    const { getByText } = render(
      <Progress max={20} value={12}>
        sample label
      </Progress>,
    )
    expect(getByText("12/20")).toBeVisible()
  })

  test("Should display the completion status as percentage", () => {
    const { getByText } = render(
      <Progress max={20} value={12} displayMode="percentage">
        sample label
      </Progress>,
    )
    expect(getByText("60%")).toBeVisible()
  })

  test("Should render hidden text `max/max` to keep right space and alignments", () => {
    const { getByText } = render(
      <Progress max={20} value={1} displayMode="fraction">
        sample label
      </Progress>,
    )
    expect(getByText("1/20")).toBeVisible()
    expect(getByText("20/20")).toHaveClass("invisible")
  })
})
