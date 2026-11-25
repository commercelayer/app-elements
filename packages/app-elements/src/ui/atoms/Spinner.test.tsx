import { render } from "@testing-library/react"
import { Spinner } from "./Spinner"

describe("Spinner", () => {
  test("Should spin", () => {
    const { getByTestId } = render(<Spinner />)
    expect(getByTestId("spinner")).toHaveClass("animate-spin")
  })

  test("Should carry the rotation over instead of restarting it at 0°", () => {
    vi.useFakeTimers()
    try {
      // a spinner that appears 300ms into the current second is 300ms into its turn
      vi.setSystemTime(new Date(1_700_000_000_300))
      const { getByTestId } = render(<Spinner />)
      expect(getByTestId("spinner")).toHaveStyle({
        animationDelay: "-300ms",
      })
    } finally {
      vi.useRealTimers()
    }
  })

  test("Should take a test id and classes of its own", () => {
    const { getByTestId } = render(
      <Spinner data-testid="list-spinner" className="mx-auto" />,
    )
    expect(getByTestId("list-spinner")).toHaveClass("animate-spin", "mx-auto")
  })
})
