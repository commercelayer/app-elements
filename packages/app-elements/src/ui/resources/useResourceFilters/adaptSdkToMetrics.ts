import {
  getLastYearIsoRange,
  removeMillisecondsFromIsoDate
} from '#helpers/date'
import { type FiltersInstructions } from '#ui/resources/useResourceFilters/types'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import pluralize from 'pluralize'

export type CoreResourceEnabledInMetrics = 'orders' | 'returns'
type MetricResource = 'order' | 'return'

const coreFiltersOperators = [
  '_eq',
  '_not_eq',
  '_lt',
  '_lteq',
  '_gt',
  '_gteq',
  '_in',
  '_not_in'
] as const
type CoreFilterOperator = (typeof coreFiltersOperators)[number]

const metricsFiltersOperators = [
  'in',
  'not_in',
  'eq',
  'ne',
  'gt',
  'gte',
  'lt',
  'lte'
] as const

const metricsResourceMapping: Record<
  CoreResourceEnabledInMetrics,
  MetricResource
> = {
  orders: 'order',
  returns: 'return'
}
const coreResourceEnabledInMetrics = Object.keys(
  metricsResourceMapping
) as CoreResourceEnabledInMetrics[]

// Relationships that are not part of the main resource, but are part of the filters
const relationships = ['market', 'tags', 'billing_address', 'shipping_address']

const metricsFiltersMapping: Record<
  CoreFilterOperator,
  (typeof metricsFiltersOperators)[number]
> = {
  _eq: 'eq',
  _not_eq: 'ne',
  _lt: 'lt',
  _lteq: 'lte',
  _gt: 'gt',
  _gteq: 'gte',
  _in: 'in',
  _not_in: 'not_in'
}

type MetricsAttribute = string
type MetricsOperator = (typeof metricsFiltersOperators)[number]
export type MetricsFilters = Partial<
  Record<
    MetricResource,
    Record<
      MetricsAttribute,
      Partial<Record<MetricsOperator | 'query', string | string[] | boolean>>
    >
  >
>

export interface AdaptSdkToMetricsParams {
  sdkFilters: QueryFilter
  resourceType: ListableResourceType
  instructions: FiltersInstructions
  predicateWhitelist?: string[]
}

