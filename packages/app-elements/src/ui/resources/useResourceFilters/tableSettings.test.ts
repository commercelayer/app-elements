import {
  applyColumnOrder,
  defaultSortDirection,
  isColumnVisible,
  makeTableSettingsStorageKey,
  makeTableSettingsStore,
  parseStoredTableSettings,
  resolveTableSort,
  toSortKey,
} from "./tableSettings"

const sortOptions = [
  { id: "order", label: "Order", sortBy: "order.placed_at", kind: "date" },
  { id: "updated", label: "Updated", sortBy: "order.updated_at", kind: "date" },
] as const

const config = {
  sortOptions: [...sortOptions],
  defaultSort: { id: "order", direction: "desc" as const },
}

describe("makeTableSettingsStorageKey", () => {
  test("scopes the key by mode, organization, app and list", () => {
    expect(
      makeTableSettingsStorageKey({
        mode: "live",
        organizationSlug: "acme",
        appSlug: "orders",
        listId: "orders",
      }),
    ).toBe("cl.table.live.acme.orders.orders")
  })
})

describe("parseStoredTableSettings", () => {
  test("keeps a well formed entry", () => {
    expect(
      parseStoredTableSettings({
        version: 1,
        sort: { id: "updated", direction: "asc" },
        columns: { tags: true },
      }),
    ).toEqual({
      sort: { id: "updated", direction: "asc" },
      columns: { tags: true },
      order: undefined,
    })
  })

  test("keeps a stored column order, and drops a malformed one", () => {
    expect(
      parseStoredTableSettings({ version: 1, order: ["tags", "status"] }).order,
    ).toEqual(["tags", "status"])
    expect(
      parseStoredTableSettings({ version: 1, order: ["tags", 3] }).order,
    ).toBeUndefined()
  })

  test("discards an entry of another version", () => {
    expect(
      parseStoredTableSettings({
        version: 2,
        sort: { id: "updated", direction: "asc" },
      }),
    ).toEqual({ sort: undefined, columns: {}, order: undefined })
  })

  test("drops the malformed parts and keeps the rest", () => {
    expect(
      parseStoredTableSettings({
        version: 1,
        sort: { id: "updated", direction: "sideways" },
        columns: { tags: true, status: "yes" },
      }),
    ).toEqual({ sort: undefined, columns: { tags: true }, order: undefined })
  })

  test("ignores anything that is not an object", () => {
    expect(parseStoredTableSettings("nope")).toEqual({
      sort: undefined,
      columns: {},
      order: undefined,
    })
    expect(parseStoredTableSettings(undefined)).toEqual({
      sort: undefined,
      columns: {},
      order: undefined,
    })
  })
})

describe("resolveTableSort", () => {
  test("applies the stored choice when the view has that option", () => {
    expect(
      resolveTableSort(config, { id: "updated", direction: "asc" }),
    ).toEqual({
      value: { id: "updated", direction: "asc" },
      option: sortOptions[1],
    })
  })

  test("falls back to the default when the stored option is unknown here", () => {
    expect(
      resolveTableSort(config, { id: "amount", direction: "asc" }),
    ).toEqual({
      value: { id: "order", direction: "desc" },
      option: sortOptions[0],
    })
  })

  test("falls back to the default with no stored choice", () => {
    expect(resolveTableSort(config, undefined)?.value).toEqual({
      id: "order",
      direction: "desc",
    })
  })

  test("resolves to nothing when not even the default is an option", () => {
    expect(
      resolveTableSort(
        { ...config, defaultSort: { id: "missing", direction: "desc" } },
        undefined,
      ),
    ).toBeUndefined()
  })
})

describe("defaultSortDirection", () => {
  test("starts names at A, dates and numbers at the newest, schedules at the soonest", () => {
    expect(defaultSortDirection("text")).toBe("asc")
    expect(defaultSortDirection("date")).toBe("desc")
    expect(defaultSortDirection("number")).toBe("desc")
    expect(defaultSortDirection("schedule")).toBe("asc")
  })
})

describe("toSortKey", () => {
  test("prefixes a descending sort with a dash", () => {
    expect(toSortKey({ sortBy: "updated_at" }, "desc")).toBe("-updated_at")
    expect(toSortKey({ sortBy: "updated_at" }, "asc")).toBe("updated_at")
  })
})

