import { render } from "@testing-library/react"
import { Button } from "./Button"

describe("Button", () => {
  it("Should be rendered", () => {
    const { getByRole } = render(<Button>click me</Button>)

    const button = getByRole("button")
    expect(button).toBeVisible()
    expect(button.innerHTML).toBe("click me")
    expect(button.tagName).toBe("BUTTON")
    expect(button).toBeInstanceOf(HTMLButtonElement)
  })

  it("Should render as primary variant", () => {
    const { getByRole } = render(<Button>click me</Button>)
    expect(getByRole("button").className).toContain("bg-black")
    expect(getByRole("button").className).toContain("text-white")
  })

  it("Should render as link variant", () => {
    const { getByRole } = render(<Button variant="link">click me</Button>)
    expect(getByRole("button").className).toContain("text-primary")
  })

  it("Should render as secondary variant", () => {
    const { getByRole } = render(<Button variant="secondary">click me</Button>)
    expect(getByRole("button").className).toContain("bg-white")
    expect(getByRole("button").className).toContain("text-black")
    expect(getByRole("button").className).toContain("border border-black")
  })

  it("Should render as danger variant", () => {
    const { getByRole } = render(<Button variant="danger">click me</Button>)
    expect(getByRole("button").className).toContain("bg-white")
    expect(getByRole("button").className).toContain("text-red")
    expect(getByRole("button").className).toContain("border border-red")
  })

  it("Should render as size small", () => {
    const { getByRole } = render(<Button size="small">click me</Button>)
    expect(getByRole("button").className).toContain("px-4 py-2")
  })

  it("Should render as size regular (default)", () => {
    const { getByRole } = render(<Button>click me</Button>)
    expect(getByRole("button").className).toContain("px-6 py-3")
  })

  it("Should render as size large", () => {
    const { getByRole } = render(<Button size="large">click me</Button>)
    expect(getByRole("button").className).toContain("px-8 py-4")
  })

  it("Should render with flex alignment", () => {
    const { getByRole } = render(<Button alignItems="center">click me</Button>)
    expect(getByRole("button").className).toContain("flex gap-1 items-center")
  })
})
