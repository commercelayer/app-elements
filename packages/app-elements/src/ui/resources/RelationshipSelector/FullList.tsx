import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Card } from '#ui/atoms/Card'
import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { SearchBar } from '#ui/composite/SearchBar'
import { ResourceList } from '#ui/resources/ResourceList'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { type QueryFilter } from '@commercelayer/sdk/lib/cjs/query'
import { isEmpty } from 'lodash'
import { useEffect, useState } from 'react'
import { Checkbox, prepareCheckboxItemOrMock } from './Checkbox'
import { computeLabelWithSelected, useToggleCheckboxValues } from './utils'

export interface SortBy {
  attribute: string
  direction: 'asc' | 'desc'
}

export interface FullListProps {
  /**
   * Default values to be shown as selected
   */
  defaultValues: string[]
  /**
   * Resource name from core API to be fetched.
   * Example: `markets`
   */
  resource: ListableResourceType
  /**
   * Attribute from the resource to be used as label for the checkbox
   * Example: name, sku_code or email
   */
  fieldForLabel: string
  /**
   * Attribute from the resource to be used as value for the checkbox
   * Example: id
   */
  fieldForValue: string
  /**
   * Callback invoked on change, it returns the new list of selected values
   */
  onChange: (values: string[]) => void
  /**
   * Value to be used as search predicate when SearchBar is used.
   * If missing the search bar will not be shown.
   * It must match the format described in the Core APIs documentation.
   * {@link https://docs.commercelayer.io/core/filtering-data}
   * Example: name_cont
   */
  searchBy?: string
  /**
   * Sorting options
   *
   * Example:
   * ```{ attribute: 'name', direction: 'asc'}```
   * or
   * ```{ attribute: 'created_at', direction: 'desc'}```
   */
  sortBy: SortBy
  /**
   * Title to be shown as main label.
   * It will be automatically computed with the number of selected items.
   */
  title: string
  /**
   * Total count of pre-fetched items.
   */
  totalCount?: number
  /**
   * Show icon in checkbox selectors
   */
  showCheckboxIcon?: boolean
}

export function FullList({
  defaultValues,
  fieldForLabel,
  fieldForValue,
  onChange,
  resource,
  searchBy,
  sortBy,
  title,
  totalCount,
  showCheckboxIcon = true
}: FullListProps): JSX.Element {
  const { sdkClient } = useCoreSdkProvider()
  const { values, toggleValue } = useToggleCheckboxValues(defaultValues)
  const [filters, setFilters] = useState<QueryFilter>({})
  const [search, setSearch] = useState<string>('')
  const selectedCount = values.length

  useEffect(() => {
    if (searchBy != null) {
      setFilters(isEmpty(search) ? {} : { [searchBy]: search })
    }
  }, [search, searchBy])

  useEffect(() => {
    onChange(values)
  }, [values])

  return (
    <div>
      {searchBy != null && (
        <Spacer bottom='8'>
          <div className='flex gap-4'>
            <SearchBar
              onSearch={setSearch}
              onClear={() => {
                setSearch('')
              }}
            />
            <button
              onClick={() => {
                history.back()
              }}
              className='text-primary font-medium'
            >
              Cancel
            </button>
          </div>
        </Spacer>
      )}

      <Spacer bottom='4'>
        <SkeletonTemplate isLoading={totalCount == null || totalCount === 0}>
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
        <ResourceList
          type={resource}
          sdkClient={sdkClient}
          emptyState={<div>No items found</div>}
          query={{
            pageSize: 25,
            filters,
            sort: {
              [sortBy.attribute]: sortBy.direction
            }
          }}
          Item={({ isLoading, resource }) => {
            const item = prepareCheckboxItemOrMock({
              resource,
              isLoading,
              fieldForLabel,
              fieldForValue
            })
            return (
              <Spacer bottom='4'>
                <Checkbox
                  item={item}
                  checked={values.includes(item.value)}
                  onChange={() => {
                    toggleValue(item.value)
                  }}
                  showIcon={showCheckboxIcon}
                />
              </Spacer>
            )
          }}
        />
      </Card>
    </div>
  )
}
