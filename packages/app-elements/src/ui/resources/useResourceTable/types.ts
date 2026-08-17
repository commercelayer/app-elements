import type {
  ListableResourceType,
  ResourceSortFields,
} from "@commercelayer/sdk"
import type { FC, ReactNode } from "react"
import type { SectionProps } from "#ui/atoms/Section"
import type { Resource } from "../useResourceList/listFetcher"
import type { UseResourceListConfig } from "../useResourceList/useResourceList"

/**
 * A single column definition for a `ResourceTable`.
 *
 * This is app-elements' own column type: TanStack Table is an implementation
 * detail and its `ColumnDef` is intentionally not exposed here (see
 * `docs/adr/0001-encapsulate-tanstack-table.md`).
 */
export interface ResourceTableColumn<TResource extends ListableResourceType> {
  /**
   * Header content. A plain string or any node (icon, tooltip, …).
   */
  header: ReactNode
  /**
   * Cell renderer for this column. Receives the fetched resource for the row
   * and returns whatever should be displayed in the cell.
   */
  cell: (props: { resource: Resource<TResource> }) => ReactNode
  /**
   * Stable, unique column id.
   * When omitted it falls back to `sortBy`, then to a positional `col-<index>`.
   * Provide one explicitly when two columns would otherwise collide.
   */
  id?: string
  /**
   * Horizontal alignment applied to both the header and the cells.
   * @default 'left'
   */
  align?: "left" | "right" | "center"
  /**
   * What the column holds. Sets its width — as a share of the table, so it stays
   * liquid — plus alignment and truncation, from one scale shared by every app
   * (see `columnKindClassName`). Leave it off for the column that should absorb
   * the leftover space: the name, email or SKU the row is about.
   *
   * Prefer this over `width`: it is what keeps a status column the same size in
   * every app, and it makes the loading and loaded tables identical, since the
   * widths no longer depend on the cell content.
   */
  kind?: ResourceTableColumnKind
  /**
   * Escape hatch for a width `kind` cannot express, as a CSS class applied to
   * the column header (e.g. `"w-1/2"`). Overrides the `kind` width.
   *
   * Note the table lays out with `table-layout: fixed`, so a class means what it
   * says: a column narrower than its content clips rather than growing.
   */
  width?: string
  /**
   * When this column starts being shown, overriding the default.
   *
   * By default a table shows only its first column on mobile — a phone has room
   * for what the row is about and little else — and everything else from `md` up.
   * Set this to widen or narrow that:
   *
   * - `"lg"` / `"xl"` — appear later than the default (a low-value column)
   * - `"never"` — always visible, mobile included. For the one column that is the
   *   point of the table: a stock item's quantity, a price, a gift card balance.
   *
   * These are app-elements' own breakpoints (see `styles/global.css`, which resets
   * Tailwind's defaults): `md` 768px, `lg` 992px, `xl` 1280px. There is
   * deliberately no `sm`.
   *
   * The column's data is still fetched either way; only its rendering is
   * suppressed, via CSS, so nothing shifts on resize.
   */
  hideBelow?: "md" | "lg" | "xl" | "never"
  /**
   * When set, the column becomes sortable and this value is the attribute it
   * sorts by (e.g. `"created_at"`).
   *
   * Only attributes the API can actually sort by are accepted: the type is the
   * resource's own sortable set, taken from the SDK (see `SortableAttribute`).
   * Attributes reached through a relationship (`sku.code`, a market's name) are
   * not sortable, so those columns stay static.
   *
   * On a `metricsQuery` table the value is a Metrics attribute instead
   * (`"order.placed_at"`) — see `MetricsAttribute`.
   *
   * Sorting is server-side: clicking the header drives the SDK `sort` query
   * param and refetches. Rows are never reordered client-side.
   *
   * The header toggles between the two directions; the sort cannot be removed,
   * so a table always keeps an explicit order.
   */
  sortBy?: SortableAttribute<TResource> | MetricsAttribute
  /**
   * Direction applied on the first click of this column's header.
   *
   * Defaults to descending for date attributes — a `sortBy` ending in `_at`,
   * where the newest rows are the interesting ones — and to ascending for
   * everything else (codes, names, emails). Set it explicitly to override, e.g.
   * on a quantity column where the largest values matter most.
   */
  sortDescFirst?: boolean
}

/**
 * The kinds of column a resource table has, each with a width, an alignment and
 * a truncation rule. Deliberately a short list: the point is that a status column
 * is the same width in every app, which only holds if apps pick from a scale
 * rather than sizing columns one by one.
 *
 * `text` is for the secondary strings a row carries — a market, a stock location,
 * a customer, an origin. Without it they would split the leftover space evenly
 * with the column the row is actually about, which is rarely what you want.
 */
export type ResourceTableColumnKind =
  | "text"
  | "code"
  | "status"
  | "datetime"
  | "amount"
  | "count"
  | "actions"

/**
 * The attributes the API can sort a given resource by, straight from the SDK's
 * `ResourceSortFields`. Every resource adds the shared `id`, `reference`,
 * `reference_origin`, `created_at` and `updated_at` to its own set.
 *
 * This is the single source of truth for whether a column can be sortable: the
 * API rejects anything else, and computed values (a status derived from several
 * timestamps, a relationship's name) are not in it by definition.
 */
export type SortableAttribute<TResource extends ListableResourceType> = Extract<
  keyof ResourceSortFields[TResource],
  string
>

/**
 * A Metrics API sort attribute, always namespaced by its entity
 * (`"order.placed_at"`). Metrics has its own attribute names, outside the SDK's
 * resource types, so these can only be checked by shape — the dot is what tells
 * them apart from a Core attribute.
 */
