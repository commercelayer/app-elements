import { render } from "@testing-library/react"
import { A } from "./A"

describe("Anchor", () => {
  it("Should be rendered", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io">My anchor tag</A>,
    )

    const a = getByRole("link")
    expect(a).toBeVisible()
    expect(a.innerHTML).toBe("My anchor tag")
    expect(a.tagName).toBe("A")
    expect(a).toBeInstanceOf(HTMLAnchorElement)
    expect(a.className).toContain("text-primary")
    expect(a.getAttribute("href")).toBe("https://commercelayer.io")
  })

  it("Should render as primary variant", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" variant="primary">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("bg-black")
    expect(getByRole("link").className).toContain("text-white")
  })

  it("Should render as secondary variant", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" variant="secondary">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("bg-white")
    expect(getByRole("link").className).toContain("text-black")
    expect(getByRole("link").className).toContain("border border-black")
  })

  it("Should render as danger variant", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" variant="danger">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("bg-white")
    expect(getByRole("link").className).toContain("text-red")
    expect(getByRole("link").className).toContain("border border-red")
  })

  it("Should render as size small", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" variant="primary" size="small">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("px-4 py-2")
  })

  it("Should render as size regular (default)", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" variant="primary">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("px-5 py-[11px]")
  })

  it("Should render as size large", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" variant="primary" size="large">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("px-8 py-4")
  })

  it("Should render with flex alignment", () => {
    const { getByRole } = render(
      <A href="https://commercelayer.io" alignItems="center">
        click me
      </A>,
    )
    expect(getByRole("link").className).toContain("flex gap-1 items-center")
  })
})
