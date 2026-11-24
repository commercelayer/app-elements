import { renderHook } from "@testing-library/react"
import type { ResourceTableColumn } from "#ui/resources/useResourceTable"
import type { TableSettingsConfig } from "./tableSettings"
import { useTableSettings } from "./useTableSettings"

// outside a token provider, as the dashboard's own pages are: the scope is the
// config's, not the (blank) token settings'
const storageKey = "dashboard:acme:live:table:agreements"

const config: TableSettingsConfig = {
  listId: "agreements",
  sortOptions: [
    { id: "created", label: "Created", sortBy: "created_at", kind: "date" },
    { id: "name", label: "Name", sortBy: "name", kind: "text" },
  ],
  defaultSort: { id: "created", direction: "desc" },
  storageScope: {
    appSlug: "dashboard",
    organizationSlug: "acme",
    mode: "live",
  },
}

const columns: Array<ResourceTableColumn<"orders">> = [
  { header: "Number", cell: () => "#1" },
  { id: "status", header: "Status", hideable: true, cell: () => "placed" },
  {
    id: "reference",
    header: "Reference",
    hideable: true,
    defaultHidden: true,
    cell: () => "ref",
  },
]

describe("useTableSettings", () => {
  beforeEach(() => {
    window.localStorage.clear()
  })

  test("leaves out the columns hidden by default, and sorts by the default", () => {
    const { result } = renderHook(() => useTableSettings({ config, columns }))

    expect(result.current.tableProps.columns?.map((c) => c.header)).toEqual([
      "Number",
      "Status",
    ])
    expect(result.current.tableProps.sort).toBe("-created_at")
    expect(result.current.menus).not.toBeNull()
  })

  test("reads the user's choice from the config's storage scope", () => {
    window.localStorage.setItem(
      storageKey,
      JSON.stringify({
        version: 1,
        columns: { reference: true, status: false },
        sort: { id: "name", direction: "asc" },
      }),
    )

    const { result } = renderHook(() => useTableSettings({ config, columns }))

    expect(result.current.tableProps.columns?.map((c) => c.header)).toEqual([
      "Number",
      "Reference",
    ])
    expect(result.current.tableProps.sort).toBe("name")
  })
})
