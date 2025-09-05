import type { QueryParamsList, Tag } from "@commercelayer/sdk"
import { uniqBy } from "lodash-es"
import type React from "react"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import {
  InputSelect,
  type InputSelectValue,
  isMultiValueSelected,
  isSingleValueSelected,
} from "#ui/forms/InputSelect"
import { useRuleEngine } from "../../RuleEngineContext"
import type { SchemaConditionItem } from "../../utils"
import { useResourcePathInfos } from "../hooks"

export const InputResourceSelector: React.FC<{
  item: SchemaConditionItem | null
  pathKey: string
}> = ({ item, pathKey }) => {
  const { sdkClient } = useCoreSdkProvider()

  const { infos } = useResourcePathInfos(item)
  console.log("infoosssssssss", infos)
  const { setPath } = useRuleEngine()

  const key = infos?.field?.name ?? "id"

  const value = item != null && "value" in item ? item.value : undefined

  const resource =
    infos?.resource?.id === "market"
      ? "markets"
      : infos?.resource?.id === "tag"
        ? "tags"
        : "skus"

  const { data, isLoading } = useCoreApi(
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

  const initialValues = uniqBy(selectedData?.concat(data ?? []), "id")

  return (
    <InputSelect
      key={`${infos?.matcherInfos?.isMulti?.toString()}-${isLoading}-${isLoadingSelectedData}`}
      placeholder="Search..."
      isClearable={false}
      isMulti={infos?.matcherInfos?.isMulti}
      defaultValue={
        Array.isArray(value)
          ? value.map((v) => ({
              label:
                initialValues?.find((item) => item.id === v)?.name ??
                v.toString(),
              value: v,
            }))
          : value != null
            ? {
                label:
                  initialValues?.find((item) => item.id === value)?.name ??
                  value.toString(),
                value: value.toString(),
              }
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