describe("applyColumnOrder", () => {
  // "order" and "actions" are fixed, the others can be moved
  const columns = ["order", "customer", "status", "amount", "actions"]
  const options = (order: string[] | undefined) => ({
    getId: (id: string) => id,
    isMovable: (id: string) => id !== "order" && id !== "actions",
    order,
  })

  test("leaves the list alone with no stored order", () => {
    expect(applyColumnOrder(columns, options(undefined))).toEqual(columns)
  })

  test("moves the movable columns only, around fixed ones", () => {
    expect(
      applyColumnOrder(columns, options(["amount", "customer", "status"])),
    ).toEqual(["order", "amount", "customer", "status", "actions"])
  })

  test("places a column the stored order does not know after its predecessor", () => {
    // `status` was added after the user dragged `amount` first
    expect(applyColumnOrder(columns, options(["amount", "customer"]))).toEqual([
      "order",
      "amount",
      "customer",
      "status",
      "actions",
    ])
    // a new first column goes first
    expect(applyColumnOrder(columns, options(["status", "amount"]))).toEqual([
      "order",
      "customer",
      "status",
      "amount",
      "actions",
    ])
  })

  test("ignores ids that no longer exist, and repeated ones", () => {
    expect(
      applyColumnOrder(
        columns,
        options(["gone", "status", "status", "amount", "customer"]),
      ),
    ).toEqual(["order", "status", "amount", "customer", "actions"])
  })
})

describe("isColumnVisible", () => {
  test("follows the column default unless overridden", () => {
    expect(isColumnVisible({ id: "tags", defaultHidden: true }, {})).toBe(false)
    expect(
      isColumnVisible({ id: "tags", defaultHidden: true }, { tags: true }),
    ).toBe(true)
    expect(isColumnVisible({ id: "status", defaultHidden: false }, {})).toBe(
      true,
    )
  })
})

describe("makeTableSettingsStore", () => {
  const key = "cl.table.test.mock.orders.orders"

  afterEach(() => {
    window.localStorage.clear()
  })

  test("starts from what is stored", () => {
    window.localStorage.setItem(
      key,
      JSON.stringify({
        version: 1,
        sort: { id: "updated", direction: "desc" },
        columns: { tags: true },
      }),
    )
    const store = makeTableSettingsStore(key)
    expect(store.getSnapshot()).toEqual({
      sort: { id: "updated", direction: "desc" },
      columns: { tags: true },
      order: undefined,
      columnEntries: [],
    })
  })

  test("persists the sort and notifies subscribers", () => {
    const store = makeTableSettingsStore(key)
    const listener = vi.fn()
    store.subscribe(listener)

    store.setSort({ id: "updated", direction: "asc" })

    expect(listener).toHaveBeenCalledTimes(1)
    expect(JSON.parse(window.localStorage.getItem(key) ?? "null")).toEqual({
      version: 1,
      sort: { id: "updated", direction: "asc" },
      columns: {},
    })
  })

  test("persists the column order", () => {
    const store = makeTableSettingsStore(key)
    store.setColumnOrder(["tags", "status"])
    expect(store.getSnapshot().order).toEqual(["tags", "status"])
    expect(
      JSON.parse(window.localStorage.getItem(key) ?? "null").order,
    ).toEqual(["tags", "status"])
  })

  test("stores only the columns moved away from their default", () => {
    const store = makeTableSettingsStore(key)
    const tags = {
      id: "tags",
      label: "Tags",
      defaultHidden: true,
      locked: false,
    }
    const status = {
      id: "status",
      label: "Status",
      defaultHidden: false,
      locked: false,
    }

    store.setColumnVisible(tags, true)
    store.setColumnVisible(status, false)
    expect(store.getSnapshot().columns).toEqual({ tags: true, status: false })

    // back to their defaults: no override left
    store.setColumnVisible(tags, false)
    store.setColumnVisible(status, true)
    expect(store.getSnapshot().columns).toEqual({})
    expect(
      JSON.parse(window.localStorage.getItem(key) ?? "null").columns,
    ).toEqual({})
  })

  test("does not persist the column entries", () => {
    const store = makeTableSettingsStore(key)
    store.setColumnEntries([
      { id: "tags", label: "Tags", defaultHidden: true, locked: false },
    ])
    expect(store.getSnapshot().columnEntries).toHaveLength(1)
    expect(window.localStorage.getItem(key)).toBeNull()
  })
})
