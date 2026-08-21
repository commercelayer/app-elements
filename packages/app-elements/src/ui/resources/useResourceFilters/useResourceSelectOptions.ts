import type { QueryParamsList } from "@commercelayer/sdk"
import uniqBy from "lodash-es/uniqBy"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import type { InputSelectValue } from "#ui/forms/InputSelect"
import type { FilterItemOptions } from "./types"

type SelectRender = Extract<
  FilterItemOptions["render"],
  { component: "inputSelect" }
>

/** The props of a select whose options come from a resource, not a fixed list. */
export type ResourceSelectProps = Exclude<
  SelectRender["props"],
  { options: unknown }
>

/** Core caps `pageSize` at 25, so this is also the most we can load in one go. */
export const defaultOptionsLimit = 10

export interface ResourceSelectOptions {
  /** Options to hand to the select: the first page, plus anything selected. */
  initialValues: InputSelectValue[]
  /** The first page is still loading. */
  isLoading: boolean
  /** How many records exist in total, once known. */
  recordCount?: number
  /** Whether the labels of the current selection have been resolved. */
  hasResolvedSelection: boolean
  /** Server-side search, when the instruction sets `searchBy`. */
  loadAsyncValues?: (hint: string) => Promise<InputSelectValue[]>
}

/**
 * Loads the options of a resource-backed filter select.
 *
 * Shared by the two places such a select is rendered — the filters drawer and,
 * for a filter promoted with `position: "bar"`, the filters bar — so that both
 * fetch the same way and a value picked in one resolves its label in the other.
 */
export function useResourceSelectOptions({
  props,
  selectedValues,
}: {
  props: ResourceSelectProps
  selectedValues: string[]
}): ResourceSelectOptions {
  const { sdkClient } = useCoreSdkProvider()
  const {
    resource,
    fieldForLabel,
    fieldForValue,
    searchBy,
    sortBy,
    filters = {},
    limit = defaultOptionsLimit,
  } = props

  const listQuery: QueryParamsList = {
    fields: {
      [resource]: [fieldForValue, fieldForLabel],
    },
    pageSize: limit as QueryParamsList["pageSize"],
    ...(sortBy != null
      ? { sort: { [sortBy.attribute]: sortBy.direction } }
      : {}),
    filters,
  }

  const toOption = (item: Record<string, unknown>): InputSelectValue => ({
    value: String(item[fieldForValue]),
    label: String(item[fieldForLabel] ?? item[fieldForValue]),
  })

  const { data: firstPage, isLoading } = useCoreApi(
    resource,
    "list",
    [listQuery],
    { revalidateOnFocus: false },
  )

  // Selected options may live on a later page, so they are fetched on their own
  // to keep their labels resolvable. With nothing selected this is the very same
  // query as above, which swr dedupes.
  const { data: selectedResources } = useCoreApi(
    resource,
    "list",
    [
      selectedValues.length === 0
        ? listQuery
        : {
            ...listQuery,
            filters: {
              ...filters,
              [`${fieldForValue}_in`]: selectedValues.join(","),
            },
          },
    ],
    { revalidateOnFocus: false },
  )

  const initialValues = uniqBy(
    [...(selectedResources ?? []), ...(firstPage ?? [])].map((item) =>
      toOption(item as unknown as Record<string, unknown>),
    ),
    "value",
  )

  return {
    initialValues,
    isLoading,
    recordCount: firstPage?.meta?.recordCount,
    hasResolvedSelection:
      selectedValues.length === 0 ||
      selectedValues.every((value) =>
        initialValues.some((option) => option.value === value),
      ),
    loadAsyncValues:
      searchBy == null
        ? undefined
        : async (hint: string) => {
            // the sdk resource is only known at runtime, so the `list` shape
            // cannot be inferred from the union of all listable resources
            const results = await (
              sdkClient[resource] as unknown as {
                list: (
                  params: QueryParamsList,
                ) => Promise<Array<Record<string, unknown>>>
              }
            ).list({
              ...listQuery,
              filters: { ...filters, [searchBy]: hint },
            })

            return results.map(toOption)
          },
  }
}
