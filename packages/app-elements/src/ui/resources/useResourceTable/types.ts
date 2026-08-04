import type { ListableResourceType } from "@commercelayer/sdk"
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
   * Optional CSS class applied to the column header, typically for width
   * control (e.g. `"w-1/2"`).
   */
  width?: string
  /**
   * Hide this column below the given breakpoint; it is shown at that width and
   * up. These are app-elements' own breakpoints (see `styles/global.css`, which
   * resets Tailwind's defaults): `md` 768px, `lg` 992px, `xl` 1280px. There is
   * deliberately no `sm`.
   *
   * Common cases: `"md"` hides on mobile (shown on tablet + desktop), `"lg"`
   * shows on desktop only. The column's data is still fetched; only its
   * rendering is suppressed via CSS, so there is no layout shift on resize.
   */
  hideBelow?: "md" | "lg" | "xl"
  /**
   * When set, the column becomes sortable and this value is the CommerceLayer
   * SDK sort attribute it sorts by (e.g. `"created_at"`).
   *
   * Sorting is server-side: clicking the header drives the SDK `sort` query
   * param and refetches. Rows are never reordered client-side.
   */
  sortBy?: string
}

/**
 * SDK sort expression, e.g. `"created_at"` (asc) or `"-created_at"` (desc).
 * `undefined` means no explicit table sort is applied.
 */
export type ResourceTableSort = string | undefined

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
    sort?: ResourceTableSort
    /**
     * Called when the user changes the sort. Provide together with `sort` for
     * controlled mode; the callback receives the new SDK sort expression (or
     * `undefined` when sorting is cleared).
     */
    onSortChange?: (sort: ResourceTableSort) => void
    /**
     * Initial sort used only when the table manages sort internally
     * (uncontrolled). Ignored when `sort`/`onSortChange` are provided.
     */
    defaultSort?: ResourceTableSort
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
  sort: ResourceTableSort
}
