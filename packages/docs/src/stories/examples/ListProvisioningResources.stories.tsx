import type { Meta, StoryFn } from "@storybook/react-vite"
import { formatDate } from "#helpers/date"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import { Icon } from "#ui/atoms/Icon"
import { Text } from "#ui/atoms/Text"
import { ListItem } from "#ui/composite/ListItem"
import { useResourceList } from "#ui/resources/useResourceList"
import type { ClientFor } from "#ui/resources/useResourceList/apiFlavour"
import {
  type ResourceTableColumn,
  useResourceTable,
} from "#ui/resources/useResourceTable"

const setup: Meta = {
  title: "Examples/List Provisioning Resources",
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
      // The providers are for the Core client the hooks always read. A
      // provisioning list never uses it — it fetches with the client it is given.
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <Story />
        </CoreSdkProvider>
      </TokenProvider>
    ),
  ],
}
export default setup

/* ------------------------------------------------------------------------- *
 * A stand-in for the Provisioning client.
 *
 * The real one is `CommerceLayerProvisioning({ accessToken })`, built by the app
 * from its own token. These stories build a small in-memory one instead, which
 * is the same thing the hooks see: a client is a set of resources, each with a
 * `list` that returns an array carrying its own `meta`.
 * ------------------------------------------------------------------------- */

interface FakeRecord {
  id: string
  name: string
  kind?: string
  created_at: string
}

const roles: FakeRecord[] = [
  { id: "role-1", name: "Admin", created_at: "2023-01-12T09:20:00.000Z" },
  { id: "role-2", name: "Read only", created_at: "2023-03-04T14:05:00.000Z" },
  {
    id: "role-3",
    name: "Order manager",
    created_at: "2024-02-19T11:45:00.000Z",
  },
  { id: "role-4", name: "Warehouse", created_at: "2024-07-01T08:30:00.000Z" },
  { id: "role-5", name: "Support", created_at: "2025-01-23T16:10:00.000Z" },
]

const apiCredentials: FakeRecord[] = [
  {
    id: "cred-1",
    name: "Storefront",
    kind: "sales_channel",
    created_at: "2023-02-24T10:00:00.000Z",
  },
  {
    id: "cred-2",
    name: "ERP sync",
    kind: "integration",
    created_at: "2023-10-17T13:20:00.000Z",
  },
  {
    id: "cred-3",
    name: "Checkout",
    kind: "sales_channel",
    created_at: "2024-01-05T09:15:00.000Z",
  },
  {
    id: "cred-4",
    name: "Admin webapp",
    kind: "webapp",
    created_at: "2024-06-11T17:40:00.000Z",
  },
  {
    id: "cred-5",
    name: "CLI",
    kind: "integration",
    created_at: "2025-03-08T12:00:00.000Z",
  },
]

/**
 * One resource of the fake client: honours `pageSize`, `pageNumber` and the
 * `sort` the table sets, and answers with the `meta` the Provisioning API
 * returns — `pageCount`, `recordCount`, `currentPage`, `recordsPerPage`, and no
 * cursor, which only the Metrics API has.
 */
function fakeResource(records: FakeRecord[]): {
  list: (params: Record<string, unknown>) => Promise<FakeRecord[]>
} {
  return {
    list: async (params) => {
      const pageSize = Number(params.pageSize ?? 25)
      const pageNumber = Number(params.pageNumber ?? 1)

      const sortExpression = Array.isArray(params.sort)
        ? String(params.sort[0] ?? "")
        : ""
      const descending = sortExpression.startsWith("-")
      const attribute = descending ? sortExpression.slice(1) : sortExpression

      const sorted =
        attribute === ""
          ? records
          : [...records].sort((a, b) => {
              const left = String(a[attribute as keyof FakeRecord] ?? "")
              const right = String(b[attribute as keyof FakeRecord] ?? "")
              return descending
                ? right.localeCompare(left)
                : left.localeCompare(right)
            })

      const page = sorted.slice(
        (pageNumber - 1) * pageSize,
        pageNumber * pageSize,
      )

      // the shape the SDK returns: an array with `meta` hung off it
      return Object.assign(page, {
        meta: {
          pageCount: Math.ceil(records.length / pageSize),
          recordCount: records.length,
          currentPage: pageNumber,
          recordsPerPage: pageSize,
        },
      })
    },
  }
}

