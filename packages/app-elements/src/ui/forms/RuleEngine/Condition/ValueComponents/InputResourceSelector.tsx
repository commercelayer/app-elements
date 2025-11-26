import type { QueryParamsList, Tag } from "@commercelayer/sdk"
import { uniqBy } from "lodash-es"
import type React from "react"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import {
  InputSelect,
  type InputSelectValue,
  isMultiValueSelected,
  isSingleValueSelected,
  type PossibleSelectValue,
} from "#ui/forms/InputSelect"
import { useRuleEngine } from "../../RuleEngineContext"
import type { ItemWithValue } from "../../utils"
import { getResourceType, type useResourcePathInfos } from "../hooks"

export const InputResourceSelector: React.FC<{
  value?: ItemWithValue["value"]
  pathKey: string
  infos: ReturnType<typeof useResourcePathInfos>["infos"]
  onSelect?: (selected: PossibleSelectValue) => void
}> = ({ value, pathKey, infos, onSelect }) => {
  const { sdkClient } = useCoreSdkProvider()

  const { setPath } = useRuleEngine()

  const key = infos?.field?.name ?? "id"

  const resource = getResourceType(infos?.resource?.id)

  const { data } = useCoreApi(
    resource,
    "list",
    infos?.resource?.id == null ? null : [getParams({ value: "" })],
  )

  const { data: selectedData, isLoading: isLoadingSelectedData } = useCoreApi(
    resource,
    "list",
    infos?.resource?.id == null
      ? null
      : [
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
      key={`${infos?.matcherInfos?.isMulti?.toString()}-${isLoadingSelectedData}-${JSON.stringify(initialValues)}`}
      placeholder="Search..."
      isClearable={false}
      isMulti={infos?.matcherInfos?.isMulti}
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
      initialValues={toInputSelectValues(initialValues ?? [], key)}
      loadAsyncValues={async (value) => {
        const items = await sdkClient[resource].list(getParams({ value }))

        return toInputSelectValues(items, key)
      }}
      onSelect={(selected) => {
        onSelect?.(selected)
        if (isMultiValueSelected(selected)) {
          setPath(
            pathKey,
            selected
              .map((s) => {
                return s.value
              })
              .filter((s) => s != null),
          )
        } else if (isSingleValueSelected(selected)) {
          setPath(pathKey, selected.value)
        }
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
