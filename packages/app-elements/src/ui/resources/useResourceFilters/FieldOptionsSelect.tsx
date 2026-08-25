import castArray from "lodash-es/castArray"
import type { JSX } from "react"
import { useFormContext } from "react-hook-form"
import { HookedInputSelect } from "#ui/forms/InputSelect"
import type { FilterItemOptions } from "./types"
import {
  type ResourceSelectProps,
  useResourceSelectOptions,
} from "./useResourceSelectOptions"

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
  const { placeholder, isClearable, isMulti = true, hideWhenSingleItem } = props

  const selectedValues = castArray(watch(name) ?? []).map((value) =>
    String(value),
  )

  const {
    initialValues,
    isLoading,
    recordCount,
    hasMorePages,
    loadAsyncValues,
  } = useResourceSelectOptions({ props, selectedValues })

  // parity with `inputResourceGroup`: a filter over a single possible value is
  // not worth showing, unless the user already picked something
  if (
    hideWhenSingleItem === true &&
    recordCount === 1 &&
    selectedValues.length === 0
  ) {
    return null
  }

  // a list that fits in its first page is entirely loaded already, so it filters
  // in place and never asks the server for anything
  const paginationProps = hasMorePages
    ? ({ infiniteScroll: true, loadAsyncValues } as const)
    : {}

  return (
    <HookedInputSelect
      name={name}
      label={label}
      initialValues={initialValues}
      isLoading={isLoading}
      isMulti={isMulti}
      isClearable={isClearable}
      placeholder={placeholder}
      {...paginationProps}
    />
  )
}
