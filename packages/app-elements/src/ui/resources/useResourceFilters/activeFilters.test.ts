import {
  getClearedFormValues,
  getPillFilters,
  isSameFilterValue,
} from "./activeFilters"
import { instructions } from "./mockedInstructions"
import type { FiltersInstructions } from "./types"

describe("isSameFilterValue", () => {
  test("ignores array wrapping and ordering", () => {
    expect(isSameFilterValue("placed", ["placed"])).toBe(true)
    expect(isSameFilterValue(["a", "b"], ["b", "a"])).toBe(true)
    expect(isSameFilterValue(["a"], ["b"])).toBe(false)
  })

  test("treats nullish and empty as equivalent", () => {
    expect(isSameFilterValue(undefined, [])).toBe(true)
  })

  test("compares ranges by value", () => {
    const range = { from: 100, to: 200, currencyCode: "EUR" }
    expect(isSameFilterValue(range, { ...range })).toBe(true)
    expect(isSameFilterValue(range, { ...range, to: 300 })).toBe(false)
  })
})

describe("getPillFilters", () => {
  const baseArgs = { instructions, predicateWhitelist: [] }

  // Apps declare `textSearch` items for predicates they only want whitelisted —
  // hidden ones driving tabs — and those can be listed before the search bar's own
  // instruction. Taking the first `textSearch` then left the searched text showing
  // as a pill, duplicating what the search bar already displays.
  test("omits the searched text even when a hidden textSearch comes first", () => {
    const withHiddenFirst: FiltersInstructions = [
      {
        hidden: true,
        label: "starts_at_lteq",
        type: "textSearch",
        sdk: { predicate: "starts_at_lteq" },
        render: { component: "input" },
      },
      ...instructions,
    ]

    const pills = getPillFilters({
      instructions: withHiddenFirst,
      predicateWhitelist: [],
      queryString: "number_or_email_cont=shoes",
    })

    expect(pills).toEqual([])
  })

  test("resolves option labels, spelling out every selected value", () => {
    const pills = getPillFilters({
      ...baseArgs,
      queryString: "status_in=placed&status_in=approved",
    })

    expect(pills).toEqual([
      {
        id: "status_in",
        label: "Status",
        value: "Placed, Approved",
        kind: "group",
      },
    ])
  })

  test("omits the free text filter, already visible in the search bar", () => {
    const pills = getPillFilters({
      ...baseArgs,
      queryString: "number_or_email_cont=foo&status_in=placed",
    })

    expect(pills.map((pill) => pill.id)).toEqual(["status_in"])
  })

  test("omits filters matching the defaults of the current view", () => {
    const pills = getPillFilters({
      ...baseArgs,
      queryString: "status_in=placed&payment_status_eq=paid",
      // as if the active tab were already filtering by status
      defaultValues: { status_in: ["placed"] },
    })

    expect(pills.map((pill) => pill.id)).toEqual(["payment_status_eq"])
  })

  test("defers the labels of selected resources to a fetch", () => {
    const [pill] = getPillFilters({
      ...baseArgs,
      queryString: "market_id_in=dLbQmsNqrX",
    })

    expect(pill?.value).toBeUndefined()
    expect(pill?.fetch).toEqual({
      resource: "markets",
      ids: ["dLbQmsNqrX"],
      fieldForLabel: "name",
      fieldForValue: "id",
    })
  })

  test("defers every selected resource, not just a single one", () => {
    // showing raw ids would be the alternative, as it did before
    const [pill] = getPillFilters({
      ...baseArgs,
      queryString: "market_id_in=dLbQmsNqrX&market_id_in=NgojhKoyYN",
    })

    expect(pill?.fetch?.ids).toEqual(["dLbQmsNqrX", "NgojhKoyYN"])
  })

  test("renders a time range preset as a single pill", () => {
    const pills = getPillFilters({
      ...baseArgs,
      queryString: "timePreset=today",
    })

    expect(pills).toHaveLength(1)
    expect(pills[0]?.kind).toBe("timeRange")
  })
})

describe("getClearedFormValues", () => {
  test("reverts to the defaults of the current view", () => {
    const cleared = getClearedFormValues({
      instructions,
      predicateWhitelist: [],
      queryString: "status_in=cancelled&payment_status_eq=paid",
      defaultValues: { status_in: ["placed"] },
    })

    expect(cleared.status_in).toEqual(["placed"])
    expect(cleared.payment_status_eq).toBeUndefined()
  })

  test("keeps the free text search and the view title", () => {
    const cleared = getClearedFormValues({
      instructions,
      predicateWhitelist: [],
      queryString:
        "number_or_email_cont=foo&viewTitle=Open&payment_status_eq=paid",
    })

    expect(cleared.number_or_email_cont).toBe("foo")
    expect(cleared.viewTitle).toBe("Open")
    expect(cleared.payment_status_eq).toBeUndefined()
  })
})