export function adaptSdkToMetrics({
  sdkFilters,
  resourceType,
  instructions,
  predicateWhitelist = []
}: AdaptSdkToMetricsParams): MetricsFilters {
  if (!isValidResourceForMetrics(resourceType)) {
    console.warn(
      'The Resource you are listing is not enabled in Metrics API',
      resourceType
    )
    return {}
  }

  const mainResource = metricsResourceMapping[resourceType]
  const defaultDatePredicate =
    instructions.find((item) => item.type === 'timeRange')?.sdk.predicate ??
    'created_at'

  // separate relationships from main resource filters
  const regroupedFilters = Object.entries(sdkFilters).reduce<{
    main: QueryFilter
    rel: QueryFilter
    aggregatedSearch?: string
    date?: { from: string; to: string; field: string }
  }>(
    (acc, [key, value]) => {
      const instructionItem = instructions.find(
        (item) => item.sdk.predicate === key
      )

      if (
        instructionItem == null &&
        !predicateWhitelist.includes(key) &&
        !key.startsWith(defaultDatePredicate)
      ) {
        return acc
      }

      if (relationships.find((r) => key.startsWith(r)) != null) {
        return {
          ...acc,
          rel: {
            ...acc.rel,
            [key]: value
          }
        }
      }

      // Handle date range
      // only supporting one between `updated_at` and `created_at`,
      // if both are included we use the last one found
      // if (key.startsWith('updated_at') || key.startsWith('created_at')) {
      if (key.startsWith(defaultDatePredicate)) {
        const dateField = `${key.split('_at_')[0]}_at`
        const dateFrom =
          sdkFilters[`${dateField}_gteq`] ?? sdkFilters[`${dateField}_gt`]
        const dateTo =
          sdkFilters[`${dateField}_lteq`] ??
          sdkFilters[`${dateField}_lt`] ??
          new Date().toISOString() // we can accept a partial date range when ony the from is set (eg: 7 days ago to now)

        if (
          dateFrom == null ||
          dateTo == null ||
          typeof dateFrom !== 'string' ||
          typeof dateTo !== 'string'
        ) {
          // we don't have a valid date range
          return acc
        }

        return {
          ...acc,
          date: {
            from: removeMillisecondsFromIsoDate(dateFrom),
            to: removeMillisecondsFromIsoDate(dateTo),
            field: `${key.split('_at_')[0]}_at`
          }
        }
      }

      if (key === 'aggregated_details' && typeof value === 'string') {
        return {
          ...acc,
          aggregatedSearch: value
        }
      }

      return {
        ...acc,
        main: {
          ...acc.main,
          [key]: value
        }
      }
    },
    { main: {}, rel: {} }
  )

  const filterValueMainResource = Object.entries(regroupedFilters.main).reduce(
    (metricsFilters, [key, value]) => {
      const coreOperator = getCoreOperator(key)

      // special case for archived that has no operator
      if (key === 'archived' && value != null) {
        return {
          ...metricsFilters,
          archived: value
        }
      }

      if (coreOperator == null) {
        return metricsFilters
      }

      const coreAttribute = key.replace(coreOperator, '')
      const isPlural = key.endsWith('_in') && typeof value === 'string'
      const metricsAttribute = isPlural
        ? pluralizePredicate(coreAttribute)
        : coreAttribute

      const metricsOperator = metricsFiltersMapping[coreOperator]

      return {
        ...metricsFilters,
        [metricsAttribute]: {
          [metricsOperator]: isPlural ? value.split(',') : value
        }
      }
    },
    {}
  )

  const filterValueRelResource = Object.entries(regroupedFilters.rel).reduce(
    (metricsRelFilters, [key, value]) => {
      // key might be `billing_address_id_not_eq`
      const coreOperator = getCoreOperator(key) // _not_eq
      const coreResourceRelParts = key.replace(coreOperator, '').split('_') // ['billing', 'address', 'id']
      const coreAttribute = coreResourceRelParts.pop() // id
      const coreResourceRel = coreResourceRelParts.join('_') // billing_address

      if (coreAttribute == null) {
        return metricsRelFilters
      }

      const metricsOperator = metricsFiltersMapping[coreOperator]
      const isPlural = key.endsWith('_in') && typeof value === 'string'
      const metricsAttribute = isPlural
        ? pluralizePredicate(coreAttribute)
        : coreAttribute

      return {
        ...metricsRelFilters,
        [coreResourceRel]: {
          [metricsAttribute]: {
            [metricsOperator]: isPlural ? value.split(',') : value
          }
        }
      }
    },
    {}
  )

  const filterAggregatedDetails =
    regroupedFilters.aggregatedSearch != null
      ? {
          aggregated_details: {
            query: regroupedFilters.aggregatedSearch.includes('*')
              ? regroupedFilters.aggregatedSearch
              : `${regroupedFilters.aggregatedSearch}*`
          }
        }
      : {}

  const filterDate =
    regroupedFilters.date != null
      ? {
          date_from: regroupedFilters.date.from,
          date_to: regroupedFilters.date.to,
          date_field: regroupedFilters.date.field
        }
      : {
          // default date range for metrics, when no custom date range is set, is 1 year
          ...getLastYearIsoRange({
            now: new Date(),
            showMilliseconds: false
          }),
          date_field: defaultDatePredicate
        }

  return {
    [mainResource]: {
      ...filterValueMainResource,
      ...filterAggregatedDetails,
      ...filterDate
    },
    ...filterValueRelResource
  }
}

function pluralizePredicate(predicate: string): string {
  const parts = predicate.split('_')
  const last = parts.pop()

  if (last == null) {
    return predicate
  }
  return [...parts, pluralize(last)].join('_')
}

function getCoreOperator(coreSdkFilterPredicate: string): CoreFilterOperator {
  const enabledNotOperators = ['_not_in', '_not_eq']
  const coreOperator =
    enabledNotOperators.find((predicate) =>
      coreSdkFilterPredicate.endsWith(predicate)
    ) ??
    coreFiltersOperators.find((predicate) =>
      coreSdkFilterPredicate.endsWith(predicate)
    )

  return coreOperator as CoreFilterOperator
}

function isValidResourceForMetrics(
  resourceType: ListableResourceType
): resourceType is CoreResourceEnabledInMetrics {
  return coreResourceEnabledInMetrics.includes(
    resourceType as CoreResourceEnabledInMetrics
  )
}
