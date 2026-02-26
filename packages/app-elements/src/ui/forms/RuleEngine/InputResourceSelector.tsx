import type {
  ListableResourceType,
  QueryParamsList,
  Tag,
} from "@commercelayer/sdk"
import { uniqBy } from "lodash-es"
import type React from "react"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import {
  InputSelect,
  type InputSelectValue,
  type PossibleSelectValue,
} from "#ui/forms/InputSelect"
import type { ItemWithValue } from "./utils"

export const InputResourceSelector: React.FC<{
  value?: ItemWithValue["value"]
  resource: Extract<
    ListableResourceType,
    "markets" | "tags" | "skus" | "sku_lists" | "bundles"
  >
  resourceKey: string
  isMulti?: boolean
  onSelect: (selected: PossibleSelectValue) => void
  isDisabled?: boolean
}> = ({
  value,
  resource,
  isDisabled,
  resourceKey,
  onSelect,
  isMulti = false,
}) => {
  const { sdkClient } = useCoreSdkProvider()

  const { data } = useCoreApi(resource, "list", [getParams({ value: "" })])

  const { data: selectedData, isLoading: isLoadingSelectedData } = useCoreApi(
    resource,
    "list",
    [
      {
        ...getParams({ value: "" }),
        filters: {
          id_in: Array.isArray(value) ? value : [value],
        },
      },
    ],
  )

  const initialValues = uniqBy([...(selectedData ?? []), ...(data ?? [])], "id")

  function getValue(value: ItemWithValue["value"]): InputSelectValue {
    return {
      label:
        initialValues?.find((item) => item.id === value.toString())?.name ??
        `${isLoadingSelectedData ? "" : "⚠️ "}${value.toString()}`,
      value: value.toString(),
    }
  }

  return (
    <InputSelect
      key={`${isMulti ? "multi" : "single"}-${isLoadingSelectedData}-${JSON.stringify(initialValues)}`}
      placeholder="Search..."
      isClearable={false}
      isDisabled={isDisabled}
      isMulti={isMulti}
      defaultValue={
        Array.isArray(value)
          ? value.map(getValue)
          : value != null
            ? getValue(value)
            : undefined
      }
      menuFooterText={
        data != null && data.meta.recordCount > 25
          ? "Type to search for more options."
          : undefined
      }
      initialValues={toInputSelectValues(initialValues ?? [], resourceKey)}
      loadAsyncValues={async (value) => {
        const items = await sdkClient[resource].list(getParams({ value }))

        return toInputSelectValues(items, resourceKey)
      }}
      onSelect={(selected) => {
        onSelect?.(selected)
      }}
    />
  )
}

function getParams({ value }: { value: string }): QueryParamsList<Tag> {
  return {
    pageSize: 25,
    sort: {
      name: "asc",
    },
    filters: {
      name_cont: value,
    },
  }
}

function toInputSelectValues(
  items: Array<{ name: string }>,
  key: string,
): InputSelectValue[] {
  return items.map((item) => ({
    label: item.name,
    // @ts-expect-error TODO: fix this
    value: item[key],
  }))
}
