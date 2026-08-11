import type { Meta, StoryFn } from "@storybook/react-vite"
import {
  getOrderDisplayStatus,
  getOrderPaymentStatusName,
} from "#dictionaries/orders"
import type { CurrencyCode } from "#helpers/currencies"
import { formatDate } from "#helpers/date"
import { formatDisplayName } from "#helpers/name"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Badge } from "#ui/atoms/Badge"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { formatCentsToCurrency } from "#ui/forms/InputCurrency"
import {
  type ResourceTableColumn,
  useResourceTable,
} from "#ui/resources/useResourceTable"

const setup: Meta = {
  title: "Resources/useResourceTable",
  parameters: {
    layout: "padded",
    docs: {
      source: {
        type: "code",
      },
    },
  },
  decorators: [
    (Story) => (
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    ),
  ],
}
export default setup

const columns: Array<ResourceTableColumn<"orders">> = [
  {
    header: "Number",
    sortBy: "number",
    cell: ({ resource }) => `#${resource.number}`,
  },
  {
    header: "Market",
    cell: ({ resource }) => resource.market?.name,
  },
  {
    header: "Total",
    align: "right",
    sortBy: "total_amount_cents",
    cell: ({ resource }) => resource.formatted_total_amount,
  },
]

/**
 * `useResourceTable` renders a CommerceLayer resource as a data table driven by
 * a column model, backed by TanStack Table. Columns (including each header and
 * cell) are defined by the consumer; the component owns rendering, loading
 * skeletons, empty state, sorting, and pagination.
 */
export const Default: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns,
  })

  return (
    <ResourceTable
      title="Orders"
      actionButton={
        <Button variant="secondary" size="mini" alignItems="center">
          <Icon name="plus" /> Order
        </Button>
      }
    />
  )
}

/**
 * Declare a `sortBy` on any column to make its header sortable. Sorting is
 * server-side: clicking the header drives the SDK `sort` param and refetches.
 */
export const WithSorting: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns,
    defaultSort: "-number",
  })

  return <ResourceTable title="Orders" />
}

/**
 * Provide `onRowClick` to make the whole row interactive. Use it to navigate
 * with your app's router.
 *
 * Pass `getRowHref` too to render each row as a real link: cmd/ctrl/middle click
 * opens a new tab and the URL shows on hover, while a plain click is handled by
 * `onRowClick` (client-side navigation).
 */
export const WithRowClick: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns,
    getRowHref: (order) => `/orders/${order.id}`,
    onRowClick: (order) => {
      console.log("clicked order", order.id)
    },
  })

  return <ResourceTable title="Orders" />
}

/**
 * By default a table uses classic prev/next pagination.
 */
export const WithPagination: StoryFn = () => {
  const { ResourceTable, Pagination } = useResourceTable({
    type: "orders",
    columns,
    query: { pageSize: 10 },
    paginationScrollTo: "list",
  })

  return (
    <>
      <ResourceTable title="Orders" />
      <Pagination />
    </>
  )
}
WithPagination.parameters = {
  docs: {
    canvas: {
      sourceState: "none",
    },
  },
}

/**
 * Opt into infinite scrolling with `paginationType: "infinite"`.
 */
export const WithInfiniteScrolling: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns,
    query: { pageSize: 10 },
    paginationType: "infinite",
  })

  return <ResourceTable title="Orders" />
}
WithInfiniteScrolling.parameters = {
  docs: {
    canvas: {
      sourceState: "none",
    },
  },
}

/**
 * Set `hideBelow` on a column to hide it below a breakpoint (Tailwind `sm`/`md`/`lg`/`xl`).
 * Resize the preview: MARKET is hidden below `md` (mobile), and NUMBER's id column
 * below `lg` (mobile + tablet). Data is still fetched — only rendering is suppressed,
 * so there is no layout shift.
 */
export const ResponsiveColumns: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns: [
      {
        header: "ID",
        hideBelow: "lg",
        cell: ({ resource }) => resource.id,
      },
      {
        header: "Number",
        sortBy: "number",
        cell: ({ resource }) => `#${resource.number}`,
      },
      {
        header: "Market",
        hideBelow: "md",
        cell: ({ resource }) => resource.market?.name,
      },
      {
        header: "Total",
        align: "right",
        sortBy: "total_amount_cents",
        cell: ({ resource }) => resource.formatted_total_amount,
      },
    ],
  })

  return <ResourceTable title="Orders" />
}

/**
 * With `layout="scroll"`, a table wider than its container keeps its natural
 * width and scrolls horizontally instead of squishing columns. The title and
 * action button stay fixed. This is an alternative to hiding columns with
 * `hideBelow` — useful when every column matters. Narrow the preview to see it.
 */
export const HorizontalScroll: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns: [
      {
        header: "Number",
        sortBy: "number",
        cell: ({ resource }) => `#${resource.number}`,
      },
      { header: "Status", cell: ({ resource }) => resource.status },
      { header: "Payment", cell: ({ resource }) => resource.payment_status },
      {
        header: "Fulfillment",
        cell: ({ resource }) => resource.fulfillment_status,
      },
      { header: "Market", cell: ({ resource }) => resource.market?.name },
      { header: "Email", cell: ({ resource }) => resource.customer_email },
      {
        header: "Placed at",
        sortBy: "placed_at",
        cell: ({ resource }) => resource.placed_at,
      },
      {
        header: "Total",
        align: "right",
        sortBy: "total_amount_cents",
        cell: ({ resource }) => resource.formatted_total_amount,
      },
    ],
  })

  return <ResourceTable title="Orders" layout="scroll" />
}

/**
 * The `boxed` variant wraps the table in a bordered card.
 */
