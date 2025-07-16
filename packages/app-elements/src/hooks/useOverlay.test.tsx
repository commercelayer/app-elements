import { act, fireEvent, render } from "@testing-library/react"
import type { JSX } from "react"
import { useOverlay } from "./useOverlay"

function OverlayScreen({ queryParam }: { queryParam?: string }): JSX.Element {
  const { Overlay, close, open } = useOverlay(
    queryParam != null ? { queryParam } : undefined,
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
    expect(queryByText("open overlay")).toBeVisible()

    // firing click to trigger history back
    act(() => {
      fireEvent.click(getByText("close overlay"))
    })

    expect(window.history.back).toBeCalledTimes(1)
  })
})
