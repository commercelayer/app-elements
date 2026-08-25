import { forwardRef } from "react"
import type {
  GroupBase,
  OptionsOrGroups,
  SelectInstance,
  StylesConfig,
} from "react-select"
import {
  AsyncPaginate,
  type LoadOptions,
  type ReduceOptions,
  wrapMenuList,
} from "react-select-async-paginate"
import type {
  InputSelectBaseProps,
  InputSelectValue,
  LoadAsyncValuesPaginated,
} from "./InputSelect"
import overrides from "./overrides"

/**
 * What the loader carries from one page to the next.
 *
 * The library calls it `additional` and hands it back untouched on the following
 * request, which is where the page cursor lives.
 */
interface Additional {
  page: number
}

type Options = OptionsOrGroups<InputSelectValue, GroupBase<InputSelectValue>>

export interface AsyncPaginateSelectComponentProps
  extends Omit<
    InputSelectBaseProps,
    "label" | "hint" | "asTextSearch" | "isCreatable"
  > {
  loadAsyncValues: LoadAsyncValuesPaginated
  styles: StylesConfig<InputSelectValue>
}

/**
 * The library wraps `MenuList` to watch its scroll position, but its own
 * wrapping runs *before* the components we pass in, so ours would replace it and
 * take the scroll listener with it. Wrapping ours here keeps both: the footer and
 * the styling we override, plus the scroll detection paging depends on.
 */
const components = {
  ...overrides,
  MenuList: wrapMenuList(overrides.MenuList),
}

const componentsWithoutDropdownIndicator = {
  ...components,
  DropdownIndicator: null,
}

/**
 * react-select hands any prop it does not know to `selectProps`, which is how the
 * `MenuList` override tells "loading the next page" — a footer under the options
 * already shown — apart from "loading the first one", which react-select covers
 * on its own. Spread rather than written as an attribute, so it is not rejected
 * as an unknown JSX prop.
 */
const paginatedSelectProps = { isPaginated: true }

/**
 * The async select that loads the next page as its menu is scrolled, instead of
 * leaving everything past the first page reachable only by typing.
 *
 * Options are always what the server returned — client-side filtering stays off,
 * as filtering a list that is only partly loaded would quietly hide matches
 * sitting on a page that has not been fetched yet.
 */
export const AsyncPaginateSelectComponent = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  AsyncPaginateSelectComponentProps
>(
  (
    {
      onSelect,
      noOptionsMessage,
      // deliberately dropped: see the note on paging from the first page below
      initialValues: _initialValues,
      isOptionDisabled,
      loadAsyncValues,
      hideDropdownIndicator = false,
      debounceMs = 500,
      ...rest
    },
    ref,
  ) => {
    const loadOptions: LoadOptions<
      InputSelectValue,
      GroupBase<InputSelectValue>,
      Additional
    > = async (inputValue, _loadedOptions, additional) => {
      const page = additional?.page ?? 1
      const { options, hasMore } = await loadAsyncValues(inputValue, { page })

      return {
        options,
        hasMore,
        additional: { page: page + 1 },
      }
    }

    return (
      <AsyncPaginate<
        InputSelectValue,
        GroupBase<InputSelectValue>,
        Additional,
        boolean
      >
        {...rest}
        {...paginatedSelectProps}
        selectRef={ref}
        loadOptions={loadOptions}
        // Paging always starts at the first page, and `initialValues` seeds
        // nothing.
        //
        // Seeding would mean claiming those values *are* the first page, which
        // the component cannot know: a caller composes them freely, and even the
        // filters bar can hand over a lone selected record that resolved before
        // the list did. Starting from the second page in that case would skip the
        // first one for good. So the menu fetches page one when it opens, and
        // `initialValues` keeps to what it is elsewhere — the labels the closed
        // control needs.
        additional={{ page: 1 }}
        reduceOptions={reduceOptions}
        debounceTimeout={debounceMs}
        closeMenuOnSelect={rest.isMulti !== true}
        isOptionDisabled={isOptionDisabled}
        onChange={onSelect}
        noOptionsMessage={() => noOptionsMessage}
        components={
          hideDropdownIndicator
            ? componentsWithoutDropdownIndicator
            : components
        }
        classNames={{
          control: (state) => (state.isFocused ? "z-[101]" : ""),
        }}
      />
    )
  },
)

/**
 * Appends a page to what the menu already shows, dropping anything already
 * there.
 *
 * A duplicate is not hypothetical: the selected option is fetched on its own so
 * that its label resolves, and it turns up again once its own page is reached.
 */
const reduceOptions: ReduceOptions<
  InputSelectValue,
  GroupBase<InputSelectValue>,
  Additional
> = (prevOptions: Options, loadedOptions: Options): Options => {
  const seen = new Set(
    prevOptions.map((option) => ("value" in option ? option.value : undefined)),
  )

  return [
    ...prevOptions,
    ...loadedOptions.filter(
      (option) => !("value" in option) || !seen.has(option.value),
    ),
  ]
}

AsyncPaginateSelectComponent.displayName = "AsyncPaginateSelectComponent"
