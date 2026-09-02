/**
 * Which Commerce Layer API a list speaks to, and the types that follow from it.
 *
 * The Core and Provisioning SDKs are structurally parallel where a list touches
 * them — same `ListableResourceType` / `ResourceFields` / `ResourceSortFields` /
 * `QueryParamsList` names, a `client[type].list({ ...query, pageNumber })` call, and
 * a `meta` of `pageCount / recordCount / currentPage / recordsPerPage`. So a list
 * needs no new logic to serve both, only a map from the flavour to each SDK's types.
 *
 * Both SDKs are imported for their types only. A runtime import of either would be
 * bundled into every app that renders a list, so keep every import in this file
 * `import type`.
 *
 * See `docs/adr/0001-provisioning-api-in-resource-list.md` for why the Provisioning
 * client is passed in by the caller rather than built here.
 */

import type {
  CommerceLayerProvisioningClient,
  ListableResourceType as ProvisioningListableResourceType,
  QueryParamsList as ProvisioningQueryParamsList,
  ResourceFields as ProvisioningResourceFields,
  ResourceSortFields as ProvisioningResourceSortFields,
} from "@commercelayer/provisioning-sdk"
import type {
  CommerceLayerBundle,
  ListableResourceType as CoreListableResourceType,
  QueryParamsList as CoreQueryParamsList,
  ResourceFields as CoreResourceFields,
  ResourceSortFields as CoreResourceSortFields,
} from "@commercelayer/sdk"

export type { ProvisioningListableResourceType }

/** The API a list speaks to. Defaults to `core` wherever it is optional. */
export type ApiFlavour = "core" | "provisioning"

/**
 * Any resource type either API can list.
 *
 * The conditional below distributes over the `ApiFlavour` union, so this is Core's
 * listable union plus Provisioning's. Used where code holds a resource type without
 * knowing its flavour — a signal key, or the metrics guard — and a plain `string`
 * would give up typo checking.
 */
export type AnyListableResourceType = ListableResourceTypeFor<ApiFlavour>

/** The resource types that flavour can list. */
export type ListableResourceTypeFor<TApi extends ApiFlavour> =
  TApi extends "provisioning"
    ? ProvisioningListableResourceType
    : CoreListableResourceType

/** The SDK client that flavour is reached through. */
export type ClientFor<TApi extends ApiFlavour> = TApi extends "provisioning"
  ? CommerceLayerProvisioningClient
  : CommerceLayerBundle

/**
 * Per-flavour maps from resource type to what that resource is.
 *
 * Written as mapped types indexed by the resource, rather than as nested
 * conditionals: a deferred indexed access (`CoreResources[TResource]`) stays
 * assignable in both directions while `TResource` is still generic, whereas a
 * conditional does not reduce until it is resolved — which made every caller that
 * builds a query (the filters stack) fail to typecheck.
 */
type CoreResources = {
  [K in CoreListableResourceType]: Awaited<
    ReturnType<CommerceLayerBundle[K]["list"]>
  >[number]
}

type ProvisioningResources = {
  [K in ProvisioningListableResourceType]: Awaited<
    ReturnType<CommerceLayerProvisioningClient[K]["list"]>
  >[number]
}

type CoreQueries = {
  [K in CoreListableResourceType]: Omit<
    CoreQueryParamsList<CoreResourceFields[K]>,
    "pageNumber"
  >
}

type ProvisioningQueries = {
  [K in ProvisioningListableResourceType]: Omit<
    ProvisioningQueryParamsList<ProvisioningResourceFields[K]>,
    "pageNumber"
  >
}

type CoreSortables = {
  [K in CoreListableResourceType]: Extract<
    keyof CoreResourceSortFields[K],
    string
  >
}

type ProvisioningSortables = {
  [K in ProvisioningListableResourceType]: Extract<
    keyof ProvisioningResourceSortFields[K],
    string
  >
}

/** One record of `TResource`, as that flavour's SDK returns it. */
export type ResourceFor<
  TApi extends ApiFlavour,
  TResource extends ListableResourceTypeFor<TApi>,
> = TApi extends "provisioning"
  ? ProvisioningResources[TResource & ProvisioningListableResourceType]
  : CoreResources[TResource & CoreListableResourceType]

/** The list query that flavour accepts, minus the page the list itself drives. */
export type QueryParamsListFor<
  TApi extends ApiFlavour,
  TResource extends ListableResourceTypeFor<TApi>,
> = TApi extends "provisioning"
  ? ProvisioningQueries[TResource & ProvisioningListableResourceType]
  : CoreQueries[TResource & CoreListableResourceType]

/**
 * The attributes that flavour's API can sort `TResource` by — the single source of
 * truth for whether a column may be sortable, since the API rejects anything else.
 */
export type SortableAttributeFor<
  TApi extends ApiFlavour,
  TResource extends ListableResourceTypeFor<TApi>,
> = TApi extends "provisioning"
  ? ProvisioningSortables[TResource & ProvisioningListableResourceType]
  : CoreSortables[TResource & CoreListableResourceType]