export type MetricsAttribute = `${string}.${string}`

/**
 * SDK sort expression, e.g. `"created_at"` (asc) or `"-created_at"` (desc).
 * `undefined` means no explicit table sort is applied.
 */
export type ResourceTableSort<
  TResource extends ListableResourceType = ListableResourceType,
> =
  | SortableAttribute<TResource>
  | `-${SortableAttribute<TResource>}`
  | MetricsAttribute
  | `-${MetricsAttribute}`
  | undefined

export type UseResourceTableConfig<TResource extends ListableResourceType> =
  Omit<UseResourceListConfig<TResource>, "metricsQuery" | "query"> & {
    /** The columns to render, in display order. */
    columns: Array<ResourceTableColumn<TResource>>
    /**
     * SDK query object, excluding `pageNumber` (handled internally) and
     * `sort` (owned by the table's sorting state — set the initial sort with
     * `sort` instead).
     */
    query?: Omit<NonNullable<UseResourceListConfig<TResource>["query"]>, "sort">
    /**
     * When set, data is fetched from the Metrics API instead of the Core API.
     *
     * Sorting still works: a column's `sortBy` is sent as the metrics
     * `search.sort_by` (so use metrics attribute names, e.g. `"order.placed_at"`)
     * together with the matching `search.sort` direction — omit `search.sort_by`
     * here and let the table own it.
     */
    metricsQuery?: {
      search: {
        limit?: number
        fields?: string[]
      }
      /**
       * Metrics filters. When the table is rendered through
       * `useResourceFilters`' `FilteredTable`, this is injected from the active
       * filters and must not be set here.
       */
      filter?: Record<string, unknown>
    }
    /**
     * Optional row-level click handler. When provided the whole row becomes
     * interactive (hover affordance + click). Use it to navigate with your
     * app's router.
     *
     * The click event is passed as second argument, so it can be forwarded to
     * helpers that need it (e.g. `navigateTo(...).onClick`).
     */
    onRowClick?: (
      resource: Resource<TResource>,
      event: React.MouseEvent<HTMLElement>,
    ) => void
    /**
     * Return an href to make each row a real link (rendered as a stretched
     * anchor over the row). This enables native link behavior — cmd/ctrl/middle
     * click opens the row in a new tab, and the URL shows on hover.
     *
     * Combine with `onRowClick` for client-side navigation: a plain click calls
     * `onRowClick` (and suppresses the default navigation), while modified
     * clicks fall through to the browser. Return `undefined` to leave a row
     * non-navigable.
     *
     * Note: avoid interactive elements in the first column when using this — the
     * stretched anchor sits over the row (in-cell controls would need their own
     * `relative`/`z-10` to stay clickable).
     */
    getRowHref?: (resource: Resource<TResource>) => string | undefined
    /**
     * Controlled sort value (SDK sort expression, e.g. `"-created_at"`).
     * Pass together with `onSortChange` to own the sort state (e.g. persist it
     * in the URL). When omitted the table manages sort internally.
     */
    sort?: ResourceTableSort<TResource>
    /**
     * Called when the user changes the sort. Provide together with `sort` for
     * controlled mode; the callback receives the new SDK sort expression (or
     * `undefined` when sorting is cleared).
     */
    onSortChange?: (sort: ResourceTableSort<TResource>) => void
    /**
     * Initial sort used only when the table manages sort internally
     * (uncontrolled). Ignored when `sort`/`onSortChange` are provided.
     */
    defaultSort?: ResourceTableSort<TResource>
  }

/** Props of the `ResourceTable` component returned by the hook. */
export interface ResourceTableProps {
  /** Title. Can be a node or a function receiving the record count. */
  title?: ((recordCount: number | undefined) => ReactNode) | ReactNode
  /** Action button rendered next to the title. */
  actionButton?: SectionProps["actionButton"]
  /**
   * Rendered when the table has no rows.
   * When omitted, a default message based on the resource name is shown.
   */
  emptyState?: ReactNode
  /** Force the title size. Defaults to `normal`. */
  titleSize?: SectionProps["titleSize"]
  /** `boxed` wraps the table in a bordered card. */
  variant?: "boxed"
  /**
   * How the table behaves when its content is wider than the container.
   * - `"fit"` (default): the table fills the container width; columns share the
   *   available space (and wrap/shrink). Pair with `hideBelow` on columns to
   *   drop low-value columns on small screens.
   * - `"scroll"`: the table keeps its natural (unwrapped) width and scrolls
   *   horizontally inside its own container; the title/action button stay fixed.
   * @default 'fit'
   */
  layout?: "fit" | "scroll"
}

export interface UseResourceTableReturn<
  TResource extends ListableResourceType,
> {
  /** The component that renders the data table. */
  ResourceTable: FC<ResourceTableProps>
  /** Prev/next pagination controls. Renders `null` unless in `pagination` mode with more than one page. */
  Pagination: FC
  /** The rows currently displayed (current page, or accumulated in infinite mode). */
  list?: Array<Resource<TResource>>
  /** SDK pagination metadata. */
  meta?: import("../useResourceList/listFetcher").FetcherResponse<
    Resource<TResource>
  >["meta"]
  isLoading: boolean
  isFirstLoading: boolean
  error?: string
  /** Removes a row from the UI only (call after a successful delete API call). */
  removeItem: (resourceId: string) => void
  /** Clears fetched data and refetches from the first page. */
  refresh: () => void
  hasMorePages?: boolean
  /** The active sort (SDK sort expression), whether controlled or internal. */
  sort: ResourceTableSort<TResource>
}
