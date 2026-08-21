import { render } from "@testing-library/react"
import { Stack, StackCell } from "./Stack"

/** The wrapper `Stack` renders around each child. */
const cells = (container: HTMLElement): HTMLElement[] =>
  Array.from(
    container.querySelectorAll<HTMLElement>(":scope > div > div > div"),
  )

describe("Stack", () => {
  test("Should render", () => {
    const { container } = render(
      <Stack>
        <div>Element #1</div>
        <div>Element #2</div>
        <div>Element #3</div>
      </Stack>,
    )

    expect(container).toBeVisible()
  })

  it("keeps the regular rhythm by default", () => {
    const { container } = render(
      <Stack>
        <div>one</div>
        <div>two</div>
      </Stack>,
    )

    expect(cells(container)[0]?.className).toContain("py-6 @xl:py-2 @xl:px-6")
    expect(container.querySelector(":scope > div > div")?.className).toContain(
      "@xl:py-6",
    )
  })

  it("tightens the padding when small", () => {
    const { container } = render(
      <Stack size="small">
        <div>one</div>
        <div>two</div>
      </Stack>,
    )

    expect(cells(container)[0]?.className).toContain("py-4 @xl:py-1 @xl:px-4")
    expect(container.querySelector(":scope > div > div")?.className).toContain(
      "@xl:py-4",
    )
  })

  // Right-aligned only from `@xl`, where the cells sit side by side, and never on a
  // cell that is also the first one — a lone cell stays on the left.
  it("sends the trailing cell right, small and side by side only", () => {
    const { container } = render(
      <Stack size="small">
        <div>one</div>
        <div>two</div>
      </Stack>,
    )

    cells(container).forEach((cell) => {
      const tokens = cell.className.split(" ")
      expect(tokens).toContain("@xl:not-first:last:items-end")
      expect(tokens).toContain("@xl:not-first:last:text-right")
      // never unconditionally: below `@xl` the cell keeps `items-start`
      expect(tokens).not.toContain("items-end")
      expect(tokens).toContain("items-start")
    })
  })

  it("leaves the regular size aligned to the left", () => {
    const { container } = render(
      <Stack>
        <div>one</div>
        <div>two</div>
      </Stack>,
    )

    cells(container).forEach((cell) => {
      expect(cell.className).not.toContain("items-end")
      expect(cell.className).not.toContain("text-right")
    })
  })
})

describe("StackCell", () => {
  it("sizes its type for a regular stack", () => {
    const { container } = render(
      <Stack>
        <StackCell label="Discount">1%</StackCell>
      </Stack>,
    )

    expect(container.textContent).toBe("Discount1%")
    expect(container.querySelector(".text-sm")).not.toBeNull()
    expect(container.querySelector(".text-base")).not.toBeNull()
  })

  it("takes the smaller type from a small stack", () => {
    const { container } = render(
      <Stack size="small">
        <StackCell label="Discount">10%</StackCell>
      </Stack>,
    )

    expect(container.querySelector(".text-xs")).not.toBeNull()
    expect(container.querySelector(".text-sm")).not.toBeNull()
    expect(container.querySelector(".text-base")).toBeNull()
  })

  it("lets the prop override the stack it sits in", () => {
    const { container } = render(
      <Stack size="small">
        <StackCell label="Discount" size="regular">
          10%
        </StackCell>
      </Stack>,
    )

    expect(container.querySelector(".text-base")).not.toBeNull()
  })

  it("renders a dash when there is no value", () => {
    const { container } = render(
      <Stack>
        <StackCell label="Apply to" />
      </Stack>,
    )

    expect(container.textContent).toBe("Apply to\u2014")
    expect(container.querySelector(".text-gray-300")).not.toBeNull()
  })
})
