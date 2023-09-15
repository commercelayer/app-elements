import { formatResourceName } from '#helpers/resources'
import { useOverlay } from '#hooks/useOverlay'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Card } from '#ui/atoms/Card'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { InputWrapper } from '#ui/internals/InputWrapper'
import { type QueryParamsList } from '@commercelayer/sdk'
import type { ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import uniqBy from 'lodash/uniqBy'
import { useEffect, useState } from 'react'
import {
  Checkbox,
  prepareCheckboxItemOrMock,
  type CheckboxItem
} from './Checkbox'
import { FullList, type FullListProps, type SortBy } from './FullList'
import { computeLabelWithSelected, useToggleCheckboxValues } from './utils'

export interface InputResourceGroupProps
  extends Omit<FullListProps, 'totalCount'> {
  /**
   * Number of item to be shown in the preview list
   * @default 5
   */
  previewLimit?: number
  /**
   * SDK filter query to be applied when fetching the list of resources
   */
  filters?: QueryFilter
  /**
   * Hide the component when there is only one item.
   */
  hideWhenSingleItem?: boolean
  /**
   * Show icon in checkbox selectors
   */
  showCheckboxIcon?: boolean
}

/**
 * Input component that allows to select multiple resources. The list of options is automatically fetched from the API using the configuration provided as props.
 * When number of fetched options is greater than `previewLimit` provided, a button will be shown to open an overlay with the full list of resources (infinite scrolling) and a search box on top.
 * <span type='info'>It's possible to mount the component with some `defaultValues` that will be always shown checked on top of the preview list, to ensure that user will always see the already checked options.</span>
 */
export const InputResourceGroup: React.FC<InputResourceGroupProps> = ({
  defaultValues,
  fieldForLabel,
  fieldForValue,
  previewLimit = 5,
  onChange,
  resource,
  searchBy,
  sortBy,
  filters = {},
  hideWhenSingleItem,
  showCheckboxIcon = true,
  title
}) => {
  const { Overlay, close, open } = useOverlay({
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
    selectedValues: selectedValuesForPreviews.slice(0, previewLimit),
    filters
  })

  useEffect(
    function syncChangesToParent() {
      onChange(values)
    },
    [values]
  )

  const isEmptyList = !isLoading && list.length === 0
  const isHidden =
    hideWhenSingleItem === true &&
    totalCount === 1 &&
    defaultValues.length === 0
  if (isEmptyList || isHidden) {
    return <></>
  }

  return (
    <SkeletonTemplate isLoading={isLoading}>
      <InputWrapper
        fieldset
        label={computeLabelWithSelected({
          label: title,
          selectedCount,
          totalCount
        })}
      >
        <Card gap='1'>
          {list.map((item, idx) => {
            return (
              <Checkbox
                key={`${item.value}-${idx}`}
                item={item}
                checked={values.includes(item.value)}
                onChange={() => {
                  toggleValue(item.value)
                }}
                showIcon={showCheckboxIcon}
              />
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
                See all{' '}
                {formatResourceName({
                  resource,
                  count: 'plural'
                })}
              </Text>
            </button>
          </Spacer>
        ) : null}
        <Overlay
          footer={
            <Button
              fullWidth
              type='button'
              onClick={() => {
                close()
                setSelectedValuesForPreview(values)
              }}
            >
              Apply
            </Button>
          }
        >
          <div className='pt-5'>
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
              showCheckboxIcon={showCheckboxIcon}
            />
          </div>
        </Overlay>
      </InputWrapper>
    </SkeletonTemplate>
  )
}
InputResourceGroup.displayName = 'InputResourceGroup'

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
  selectedValues,
  filters
}: {
  resource: ListableResourceType
  limit: number
  fieldForValue: string
  fieldForLabel: string
  sortBy: SortBy
  selectedValues: string[]
  filters: QueryFilter
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
    },
    filters
  }

  const filtersSelected: QueryParamsList =
    selectedValues.length === 0
      ? {
          filters
        }
      : {
          filters: {
            ...filters,
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
