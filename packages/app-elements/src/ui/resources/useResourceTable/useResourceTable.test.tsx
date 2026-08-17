import { createEvent, fireEvent, render, waitFor } from "@testing-library/react"
import { HttpResponse, http } from "msw"
import type { FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { server } from "../../../mocks/server"
import type {
  ResourceTableColumn,
  ResourceTableProps,
  ResourceTableSort,
} from "./types"
import { useResourceTable } from "./useResourceTable"

const mockedOrders = [
  { id: "order-1", number: 1001 },
  { id: "order-2", number: 1002 },
  { id: "order-3", number: 1003 },
]

/**
 * Deterministic orders, replacing the shared handler's randomized ones, plus a
 * record of every `sort` the API is asked for — sorting is server-side, so the
 * outgoing query is the observable behavior.
 */
function mockOrdersList(): { requestedSorts: Array<string | null> } {
  const requestedSorts: Array<string | null> = []
  server.use(
    http.get(`https://*/api/orders`, ({ request }) => {
      requestedSorts.push(new URL(request.url).searchParams.get("sort"))
      return HttpResponse.json({
        data: mockedOrders.map((order) => ({
          id: order.id,
          type: "orders",
          attributes: { number: order.number },
        })),
        meta: { record_count: mockedOrders.length, page_count: 1 },
      })
    }),
  )
  return { requestedSorts }
}

const columns: Array<ResourceTableColumn<"orders">> = [
  {
    header: "Order",
    sortBy: "number",
    cell: ({ resource }) => `#${resource.number}`,
  },
  // no `sortBy`, so this one must not become interactive
  { header: "Status", cell: () => "placed" },
]

const Wrapper: FC<{ children: React.ReactNode }> = ({ children }) => (
  <TokenProvider kind="integration" appSlug="orders" devMode>
    <CoreSdkProvider>{children}</CoreSdkProvider>
  </TokenProvider>
)

/** Row elements in document order. */
function getRows(container: HTMLElement): HTMLElement[] {
  return Array.from(container.querySelectorAll("tbody tr"))
}

describe("useResourceTable", () => {
  describe("component identity", () => {
    it("keeps the returned `ResourceTable` stable across re-renders, so rows are not remounted (which showed up as a flicker on row click)", async () => {
      mockOrdersList()
      const seen = new Set<FC<ResourceTableProps>>()

      const Implementation: FC<{ tick: number }> = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          // inline handlers: a fresh identity on every render, as callers write them
          onRowClick: () => {},
          getRowHref: (order) => `/orders/${order.id}`,
        })
        seen.add(ResourceTable)
        return <ResourceTable />
      }

      const { findByText, rerender } = render(
        <Wrapper>
          <Implementation tick={0} />
        </Wrapper>,
      )

      // covers the render caused by the fetch resolving, which swaps `list`,
      // `meta` and `fetchMore`
      expect(await findByText("#1001")).toBeInTheDocument()

      rerender(
        <Wrapper>
          <Implementation tick={1} />
        </Wrapper>,
      )

      expect(seen.size).toBe(1)
    })
  })

  describe("row links", () => {
    const renderWithLinks = (
      onRowClick?: (order: { id: string }, event: React.MouseEvent) => void,
    ) => {
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          getRowHref: (order) => `/orders/${order.id}`,
          onRowClick,
        })
        return <ResourceTable />
      }
      return render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
    }

    it("renders a single stretched anchor, on the first cell only", async () => {
      mockOrdersList()
      const { container, findByText } = renderWithLinks()
      await findByText("#1001")

      const [firstRow] = getRows(container)
      assertToBeDefined(firstRow)
      const anchors = firstRow.querySelectorAll("a")
      expect(anchors).toHaveLength(1)

      const anchor = anchors[0]
      assertToBeDefined(anchor)
      expect(anchor).toHaveAttribute("href", "/orders/order-1")
      expect(anchor.closest("td")).toBe(firstRow.querySelector("td"))
      // `::after` is what covers the row, so the anchor needs a positioned row
      expect(firstRow).toHaveClass("relative")
    })

    it("leaves the row itself non-interactive, so the anchor owns the click", async () => {
      mockOrdersList()
      const { container, findByText } = renderWithLinks(() => {})
      await findByText("#1001")

      const [firstRow] = getRows(container)
      assertToBeDefined(firstRow)
      expect(firstRow).not.toHaveAttribute("role", "button")
    })

    it("on a plain click, calls `onRowClick` with the row's resource and prevents the navigation", async () => {
      mockOrdersList()
      const onRowClick = vi.fn()
      const { container, findByText } = renderWithLinks(onRowClick)
      await findByText("#1001")

      const anchor = getRows(container)[0]?.querySelector("a")
      assertToBeDefined(anchor)
      const click = createEvent.click(anchor)
      fireEvent(anchor, click)

      expect(onRowClick).toHaveBeenCalledTimes(1)
      expect(onRowClick.mock.calls[0]?.[0]).toMatchObject({ id: "order-1" })
      expect(click.defaultPrevented).toBe(true)
    })

    it.each([
      ["metaKey", { metaKey: true }],
      ["ctrlKey", { ctrlKey: true }],
      ["shiftKey", { shiftKey: true }],
      ["altKey", { altKey: true }],
    ])(
      "on a %s click, falls through to the browser so the row opens in a new tab",
      async (_name, modifier) => {
        mockOrdersList()
        const onRowClick = vi.fn()
        const { container, findByText } = renderWithLinks(onRowClick)
        await findByText("#1001")

        const anchor = getRows(container)[0]?.querySelector("a")
        assertToBeDefined(anchor)
        const click = createEvent.click(anchor, modifier)
        fireEvent(anchor, click)

        expect(onRowClick).not.toHaveBeenCalled()
        expect(click.defaultPrevented).toBe(false)
      },
    )

    it("without `getRowHref`, makes the row itself the button and renders no anchor", async () => {
      mockOrdersList()
      const onRowClick = vi.fn()
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          onRowClick,
        })
        return <ResourceTable />
      }
      const { container, findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      const [firstRow] = getRows(container)
      assertToBeDefined(firstRow)
      expect(firstRow.querySelectorAll("a")).toHaveLength(0)
      expect(firstRow).toHaveAttribute("role", "button")

      fireEvent.click(firstRow)
      expect(onRowClick).toHaveBeenCalledTimes(1)
      expect(onRowClick.mock.calls[0]?.[0]).toMatchObject({ id: "order-1" })
    })
  })

  describe("column widths", () => {
    const kindColumns: Array<ResourceTableColumn<"orders">> = [
      // no kind: absorbs whatever the others leave
      { header: "Order", cell: ({ resource }) => `#${resource.number}` },
      { header: "Status", kind: "status", cell: () => "placed" },
      { header: "Amount", kind: "amount", cell: () => "€10,00" },
      { header: "", kind: "actions", cell: () => "…" },
    ]

    const renderKinds = () => {
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns: kindColumns,
        })
        return <ResourceTable />
      }
      return render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
    }

    /** Declared column widths, as numbers. */
    const declaredWidths = (container: HTMLElement): number[] =>
      Array.from(container.querySelectorAll("thead th")).map((th) =>
        Number.parseFloat((th as HTMLElement).style.width),
      )

    it("sizes columns from their kind, giving the unlabelled one the largest share", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      // weights 3 (no kind) + 2 (status) + 1 (amount) + 1 (actions) = 7
      const widths = declaredWidths(container)
      expect(widths[0]).toBeCloseTo((3 / 7) * 100, 4)
      expect(widths[1]).toBeCloseTo((2 / 7) * 100, 4)
      expect(widths[2]).toBeCloseTo((1 / 7) * 100, 4)
      expect(widths[3]).toBeCloseTo((1 / 7) * 100, 4)
    })

    // The bug this replaced: shares that did not add up left the surplus on the
    // last column, so a third of the table looked empty.
    it("declares widths that fill the table exactly", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      const total = declaredWidths(container).reduce((sum, w) => sum + w, 0)
      expect(total).toBeCloseTo(100, 4)
    })

    it("lets an explicit `width` class own the width", async () => {
      mockOrdersList()
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns: [
            { header: "Order", cell: ({ resource }) => `#${resource.number}` },
            { header: "Half", width: "w-1/2", cell: () => "x" },
          ],
        })
        return <ResourceTable />
      }
      const { container, findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      const headers = Array.from(container.querySelectorAll("thead th"))
      expect(headers[1]).toHaveClass("w-1/2")
      expect((headers[1] as HTMLElement).style.width).toBe("")
    })

    // The whole point: the widths live on the header row and come from the kind,
    // so the table does not resize when the data replaces the skeleton.
    it("declares the same widths while loading as when loaded", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()

      const widthsOf = () =>
        Array.from(container.querySelectorAll("thead th")).map(
          (th) => (th as HTMLElement).style.width,
        )
      const loading = widthsOf()
      // guards the assertion below against being trivially true when no width is
      // declared anywhere
      expect(loading.join("")).not.toBe("")
      await findByText("#1001")

      expect(loading).toEqual(widthsOf())
    })

    // Fixed layout takes its widths from the first rendered row. The header is
    // hidden on mobile, so the body cells have to carry the widths too or the
    // columns fall back to an even split.
    it("declares the widths on the body cells as well as the header", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      const headWidths = declaredWidths(container)
      const bodyWidths = Array.from(
        container.querySelectorAll("tbody tr:first-of-type td"),
      ).map((td) => Number.parseFloat((td as HTMLElement).style.width))

      expect(bodyWidths).toEqual(headWidths)
      expect(bodyWidths.some((w) => Number.isNaN(w))).toBe(false)
    })

    it("hides the header on mobile", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      expect(container.querySelector("thead")).toHaveClass(
        "hidden",
        "md:table-header-group",
      )
    })

    it("lays out with fixed table layout so cells cannot widen a column", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      expect(container.querySelector("table")).toHaveClass("table-fixed")
    })

    it("right-aligns amounts and counts without the app asking", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      const amountCell = container.querySelector(
        "tbody tr:first-of-type td:nth-of-type(3)",
      )
      expect(amountCell).toHaveClass("text-right")
    })

    // An open dropdown is absolutely positioned, not portaled, so clipping the
    // actions cell would clip the menu away with it.
    it("clips every cell except the actions one", async () => {
      mockOrdersList()
      const { container, findByText } = renderKinds()
      await findByText("#1001")

      const cells = Array.from(
        container.querySelectorAll("tbody tr:first-of-type td"),
      )
      expect(cells[0]).toHaveClass("overflow-hidden")
      expect(cells[1]).toHaveClass("overflow-hidden")
      expect(cells[3]).not.toHaveClass("overflow-hidden")
    })
  })

  describe("mobile visibility", () => {
    const renderCols = (cols: Array<ResourceTableColumn<"orders">>) => {
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns: cols,
        })
        return <ResourceTable />
      }
      return render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
    }

    /** Whether each column is hidden on mobile, header row and body row alike. */
    const hiddenOnMobile = (container: HTMLElement) => {
      const cellsOf = (selector: string) =>
        Array.from(container.querySelectorAll(selector)).map((cell) =>
          cell.classList.contains("hidden"),
        )
      return {
        head: cellsOf("thead th"),
        body: cellsOf("tbody tr:first-of-type td"),
      }
    }

    it("shows only the first column, actions included", async () => {
      mockOrdersList()
      const { container, findByText } = renderCols([
        { header: "Order", cell: ({ resource }) => `#${resource.number}` },
        { header: "Customer", kind: "text", cell: () => "someone" },
        { header: "Status", kind: "status", cell: () => "placed" },
        { header: "", kind: "actions", cell: () => "…" },
      ])
      await findByText("#1001")

      const { head, body } = hiddenOnMobile(container)
      expect(head).toEqual([false, true, true, true])
      // the body must agree with the header, or the columns would misalign
      expect(body).toEqual(head)
    })

    it("keeps a column visible on mobile when it asks to be", async () => {
      mockOrdersList()
      const { container, findByText } = renderCols([
        { header: "SKU", cell: ({ resource }) => `#${resource.number}` },
        // the value the table exists for, e.g. a stock item's quantity
        {
          header: "Quantity",
          kind: "count",
          hideBelow: "never",
          cell: () => "12",
        },
        { header: "Updated", kind: "datetime", cell: () => "today" },
      ])
      await findByText("#1001")

      expect(hiddenOnMobile(container).head).toEqual([false, false, true])
    })

    it("honours a later breakpoint for a low-value column", async () => {
      mockOrdersList()
      const { container, findByText } = renderCols([
        { header: "Order", cell: ({ resource }) => `#${resource.number}` },
        { header: "Group", kind: "text", hideBelow: "lg", cell: () => "vip" },
      ])
      await findByText("#1001")

      const group = container.querySelectorAll("thead th")[1]
      expect(group).toHaveClass("hidden", "lg:table-cell")
      expect(group).not.toHaveClass("md:table-cell")
    })
  })

  // Headers carry no sorting affordance: sorting will be driven by a field +
  // direction control outside the table, so a `sortBy` marks the column sortable
  // without making its header interactive.
  describe("inert headers", () => {
    it("renders no control in a header, even for a column with a `sortBy`", async () => {
      mockOrdersList()
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({ type: "orders", columns })
        return <ResourceTable />
      }
      const { container, findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      expect(container.querySelectorAll("thead th")).toHaveLength(2)
      expect(container.querySelector("thead button")).not.toBeInTheDocument()
      // no direction indicator either
      expect(container.querySelector("thead svg")).not.toBeInTheDocument()
    })

    it("orders the list server-side all the same", async () => {
      const { requestedSorts } = mockOrdersList()
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          defaultSort: "-number",
        })
        return <ResourceTable />
      }
      const { findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      expect(requestedSorts).toEqual(["-number"])
    })
  })

  describe("sorting", () => {
    // Headers are inert: sorting is driven from outside the table (a field +
    // direction control), so what matters is that the expression reaches the API
    // and that rows are never reordered client-side.
    it("sends `defaultSort` to the API and leaves the server's row order alone", async () => {
      const { requestedSorts } = mockOrdersList()
      const Implementation: FC = () => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          defaultSort: "-number",
        })
        return <ResourceTable />
      }
      const { container, findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      expect(requestedSorts).toEqual(["-number"])
      // the mock returns its rows in a fixed order whatever the sort: the table
      // must show them in that order rather than sorting them itself
      expect(
        getRows(container).map((row) => row.textContent?.slice(0, 5)),
      ).toEqual(["#1001", "#1002", "#1003"])
    })

    it("refetches with the new expression when a controlled sort changes", async () => {
      const { requestedSorts } = mockOrdersList()
      const Implementation: FC<{ sort: ResourceTableSort<"orders"> }> = ({
        sort,
      }) => {
        const { ResourceTable } = useResourceTable({
          type: "orders",
          columns,
          sort,
          onSortChange: () => {},
        })
        return <ResourceTable />
      }
      const { rerender, findByText } = render(
        <Wrapper>
          <Implementation sort="number" />
        </Wrapper>,
      )
      await findByText("#1001")
      expect(requestedSorts).toEqual(["number"])

      rerender(
        <Wrapper>
          <Implementation sort="-created_at" />
        </Wrapper>,
      )
      await waitFor(() => {
        expect(requestedSorts).toContain("-created_at")
      })
    })

    it("exposes the active sort, so a sort control can reflect it", async () => {
      mockOrdersList()
      let seen: ResourceTableSort<"orders">
      const Implementation: FC = () => {
        const { ResourceTable, sort } = useResourceTable({
          type: "orders",
          columns,
          defaultSort: "-number",
        })
        seen = sort
        return <ResourceTable />
      }
      const { findByText } = render(
        <Wrapper>
          <Implementation />
        </Wrapper>,
      )
      await findByText("#1001")

      expect(seen).toBe("-number")
    })
  })
})