export const WithEmptyState: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    columns,
    query: { filters: { market_id_eq: "not-existing-id" } },
  })

  return (
    <ResourceTable
      title="Orders"
      variant="boxed"
      emptyState={<div>No orders found</div>}
    />
  )
}

/**
 * A realistic "Orders" list mimicking a product mockup: two-line ORDER and
 * CUSTOMER cells, a colored STATUS badge, a right-aligned AMOUNT with the
 * payment status beneath it, a sortable ORDER header, and clickable rows
 * (real links via `getRowHref`).
 */
export const OrdersMockup: StoryFn = () => {
  const { ResourceTable } = useResourceTable({
    type: "orders",
    getRowHref: (order) => `/orders/${order.id}`,
    onRowClick: (order) => {
      console.log("open order", order.id)
    },
    columns: [
      {
        header: "Order",
        sortBy: "number",
        cell: ({ resource }) => (
          <div>
            <Text tag="div" weight="semibold">
              {resource.market?.name} #{resource.number}
            </Text>
            <Text tag="div" size="small" variant="info">
              {resource.placed_at?.slice(0, 10) ?? "—"}
            </Text>
          </div>
        ),
      },
      {
        header: "Customer",
        cell: ({ resource }) => (
          <div>
            <Text tag="div" weight="semibold">
              {resource.billing_address?.full_name ?? "—"}
            </Text>
            <Text tag="div" size="small" variant="info">
              {resource.customer_email}
            </Text>
          </div>
        ),
      },
      {
        header: "Status",
        cell: ({ resource }) => {
          const status =
            resource.status === "cancelled"
              ? { label: "cancelled", variant: "secondary" as const }
              : resource.fulfillment_status === "fulfilled"
                ? { label: "fulfilled", variant: "success" as const }
                : resource.fulfillment_status === "in_progress"
                  ? { label: "in progress", variant: "warning" as const }
                  : { label: "awaiting approval", variant: "warning" as const }
          return <Badge variant={status.variant}>{status.label}</Badge>
        },
      },
      {
        header: "Amount",
        align: "right",
        cell: ({ resource }) => (
          <div>
            <Text tag="div" weight="semibold">
              {resource.formatted_total_amount}
            </Text>
            <Text tag="div" size="small" variant="info">
              {resource.payment_status}
            </Text>
          </div>
        ),
      },
    ],
  })

  return (
    <ResourceTable
      title={() => "Orders"}
      actionButton={
        <Button variant="primary" size="small" alignItems="center">
          <Icon name="plus" /> New order
        </Button>
      }
    />
  )
}

/**
 * Set `metricsQuery` to fetch from the **Metrics API** (`/metrics/orders/search`)
 * instead of the Core API.
 *
 * The metrics API is cursor-based, so prev/next pagination works by remembering
 * the cursor that opens each visited page — arbitrary page jumps are not
 * possible. Sorting is server-side too: a column's `sortBy` is sent as the
 * metrics `search.sort_by`, so use metrics attribute names (`order.placed_at`).
 *
 * Note that metrics orders carry `total_amount` in units (not a formatted
 * string) and provide no `customer_email`, hence the amount helper and the
 * country code as the customer's second line.
 */
export const FromMetricsApi: StoryFn = () => {
  const { ResourceTable, Pagination } = useResourceTable({
    type: "orders",
    metricsQuery: {
      search: {
        limit: 10,
        fields: ["order.*", "billing_address.*", "market.*", "customer.*"],
      },
    },
    defaultSort: "-order.placed_at",
    columns: [
      {
        header: "Order",
        sortBy: "order.placed_at",
        width: "w-1/3",
        cell: ({ resource }) => (
          <div>
            <Text tag="div" weight="semibold" wrap="nowrap">
              {`${resource.market?.name ?? "Order"} #${resource.number ?? ""}`}
            </Text>
            <Text tag="div" size="small" variant="info" wrap="nowrap">
              {formatDate({
                format: "full",
                isoDate: resource.placed_at ?? undefined,
              })}
            </Text>
          </div>
        ),
      },
      {
        header: "Customer",
        hideBelow: "md",
        cell: ({ resource }) => (
          <div>
            <Text tag="div" weight="semibold">
              {formatDisplayName(
                resource.billing_address?.first_name ?? "",
                resource.billing_address?.last_name ?? "",
              )}{" "}
              ({resource.billing_address?.country_code ?? "—"})
            </Text>
            <Text tag="div" size="small" variant="info">
              {resource.customer?.email ?? "—"}
            </Text>
          </div>
        ),
      },
      {
        header: "Status",
        cell: ({ resource }) => {
          const displayStatus = getOrderDisplayStatus(resource)
          return (
            <Badge
              variant={
                displayStatus.color === "green"
                  ? "success"
                  : displayStatus.color === "orange"
                    ? "warning"
                    : displayStatus.color === "red"
                      ? "danger"
                      : "secondary"
              }
            >
              {displayStatus.label}
            </Badge>
          )
        },
      },
      {
        header: "Amount",
        align: "right",
        sortBy: "order.total_amount",
        cell: ({ resource }) => (
          <div>
            <Text tag="div" weight="semibold" wrap="nowrap">
              {resource.currency_code != null && "total_amount" in resource
                ? formatCentsToCurrency(
                    (resource.total_amount as number) * 100,
                    resource.currency_code as CurrencyCode,
                  )
                : resource.formatted_total_amount}
            </Text>
            <Text tag="div" size="small" variant="info" wrap="nowrap">
              {getOrderPaymentStatusName(resource.payment_status)}
            </Text>
          </div>
        ),
      },
    ],
  })

  return (
    <>
      <ResourceTable title="Orders" />
      <Pagination />
    </>
  )
}
FromMetricsApi.parameters = {
  docs: {
    canvas: {
      sourceState: "none",
    },
  },
}
