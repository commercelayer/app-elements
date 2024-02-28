import { formatDateRange } from '#helpers/date'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { ButtonFilter } from '#ui/atoms/ButtonFilter'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  formatCentsToCurrency,
  type InputCurrencyProps
} from '#ui/forms/InputCurrency'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import castArray from 'lodash/castArray'
import isDate from 'lodash/isDate'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useMemo } from 'react'
import { makeFilterAdapters } from './adapters'
import {
  getDefaultBrowserTimezone,
  getTimeRangePresetName,
  isTimeRangeFilterUiName
} from './timeUtils'
import {
  isTextSearch,
  type CurrencyRangeFieldValue,
  type FiltersInstructionItem,
  type FiltersInstructions,
  type FormFullValues,
  type UiFilterName,
  type UiFilterValue
} from './types'
import { getActiveFilterCountFromUrl } from './utils'

export interface FiltersNavProps {
  /**
   * Array of instruction items to build the filters behaviors
   */
  instructions: FiltersInstructions
  /**
   * Url query string to be parsed.
   * It must be "reactive", so most of the time it should come for router.
   */
  queryString: string
  /**
   * Callback function triggered when user interacts with the filters buttons.
   * Implemented function should update the url query string / search params,
   * based on the new queryString received as argument.
   */
  onUpdate: (newQueryString: string) => void
  /**
   * Callback function triggered when user clicks on the "Edit filters" button.
   * Implemented function should open the filters form.
   */
  onFilterClick: (queryString: string, filterPredicate?: string) => void
}

