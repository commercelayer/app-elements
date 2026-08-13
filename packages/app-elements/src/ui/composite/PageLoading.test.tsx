import { act, render } from "@testing-library/react"
import { PageLoading } from "./PageLoading"

describe("PageLoading", () => {
  test("Should reserve the title band without drawing anything in it", () => {
    const { getByRole, getByText } = render(<PageLoading delayMs={0} />)

    // the h1 is there, so the real title lands in the same place, but its content
    // is hidden rather than replaced by a fake one
    const title = getByRole("heading", { level: 1 })
    expect(title).toBeInTheDocument()
    expect(title.firstElementChild).toHaveClass("invisible")

    // and there is a name for whoever cannot see the spinner
    expect(getByText("Loading page")).toHaveClass("sr-only")
  })

  test("Should not draw a spinner before the delay has elapsed", () => {
    vi.useFakeTimers()
    try {
      const { queryByTestId } = render(<PageLoading delayMs={200} />)
      // a page that resolves quickly shows no indicator at all, rather than a flash
      expect(queryByTestId("page-loading-spinner")).toBe(null)

      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(queryByTestId("page-loading-spinner")).toBeInTheDocument()
    } finally {
      vi.useRealTimers()
    }
  })

  test("Should draw the spinner right away when there is no delay", () => {
    const { getByTestId } = render(<PageLoading delayMs={0} />)
    expect(getByTestId("page-loading-spinner")).toBeInTheDocument()
  })

  test("Should not invent any content", () => {
    const { container } = render(<PageLoading delayMs={0} />)
    // the trap the previous `PageSkeleton` fell into: a fake search bar and rows
    // that had to be kept in step with every page
    expect(container.querySelector("input")).toBe(null)
    expect(container.querySelector("table")).toBe(null)
    expect(container.querySelectorAll("button").length).toBe(0)
  })
})
