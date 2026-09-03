import { type FocusEventHandler, forwardRef } from "react"
import type {
  GroupBase,
  MenuPlacement,
  MultiValue,
  Options,
  SelectInstance,
  SingleValue,
} from "react-select"
import { t } from "#providers/I18NProvider"
import {
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"
import { AsyncSelectComponent } from "./AsyncComponent"
import { AsyncCreatableSelectComponent } from "./AsyncCreatableComponent"
import { AsyncPaginateSelectComponent } from "./AsyncPaginateComponent"
import {
  CreatableComponent,
  type CreatableComponentProps,
} from "./CreatableComponent"
import type { GenericAsyncSelectComponentProps } from "./GenericAsyncComponent"
import { SelectComponent, type SelectComponentProps } from "./SelectComponent"
import { getSelectStyles } from "./styles"

export type GroupedSelectValues = Array<{
  label?: string
  options: InputSelectValue[]
}>

export interface InputSelectValue {
  value: string | number | boolean
  label: string
  meta?: Record<string, any>
  isDisabled?: boolean
}

export type PossibleSelectValue =
  | MultiValue<InputSelectValue>
  | SingleValue<InputSelectValue>

export interface InputSelectBaseProps extends InputWrapperBaseProps {
  /**
   * Initial values to populate the select options. It can be a flat array of values or a grouped array.
   */
  initialValues: GroupedSelectValues | InputSelectValue[]
  /**
   * Selected value or values, in case of `isMulti`
   */
  defaultValue?: InputSelectValue | InputSelectValue[]
  /**
   * Selected value or values, in case of `isMulti`
   */
  value?: InputSelectValue | InputSelectValue[]
  /**
   * Placeholder text to display when no value is selected
   */
  placeholder?: string
  /**
   * Controls loading UI state
   */
  isLoading?: boolean
  /**
   * Text to display when loading
   */
  loadingText?: string
  /**
   * Add a clear button (x) to the select to empty all selected values
   */
  isClearable?: boolean
  /**
   * Disable the select
   */
  isDisabled?: boolean
  /**
   * When `true` it's possible to type to narrow down the options
   */
  isSearchable?: boolean
  /**
   * How tall the control is.
   *
   * `small` (36px) lines it up with the other controls of a toolbar row — the
   * search field and the buttons beside it. Otherwise the regular 44px of a form
   * field.
   * @default 'regular'
   */
  size?: "regular" | "small"
  /**
   * Allow to select multiple values
   */
  isMulti?: boolean
  /**
   * Custom rule to disable an option
   */
  isOptionDisabled?: (
    option: InputSelectValue,
    selectValue: Options<InputSelectValue>,
  ) => boolean
  /**
   * Callback triggered when a value is selected.
   */
  onSelect: (value: PossibleSelectValue) => void
  /**
   * onBlur event handler
   */
  onBlur?: FocusEventHandler<HTMLInputElement>
  /**
   * HTML name attribute for the input component
   */
  name?: string
  /**
   * The id of the search input
   */
  inputId?: string
  /**
   * When `true` the dropdown menu is always open
   */
  menuIsOpen?: boolean
  /**
   * Message to display when no options are found
   */
  noOptionsMessage?: string
  /**
   * CSS class name
   */
  className?: string
  /**
   * Optional text to display at the bottom of the dropdown menu
   */
  menuFooterText?: string
  /**
   * Debounce time in milliseconds for async search.
   * It only works when `loadAsyncValues` is provided
   */
  debounceMs?: number
  /**
   * Allows to create new options on the fly when no option is found.
   * It does not work with `loadAsyncValues`.
   */
  isCreatable?: boolean

  /**
   * When `true` the async select will show a text input instead of a select input.
   * This is useful for cases where you want to allow freeform text input in addition to selecting from the dropdown.
   *
   * **This option is only available when `loadAsyncValues` is provided.**
   */
  asTextSearch?: boolean
  /**
   * Hide the chevron on the right of the control.
   *
   * For a field that is a text entry first and a picker second — an email you may be
   * typing for the first time — where the chevron promises a list of choices the
   * value does not have to come from. The menu still opens on focus and on typing.
   */
  hideDropdownIndicator?: boolean
  /**
   * Whether the menu should use a portal, and where it should attach to.
   */
  menuPortalTarget?: HTMLElement | null
  /**
   * Which side of the control the menu opens on.
   *
   * `auto` — the default here, unlike react-select's own `bottom` — flips the menu
   * above the control when there is not enough room below it. That matters inside
   * a scrolling container such as a details drawer: a menu opening downwards past
   * the bottom extends the container's scroll height, and react-select then
   * scrolls it into view, so the whole panel jumps under the pointer.
   */
  menuPlacement?: MenuPlacement
}

/**
 * Loads the options matching what has been typed, all in one go.
 */
export type LoadAsyncValues = (
  inputValue: string,
) => Promise<GroupedSelectValues | InputSelectValue[]>

/**
 * Loads one page of the options matching what has been typed.
 *
 * `hasMore` is what stops the paging: while it is `true` the menu asks for the
 * page after the current one as it is scrolled to the bottom.
 */
export type LoadAsyncValuesPaginated = (
  inputValue: string,
  meta: { page: number },
) => Promise<{ options: InputSelectValue[]; hasMore: boolean }>

/**
 * How the options are loaded, which also decides which select is mounted.
 *
 * The two are kept apart rather than folded into one optional flag so that
 * turning `infiniteScroll` on makes the paginated loader mandatory — a loader
 * that ignores the page it is handed would silently return the first page
 * forever.
 */
export type InputSelectAsyncProps =
  | {
      /**
       * Load the next page of options as the menu is scrolled, so that a list
       * longer than one page can be browsed instead of only searched.
       *
       * Opt-in: without it the select keeps loading options the way it always
       * has, one non-paginated request per search.
       */
      infiniteScroll?: false
      /**
       * Function to load async values on search
       */
      loadAsyncValues?: LoadAsyncValues
    }
  | {
      infiniteScroll: true
      /**
       * Function to load one page of async values. Called again with the next
       * page as the menu is scrolled to the bottom.
       */
      loadAsyncValues: LoadAsyncValuesPaginated
    }

export type InputSelectProps = InputSelectBaseProps & InputSelectAsyncProps

/**
 * Advanced select component with support for async options loading and multi-select.
 * It's a wrapper around `react-select` with a subset of props exposed.
 *
 * To enable async data fetching for loading options while typing, provide the `loadAsyncValues` prop.
 * This function will be used to fetch new options while typing and the results will be displayed in the options menu.
 *
 * When `isSearchable` is `true`, it's possible to type to narrow down the options. The component will always be searchable when `loadAsyncValues` is provided.
 * On both standard and async mode it can be set to select a single single value or multiple values.
 *
 */
export const InputSelect = forwardRef<
  SelectInstance<InputSelectValue, boolean, GroupBase<InputSelectValue>>,
  InputSelectProps
>(
  (
    {
      label,
      hint,
      feedback,
      menuIsOpen,
      initialValues,
      defaultValue,
      value,
      isClearable,
      isLoading,
      loadingText = t("common.loading"),
      placeholder,
      size = "regular",
      isDisabled,
      isOptionDisabled,
      isSearchable,
      onSelect,
      isMulti,
      onBlur,
      name,
      className,
      loadAsyncValues,
      infiniteScroll,
      debounceMs,
      noOptionsMessage = t("common.no_results_found"),
      menuFooterText,
      isCreatable,
      asTextSearch,
      hideDropdownIndicator,
      menuPortalTarget,
      menuPlacement = "auto",
      ...rest
    },
    ref,
  ) => {
    const commonProps:
      | GenericAsyncSelectComponentProps
      | CreatableComponentProps
      | SelectComponentProps = {
      menuIsOpen,
      initialValues,
      defaultValue,
      value,
      isClearable,
      placeholder: isLoading === true ? loadingText : placeholder,
      isDisabled: isLoading === true || isDisabled === true,
      onSelect,
      isMulti,
      isOptionDisabled,
      onBlur,
      name,
      styles: getSelectStyles(feedback?.variant, size),
      menuFooterText,
      menuPlacement,
    }

    return (
      <InputWrapper
        className={className}
        label={label}
        hint={hint}
        feedback={feedback}
        name={name}
        {...rest}
      >
        {loadAsyncValues != null && infiniteScroll === true ? (
          <AsyncPaginateSelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            loadAsyncValues={loadAsyncValues as LoadAsyncValuesPaginated}
            hideDropdownIndicator={hideDropdownIndicator}
            menuPortalTarget={menuPortalTarget}
            debounceMs={debounceMs}
            noOptionsMessage={noOptionsMessage}
            isSearchable={isSearchable}
          />
        ) : loadAsyncValues != null && isCreatable === true ? (
          <AsyncCreatableSelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            loadAsyncValues={loadAsyncValues as LoadAsyncValues}
            asTextSearch={asTextSearch}
            hideDropdownIndicator={hideDropdownIndicator}
            menuPortalTarget={menuPortalTarget}
            debounceMs={debounceMs}
            noOptionsMessage={noOptionsMessage}
          />
        ) : loadAsyncValues != null ? (
          <AsyncSelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            loadAsyncValues={loadAsyncValues as LoadAsyncValues}
            asTextSearch={asTextSearch}
            hideDropdownIndicator={hideDropdownIndicator}
            menuPortalTarget={menuPortalTarget}
            debounceMs={debounceMs}
            noOptionsMessage={noOptionsMessage}
          />
        ) : isCreatable === true ? (
          <CreatableComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            isSearchable={isSearchable}
            menuPortalTarget={menuPortalTarget}
          />
        ) : (
          <SelectComponent
            {...commonProps}
            ref={ref}
            inputId={name}
            isSearchable={isSearchable}
            menuPortalTarget={menuPortalTarget}
          />
        )}
      </InputWrapper>
    )
  },
)

InputSelect.displayName = "InputSelect"
