import { renderHook, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import type { FC, ReactNode } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../../mocks/server"
import {
  type ResourceSelectProps,
  useResourceSelectOptions,
} from "./useResourceSelectOptions"

const firstPage = [
  { id: "eu", name: "EU Warehouse" },
  { id: "milano", name: "Milano 1" },
  { id: "mm", name: "MM Stock Loc" },
  { id: "us", name: "US Warehouse" },
]

/**
 * Stock locations: the first page, and whatever a `filter[id_in]` asks for, which
 * is how the hook resolves the selection on its own.
 */
function mockStockLocations(extra: Array<{ id: string; name: string }> = []) {
  server.use(
    http.get("https://*/api/:version/stock_locations", ({ request }) => {
      const ids = new URL(request.url).searchParams.get("filter[q][id_in]")
      const records =
        ids == null
          ? firstPage
          : [...firstPage, ...extra].filter((record) =>
              ids.split(",").includes(record.id),
            )
      return HttpResponse.json({
        data: records.map((record) => ({
          id: record.id,
          type: "stock_locations",
          attributes: { name: record.name },
        })),
        meta: { record_count: records.length, page_count: 1 },
      })
    }),
  )
}

const props: ResourceSelectProps = {
  resource: "stock_locations",
  fieldForLabel: "name",
  fieldForValue: "id",
  sortBy: { attribute: "name", direction: "asc" },
}

const Wrapper: FC<{ children: ReactNode }> = ({ children }) => (
  <TokenProvider kind="integration" appSlug="inventory" devMode>
    <CoreSdkProvider>{children}</CoreSdkProvider>
  </TokenProvider>
)

describe("useResourceSelectOptions", () => {
  test("keeps a selected option where it is in the first page", async () => {
    mockStockLocations()
    const { result } = renderHook(
      () => useResourceSelectOptions({ props, selectedValues: ["mm"] }),
      { wrapper: Wrapper },
    )

    await waitFor(() => {
      expect(result.current.hasResolvedSelection).toBe(true)
      expect(result.current.initialValues).toHaveLength(4)
    })
    expect(result.current.initialValues.map(({ label }) => label)).toEqual([
      "EU Warehouse",
      "Milano 1",
      "MM Stock Loc",
      "US Warehouse",
    ])
  })

  test("adds a selection from a later page last, only to resolve its label", async () => {
    mockStockLocations([{ id: "zurich", name: "Zurich" }])
    const { result } = renderHook(
      () => useResourceSelectOptions({ props, selectedValues: ["zurich"] }),
      { wrapper: Wrapper },
    )

    await waitFor(() => {
      expect(result.current.hasResolvedSelection).toBe(true)
    })
    expect(result.current.initialValues.map(({ label }) => label)).toEqual([
      "EU Warehouse",
      "Milano 1",
      "MM Stock Loc",
      "US Warehouse",
      "Zurich",
    ])
  })
})
