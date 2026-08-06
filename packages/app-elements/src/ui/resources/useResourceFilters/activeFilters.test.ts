import {
  getClearedFormValues,
  getPillFilters,
  isSameFilterValue,
} from "./activeFilters"
import { instructions } from "./mockedInstructions"

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

  test("defers the label of a single selected resource to a fetch", () => {
    const [pill] = getPillFilters({
      ...baseArgs,
      queryString: "market_id_in=dLbQmsNqrX",
    })

    expect(pill?.value).toBeUndefined()
    expect(pill?.fetch).toEqual({
      resource: "markets",
      id: "dLbQmsNqrX",
      fieldForLabel: "name",
    })
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
