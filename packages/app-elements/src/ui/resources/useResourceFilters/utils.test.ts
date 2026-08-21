import { instructions } from "./mockedInstructions"
import type { FiltersInstructionItem, FiltersInstructions } from "./types"
import {
  computeFilterLabel,
  getActiveFilterCountFromUrl,
  isBarFilter,
} from "./utils"

describe("computeFilterLabel", () => {
  test("should return valid computed label", () => {
    expect(
      computeFilterLabel({
        label: "Markets",
        selectedCount: 0,
        totalCount: 4,
      }),
    ).toBe("Markets · 4")
  })

  test("should return selected count in computed label", () => {
    expect(
      computeFilterLabel({
        label: "Payment status",
        selectedCount: 2,
        totalCount: 6,
      }),
    ).toBe("Payment status · 2 of 6")
  })
})

describe("getActiveFilterCountFromUrl", () => {
  test("should read current URL query string", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        queryString:
          "?market_id_in=abc123&status_in=approved&status_in=cancelled",
      }),
    ).toBe(2)
  })

  test("should not count hidden filters", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        queryString:
          "?market_id_in=abc123&status_in=approved&status_in=cancelled&archived_at_null=show",
      }),
    ).toBe(2)
  })

  test("should return 0 when no filters are in query string", () => {
    expect(getActiveFilterCountFromUrl({ instructions, queryString: "" })).toBe(
      0,
    )
  })

  test("should ignore params that are not a filter", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        queryString: "?status_in=approved&not-a-filter=yeah",
      }),
    ).toBe(1)
  })

  test("should ignore text filter", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        includeTextSearch: false,
        queryString: "?status_in=approved&number_or_email_cont=foobar",
      }),
    ).toBe(1)
  })

  test("should include text filter when asked", () => {
    expect(
      getActiveFilterCountFromUrl({
        instructions,
        includeTextSearch: true,
        queryString: "?status_in=approved&number_or_email_cont=foobar",
      }),
    ).toBe(2)
  })
})

describe("isBarFilter", () => {
  const promotedFixture = {
    label: "Price list",
    type: "options",
    sdk: { predicate: "price_list_id_in" },
    render: {
      component: "inputSelect",
      position: "bar",
      props: {
        resource: "price_lists",
        fieldForLabel: "name",
        fieldForValue: "id",
      },
    },
  } as unknown as FiltersInstructionItem

  test("Should recognise a select promoted to the bar", () => {
    expect(isBarFilter(promotedFixture)).toBe(true)
  })

  test("Should leave a select in the drawer by default", () => {
    const { position, ...render } = promotedFixture.render as Record<
      string,
      unknown
    >
    expect(
      isBarFilter({
        ...promotedFixture,
        render,
      } as unknown as FiltersInstructionItem),
    ).toBe(false)
  })

  // a tab pinning the predicate must not leave a select in the bar claiming
  // something else
  test("Should stay out of the bar when the instruction is hidden", () => {
    expect(isBarFilter({ ...promotedFixture, hidden: true })).toBe(false)
  })

  // the button opens the drawer, so it has to reflect what the drawer holds: a
  // page whose only filter is promoted to the bar should not offer an empty one
  test("Should not count a promoted filter as a drawer field", () => {
    const barOnly = [
      promotedFixture,
      {
        label: "Search",
        type: "textSearch",
        sdk: { predicate: "name_cont" },
        render: { component: "searchBar" },
      },
    ] as unknown as FiltersInstructions

    expect(barOnly.filter((item) => !isBarFilter(item)).length).toBe(1)
    expect(
      barOnly.some(
        (item) =>
          item.hidden !== true &&
          !(
            item.type === "textSearch" && item.render.component === "searchBar"
          ) &&
          !isBarFilter(item),
      ),
    ).toBe(false)
  })

  test("Should ignore filters that are not selects", () => {
    const timeRange = instructions.find((item) => item.type === "timeRange")
    expect(timeRange).toBeDefined()
    expect(isBarFilter(timeRange as FiltersInstructionItem)).toBe(false)
  })
})
