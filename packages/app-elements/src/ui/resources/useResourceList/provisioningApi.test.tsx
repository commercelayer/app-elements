import { render, waitFor } from "@testing-library/react"
import type { FC } from "react"
import { CoreSdkProvider } from "#providers/CoreSdkProvider"
import { MockTokenProvider as TokenProvider } from "#providers/TokenProvider/MockTokenProvider"
import type { ClientFor } from "./apiFlavour"
import { listFetcher } from "./listFetcher"
import { useResourceList, useResourceListForApi } from "./useResourceList"

/**
 * A stand-in for the Provisioning client. The real one is built by the caller from
 * the dashboard's own token (see
 * `docs/adr/0001-provisioning-api-in-resource-list.md`), so a list is handed a
 * client rather than reaching for one — which is exactly what makes it testable
 * without a network or a provider.
 */
function fakeProvisioningClient({
  pages,
}: {
  pages: Array<Array<{ id: string; name: string }>>
}): {
  client: ClientFor<"provisioning">
  calls: Array<Record<string, unknown>>
} {
  const calls: Array<Record<string, unknown>> = []

  const list = async (
    params: Record<string, unknown>,
  ): Promise<Array<{ id: string; name: string }>> => {
    calls.push(params)
    const pageNumber = Number(params.pageNumber ?? 1)
    const records = pages[pageNumber - 1] ?? []
    const listResponse = [...records] as Array<{ id: string; name: string }> & {
      meta: {
        pageCount: number
        recordCount: number
        currentPage: number
        recordsPerPage: number
      }
    }
    // the shape the Provisioning SDK returns: an array carrying its own `meta`
    listResponse.meta = {
      pageCount: pages.length,
      recordCount: pages.flat().length,
      currentPage: pageNumber,
      recordsPerPage: records.length,
    }
    return listResponse
  }

  return {
    client: { roles: { list } } as unknown as ClientFor<"provisioning">,
    calls,
  }
}

describe("listFetcher, provisioning arm", () => {
  test("Should call the resource's own list with the page it asked for", async () => {
    const { client, calls } = fakeProvisioningClient({
      pages: [[{ id: "role-1", name: "Admin" }]],
    })

    const result = await listFetcher<"roles", "provisioning">({
      resourceType: "roles",
      client,
      clientType: "provisioningSdkClient",
      query: { filters: { name_i_cont: "adm" }, pageSize: 25 },
    })

    expect(calls).toEqual([
      { filters: { name_i_cont: "adm" }, pageSize: 25, pageNumber: 1 },
    ])
    expect(result.list).toEqual([{ id: "role-1", name: "Admin" }])
  })

  test("Should map the meta the Provisioning API returns", async () => {
    const { client } = fakeProvisioningClient({
      pages: [
        [{ id: "role-1", name: "Admin" }],
        [{ id: "role-2", name: "Ops" }],
      ],
    })

    const result = await listFetcher<"roles", "provisioning">({
      resourceType: "roles",
      client,
      clientType: "provisioningSdkClient",
    })

    expect(result.meta).toEqual({
      pageCount: 2,
      recordCount: 2,
      currentPage: 1,
      recordsPerPage: 1,
      // the Provisioning API has no cursor: only the Metrics API sets one
      cursor: null,
    })
  })

  test("Should accumulate pages, as the Core arm does", async () => {
    const { client } = fakeProvisioningClient({
      pages: [
        [{ id: "role-1", name: "Admin" }],
        [{ id: "role-2", name: "Ops" }],
      ],
    })

    const firstPage = await listFetcher<"roles", "provisioning">({
      resourceType: "roles",
      client,
      clientType: "provisioningSdkClient",
    })
    const secondPage = await listFetcher<"roles", "provisioning">({
      resourceType: "roles",
      client,
      clientType: "provisioningSdkClient",
      currentData: firstPage,
    })

    expect(secondPage.list.map((role) => role.id)).toEqual(["role-1", "role-2"])
  })
})

describe("useResourceList, provisioning flavour", () => {
  const ProvisioningRoles: FC<{ client: ClientFor<"provisioning"> }> = ({
    client,
  }) => {
    const { ResourceList } = useResourceList({
      type: "roles",
      api: "provisioning",
      client,
    })

    return (
      <ResourceList
        title="All roles"
        emptyState={<div>No roles found</div>}
        ItemTemplate={({ resource }) => (
          <div data-testid="roleItem">{resource?.name ?? "loading"}</div>
        )}
      />
    )
  }

  test("Should render the records the injected client returns", async () => {
    const { client } = fakeProvisioningClient({
      pages: [
        [
          { id: "role-1", name: "Admin" },
          { id: "role-2", name: "Ops" },
        ],
      ],
    })

    const { findAllByTestId } = render(
      // the providers are for the Core client the hook always reads; a
      // provisioning list never uses it
      <TokenProvider kind="integration" appSlug="orders" devMode>
        <CoreSdkProvider>
          <ProvisioningRoles client={client} />
        </CoreSdkProvider>
      </TokenProvider>,
    )

    await waitFor(async () => {
      const items = await findAllByTestId("roleItem")
      expect(items.map((item) => item.textContent)).toEqual(["Admin", "Ops"])
    })
  })
})

describe("useResourceListForApi, without a client", () => {
  test("Should fail loudly rather than query the Core API instead", () => {
    const Broken: FC = () => {
      // the generic entry point cannot enforce the pairing in its types, so a
      // missing client used to fall through to the Core client unnoticed
      useResourceListForApi({ type: "roles", api: "provisioning" })
      return null
    }

    expect(() => render(<Broken />)).toThrow(/needs a client/)
  })
})

describe("the api flavour, at the type level", () => {
  test("Should require a client for the Provisioning API, and none for Core", () => {
    // Each call is kept on one line so its expected error has one place to land.
    // These never run: what is being tested is that they compile, or do not.
    const assertions = [
      // a Core list is unchanged: no `api`, no `client`
      () => useResourceList({ type: "orders" }),
      // @ts-expect-error a provisioning list cannot be built without a client
      () => useResourceList({ api: "provisioning", type: "roles" }),
      // @ts-expect-error `orders` is a Core resource, not a Provisioning one
      () => useResourceList({ api: "provisioning", type: "orders", client }),
      // and the other way round: a Core list cannot take a provisioning type
      // @ts-expect-error `roles` is a Provisioning resource, not a Core one
      () => useResourceList({ type: "roles" }),
    ]

    expect(assertions).toHaveLength(4)
  })
})

declare const client: ClientFor<"provisioning">
