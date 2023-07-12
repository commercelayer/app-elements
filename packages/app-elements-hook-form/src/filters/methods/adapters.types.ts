import { type FormFullValues } from '#filters/methods/types'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import { type AdaptFormValuesToSdkParams } from './adaptFormValuesToSdk'
import { type AdaptFormValuesToUrlQueryParams } from './adaptFormValuesToUrlQuery'
import { type AdaptUrlQueryToFormValuesParams } from './adaptUrlQueryToFormValues'
import { type AdaptUrlQueryToSdkParams } from './adaptUrlQueryToSdk'
import { type AdaptUrlQueryToUrlQueryParams } from './adaptUrlQueryToUrlQuery'
import {
  type FiltersInstructions,
  type PageInfoFormValues,
  type TimeRangeFormValues,
  type UiFilterName,
  type UiFilterValue
} from './types'

interface MakeFilterAdaptersParams {
  instructions: FiltersInstructions
}

interface MakeFilterAdaptersReturn<FilterFormValues extends FormFullValues> {
  adaptFormValuesToUrlQuery: (
    params: Pick<AdaptFormValuesToUrlQueryParams<FormFullValues>, 'formValues'>
  ) => string

  adaptFormValuesToSdk: (
    params: Pick<
      AdaptFormValuesToSdkParams<FilterFormValues>,
      'formValues' | 'timezone'
    >
  ) => QueryFilter

  adaptUrlQueryToFormValues: (
    params: Pick<AdaptUrlQueryToFormValuesParams, 'queryString'>
  ) => FilterFormValues & TimeRangeFormValues & PageInfoFormValues

  adaptUrlQueryToSdk: (
    params: Pick<AdaptUrlQueryToSdkParams, 'queryString' | 'timezone'>
  ) => QueryFilter

  adaptUrlQueryToUrlQuery: (
    params: Pick<AdaptUrlQueryToUrlQueryParams, 'queryString'>
  ) => string

  validInstructions: FiltersInstructions
}

export type MakeFiltersAdapters = <
  FilterFormValues extends Record<UiFilterName, UiFilterValue>
>({
  instructions
}: MakeFilterAdaptersParams) => MakeFilterAdaptersReturn<FilterFormValues>
