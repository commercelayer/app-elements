import { useOverlayNavigation } from '#hooks/useOverlayNavigation'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { Card } from '#ui/atoms/Card'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { type QueryParamsList } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import uniqBy from 'lodash/uniqBy'
import { useEffect, useState } from 'react'
import {
  Checkbox,
  prepareCheckboxItemOrMock,
  type CheckboxItem
} from './Checkbox'
import { FullList, type FullListProps, type SortBy } from './FullList'
import { computeLabelWithSelected, useToggleCheckboxValues } from './utils'

export interface RelationshipSelectorProps
  extends Omit<FullListProps, 'totalCount'> {
  /**
   * Number of item to be shown in the preview list
   * @default 5
   */
  previewLimit?: number
}

function RelationshipSelector({
  defaultValues,
  fieldForLabel,
  fieldForValue,
  previewLimit = 5,
  onChange,
  resource,
  searchBy,
  sortBy,
  title
}: RelationshipSelectorProps): JSX.Element {
  const { Overlay, close, open } = useOverlayNavigation({
    queryParam: `${resource}ViewAll`
  })

  const { values, toggleValue, setValues } =
    useToggleCheckboxValues(defaultValues)
  const selectedCount = values.length

  // keeping this separated from values to prevent firing api calls on every change
  // we re-run api request to get the list of selected values only when overlay is closed
  const [selectedValuesForPreviews, setSelectedValuesForPreview] =
    useState<string[]>(defaultValues)
  const { list, isLoading, totalCount } = useList({
    resource,
    limit: previewLimit,
    fieldForValue,
    fieldForLabel,
    sortBy,
    selectedValues: selectedValuesForPreviews.slice(0, previewLimit)
  })

  useEffect(
    function syncChangesToParent() {
      onChange(values)
    },
    [values]
  )

  const isEmptyList = !isLoading && list.length === 0
  const isOnlyOneItem = totalCount === 1 && defaultValues.length === 0
  if (isEmptyList || isOnlyOneItem) {
    return <></>
  }

  return (
    <div>
      <Spacer bottom='4'>
        <SkeletonTemplate isLoading={isLoading}>
          <Text variant='info' weight='medium'>
            {computeLabelWithSelected({
              label: title,
              selectedCount,
              totalCount
            })}
          </Text>
        </SkeletonTemplate>
      </Spacer>

      <Card>
        {list.map((item, idx) => {
          const hasBottomGap = idx + 1 < list.length
          return (
            <Spacer
              key={`${item.value}-${idx}`}
              bottom={hasBottomGap ? '4' : undefined}
            >
              <Checkbox
                item={item}
                checked={values.includes(item.value)}
                onChange={() => {
                  toggleValue(item.value)
                }}
              />
            </Spacer>
          )
        })}
      </Card>

      {totalCount != null && totalCount > previewLimit ? (
        <Spacer top='4'>
          <button
            type='button'
            onClick={() => {
              open()
            }}
          >
            <Text variant='primary' weight='bold'>
              See all {resource}
            </Text>
          </button>
        </Spacer>
      ) : null}
      <Overlay
        button={{
          label: 'Apply',
          onClick: () => {
            close()
            setSelectedValuesForPreview(values)
          }
        }}
      >
        <FullList
          defaultValues={values}
          fieldForLabel={fieldForLabel}
          fieldForValue={fieldForValue}
          onChange={setValues}
          resource={resource}
          searchBy={searchBy}
          sortBy={sortBy}
          title={title}
          totalCount={totalCount}
        />
      </Overlay>
    </div>
  )
}

/**
 * Fetches the list of resources and merges it with the list of selected resources
 * This is needed to show the selected resources in the preview list also when they are on different pages
 */
function useList({
  resource,
  limit,
  fieldForValue,
  fieldForLabel,
  sortBy,
  selectedValues
}: {
  resource: ListableResourceType
  limit: number
  fieldForValue: string
  fieldForLabel: string
  sortBy: SortBy
  selectedValues: string[]
}): {
  list: CheckboxItem[]
  totalCount?: number
  isLoading: boolean
} {
  const queryParam: QueryParamsList = {
    fields: [fieldForValue, fieldForLabel],
    pageSize: limit,
    sort: {
      [sortBy.attribute]: sortBy.direction
    }
  }

  const filtersSelected: QueryParamsList =
    selectedValues.length === 0
      ? {}
      : {
          filters: {
            [`${fieldForValue}_in`]: selectedValues.join(',')
          }
        }

  // list of selected resources to be shown on top of the list, even if they are on different pages
  const { data: selectedResources, isLoading: isLoadingSelectedResources } =
    useCoreApi(
      resource,
      'list',
      [
        {
          ...queryParam,
          ...filtersSelected
        }
      ],
      {
        revalidateOnFocus: false
      }
    )

  // list of all resources, no need to exclude the selected ones since we can leverage both api and swr caches
  const { data: allResources, isLoading: isLoadingAllResources } = useCoreApi(
    resource,
    'list',
    [queryParam],
    {
      revalidateOnFocus: false
    }
  )

  const isLoading = isLoadingSelectedResources || isLoadingAllResources
  const totalCount = allResources?.meta?.recordCount
  const jointList = [...(selectedResources ?? []), ...(allResources ?? [])]

  // during loading, list is filled with empty mocks so we can render the skeleton
  const list = isLoading
    ? Array(limit)
        .fill(null)
        .map(() =>
          prepareCheckboxItemOrMock({
            isLoading: true,
            fieldForLabel,
            fieldForValue
          })
        )
    : uniqBy(
        jointList.map((item) =>
          prepareCheckboxItemOrMock({
            resource: item,
            fieldForLabel,
            fieldForValue
          })
        ),
        'value'
      ).slice(0, limit)

  return {
    list,
    totalCount,
    isLoading
  }
}

RelationshipSelector.displayName = 'RelationshipSelector'
export { RelationshipSelector }
