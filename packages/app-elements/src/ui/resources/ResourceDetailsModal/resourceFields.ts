import { CommerceLayerStatic, type Resource } from "@commercelayer/sdk"

/**
 * Every resource type the bundled SDK knows about, taken from the SDK itself
 * rather than a hand-maintained list.
 */
const RESOURCE_TYPES = new Set<string>(CommerceLayerStatic.resources())

/**
 * Shape of a JSON:API resource type: plural, snake_case. For example `orders`,
 * `payment_authorizations`, `payment_setting_gift_cards`.
 */
const RESOURCE_TYPE_PATTERN = /^[a-z][a-z0-9]*(_[a-z0-9]+)*s$/

/**
 * The SDK list is authoritative but only as current as the version bundled
 * here, and the API keeps adding resources. Falling back to the shape of the
 * type keeps relationships on newer resources from being rendered as raw JSON
 * blobs until the SDK catches up.
 */
function isResourceType(type: string): boolean {
  return RESOURCE_TYPES.has(type) || RESOURCE_TYPE_PATTERN.test(type)
}

/**
 * A sideloaded relationship is serialized as an object carrying an `id` and a
 * `type` naming a resource. Requiring both is what keeps free-form JSON
 * attributes (`metadata`, `response_data`, and the like) from being mistaken
 * for relationships.
 */
function isResourceLike(value: unknown): boolean {
  if (value == null || typeof value !== "object") {
    return false
  }
  const { id, type } = value as { id?: unknown; type?: unknown }
  return (
    typeof id === "string" && typeof type === "string" && isResourceType(type)
  )
}

/**
 * An empty array is treated as a relationship: an emptied has-many
 * (`payment_refunds: []`) is far more common than a top-level array-valued
 * attribute, and there is no way to tell them apart from the payload alone.
 */
export function isRelationshipValue(value: unknown): boolean {
  return Array.isArray(value)
    ? value.length === 0 || isResourceLike(value[0])
    : isResourceLike(value)
}

export interface ResourceFields {
  /** Plain attribute keys, alphabetically sorted. */
  attributes: string[]
  /** Relationship keys, alphabetically sorted. */
  relationships: string[]
}

/**
 * Splits a resource's keys into plain attributes and relationships, so each can
 * be rendered separately. `id` and `type` are excluded: they identify the
 * resource itself and are shown on their own.
 */
export function splitResourceFields(resource: Resource): ResourceFields {
  const { id, type, ...rest } = resource
  const attributes: string[] = []
  const relationships: string[] = []

  for (const [key, value] of Object.entries(rest)) {
    if (isRelationshipValue(value)) {
      relationships.push(key)
    } else {
      attributes.push(key)
    }
  }

  return {
    attributes: attributes.sort(),
    relationships: relationships.sort(),
  }
}
