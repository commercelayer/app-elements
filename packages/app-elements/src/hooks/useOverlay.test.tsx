import { act, fireEvent, render } from "@testing-library/react"
import { type JSX, useEffect } from "react"
import { useOverlay } from "./useOverlay"

function OverlayScreen({
  queryParam,
  initialOpen,
}: {
  queryParam?: string
  initialOpen?: boolean
}): JSX.Element {
  const { Overlay, close, open } = useOverlay(
    queryParam != null || initialOpen != null
      ? { queryParam, initialOpen }
      : undefined,
  )

  return (
    <div>
      <button
        type="button"
        onClick={() => {
          open()
        }}
      >
        open overlay
      </button>
      <Overlay
        footer={
          <button
            type="button"
            onClick={() => {
              close()
            }}
          >
            close overlay
          </button>
        }
      >
        Overlay content
      </Overlay>
    </div>
  )
}

/**
 * Renders a route-driven drawer and returns what got painted, in order: `page` for
 * a render of the component holding the hook, `overlay` for one of its content.
 */
function paintsOf({ initialOpen }: { initialOpen: boolean }): string[] {
  const paints: string[] = []

  function OverlayContent(): null {
    paints.push("overlay")
    return null
  }

  function RouteDrawer(): JSX.Element {
    const { Overlay, open } = useOverlay(initialOpen ? { initialOpen } : {})
    useEffect(() => {
      if (!initialOpen) {
        open()
      }
    }, [open])
    paints.push("page")
    return (
      <Overlay
        drawer
        onBackdropClick={() => {
          // the drawer is closed by navigating away, not from here
        }}
      >
        <OverlayContent />
      </Overlay>
    )
  }

  const { unmount } = render(<RouteDrawer />)
  unmount()
  return paints
}

describe("useOverlay", () => {
  test("Should be rendered closed", () => {
    const { queryByText } = render(<OverlayScreen />)
    expect(queryByText("Overlay content")).toBe(null)
  })

  test("Should open and close on click", () => {
    const { queryByText, getByText } = render(<OverlayScreen />)
    act(() => {
      fireEvent.click(getByText("open overlay"))
    })
    expect(queryByText("open overlay")).toBeVisible()

    act(() => {
      fireEvent.click(getByText("close overlay"))
    })
    expect(queryByText("Overlay content")).toBe(null)
  })

  test("Should be rendered open with `initialOpen`", () => {
    const { queryByText } = render(<OverlayScreen initialOpen />)
    expect(queryByText("Overlay content")).toBeVisible()
  })

  test("Should render its content in the same paint as the page, with `initialOpen`", () => {
    // what a route-driven drawer needs: the page must never paint without the
    // overlay, or the content behind it shows through for a frame on page load
    expect(paintsOf({ initialOpen: true })).toEqual(["page", "overlay"])

    // opening from an effect instead — as those apps used to do — paints the bare
    // page first, which is exactly the flicker `initialOpen` removes
    expect(paintsOf({ initialOpen: false })).toEqual([
      "page",
      "page",
      "overlay",
    ])
  })

  test("Should still be closable when opened with `initialOpen`", () => {
    const { queryByText, getByText } = render(<OverlayScreen initialOpen />)
    act(() => {
      fireEvent.click(getByText("close overlay"))
    })
    expect(queryByText("Overlay content")).toBe(null)
  })
})

describe("useOverlay in `queryParam` mode", () => {
  const originalLocationObj = window.location
  const originalHistoryObj = window.history
  function allowLocationMocks(): void {
    ;(window as typeof globalThis).location = {
      ...originalLocationObj,
    }
    window.history = {
      ...originalHistoryObj,
    }
  }

  beforeEach(() => {
    allowLocationMocks()
  })

  afterEach(() => {
    ;(window as typeof globalThis).location = originalLocationObj
    window.history = originalHistoryObj
  })

  test("Should be rendered open when query param is in URL and can be closed with history back", () => {
    window.location.search = "?myOverlay=true"
    window.history.back = vi.fn()

    const { queryByText, getByText } = render(
      <OverlayScreen queryParam="myOverlay" />,
    )

    // start as open
    expect(queryByText("Overlay content")).toBeVisible()

    // firing click to trigger history back
    act(() => {
      fireEvent.click(getByText("close overlay"))
    })

    expect(window.history.back).toBeCalledTimes(1)
  })
})
