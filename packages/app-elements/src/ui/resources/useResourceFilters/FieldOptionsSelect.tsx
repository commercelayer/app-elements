import type { QueryParamsList } from "@commercelayer/sdk"
import castArray from "lodash-es/castArray"
import uniqBy from "lodash-es/uniqBy"
import type { JSX } from "react"
import { useFormContext } from "react-hook-form"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { HookedInputSelect, type InputSelectValue } from "#ui/forms/InputSelect"
import type { FilterItemOptions } from "./types"

type SelectRender = Extract<
  FilterItemOptions["render"],
  { component: "inputSelect" }
>

/**
 * The two shapes a select can take, split apart.
 *
 * The parent narrows once and hands each child exactly the props it understands,
 * rather than passing the whole item and having the child bail out on the wrong
 * shape — a bail-out before hooks is a hooks-order bug waiting to happen.
 */
type StaticSelectProps = Extract<SelectRender["props"], { options: unknown }>
type ResourceSelectProps = Exclude<SelectRender["props"], { options: unknown }>

/** Core caps `pageSize` at 25, so this is also the most we can load in one go. */
const defaultLimit = 25

/**
 * Renders an `options` filter as a (multi) select dropdown, the style used by the
 * dashboard metrics filters.
 *
 * Options come from the Core API. Anything already selected is fetched
 * separately, so its label resolves even when it is not in the first page, and
 * when `searchBy` is set typing searches server-side instead of filtering only
 * what has been loaded.
 */
export function FieldOptionsSelect({
  item,
}: {
  item: FilterItemOptions & { render: SelectRender }
}): JSX.Element | null {
  const { render, sdk, label } = item
  return "options" in render.props ? (
    <StaticOptionsSelect
      name={sdk.predicate}
      label={label}
      props={render.props}
    />
  ) : (
    <ResourceOptionsSelect
      name={sdk.predicate}
      label={label}
      props={render.props}
    />
  )
}

/**
 * A select over a list the app already holds — statuses, kinds, and the like.
 * Nothing is fetched, so it is also what the drawer falls back to for filters
 * that used to render as toggle buttons.
 */
function StaticOptionsSelect({
  name,
  label,
  props,
}: {
  name: string
  label: string
  props: StaticSelectProps
}): JSX.Element {
  const { options, placeholder, isClearable, isMulti = true } = props

  return (
    <HookedInputSelect
      name={name}
      label={label}
      // hidden options stay valid in the query, they just have no button here
      initialValues={options
        .filter((option) => option.isHidden !== true)
        .map(({ value, label }) => ({ value, label }))}
      isMulti={isMulti}
      isClearable={isClearable}
      placeholder={placeholder}
    />
  )
}

/** A select whose options are fetched from the Core API. */
function ResourceOptionsSelect({
  name,
  label,
  props,
}: {
  name: string
  label: string
  props: ResourceSelectProps
}): JSX.Element | null {
  const { watch } = useFormContext()
  const { sdkClient } = useCoreSdkProvider()

  const {
    resource,
    fieldForLabel,
    fieldForValue,
    searchBy,
    sortBy,
    filters = {},
    limit = defaultLimit,
    placeholder,
    isClearable,
    isMulti = true,
    hideWhenSingleItem,
  } = props

  const selectedValues = castArray(watch(name) ?? []).map((value) =>
    String(value),
  )

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
    [...(selectedResources ?? []), ...(firstPage ?? [])].map((resource) =>
      toOption(resource as unknown as Record<string, unknown>),
    ),
    "value",
  )

  // parity with `inputResourceGroup`: a filter over a single possible value is
  // not worth showing, unless the user already picked something
  if (
    hideWhenSingleItem === true &&
    firstPage?.meta?.recordCount === 1 &&
    selectedValues.length === 0
  ) {
    return null
  }

  return (
    <HookedInputSelect
      name={name}
      label={label}
      initialValues={initialValues}
      isLoading={isLoading}
      isMulti={isMulti}
      isClearable={isClearable}
      placeholder={placeholder}
      loadAsyncValues={
        searchBy == null
          ? undefined
          : async (hint) => {
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
            }
      }
    />
  )
}
