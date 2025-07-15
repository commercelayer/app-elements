import type { QueryFilter } from "@commercelayer/sdk"
import type { AdaptFormValuesToSdkParams } from "./adaptFormValuesToSdk"
import type { AdaptFormValuesToUrlQueryParams } from "./adaptFormValuesToUrlQuery"
import type {
  AdaptSdkToMetricsParams,
  MetricsFilters,
} from "./adaptSdkToMetrics"
import type { AdaptSdkToUrlQueryParams } from "./adaptSdkToUrlQuery"
import type { AdaptUrlQueryToFormValuesParams } from "./adaptUrlQueryToFormValues"
import type { AdaptUrlQueryToSdkParams } from "./adaptUrlQueryToSdk"
import type { AdaptUrlQueryToUrlQueryParams } from "./adaptUrlQueryToUrlQuery"
import type {
  FiltersInstructions,
  FormFullValues,
  PageInfoFormValues,
  TimeRangeFormValues,
  UiFilterName,
  UiFilterValue,
} from "./types"

interface MakeFilterAdaptersParams {
  instructions: FiltersInstructions
  predicateWhitelist: string[]
}

interface MakeFilterAdaptersReturn<FilterFormValues extends FormFullValues> {
  adaptFormValuesToUrlQuery: (
    params: Pick<AdaptFormValuesToUrlQueryParams<FormFullValues>, "formValues">,
  ) => string

  adaptFormValuesToSdk: (
    params: Pick<
      AdaptFormValuesToSdkParams<FilterFormValues>,
      "formValues" | "timezone"
    >,
  ) => QueryFilter

  adaptUrlQueryToFormValues: (
    params: Pick<AdaptUrlQueryToFormValuesParams, "queryString">,
  ) => FilterFormValues & TimeRangeFormValues & PageInfoFormValues

  adaptUrlQueryToSdk: (
    params: Pick<AdaptUrlQueryToSdkParams, "queryString" | "timezone">,
  ) => QueryFilter

  adaptUrlQueryToUrlQuery: (
    params: Pick<AdaptUrlQueryToUrlQueryParams, "queryString">,
  ) => string

  adaptSdkToMetrics: (
    params: Pick<AdaptSdkToMetricsParams, "sdkFilters" | "resourceType">,
  ) => MetricsFilters

  adaptSdkToUrlQuery: (
    params: Pick<AdaptSdkToUrlQueryParams, "sdkFilters">,
  ) => string

  validInstructions: FiltersInstructions
}

export type MakeFiltersAdapters = <
  FilterFormValues extends Record<UiFilterName, UiFilterValue>,
>({
  instructions,
  predicateWhitelist,
}: MakeFilterAdaptersParams) => MakeFilterAdaptersReturn<FilterFormValues>