export function FiltersNav({
  instructions,
  onFilterClick: onBtnLabelClick,
  onUpdate,
  queryString
}: FiltersNavProps): JSX.Element {
  const { user } = useTokenProvider()

  const {
    adaptUrlQueryToFormValues,
    adaptFormValuesToUrlQuery,
    adaptUrlQueryToUrlQuery
  } = makeFilterAdapters({
    instructions
  })

  const filters = useMemo(
    () =>
      adaptUrlQueryToFormValues({
        queryString
      }),
    [queryString]
  )

  const activeGroupCount = useMemo(
    () =>
      getActiveFilterCountFromUrl({
        includeTextSearch: false,
        instructions,
        queryString
      }),
    [instructions, queryString]
  )

  const updateQueryString = useCallback(
    (queryString: string): void => {
      onUpdate(queryString)
    },
    [onUpdate]
  )

  const removeSingleFilterGroup = useCallback(
    (filterPredicate: string): void => {
      updateQueryString(
        adaptFormValuesToUrlQuery({
          formValues: {
            ...filters,
            [filterPredicate]: []
          }
        })
      )
    },
    [filters]
  )

  const removeTimeRangeFilter = useCallback((): void => {
    updateQueryString(
      adaptFormValuesToUrlQuery({
        formValues: {
          ...filters,
          timePreset: undefined,
          timeFrom: undefined,
          timeTo: undefined
        }
      })
    )
  }, [filters])

  const hiddenFilters = useMemo(
    () =>
      instructions
        .filter((item) => item.hidden === true)
        .map((item) => item.sdk.predicate),
    [instructions]
  )

  const removeAllFilters = useCallback((): void => {
    const emptyFilters = adaptUrlQueryToFormValues({ queryString: '' })

    const currentFilters = adaptUrlQueryToFormValues({
      queryString
    })
    // we need to keep all filters hidden in UI, the viewTitle and the text filter
    const filtersToKeep = Object.entries(currentFilters).reduce<FormFullValues>(
      (toKeep, [filterName, value]) => {
        const textPredicate = instructions.find(isTextSearch)?.sdk.predicate

        const isToKeep =
          hiddenFilters.includes(filterName) ||
          filterName === 'viewTitle' ||
          filterName === textPredicate

        if (isToKeep) {
          return {
            ...toKeep,
            [filterName]: value
          }
        }
        return toKeep
      },
      {}
    )

    updateQueryString(
      adaptFormValuesToUrlQuery({
        formValues: {
          ...emptyFilters,
          ...filtersToKeep
        }
      })
    )
  }, [queryString, instructions, hiddenFilters])

  const onLabelClickHandler = useCallback(
    (filterPredicate?: string): void => {
      onBtnLabelClick(
        adaptUrlQueryToUrlQuery({
          queryString
        }),
        filterPredicate
      )
    },
    [queryString]
  )

  const activeFilters: Array<[UiFilterName, UiFilterValue]> = useMemo(
    () =>
      Object.entries(filters)
        .filter(([, value]) => isDate(value) || !isEmpty(value))
        .filter(([filterName]) => !hiddenFilters.includes(filterName))
        .filter(([filterName]) => filterName !== 'viewTitle'),
    [filters]
  )

  // remove special filters that have custom UI logics
  // such as time range and currency range
  const userDefinedFilters = useMemo(
    () =>
      activeFilters.filter(
        ([filterPredicate]) =>
          !isTimeRangeFilterUiName(filterPredicate) &&
          !predicateBelongsToCurrencyRange({
            filterPredicate,
            instructions
          })
      ) as Array<[string, string | string[]]>,
    [activeFilters]
  )

  // getting currency range filters separately
  const currencyRangeFilters = useMemo(
    () => extractCurrencyRangeFilterValues({ activeFilters, instructions }),
    [activeFilters]
  )

  // getting time range filters separately
  const selectedTimePreset = filters?.timePreset
  const selectedTimeFrom = filters?.timeFrom
  const selectedTimeTo = filters?.timeTo

  if (filters == null) {
    return <></>
  }

  return (
    <div className='flex gap-2 flex-wrap'>
      {/* Main filter button */}
      {activeGroupCount > 0 ? (
        <ButtonFilter
          label={`Filters · ${activeGroupCount}`}
          icon='funnelSimple'
          onClick={() => {
            onLabelClickHandler()
          }}
          onRemoveRequest={removeAllFilters}
        />
      ) : (
        <ButtonFilter
          label='Filters'
          icon='funnelSimple'
          onClick={() => {
            onLabelClickHandler()
          }}
        />
      )}

      {userDefinedFilters.map(([filterPredicate, value]) => {
        const instructionItem = getInstructionItemByFilterPredicate({
          instructions,
          filterPredicate
        })

        if (
          instructionItem == null ||
          (instructionItem.type === 'textSearch' &&
            instructionItem.render.component === 'searchBar')
        ) {
          return null
        }

        const arrValue = castArray(value)

        if (
          instructionItem.render.component === 'inputResourceGroup' &&
          arrValue[0] !== undefined &&
          arrValue.length === 1
        ) {
          return (
            <ButtonFilterFetchResource
              key={filterPredicate}
              id={arrValue[0]}
              resource={instructionItem.render.props.resource}
              fieldForLabel={instructionItem.render.props.fieldForLabel}
              onClick={() => {
                onLabelClickHandler(filterPredicate)
              }}
              onRemoveRequest={() => {
                removeSingleFilterGroup(filterPredicate)
              }}
            />
          )
        }

        return (
          <ButtonFilter
            key={filterPredicate}
            label={getButtonFilterLabel({
              values: value,
              instructionItem
            })}
            onClick={() => {
              onLabelClickHandler(filterPredicate)
            }}
            onRemoveRequest={() => {
              removeSingleFilterGroup(filterPredicate)
            }}
          />
        )
      })}

      {/* Currency Range */}
      {currencyRangeFilters.map(([filterPredicate, currencyRangeValue]) => {
        return (
          <ButtonFilter
            key={filterPredicate}
            onClick={() => {
              onLabelClickHandler('timePreset')
            }}
            onRemoveRequest={() => {
              removeSingleFilterGroup(filterPredicate)
            }}
            label={makeCurrencyRangeFilterButtonLabel(currencyRangeValue)}
          />
        )
      })}

      {/* Time range preset */}
      {selectedTimePreset != null && selectedTimePreset !== 'custom' ? (
        <ButtonFilter
          label={getTimeRangePresetName(selectedTimePreset)}
          onClick={() => {
            onLabelClickHandler('timePreset')
          }}
          onRemoveRequest={removeTimeRangeFilter}
        />
      ) : null}

      {/* Time range custom */}
      {selectedTimePreset === 'custom' &&
      selectedTimeTo != null &&
      selectedTimeFrom != null ? (
        <ButtonFilter
          label={formatDateRange({
            rangeFrom: selectedTimeFrom.toString(),
            rangeTo: selectedTimeTo.toString(),
            timezone: user?.timezone ?? getDefaultBrowserTimezone()
          })}
          onClick={() => {
            onLabelClickHandler('timePreset')
          }}
          onRemoveRequest={removeTimeRangeFilter}
        />
      ) : null}
    </div>
  )
}

