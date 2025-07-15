import classNames from "classnames"
import type React from "react"
import { useState } from "react"
import { useRuleEngine } from "../RuleEngineContext"
import type { SchemaCondition } from "../utils"
import { ConditionListItem } from "./ConditionListItem"

export function Condition({
  item,
  children,
  nestingLevel = 0,
  pathPrefix,
}: {
  item?: SchemaCondition
  nestingLevel?: number
  children?: React.JSX.Element
  pathPrefix: string
}): React.JSX.Element {
  const {
    state: { selectedRuleIndex },
  } = useRuleEngine()
  const conditionsLogin = item?.conditions_logic?.toLowerCase() ?? "and"
  const { setPath } = useRuleEngine()
  const [rerenderKey, setRerenderKey] = useState(0)
  const isNested = nestingLevel > 0

  return (
    <div
      className={classNames("query-group", {
        "p-4 border border-gray-200 rounded-md": isNested,
      })}
    >
      {children}
      {item != null && (item.conditions ?? []).length > 0 && (
        <>
          <select
            onChange={(event) => {
              setPath(
                `${pathPrefix}.conditions_logic`,
                event.currentTarget.value,
              )
            }}
            defaultValue={conditionsLogin}
            className="pl-4 pr-8 py-2 font-bold focus:ring-0 focus:outline-none appearance-none bg-gray-50 border border-gray-200 rounded-md text-sm leading-4"
          >
            <option value="and">{isNested ? "Nested in " : ""}AND</option>
            <option value="or">{isNested ? "Nested in " : ""}OR</option>
          </select>
          <div className="border-l border-gray-200 ml-3 pt-3">
            {item?.conditions?.map((condition, conditionIndex, arr) => {
              const isLast = conditionIndex === arr.length - 1
              return (
                <div
                  key={`${selectedRuleIndex}-${conditionIndex}-${rerenderKey}`}
                  className="flex items-center mb-4 last:mb-0 relative"
                >
                  <Connector rounded={isLast} />
                  <div className="ml-4 w-full">
                    <Condition
                      item={condition?.nested ?? undefined}
                      nestingLevel={
                        condition?.nested != null ? nestingLevel + 1 : 0
                      }
                      pathPrefix={`${pathPrefix}.conditions.${conditionIndex}.nested`}
                    >
                      <div
                        className={classNames({
                          "mb-4": condition?.nested != null,
                        })}
                      >
                        <ConditionListItem
                          item={condition}
                          nestingLevel={nestingLevel}
                          pathPrefix={`${pathPrefix}.conditions.${conditionIndex}`}
                          onDelete={
                            arr.length > 1 || nestingLevel > 0
                              ? () => {
                                  setRerenderKey((prevKey) => prevKey + 1)
                                }
                              : undefined
                          }
                        />
                      </div>
                    </Condition>
                  </div>
                </div>
              )
            })}
          </div>
        </>
      )}
    </div>
  )
}

function Connector({
  rounded = false,
}: {
  rounded?: boolean
}): React.JSX.Element {
  if (!rounded) {
    return (
      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-3.5 h-px bg-gray-200" />
    )
  }

  return (
    <>
      <div className="absolute -left-[1px] top-1/2 w-px h-1/2 bg-white" />
      <div className="absolute -left-[1px] top-1/2 -translate-y-1/2 w-3.5 h-3.5 border-l border-b rounded-es-sm bg-white border-gray-200" />
    </>
  )
}
