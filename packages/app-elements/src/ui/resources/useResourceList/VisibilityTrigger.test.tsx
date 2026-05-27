import { render } from "@testing-library/react"
import { VisibilityTrigger } from "./VisibilityTrigger"

describe("VisibilityTrigger", () => {
  let observerCallback: IntersectionObserverCallback | undefined

  beforeEach(() => {
    observerCallback = undefined
    vi.stubGlobal(
      "IntersectionObserver",
      vi.fn((callback: IntersectionObserverCallback) => {
        observerCallback = callback
        return {
          disconnect: vi.fn(),
          observe: vi.fn(),
          takeRecords: vi.fn(),
          unobserve: vi.fn(),
        }
      }),
    )
  })

  afterEach(() => {
    vi.unstubAllGlobals()
  })

  function triggerIntersection(isIntersecting: boolean): void {
    observerCallback?.(
      [{ isIntersecting } as IntersectionObserverEntry],
      vi.fn() as unknown as IntersectionObserver,
    )
  }

  test("Should render", async () => {
    const onCallback = vi.fn()
    const { getByTestId } = render(
      <VisibilityTrigger enabled callback={onCallback} />,
    )

    expect(getByTestId("visibility-trigger")).toBeVisible()
    triggerIntersection(true)

    expect(onCallback).toHaveBeenCalledTimes(1)
  })

  test("Should not recall callback while staying intersecting", async () => {
    const onCallback = vi.fn()
    render(<VisibilityTrigger enabled callback={onCallback} />)

    triggerIntersection(true)
    triggerIntersection(true)

    expect(onCallback).toHaveBeenCalledTimes(1)

    triggerIntersection(false)
    triggerIntersection(true)

    expect(onCallback).toHaveBeenCalledTimes(2)
  })

  test("Should call latest callback after prop update", async () => {
    const initialCallback = vi.fn()
    const updatedCallback = vi.fn()
    const { rerender } = render(
      <VisibilityTrigger enabled callback={initialCallback} />,
    )

    rerender(<VisibilityTrigger enabled callback={updatedCallback} />)
    triggerIntersection(true)

    expect(initialCallback).not.toHaveBeenCalled()
    expect(updatedCallback).toHaveBeenCalledTimes(1)
  })
})
