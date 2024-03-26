import {
  getLastYearIsoRange,
  removeMillisecondsFromIsoDate
} from '#helpers/date'
import { type FiltersInstructions } from '#ui/resources/useResourceFilters/types'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import pluralize from 'pluralize'

export type CoreResourceEnabledInMetrics = 'orders' | 'returns'
type MetricsResource = 'order' | 'return'

const metricsResourceMapping: Record<
  CoreResourceEnabledInMetrics,
  MetricsResource
> = {
  orders: 'order',
  returns: 'return'
}

// Relationships that are not part of the main resource, but are part of the filters
const relationships = ['market', 'tags', 'billing_address', 'shipping_address']

/** Record of core api filter operators with relative metrics operator */
const metricsFiltersMapping = {
  _eq: 'eq',
  _not_eq: 'ne',
  _lt: 'lt',
  _lteq: 'lte',
  _gt: 'gt',
  _gteq: 'gte',
  _in: 'in',
  _not_in: 'not_in'
} as const

type CoreFilterOperator = keyof typeof metricsFiltersMapping
type MetricsFilterOperator = (typeof metricsFiltersMapping)[CoreFilterOperator]
type MetricsAttribute = string

export type MetricsFilters = Partial<
  Record<
    MetricsResource,
    Record<
      MetricsAttribute,
      Partial<Record<MetricsFilterOperator, string | string[] | boolean>>
    > & {
      date_from: string
      date_to: string
      date_field: string
    }
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
    /** main resource filters */
    main: QueryFilter
    /** relationships filters */
    rel: QueryFilter
    /** value to be used to build the `aggregated_details` filter predicate (free text search) */
    aggregatedDetails?: string
    /** date range filter */
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
      if (key.startsWith(defaultDatePredicate)) {
        const dateField = `${key.split('_at_')[0]}_at`
        const dateFrom =
          sdkFilters[`${dateField}_gteq`] ?? sdkFilters[`${dateField}_gt`]
        const dateTo =
          sdkFilters[`${dateField}_lteq`] ??
          sdkFilters[`${dateField}_lt`] ??
          new Date().toJSON() // we can accept a partial date range when ony the from is set (eg: 7 days ago to now)

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
            field: dateField
          }
        }
      }

      if (key === 'aggregated_details' && typeof value === 'string') {
        return {
          ...acc,
          aggregatedDetails: value
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
      if (coreOperator == null) {
        return metricsRelFilters
      }

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
    regroupedFilters.aggregatedDetails != null
      ? {
          aggregated_details: {
            query: regroupedFilters.aggregatedDetails
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

function getCoreOperator(
  coreSdkFilterPredicate: string
): CoreFilterOperator | undefined {
  const coreFiltersOperators = Object.keys(metricsFiltersMapping)
  const regexp = new RegExp(`(?<matcher>${coreFiltersOperators.join('|')})$`)
  const matcher = coreSdkFilterPredicate.match(regexp)?.groups?.matcher as
    | CoreFilterOperator
    | undefined
  return matcher
}

function isValidResourceForMetrics(
  resourceType: ListableResourceType
): resourceType is CoreResourceEnabledInMetrics {
  return Object.keys(metricsResourceMapping).includes(
    resourceType as CoreResourceEnabledInMetrics
  )
}
