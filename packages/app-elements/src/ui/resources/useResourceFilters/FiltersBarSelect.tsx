import castArray from "lodash-es/castArray"
import type { JSX } from "react"
import { useEffect } from "react"
import { SkeletonItem } from "#ui/atoms/Skeleton"
import { InputSelect, isSingleValueSelected } from "#ui/forms/InputSelect"
import { makeFilterAdapters } from "./adapters"
import type {
  FilterItemOptions,
  FiltersInstructions,
  FormFullValues,
} from "./types"
import {
  type ResourceSelectProps,
  useResourceSelectOptions,
} from "./useResourceSelectOptions"

/**
 * The width every promoted filter's trigger takes, whatever it currently says.
 *
 * Fixed on purpose: the trigger sits in the bar's right-hand group, next to the
 * filters and export buttons, and a label that sized itself ("EU" against
 * "Black Friday 2026 — EU wholesale") would shove those buttons sideways on every
 * selection. Sized for "All stock locations", the longest of the empty labels.
 */
const triggerWidth = "w-full md:w-48"

export interface FiltersBarSelectProps {
  /** The promoted filter, already known to be an `inputSelect` in the bar. */
  item: FilterItemOptions
  instructions: FiltersInstructions
  queryString: string
  predicateWhitelist: string[]
  onUpdate: (queryString: string) => void
}

/**
 * A filter rendered in `FiltersBar` rather than in the drawer.
 *
 * It works straight on the query string, as the search bar does: there is no form
 * around it to submit, so a choice applies immediately. Single-valued — the
 * trigger has one line to state what the page is showing — while the predicate
 * stays `_in`, so links shared before the filter was promoted keep working.
 */
export function FiltersBarSelect({
  item,
  instructions,
  queryString,
  predicateWhitelist,
  onUpdate,
}: FiltersBarSelectProps): JSX.Element | null {
  const { adaptUrlQueryToFormValues, adaptFormValuesToUrlQuery } =
    makeFilterAdapters({ instructions, predicateWhitelist })

  const predicate = item.sdk.predicate
  const formValues = adaptUrlQueryToFormValues({ queryString })
  const values = castArray(formValues[predicate] ?? [])
    .filter((value) => value != null && value !== "")
    .map((value) => String(value))

  const selectedValue = values[0]
  const write = (value?: string): void => {
    onUpdate(
      adaptFormValuesToUrlQuery({
        formValues: {
          ...formValues,
          [predicate]: value ?? undefined,
        } as FormFullValues,
      }),
    )
  }

  // A link made when the filter was multi-valued, or hand-edited, can carry more
  // than one id. The trigger can only state one, so the url is brought in line
  // with what is displayed rather than leaving the two disagreeing.
  useEffect(() => {
    if (values.length > 1) {
      write(selectedValue)
    }
  }, [values.length, selectedValue])

  const props = item.render.props as ResourceSelectProps
  const {
    initialValues,
    isLoading,
    recordCount,
    hasResolvedSelection,
    loadAsyncValues,
  } = useResourceSelectOptions({
    props,
    selectedValues: selectedValue == null ? [] : [selectedValue],
  })

  // Nothing to choose from: the page below is empty too, and its empty state
  // carries the message. With one option the select stays — it still says what
  // the page is showing, and a control that vanishes after a fetch is the kind of
  // reflow this bar exists to avoid.
  if (recordCount === 0) {
    return null
  }

  // The id arrives with the url, its label only after a request. Falling back to
  // the placeholder here would read "All price lists" over an already filtered
  // table, so the trigger waits instead — at its own width, so nothing moves.
  if (selectedValue != null && !hasResolvedSelection) {
    return (
      <div className={triggerWidth}>
        <SkeletonItem className="h-9 w-full rounded" />
      </div>
    )
  }

  // The unfiltered state is a row of the menu rather than a cleared field: it is
  // how the user gets back to "all", it reads the same as the resting trigger,
  // and it keeps this a plain single select with no clear affordance to explain.
  const allOption = { value: "", label: props.placeholder ?? item.label }
  const options = [allOption, ...initialValues]

  return (
    <div className={triggerWidth}>
      <InputSelect
        aria-label={item.label}
        initialValues={options}
        isLoading={isLoading}
        // the first page holds 25 options at most, so without searching the rest
        // of a long list cannot be reached from here at all
        loadAsyncValues={loadAsyncValues}
        isSearchable={loadAsyncValues != null}
        isClearable={false}
        // lines up with the search field and the buttons beside it
        size="small"
        value={
          options.find((option) => option.value === selectedValue) ?? allOption
        }
        onSelect={(value) => {
          const picked = isSingleValueSelected(value) ? String(value.value) : ""
          write(picked === "" ? undefined : picked)
        }}
      />
    </div>
  )
}

FiltersBarSelect.displayName = "FiltersBarSelect"
