import { render, waitFor } from "@testing-library/react"
import { act, type FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { instructions } from "./mockedInstructions"
import { useResourceFilters } from "./useResourceFilters"

/**
 * `FilteredList` and `FilteredTable` are memoized on the `sdkFilters` object, so
 * a fresh identity is a fresh component type and React remounts the whole list.
 * The query string carries more than filters, and an unrelated parameter must
 * not cost a remount.
 */
describe("useResourceFilters", () => {
  let renders: Array<{
    sdkFilters: unknown
    FilteredList: unknown
    FilteredTable: unknown
  }> = []

  const Harness: FC = () => {
    const { sdkFilters, FilteredList, FilteredTable } = useResourceFilters({
      instructions,
    })
    renders.push({ sdkFilters, FilteredList, FilteredTable })
    return <div>{sdkFilters == null ? "pending" : "ready"}</div>
  }

  // wouter patches `history.pushState` and dispatches an event, so navigating
  // this way is what a real url change looks like to the hook
  const navigate = (search: string): void => {
    act(() => {
      window.history.pushState({}, "", search)
    })
  }

  const renderHarness = async (search: string): Promise<void> => {
    window.history.pushState({}, "", search)
    render(
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <Harness />
        </CoreSdkProvider>
      </TokenProvider>,
    )
    await waitFor(() => {
      expect(renders.at(-1)?.sdkFilters).not.toBeUndefined()
    })
  }

  beforeEach(() => {
    renders = []
    // jsdom keeps a single location per test file, so a test that navigated
    // would otherwise leak its query string into the next one
    window.history.pushState({}, "", "/")
  })

  test("keeps the memoized list components when an unrelated query param changes", async () => {
    await renderHarness("/?status_in=placed")
    const before = renders.at(-1)
    const renderCountBefore = renders.length

    navigate("/?status_in=placed&page=2")

    await waitFor(() => {
      expect(renders.length).toBeGreaterThan(renderCountBefore)
    })

    const after = renders.at(-1)
    expect(after?.sdkFilters).toBe(before?.sdkFilters)
    expect(after?.FilteredList).toBe(before?.FilteredList)
    expect(after?.FilteredTable).toBe(before?.FilteredTable)
  })

  test("rebuilds the memoized list components when the filters really change", async () => {
    await renderHarness("/?status_in=placed")
    const before = renders.at(-1)

    navigate("/?status_in=approved")

    await waitFor(() => {
      expect(renders.at(-1)?.sdkFilters).not.toBe(before?.sdkFilters)
    })

    const after = renders.at(-1)
    expect(after?.FilteredList).not.toBe(before?.FilteredList)
    expect(after?.FilteredTable).not.toBe(before?.FilteredTable)
  })
})
