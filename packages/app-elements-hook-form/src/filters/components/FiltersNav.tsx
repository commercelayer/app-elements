import { makeFilterAdapters } from '#filters/methods/adapters'
import {
  getTimeRangeCustomLabel,
  getTimeRangePresetName,
  isTimeRangeFilterUiName
} from '#filters/methods/timeUtils'
import {
  isItemOptions,
  isTextSearch,
  type FiltersInstructionItem,
  type FiltersInstructions,
  type FormFullValues,
  type UiFilterName,
  type UiFilterValue
} from '#filters/methods/types'
import { getActiveFilterCountFromUrl } from '#filters/methods/utils'
import {
  ButtonFilter,
  SkeletonTemplate,
  useCoreApi,
  useTokenProvider
} from '@commercelayer/app-elements'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { castArray, isDate, isEmpty } from 'lodash'
import { useCallback, useMemo } from 'react'

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

  // remove time range filters
  const userDefinedFilters = useMemo(
    () =>
      activeFilters.filter(
        ([filterPredicate]) => !isTimeRangeFilterUiName(filterPredicate)
      ) as Array<[string, string | string[]]>,
    [activeFilters]
  )

  // getting time range filters separately from main filters object
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
          icon='funnel'
          onClick={() => {
            onLabelClickHandler()
          }}
          onRemoveRequest={removeAllFilters}
        />
      ) : (
        <ButtonFilter
          label='Filters'
          icon='funnel'
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

        if (instructionItem == null || instructionItem.type === 'textSearch') {
          return null
        }

        if (
          instructionItem.render.component === 'relationshipSelector' &&
          castArray(value).length === 1
        ) {
          return (
            <ButtonFilterFetchResource
              key={filterPredicate}
              id={castArray(value)[0]}
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
          label={getTimeRangeCustomLabel(
            selectedTimeFrom,
            selectedTimeTo,
            user?.timezone
          )}
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
 * Render the button for relationshipSelector when there's one value.
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
  if (
    isItemOptions(instructionItem) &&
    'options' in instructionItem.render.props &&
    instructionItem.render.props.options != null &&
    instructionItem.render.props.options.length > 0 &&
    values.length === 1
  ) {
    return (
      instructionItem.render.props.options.find(
        ({ value }) => value === values[0]
      )?.label ?? instructionItem.label
    )
  }

  return `${instructionItem.label} · ${values.length}`
}