const provisioningClient = {
  roles: fakeResource(roles),
  api_credentials: fakeResource(apiCredentials),
} as unknown as ClientFor<"provisioning">

/**
 * `useResourceList` and `useResourceTable` speak to the Provisioning API when
 * given `api: "provisioning"` — the resource types, query and returned records
 * are then the Provisioning SDK's (`roles`, `memberships`, `api_credentials`,
 * `organizations`, …) rather than the Core API's.
 *
 * **The caller passes the client.** app-elements has no provisioning token of
 * its own — `TokenProvider` never sees one — so a provisioning list is handed a
 * client and the types make it mandatory. An app typically wraps that injection
 * once, so its own call sites stay free of plumbing (see
 * `docs/adr/0001-provisioning-api-in-resource-list.md`):
 *
 * ```tsx
 * export function useProvisioningResourceList<TResource extends ListableResourceType>(
 *   config: Omit<UseResourceListConfig<TResource, "provisioning">, "api" | "client" | "metricsQuery">,
 * ): UseResourceListReturn<TResource, "provisioning"> {
 *   const { sdkClient } = useProvisioningSdkProvider()
 *   return useResourceList({ ...config, api: "provisioning", client: sdkClient })
 * }
 * ```
 *
 * Everything else is the same list you already know: infinite scrolling, the
 * loading skeleton, the empty state, the record count in the title, and the
 * refresh/remove signals.
 */
export const Default: StoryFn = () => {
  const { ResourceList } = useResourceList({
    type: "roles",
    api: "provisioning",
    client: provisioningClient,
    query: {
      pageSize: 25,
      sort: { created_at: "asc" },
    },
  })

  return (
    <ResourceList
      title="All roles"
      emptyState="No roles found."
      ItemTemplate={({ resource, isLoading }) => (
        <ListItem>
          <Text weight="semibold">
            {isLoading === true ? "Loading role" : resource?.name}
          </Text>
          <Icon name="caretRight" />
        </ListItem>
      )}
    />
  )
}

const columns: Array<ResourceTableColumn<"api_credentials", "provisioning">> = [
  {
    header: "Name",
    cell: ({ resource }) => <Text weight="medium">{resource.name}</Text>,
  },
  {
    header: "Kind",
    kind: "text",
    // no `sortBy`: it accepts only what the Provisioning API can sort api
    // credentials by — `id`, `mode`, `created_at`, `updated_at`, `reference`,
    // `reference_origin` — taken from the SDK, and `kind` is not among them, so
    // this column stays static rather than sending a sort the API would reject
    cell: ({ resource }) => <Text variant="info">{resource.kind}</Text>,
  },
  {
    header: "Created",
    kind: "datetime",
    sortBy: "created_at",
    cell: ({ resource }) => (
      <Text variant="info" wrap="nowrap">
        {formatDate({ format: "date", isoDate: resource.created_at })}
      </Text>
    ),
  },
]

/**
 * The table flavour, with the columns typed against the Provisioning resource:
 * `resource` in each `cell` is an `ApiCredential`, and `sortBy` accepts only the
 * attributes the Provisioning API can sort api credentials by.
 *
 * Sorting and pagination work exactly as they do on the Core API — both are
 * server-side, so they become query parameters the client sends. `defaultSort`
 * sets the initial sort; headers are inert, so a control outside the table
 * drives it from there through `sort` + `onSortChange` (or `setSort`).
 */
export const AsTable: StoryFn = () => {
  const { ResourceTable, Pagination } = useResourceTable({
    type: "api_credentials",
    api: "provisioning",
    client: provisioningClient,
    columns,
    query: {
      pageSize: 3,
    },
    defaultSort: "-created_at",
  })

  return (
    <>
      <ResourceTable title="API credentials" />
      <Pagination />
    </>
  )
}
