import type {
  ListResponse,
  QueryParamsList,
  Resource,
  ResourceTypeLock,
} from "@commercelayer/sdk"
import cn from "classnames"
import capitalize from "lodash-es/capitalize"
import lowerCase from "lodash-es/lowerCase"
import pluralize from "pluralize"
import { type FC, useId, useState } from "react"
import useSWR from "swr"
import { isMockedId } from "#helpers/mocks"
import { useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { t } from "#providers/i18n"
import { Icon } from "#ui/atoms/Icon"
import { SkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Text } from "#ui/atoms/Text"
import { PaginationInfo } from "#ui/resources/useResourceList/PaginationInfo"

const PAGE_SIZE = 10

export interface ResourceRelationshipsConfig {
  /**
   * Relationship names to list, e.g. `["customer", "line_items"]`.
   *
   * They come from the caller because neither the SDK nor the payload can tell
   * which relationships a type has: a relationship that was not sideloaded is
   * simply absent from the resource.
   */
  names: string[]
  /**
   * Called with a related record when its eye icon is clicked. Without it the
   * records are listed but not clickable.
   */
  onSelect?: (related: { type: string; id: string }) => void
}

/**
 * Lists a resource's relationships as an accordion, each row telling whether
 * it holds a single record or many.
 *
 * A has-one sideloaded by the caller is read straight from the payload.
 * Everything else is fetched through the relationship endpoint only when its
 * row is expanded, one page at a time: loading every has-many upfront would
 * cost one request each, dozens for an order.
 */
export const ResourceRelationships: FC<
  ResourceRelationshipsConfig & { resource: Resource }
> = ({ resource, names, onSelect }) => {
  if (names.length === 0) {
    return (
      <Text variant="info">
        {t("common.resource_details.no_relationships")}
      </Text>
    )
  }

  return (
    <div>
      {[...names].sort().map((name) => (
        <RelationshipRow
          key={[resource.id, name].join("-")}
          resource={resource}
          name={name}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

const RelationshipRow: FC<{
  resource: Resource
  name: string
  onSelect: ResourceRelationshipsConfig["onSelect"]
}> = ({ resource, name, onSelect }) => {
  const [isOpen, setIsOpen] = useState(false)
  // Kept here rather than in the panel, which unmounts when the row is
  // collapsed: reopening the row shows the page it was left on.
  const [pageNumber, setPageNumber] = useState(1)
  const id = useId()
  const buttonId = `${id}-button`
  const panelId = `${id}-panel`

  return (
    <>
      <button
        id={buttonId}
        type="button"
        aria-expanded={isOpen}
        aria-controls={panelId}
        className={cn(
          // The ring is drawn just outside the row: the row has no padding of
          // its own, so one drawn inside would run over the caret and the kind.
          // The details keep a 24px gutter around the list, room enough for it.
          "w-full flex items-center justify-between gap-4 py-3 text-left focus-visible:outline-offset-2",
          { "border-b border-gray-100": !isOpen },
        )}
        onClick={() => {
          setIsOpen((current) => !current)
        }}
      >
        <span className="flex items-center gap-1.5 min-w-0">
          <Icon
            name={getCaretIcon(isOpen)}
            size={10}
            weight="fill"
            aria-hidden="true"
            className={cn("shrink-0", {
              "text-black": isOpen,
              "text-gray-300": !isOpen,
            })}
          />
          <Text
            size="xx-small"
            weight="semibold"
            className="font-mono truncate"
          >
            {capitalize(lowerCase(name))}
          </Text>
        </span>
        <Text
          size="xx-small"
          variant="info"
          className="font-mono whitespace-nowrap"
        >
          {getRelationshipKindLabel(name)}
        </Text>
      </button>

      {isOpen && (
        <section
          id={panelId}
          aria-labelledby={buttonId}
          className="pl-4 pt-1 pb-4 border-b border-gray-100"
        >
          <div className="bg-gray-50 rounded p-4">
            <RelationshipPanel
              resource={resource}
              name={name}
              pageNumber={pageNumber}
              onPageChange={setPageNumber}
              onSelect={onSelect}
            />
          </div>
        </section>
      )}
    </>
  )
}

interface RelationshipPanelProps {
  resource: Resource
  name: string
  pageNumber: number
  onPageChange: (pageNumber: number) => void
  onSelect: ResourceRelationshipsConfig["onSelect"]
}

/** The content of an expanded row, mounted only while the row is open. */
const RelationshipPanel: FC<RelationshipPanelProps> = ({
  resource,
  name,
  pageNumber,
  onPageChange,
  onSelect,
}) => {
  const sideloaded = getSideloadedHasOne(resource, name)

  if (sideloaded !== undefined) {
    return (
      <RelatedRecords records={toRecordList(sideloaded)} onSelect={onSelect} />
    )
  }

  return (
    <FetchedRelatedRecords
      resource={resource}
      name={name}
      pageNumber={pageNumber}
      onPageChange={onPageChange}
      onSelect={onSelect}
    />
  )
}

const FetchedRelatedRecords: FC<RelationshipPanelProps> = ({
  resource,
  name,
  pageNumber,
  onPageChange,
  onSelect,
}) => {
  const { data, error, isLoading } = useRelatedRecords({
    resource,
    name,
    pageNumber,
  })

  if (error != null) {
    return (
      <Text size="small" variant="danger" role="alert">
        {t("common.resource_details.relationship_error")}
      </Text>
    )
  }

  if (data == null) {
    return (
      <div role="status">
        <span className="sr-only">{t("common.loading")}</span>
        <div aria-hidden="true">
          <SkeletonTemplate isLoading>
            <RelatedRecords records={placeholderRecords} />
          </SkeletonTemplate>
        </div>
      </div>
    )
  }

  return (
    <>
      <div
        aria-busy={isLoading}
        className={cn({ "opacity-40 pointer-events-none": isLoading })}
      >
        <RelatedRecords records={data} onSelect={onSelect} />
      </div>
      {data.meta.pageCount > 1 && (
        <PaginationInfo
          currentPage={data.meta.currentPage}
          pageCount={data.meta.pageCount}
          recordsPerPage={PAGE_SIZE}
          recordCount={data.meta.recordCount}
          isLoading={isLoading}
          onPageChange={onPageChange}
          top="4"
        />
      )}
    </>
  )
}

/**
 * Reads one page of a relationship through its endpoint. The endpoint answers
 * a has-many with a list and a has-one with a single record (or nothing), so
 * both are normalized to a list. The previous page stays on screen while the
 * next one loads, so the pager doesn't jump, and a page already seen is not
 * fetched again when its row is reopened.
 */
const useRelatedRecords = ({
  resource,
  name,
  pageNumber,
}: {
  resource: Resource
  name: string
  pageNumber: number
}) => {
  const { sdkClient } = useCoreSdkProvider()

  return useSWR(
    getRelatedRecordsKey({ resource, name, pageNumber }),
    async () => {
      // `name` is only known at runtime, so the relationship method can't be
      // resolved through the SDK's static types.
      const reader = (sdkClient as unknown as RelationshipReader)[
        resource.type as ResourceTypeLock
      ]

      // A name the SDK doesn't know would otherwise read as an empty
      // relationship, hiding a typo or a renamed relationship.
      const read = reader?.[name]
      if (typeof read !== "function") {
        throw new Error(`Unknown relationship "${name}" for "${resource.type}"`)
      }

      return toListResponse(
        await read.call(reader, resource.id, {
          pageNumber,
          pageSize: PAGE_SIZE,
        }),
      )
    },
    { keepPreviousData: true, revalidateIfStale: false },
  )
}

/** The SWR key of a relationship page, or `null` while the resource is a placeholder. */
function getRelatedRecordsKey({
  resource,
  name,
  pageNumber,
}: {
  resource: Resource
  name: string
  pageNumber: number
}): [string, string, string, string, number] | null {
  if (isMockedId(resource.id)) {
    return null
  }

  return ["relationships", resource.type, resource.id, name, pageNumber]
}

const RelatedRecords: FC<{
  records: Resource[]
  onSelect?: ResourceRelationshipsConfig["onSelect"]
}> = ({ records, onSelect }) => {
  if (records.length === 0) {
    return (
      <Text size="x-small" variant="info">
        {t("common.resource_details.no_records")}
      </Text>
    )
  }

  return (
    <div className="bg-white border border-gray-100 rounded overflow-hidden">
      {records.map((record, idx) => (
        <RelatedRecord
          key={record.id}
          record={record}
          hasBorder={idx !== records.length - 1}
          onSelect={onSelect}
        />
      ))}
    </div>
  )
}

const RelatedRecord: FC<{
  record: Resource
  hasBorder: boolean
  onSelect?: ResourceRelationshipsConfig["onSelect"]
}> = ({ record, hasBorder, onSelect }) => {
  const className = cn(
    // The ring is drawn inside: the card clips anything outside its edges.
    "w-full flex items-center justify-between gap-4 px-4 py-2.5 text-left focus-visible:outline-offset-[-2px]",
    { "border-b border-gray-100": hasBorder },
  )

  const content = (
    <>
      <span className="flex items-center gap-2 min-w-0">
        <Text
          size="xx-small"
          weight="semibold"
          className="font-mono w-30 shrink-0 truncate"
        >
          {record.id}
        </Text>
        <Text
          size="xx-small"
          weight="medium"
          variant="info"
          className="font-mono truncate"
        >
          {getRecordLabel(record) ?? <>&#8212;</>}
        </Text>
      </span>
      {onSelect != null && (
        <Icon
          name="eye"
          size={16}
          aria-hidden="true"
          className="text-gray-500 shrink-0"
        />
      )}
    </>
  )

  if (onSelect == null) {
    return <div className={className}>{content}</div>
  }

  return (
    <button
      type="button"
      // Half a `bg-gray-50`: the card sits in a `bg-gray-50` box, and a full
      // one would make the hovered row read as a hole in the card.
      className={cn(
        className,
        "hover:bg-gray-50/50 focus-visible:bg-gray-50/50",
      )}
      aria-label={t("common.resource_details.view_record", { id: record.id })}
      onClick={() => {
        onSelect({ type: record.type, id: record.id })
      }}
    >
      {content}
    </button>
  )
}

function getCaretIcon(isOpen: boolean): "caretDown" | "caretRight" {
  if (isOpen) {
    return "caretDown"
  }

  return "caretRight"
}

function getRelationshipKindLabel(name: string): string {
  if (isHasManyRelationship(name)) {
    return t("common.resource_details.has_many")
  }

  return t("common.resource_details.has_one")
}

/**
 * The related record of a has-one the caller sideloaded: the record itself,
 * `null` when the relationship is empty, or `undefined` when it was not
 * sideloaded (or is a has-many) and must be fetched instead.
 */
function getSideloadedHasOne(
  resource: Resource,
  name: string,
): Resource | null | undefined {
  if (!(name in resource)) {
    return undefined
  }

  const value = (resource as unknown as Record<string, unknown>)[name]

  if (value === null) {
    return null
  }

  if (Array.isArray(value) || typeof value !== "object") {
    return undefined
  }

  return value as Resource
}

/**
 * Whether a relationship holds many records, told from its name: has-many
 * relationships are plural (`line_items`), has-one singular (`market`).
 *
 * Checked against every relationship of the public resources schema. The one
 * exception is `skus`, which `pluralize` takes for a singular.
 */
export function isHasManyRelationship(name: string): boolean {
  return pluralize.isPlural(name) || /(^|_)skus$/.test(name)
}

/**
 * The attributes that best tell a record apart from its siblings, in order of
 * preference. No attribute is shared by every type, so this is a best effort.
 */
const LABEL_ATTRIBUTES = [
  "name",
  "number",
  "code",
  "sku_code",
  "email",
  "reference",
] as const

function getRecordLabel(record: Resource): string | undefined {
  const values = record as unknown as Record<string, unknown>

  for (const attribute of LABEL_ATTRIBUTES) {
    const value = values[attribute]
    if (typeof value === "string" || typeof value === "number") {
      if (value !== "") {
        return String(value)
      }
    }
  }

  return undefined
}

/** Reads any relationship of any resource type, as the SDK client exposes it. */
type RelationshipReader = Record<
  ResourceTypeLock,
  Record<
    string,
    | ((
        id: string,
        params?: QueryParamsList<Resource>,
      ) => Promise<ListResponse<Resource> | Resource | null>)
    | undefined
  >
>

/**
 * A has-many already comes back as a `ListResponse` (an array with `meta`). A
 * has-one is wrapped as a single page holding it: the SDK exports
 * `ListResponse` as a type only, so the array is given the same `meta` shape
 * rather than built through its constructor.
 */
function toListResponse(
  response: ListResponse<Resource> | Resource | null | undefined,
): ListResponse<Resource> {
  if (Array.isArray(response)) {
    return response
  }

  const records = toRecordList(response)
  const meta: ListResponse<Resource>["meta"] = {
    pageCount: 1,
    recordCount: records.length,
    recordCountEstimated: false,
    currentPage: 1,
    recordsPerPage: PAGE_SIZE,
  }

  return Object.assign(records, { meta }) as unknown as ListResponse<Resource>
}

/** A has-one's record as a list: empty when the relationship is empty. */
function toRecordList(record: Resource | null | undefined): Resource[] {
  if (record == null) {
    return []
  }

  return [record]
}

const placeholderRecords = [1, 2, 3].map(
  (n) =>
    ({
      id: `fake-record-${n}`,
      type: "fake",
      name: "Loading",
    }) as unknown as Resource,
)