function getInstructionItemByFilterPredicate({
  instructions,
  filterPredicate
}: {
  instructions: FiltersInstructions
  filterPredicate: string
}): FiltersInstructionItem | undefined {
  if (isTimeRangeFilterUiName(filterPredicate)) {
    return instructions.find(({ type }) => type === 'timeRange')
  }
  return instructions.find((item) => item.sdk.predicate === filterPredicate)
}

/**
 * Render the button for InputResourceGroup when there's one value.
 * It fetches the resource to get the label.
 */
function ButtonFilterFetchResource({
  resource,
  id,
  fieldForLabel,
  onClick,
  onRemoveRequest
}: {
  resource: ListableResourceType
  id: string
  fieldForLabel: string
  onClick?: () => void
  onRemoveRequest?: () => void
}): JSX.Element {
  const { data, isLoading } = useCoreApi(resource, 'retrieve', [
    id,
    {
      fields: [fieldForLabel]
    }
  ])

  const label =
    data != null
      ? fieldForLabel in data && data[fieldForLabel as keyof typeof data]
      : undefined

  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      <ButtonFilter
        label={typeof label === 'string' ? label : id}
        onClick={onClick}
        onRemoveRequest={onRemoveRequest}
      />
    </SkeletonTemplate>
  )
}

/**
 * Get label for user defined ButtonFilter component by reading the `instructionItem` object.
 * If the filter has options and only one value is selected, the label will be the option label.
 * Otherwise, the label will be the filter group label plus the number of selected values.
 */
function getButtonFilterLabel({
  values,
  instructionItem
}: {
  values: string | string[]
  instructionItem: FiltersInstructionItem
}): string {
  const isSingleElementArray = Array.isArray(values) && values.length === 1
  const isString = typeof values === 'string'
  const optionValue = Array.isArray(values) ? values[0] : values

  if (
    instructionItem.type === 'options' &&
    'options' in instructionItem.render.props &&
    instructionItem.render.props.options != null &&
    instructionItem.render.props.options.length > 0 &&
    (isSingleElementArray || isString)
  ) {
    return (
      instructionItem.render.props.options.find(
        ({ value }) => value === optionValue
      )?.label ?? instructionItem.label
    )
  }

  if (instructionItem.type === 'textSearch') {
    return `${instructionItem.label} · ${optionValue}`
  }

  return `${instructionItem.label} · ${values.length}`
}

function extractCurrencyRangeFilterValues({
  activeFilters,
  instructions
}: {
  activeFilters: Array<[string, UiFilterValue]>
  instructions: FiltersInstructions
}): Array<[string, CurrencyRangeFieldValue]> {
  const rangeFilters = activeFilters.filter(([filterPredicate]) => {
    return predicateBelongsToCurrencyRange({
      filterPredicate,
      instructions
    })
  }) as Array<[string, CurrencyRangeFieldValue]>

  return rangeFilters.filter(
    ([, value]) => value.from != null || value.to != null
  )
}

/**
 * Checks if a filter predicate belongs to a currency range filter
 * by checking the instructions
 */
function predicateBelongsToCurrencyRange({
  filterPredicate,
  instructions
}: {
  filterPredicate: string
  instructions: FiltersInstructions
}): boolean {
  const instructionItem = instructions.find(
    (item) => item.sdk.predicate === filterPredicate
  )

  return instructionItem?.type === 'currencyRange'
}

function makeCurrencyRangeFilterButtonLabel(
  value: CurrencyRangeFieldValue
): string {
  const currencyCode = value.currencyCode as InputCurrencyProps['currencyCode']
  if (value.from == null && value.to == null) {
    return ''
  }

  const formattedFrom = formatCentsToCurrency(
    value.from ?? 0,
    currencyCode,
    true
  )

  const formattedTo =
    value.to != null
      ? formatCentsToCurrency(value.to, currencyCode, true)
      : 'Max'

  return `${formattedFrom} - ${formattedTo}`
}
