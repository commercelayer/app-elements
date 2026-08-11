import type { ListableResourceType } from "@commercelayer/sdk"

/**
 * What a mounted list is being asked to do.
 * - `removeItem` drops a single row without any request
 * - `refresh` refetches from the first page
 */
type ResourceListSignal =
  | { kind: "removeItem"; resourceId: string }
  | { kind: "refresh" }

type ResourceListSubscriber = (signal: ResourceListSignal) => void

const subscribers = new Map<ListableResourceType, Set<ResourceListSubscriber>>()

/**
 * Subscribe a mounted list to the signals for a resource type.
 * Called by `useResourceList`; returns the unsubscribe function.
 */
export function subscribeToResourceLists(
  type: ListableResourceType,
  subscriber: ResourceListSubscriber,
): () => void {
  const forType = subscribers.get(type) ?? new Set<ResourceListSubscriber>()
  forType.add(subscriber)
  subscribers.set(type, forType)

  return () => {
    forType.delete(subscriber)
    if (forType.size === 0) {
      subscribers.delete(type)
    }
  }
}

function emit(type: ListableResourceType, signal: ResourceListSignal): void {
  // copied before iterating: a subscriber could unsubscribe while we notify
  const forType = subscribers.get(type)
  if (forType == null) {
    return
  }
  for (const subscriber of [...forType]) {
    subscriber(signal)
  }
}

/**
 * Drop a row from every mounted list of the given resource type, with no
 * request. Call it right after a successful delete.
 *
 * Needed when the component that deletes is not the one rendering the list —
 * typically a details drawer rendered as a sibling of the list, which leaves the
 * list mounted, so it would otherwise keep showing the deleted row until the
 * page is reloaded. Lists that do not hold the row ignore the signal, and the
 * total record count is adjusted for those that do.
 *
 * @example
 * await sdkClient.stock_items.delete(stockItem.id)
 * removeFromResourceLists("stock_items", stockItem.id)
 */
export function removeFromResourceLists(
  type: ListableResourceType,
  resourceId: string,
): void {
  emit(type, { kind: "removeItem", resourceId })
}

/**
 * Refetch every mounted list of the given resource type from the first page.
 *
 * Prefer `removeFromResourceLists` after a delete: it is instant, and it neither
 * flashes the loading skeleton nor renumbers an infinite list mid-scroll. Reach
 * for this one when rows were created or edited elsewhere and the list content
 * can no longer be patched locally.
 *
 * A signal emitted while no list is mounted is a no-op — which is harmless,
 * since a list fetches on mount anyway.
 */
export function refreshResourceLists(type: ListableResourceType): void {
  emit(type, { kind: "refresh" })
}
