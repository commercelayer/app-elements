import type React from "react"
import {
  isMultiValueSelected,
  isSingleValueSelected,
  type PossibleSelectValue,
} from "#ui/forms/InputSelect"
import { InputResourceSelector as GenericInputResourceSelector } from "../../InputResourceSelector"
import { useRuleEngine } from "../../RuleEngineContext"
import type { ItemWithValue } from "../../utils"
import { getResourceType, type useResourcePathInfos } from "../hooks"

export const InputResourceSelector: React.FC<{
  value?: ItemWithValue["value"]
  pathKey: string
  infos: ReturnType<typeof useResourcePathInfos>["infos"]
  onSelect?: (selected: PossibleSelectValue) => void
}> = ({ value, pathKey, infos, onSelect }) => {
  const { setPath } = useRuleEngine()

  return (
    <GenericInputResourceSelector
      resourceKey={infos?.field?.name ?? "id"}
      resource={getResourceType(infos?.resource?.id)}
      isMulti={infos?.matcherInfos?.isMulti}
      value={value}
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
