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

  test("Should keep the spinner on screen when one takes over from another", () => {
    vi.useFakeTimers()
    try {
      // the dashboard's loader, which has already paid the delay
      const first = render(<PageLoading delayMs={200} />)
      act(() => {
        vi.advanceTimersByTime(200)
      })
      expect(first.queryByTestId("page-loading-spinner")).toBeInTheDocument()

      // …handing over to the app's own, mounted fresh: without a shared sequence
      // this would hide the spinner for another 200ms, which reads as a flicker
      first.unmount()
      const second = render(<PageLoading delayMs={200} />)
      expect(second.queryByTestId("page-loading-spinner")).toBeInTheDocument()
      second.unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  test("Should wait again once the loading sequence is over", () => {
    vi.useFakeTimers()
    try {
      const first = render(<PageLoading delayMs={200} />)
      act(() => {
        vi.advanceTimersByTime(200)
      })
      first.unmount()

      // nobody took over, so the next page load starts its own sequence
      act(() => {
        vi.advanceTimersByTime(500)
      })
      const later = render(<PageLoading delayMs={200} />)
      expect(later.queryByTestId("page-loading-spinner")).toBe(null)
      later.unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  test("Should carry the rotation over instead of restarting it at 0°", () => {
    vi.useFakeTimers()
    try {
      // a spinner that appears 300ms into the current second is 300ms into its turn
      vi.setSystemTime(new Date(1_700_000_000_300))
      const first = render(<PageLoading delayMs={0} />)
      expect(first.getByTestId("page-loading-spinner")).toHaveStyle({
        animationDelay: "-300ms",
      })
      first.unmount()

      // the next one, mounting later in the same sequence, picks the angle up from
      // where that one had got to rather than snapping back to the first frame
      vi.setSystemTime(new Date(1_700_000_000_850))
      const second = render(<PageLoading delayMs={0} />)
      expect(second.getByTestId("page-loading-spinner")).toHaveStyle({
        animationDelay: "-850ms",
      })
      second.unmount()
    } finally {
      vi.useRealTimers()
    }
  })

  test("Should share the loading sequence through window, across bundles", () => {
    vi.useFakeTimers()
    try {
      const { unmount } = render(<PageLoading delayMs={200} />)
      // each app is mounted as its own bundle with its own copy of this module, so
      // module scope would not reach the handoff this sequence exists for
      expect(
        (window as unknown as Record<string, unknown>)
          .__clPageLoadingSequenceStartedAt,
      ).toEqual(expect.any(Number))
      unmount()
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
