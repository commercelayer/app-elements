import { get, isEqual, set, unset } from "lodash-es"
import type React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react"
import type { RuleEngineProps } from "./RuleEngineComponent"
import type { ActionType, RulesObject } from "./utils"

interface State {
  value: RulesObject
  selectedRuleIndex: number
}

type Action =
  | { type: "SET_PATH"; path: string; value: unknown }
  | { type: "SET_SELECTED_RULE_INDEX"; index: number }
  | { type: "SET_VALUE"; value: RulesObject }

interface RuleEngineContextType {
  availableActionTypes: ActionType[]
  state: State
  schemaType: RuleEngineProps["schemaType"]
  setPath: (path: string, value: unknown) => void
  setSelectedRuleIndex: (index: number) => void
  setValue: (value: RulesObject) => void
}

const RuleEngineContext = createContext<RuleEngineContextType | undefined>(
  undefined,
)

function ruleEngineReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PATH": {
      const newValue = { ...state.value }

      if (action.value === null) {
        if (/\.\d+$/.test(action.path)) {
          // If the path ends with a number, we assume it's an array index
          const arrayPath = action.path.replace(/\.\d+$/, "")
          const arrayIndex = parseInt(action.path.match(/\d+$/)?.[0] ?? "0", 10)

          const arrayValue = get(newValue, arrayPath) as unknown[]

          if (Array.isArray(arrayValue)) {
            arrayValue.splice(arrayIndex, 1)
            set(newValue, arrayPath, arrayValue)

            if (arrayValue.length === 0) {
              // If the array is empty, we unset the entire path when it is a "nested condition"
              if (arrayPath.endsWith(".nested.conditions")) {
                unset(newValue, arrayPath.replace(/\.conditions$/, ""))
              }
            }
          }
        } else {
          // If the path does not end with a number, we unset the value
          unset(newValue, action.path)
        }
      } else {
        set(newValue, action.path, action.value)
      }

      // Remove empty nested.conditions array

      return {
        ...state,
        value: newValue,
      }
    }

    case "SET_SELECTED_RULE_INDEX":
      return {
        ...state,
        selectedRuleIndex: action.index,
      }

    case "SET_VALUE":
      if (!isEqual(state.value, action.value)) {
        if (action.value.rules?.length === 0) {
          return {
            selectedRuleIndex: 0,
            value: {
              rules: [],
            },
          }
        }

        return {
          ...state,
          value: action.value,
        }
      }
      return state
    default:
      return state
  }
}

export function RuleEngineProvider({
  children,
  initialValue,
}: {
  children: React.ReactNode
  initialValue: {
    value: RulesObject
    schemaType: RuleEngineContextType["schemaType"]
    availableActionTypes: RuleEngineContextType["availableActionTypes"]
  }
}): React.JSX.Element {
  const [state, dispatch] = useReducer(ruleEngineReducer, {
    value: initialValue.value,
    selectedRuleIndex: 0,
  })

  const setPath = useCallback((path: string, value: unknown) => {
    dispatch({ type: "SET_PATH", path, value })
  }, [])

  const setSelectedRuleIndex = useCallback((index: number) => {
    dispatch({ type: "SET_SELECTED_RULE_INDEX", index })
    if (index < 0) {
      setTimeout(() => {
        dispatch({ type: "SET_SELECTED_RULE_INDEX", index: 0 })
      }, 50)
    }
  }, [])

  const setValue = useCallback((value: RulesObject) => {
    dispatch({ type: "SET_VALUE", value })
  }, [])

  const contextValue = useMemo(
    () => ({
      state,
      setPath,
      setSelectedRuleIndex,
      setValue,
      availableActionTypes: initialValue.availableActionTypes,
      schemaType: initialValue.schemaType,
    }),
    [
      state,
      setPath,
      setSelectedRuleIndex,
      setValue,
      initialValue.availableActionTypes,
      initialValue.schemaType,
    ],
  )

  return (
    <RuleEngineContext.Provider value={contextValue}>
      {children}
    </RuleEngineContext.Provider>
  )
}

export function useRuleEngine(): RuleEngineContextType {
  const context = useContext(RuleEngineContext)
  if (context === undefined) {
    throw new Error("useRuleEngine must be used within a RuleEngineProvider")
  }
  return context
}
