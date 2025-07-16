import type { ListableResourceType, QueryFilter } from "@commercelayer/sdk"
import isEmpty from "lodash-es/isEmpty"
import { type JSX, useCallback, useEffect, useMemo, useState } from "react"
import { useOverlay } from "#hooks/useOverlay"
import { t } from "#providers/I18NProvider"
import { AvatarLetter } from "#ui/atoms/AvatarLetter"
import { SkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { SearchBar } from "#ui/composite/SearchBar"
import type { OverlayProps } from "#ui/internals/Overlay"
import { useResourceList } from "#ui/resources/useResourceList"
import { InputCheckboxGroupItem } from "../InputCheckboxGroup/InputCheckboxGroupItem"
import {
  computeLabelWithSelected,
  prepareCheckboxItemOrMock,
  useToggleCheckboxValues,
} from "./utils"

export interface SortBy {
  attribute: string
  direction: "asc" | "desc"
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
   * Optional callback to be triggered when cancel button is pressed.
   * If missing, the local history will be used to go back (`history.back()`).
   */
  onCancel?: () => void
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
   * Show icon in checkbox selectors
   */
  showCheckboxIcon?: boolean
  /**
   * Hide selected items
   */
  hideSelected?: boolean
}

export function FullList({
  defaultValues,
  fieldForLabel,
  fieldForValue,
  onCancel,
  onChange,
  resource,
  searchBy,
  sortBy,
  title,
  showCheckboxIcon = true,
  hideSelected = false,
}: FullListProps): JSX.Element {
  const { values, toggleValue } = useToggleCheckboxValues(defaultValues)
  const [filters, setFilters] = useState<QueryFilter>({})
  const [search, setSearch] = useState<string>("")

  const initialValues = useMemo(() => defaultValues, [])

  const selectedCount = values.length

  const { ResourceList } = useResourceList({
    type: resource,
    query: {
      pageSize: 25,
      filters,
      sort: {
        [sortBy.attribute]: sortBy.direction,
      },
    },
  })

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
        <Spacer bottom="8">
          <div className="flex gap-4">
            <SearchBar
              onSearch={setSearch}
              onClear={() => {
                setSearch("")
              }}
            />
            <button
              type="button"
              onClick={() => {
                if (onCancel != null) {
                  onCancel()
                } else {
                  history.back()
                }
              }}
              className="text-primary font-bold rounded px-1 shadow-none !outline-0 !border-0 !ring-0 focus:shadow-focus"
            >
              {t("common.cancel")}
            </button>
          </div>
        </Spacer>
      )}

      <SkeletonTemplate>
        <ResourceList
          variant="boxed"
          title={(totalCount) => (
            <Text weight="semibold">
              {computeLabelWithSelected({
                label: title,
                selectedCount: hideSelected
                  ? selectedCount - initialValues.length
                  : selectedCount,
                totalCount:
                  hideSelected && totalCount != null
                    ? totalCount - initialValues.length
                    : totalCount,
              })}
            </Text>
          )}
          ItemTemplate={({ isLoading, resource }) => {
            const item = prepareCheckboxItemOrMock({
              resource,
              isLoading,
              fieldForLabel,
              fieldForValue,
            })

            if (hideSelected && initialValues.includes(item.value)) {
              return null
            }

            return (
              <InputCheckboxGroupItem
                isLoading={isLoading}
                checked={values.includes(item.value)}
                onChange={() => {
                  toggleValue(item.value)
                }}
                icon={
                  showCheckboxIcon ? (
                    <AvatarLetter text={item.label} />
                  ) : undefined
                }
                hideIconOnDesktop
                content={<Text weight="semibold">{item.label}</Text>}
                value={item.value}
              />
            )
          }}
        />
      </SkeletonTemplate>
    </div>
  )
}

export const useInputResourceGroupOverlay = () => {
  const { Overlay, close, open } = useOverlay()

  const InputResourceGroupOverlay = useCallback(
    ({
      footer,
      backgroundColor,
      ...props
    }: FullListProps & Omit<OverlayProps, "children">) => (
      <Overlay backgroundColor={backgroundColor} footer={footer}>
        <div className="pt-5">
          <FullList {...props} />
        </div>
      </Overlay>
    ),
    [Overlay],
  )

  return {
    InputResourceGroupOverlay,
    openInputResourceGroupOverlay: open,
    closeInputResourceGroupOverlay: close,
  }
}
