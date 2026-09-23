import { fireEvent, render, waitFor, within } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import type { FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import type { ResourceTableColumn } from "#ui/resources/useResourceTable"
import { server } from "../../../mocks/server"
import { instructions } from "./mockedInstructions"
import type { TableSettingsConfig } from "./tableSettings"
import { useResourceFilters } from "./useResourceFilters"

// scoped by the mock token provider: mode `test`, organization `mock`, app `elements`
const storageKey = "cl.table.test.mock.elements.orders"

const tableSettings: TableSettingsConfig = {
  listId: "orders",
  sortOptions: [
    { id: "number", label: "Order", sortBy: "number", kind: "text" },
    { id: "updated", label: "Updated", sortBy: "updated_at", kind: "date" },
    { id: "placed", label: "Placed", sortBy: "placed_at", kind: "schedule" },
  ],
  defaultSort: { id: "updated", direction: "desc" },
}

const columns: Array<ResourceTableColumn<"orders">> = [
  {
    header: "Order",
    sortBy: "number",
    cell: ({ resource }) => `#${resource.number}`,
  },
  {
    id: "status",
    header: "Status",
    hideable: true,
    cell: () => "placed",
  },
  {
    id: "reference",
    header: "Reference",
    hideable: true,
    defaultHidden: true,
    cell: () => "ref",
  },
]

function mockOrdersList(): { requestedSorts: Array<string | null> } {
  const requestedSorts: Array<string | null> = []
  server.use(
    http.get(`https://*/api/orders`, ({ request }) => {
      requestedSorts.push(new URL(request.url).searchParams.get("sort"))
      return HttpResponse.json({
        data: [{ id: "order-1", type: "orders", attributes: { number: 1001 } }],
        meta: { record_count: 1, page_count: 1 },
      })
    }),
  )
  return { requestedSorts }
}

const Page: FC = () => {
  const { FiltersBar, FilteredTable } = useResourceFilters({
    instructions,
    tableSettings,
  })
  return (
    <>
      <FiltersBar queryString="" onUpdate={() => {}} />
      <FilteredTable type="orders" columns={columns} hideTitle />
    </>
  )
}

function renderPage(): ReturnType<typeof render> {
  return render(
    <TokenProvider kind="integration" appSlug="orders" devMode>
      <CoreSdkProvider>
        <Page />
      </CoreSdkProvider>
    </TokenProvider>,
  )
}

function headers(container: HTMLElement): string[] {
  return Array.from(container.querySelectorAll("thead th")).map(
    (th) => th.textContent ?? "",
  )
}

describe("useResourceFilters with tableSettings", () => {
  beforeEach(() => {
    window.localStorage.clear()
    window.history.pushState({}, "", "/")
  })

  test("fetches with the default sort and shows the default columns", async () => {
    const { requestedSorts } = mockOrdersList()
    const { container, getByText } = renderPage()

    await waitFor(() => {
      expect(getByText("#1001")).toBeVisible()
    })
    expect(requestedSorts).toEqual(["-updated_at"])
    expect(headers(container)).toEqual(["Order", "Status"])
  })

  test("restores the stored sort and columns before the first fetch", async () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        sort: { id: "number", direction: "asc" },
        columns: { status: false, reference: true },
      }),
    )
    const { requestedSorts } = mockOrdersList()
    const { container, getByText } = renderPage()

    await waitFor(() => {
      expect(getByText("#1001")).toBeVisible()
    })
    expect(requestedSorts).toEqual(["number"])
    expect(headers(container)).toEqual(["Order", "Reference"])
    // the sorted column carries the arrow
    expect(
      container.querySelector('th[aria-sort="ascending"]'),
    ).toHaveTextContent("Order")
  })

  test("refetches and persists when the user picks another sort", async () => {
    const { requestedSorts } = mockOrdersList()
    const { getByText, getByRole } = renderPage()
    await waitFor(() => {
      expect(getByText("#1001")).toBeVisible()
    })

    fireEvent.click(getByRole("button", { name: "common.table_settings.sort" }))
    const orderOption = getByRole("menuitemradio", { name: "Order" })
    fireEvent.click(orderOption)

    await waitFor(() => {
      expect(requestedSorts.at(-1)).toBe("-number")
    })
    // the menu stays open, and the direction words follow the new option kind
    // (`t` returns the key in tests)
    expect(
      getByRole("menuitemradio", { name: "common.table_settings.z_to_a" }),
    ).toHaveAttribute("aria-checked", "true")
    expect(
      JSON.parse(window.localStorage.getItem(storageKey) ?? "null").sort,
    ).toEqual({ id: "number", direction: "desc" })

    fireEvent.click(
      getByRole("menuitemradio", { name: "common.table_settings.a_to_z" }),
    )
    await waitFor(() => {
      expect(requestedSorts.at(-1)).toBe("number")
    })
  })

  test("shows and hides columns without refetching", async () => {
    const { requestedSorts } = mockOrdersList()
    const { container, getByText, getByRole } = renderPage()
    await waitFor(() => {
      expect(getByText("#1001")).toBeVisible()
    })
    const requestsBefore = requestedSorts.length

    fireEvent.click(
      getByRole("button", { name: "common.table_settings.columns" }),
    )
    const menu = getByText("common.table_settings.edit_columns").parentElement
    assertToBeDefined(menu)
    // only the hideable columns are listed
    expect(
      within(menu)
        .getAllByRole("menuitemcheckbox")
        .map((item) => item.getAttribute("aria-label")),
    ).toEqual(["Status", "Reference"])
    // the primary column is listed too, first, locked
    const locked = within(menu).getByRole("button", { name: "Order" })
    expect(locked).toBeDisabled()
    expect(menu.textContent?.indexOf("Order")).toBeLessThan(
      menu.textContent?.indexOf("Status") ?? 0,
    )

    fireEvent.click(
      within(menu).getByRole("menuitemcheckbox", { name: "Reference" }),
    )
    fireEvent.click(
      within(menu).getByRole("menuitemcheckbox", { name: "Status" }),
    )

    expect(headers(container)).toEqual(["Order", "Reference"])
    expect(requestedSorts).toHaveLength(requestsBefore)
    expect(
      JSON.parse(window.localStorage.getItem(storageKey) ?? "null").columns,
    ).toEqual({ reference: true, status: false })
  })

  test("words a schedule sort by what comes up soonest", async () => {
    const { requestedSorts } = mockOrdersList()
    const { getByText, getByRole, getAllByRole } = renderPage()
    await waitFor(() => {
      expect(getByText("#1001")).toBeVisible()
    })

    fireEvent.click(getByRole("button", { name: "common.table_settings.sort" }))
    fireEvent.click(getByRole("menuitemradio", { name: "Placed" }))

    await waitFor(() => {
      expect(requestedSorts.at(-1)).toBe("-placed_at")
    })
    // soonest first comes first, and desc (carried over) reads as latest first
    expect(
      getAllByRole("menuitemradio")
        .slice(-2)
        .map((item) => item.getAttribute("aria-label")),
    ).toEqual([
      "common.table_settings.soonest_first",
      "common.table_settings.latest_first",
    ])
    expect(
      getByRole("menuitemradio", {
        name: "common.table_settings.latest_first",
      }),
    ).toHaveAttribute("aria-checked", "true")
  })
})
