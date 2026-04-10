import type { QueryFilter } from "@commercelayer/sdk"
import type { ValueOf } from "type-fest"
import type { InputCurrencyRangeProps } from "#ui/forms/InputCurrencyRange"
import type { InputResourceGroupProps } from "#ui/forms/InputResourceGroup"

export const filterableTimeRangePreset = [
  "today",
  "last7days",
  "last30days",
  "custom",
] as const

export type UiFilterName = string
export type UiFilterValue = string | string[] | boolean | Date | undefined

export type TimeRangePreset = (typeof filterableTimeRangePreset)[number]

export interface TimeRangeFormValues {
  timePreset?: TimeRangePreset | null
  timeFrom?: Date | null
  timeTo?: Date | null
}

type CurrencyRangeSdkPredicate = string // example: 'total_amount_cents'
export interface CurrencyRangeFieldValue {
  from?: number | null
  to?: number | null
  currencyCode?: string | null
}
export type CurrencyRangeFormValues = Record<
  CurrencyRangeSdkPredicate,
  CurrencyRangeFieldValue
>

export interface PageInfoFormValues {
  viewTitle?: string
}

export type FormFullValues = Record<
  UiFilterName,
  UiFilterValue | CurrencyRangeFieldValue
> &
  TimeRangeFormValues &
  PageInfoFormValues

/**
 * The SDK predicate to use in the query for a text search filter. It can be:
 * - A static string (e.g. `name_cont`) — used as both the form field name and the SDK query key.
 * - A function `(value: unknown) => string` that receives the current input value and returns
 *   the SDK predicate dynamically. When using a function, `fieldKey` must also be provided.
 */
export type SdkPredicate = string | ((value: unknown) => string)

/**
 * Returns the stable form field name / URL query param key for a text search sdk config.
 * - When `predicate` is a string, returns `predicate`.
 * - When `predicate` is a function, returns `fieldKey`.
 */
export function getFieldKey(sdk: {
  predicate: SdkPredicate
  fieldKey?: string
}): string {
  return typeof sdk.predicate === "string"
    ? sdk.predicate
    : (sdk.fieldKey as string)
}

/**
 * Resolves the SDK predicate key to use in a query.
 * - When `predicate` is a string, returns it directly.
 * - When `predicate` is a function, calls it with `value` and returns the result.
 */
export function resolvePredicate(
  predicate: SdkPredicate,
  value: unknown,
): string {
  return typeof predicate === "function" ? predicate(value) : predicate
}

export interface BaseFilterItem {
  /**
   * Label of the filter field in form component
   */
  label: string
  /**
   * Flag to hide the filter field in form component
   */
  hidden?: boolean
  /**
   * Instruction to use this item to build the sdk query
   */
  sdk: {
    /**
     * SDK predicate to use in the query (example: `status_in` or `name_cont`)
     */
    predicate: string
    /**
     * Set the default options to use in the query when this filter is not selected.
     * Example, you have no `status_in` selected in UI, but if this option is `['placed', 'approved']`, the query will always contain
     * a `status_in` predicate with `placed` and `approved` statuses. This helps to avoid getting status we never want to see (eg: 'draft')
     */
    defaultOptions?: string[]
    /**
     * Custom function to transform the form value to the SDK value
     */
    parseFormValue?: (value: unknown) => ValueOf<QueryFilter> | undefined
  }
}

export type FilterItemOptions = BaseFilterItem & {
  type: "options"
  render:
    | {
        /**
         * UI component to render
         */
        component: "inputToggleButton"
        /**
         * props required for the UI component
         */
        props: {
          mode: "multi" | "single"
          /**
           * an option can be hidden from the UI but still be used in the query
           * Example: we wont show the button to filter `pending` status in the UI, but we still want to accept it for a predefined list)
           */
          options: Array<{ label: string; value: string; isHidden?: boolean }>
        }
      }
    | {
        /**
         * UI component to render
         */
        component: "inputResourceGroup"
        /**
         * props required for the UI component
         */
        props: Omit<
          InputResourceGroupProps,
          "onChange" | "defaultValues" | "title"
        >
      }
}

export interface FilterItemTextSearch extends Omit<BaseFilterItem, "sdk"> {
  type: "textSearch"
  render: {
    /**
     * UI component to render.
     *
     * ⚠️ You can have only one `searchBar` component.
     */
    component: "searchBar" | "input"
  }
  sdk: {
    /**
     * Custom function to transform the form value to the SDK value
     */
    parseFormValue?: (value: unknown) => ValueOf<QueryFilter> | undefined
  } & (
    | {
        /**
         * SDK predicate to use in the query (example: `name_cont` or `email_start`).
         * Can also be a function `(value: unknown) => string` that dynamically computes the
         * predicate based on the current input value (e.g. to switch between predicates depending
         * on what the user typed). When using a function, `fieldKey` must also be provided to
         * identify the form field name and URL query param key.
         */
        predicate: string
        fieldKey?: never
      }
    | {
        predicate: (value: unknown) => string
        /**
         * The form field name and URL query param key for this filter item.
         * Required when `predicate` is a function; ignored when `predicate` is a string
         * (in that case the predicate string itself is used as the field key).
         */
        fieldKey: string
      }
  )
}

export interface FilterItemTime extends Omit<BaseFilterItem, "sdk"> {
  type: "timeRange"
  sdk: {
    /**
     * SDK predicate to use in the query (example: `updated_at` or `updated_at`).
     * Don't use `_gteq` or `_lteq` suffixes, they will be generated by the filter method based on the following key
     * Example given the key `updated_at`, the generated predicate will be `updated_at_gteq` or `updated_at_lteq` depending on the preset
     */
    predicate: string
  }
  render: {
    component: "dateRangePicker"
  }
}

export interface FilterItemCurrencyRange extends Omit<BaseFilterItem, "sdk"> {
  type: "currencyRange"
  sdk: {
    /**
     * SDK predicate to use in the query (example: `total_amount_cents` or `subtotal_amount_cents`).
     * Don't use `_gteq` or `_lteq` suffixes, they will be generated by the filter method based on the following key
     * Example given the key `total_amount_cents`, the generated predicate will be `total_amount_cents_gteq` or `total_amount_cents_lteq`
     * It will also add the `currency_code_eq` predicate
     */
    predicate: string
  }
  render: {
    component: "inputCurrencyRange"
    props: Omit<
      InputCurrencyRangeProps,
      "onChange" | "fromCents" | "toCents" | "defaultCurrency" | "currencyList"
    >
  }
}

export type FiltersInstructionItem =
  | FilterItemOptions
  | FilterItemTextSearch
  | FilterItemTime
  | FilterItemCurrencyRange

export type FiltersInstructions = FiltersInstructionItem[]

export function isItemOptions(
  item: FiltersInstructionItem,
): item is FilterItemOptions {
  return item.type === "options"
}

export function isTextSearch(
  item: FiltersInstructionItem,
): item is FilterItemTextSearch {
  return item.type === "textSearch"
}

export function isCurrencyRange(
  item: FiltersInstructionItem,
): item is FilterItemCurrencyRange {
  return item.type === "currencyRange"
}
