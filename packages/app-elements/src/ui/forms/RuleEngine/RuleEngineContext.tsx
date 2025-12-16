import { cloneDeep, get, isEqual, set, unset } from "lodash-es"
import type React from "react"
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer,
} from "react"
import type { OptionsConfig } from "./optionsConfig"
import type { RuleEngineProps } from "./RuleEngineComponent"
import type { RulesObject } from "./utils"

interface RenderOptions {
  [path: string]: RenderOptions | RenderOptions[]
}

interface State {
  value: RulesObject
  renderOptions: RenderOptions
  selectedRuleIndex: number
}

type Action =
  | { type: "SET_PATH"; path: string; value: unknown; allowNullValue?: boolean }
  | { type: "SET_RENDER_OPTION"; path: string; value: unknown | null }
  | { type: "SET_SELECTED_RULE_INDEX"; index: number }
  | { type: "SET_VALUE"; value: RulesObject }

interface RuleEngineContextType {
  state: State
  schemaType: RuleEngineProps["schemaType"]
  optionsConfig: OptionsConfig
  /** Sets a value at the given path */
  setPath: (
    /** The path to set the value at */
    path: string,
    /** The value to set */
    value: unknown,
    /**
     * Whether to allow setting the value to `null`.
     * When `false`, setting a value to `null` will remove the value at the given path.
     *
     * @default false
     */
    allowNullValue?: boolean,
  ) => void
  /** Sets a render option at the given path */
  setRenderOption: (path: string, value: unknown | null) => void
  /** Sets the selected rule index */
  setSelectedRuleIndex: (index: number) => void
  /** Sets the entire rules object value */
  setValue: (value: RulesObject) => void
}

const RuleEngineContext = createContext<RuleEngineContextType | undefined>(
  undefined,
)

// if (/conditions\.\d\.[\w_]+$/.test(action.path)) {
//   const parentPath = action.path.replace(/\.[\w_]+$/, "")
//   const parentValue = get(newValue, parentPath) as Record<
//     string,
//     unknown
//   > | null

//   console.log("parentPath", parentPath, parentValue)
//   console.log(
//     `set(newValue, "${parentValue}.group", "${window.crypto.randomUUID()}")`,
//   )

//   if (parentValue?.group == null) {
//     set(newValue, `${parentPath}.group`, window.crypto.randomUUID())
//   }
// }

function ruleEngineReducer(state: State, action: Action): State {
  switch (action.type) {
    case "SET_PATH": {
      const newValue = cloneDeep(state.value)

      // Ensure that if we are setting a field inside an action, the action has a groups array
      if (/actions\.\d\.[\w_]+$/.test(action.path)) {
        const parentPath = action.path.replace(/\.[\w_]+$/, "")
        const parentValue = get(newValue, parentPath) as Record<
          string,
          unknown
        > | null

        if (parentValue?.groups == null) {
          set(newValue, `${parentPath}.groups`, [])
        }
      }

      if (action.value === null && action.allowNullValue === false) {
        if (/\.\d+$/.test(action.path)) {
          // If the path ends with a number, we assume it's an array index
          const arrayPath = action.path.replace(/\.\d+$/, "")
          const arrayIndex = parseInt(action.path.match(/\d+$/)?.[0] ?? "0", 10)

          const arrayValue = get(newValue, arrayPath)

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

    case "SET_RENDER_OPTION": {
      const newValue = cloneDeep(state.renderOptions)

      if (action.value === null) {
        if (/\.\d+$/.test(action.path)) {
          // If the path ends with a number, we assume it's an array index
          const arrayPath = action.path.replace(/\.\d+$/, "")
          const arrayIndex = parseInt(action.path.match(/\d+$/)?.[0] ?? "0", 10)

          const arrayValue = get(newValue, arrayPath)

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

      return {
        ...state,
        renderOptions: newValue,
      }
    }

    case "SET_SELECTED_RULE_INDEX":
      return {
        ...state,
        selectedRuleIndex: action.index,
      }

    case "SET_VALUE":
      if (!isEqual(state.value, action.value)) {
        if ((action.value.rules?.length ?? 0) === 0) {
          return {
            selectedRuleIndex: 0,
            value: {
              rules: [
                {
                  name: "Rule name",
                  // @ts-expect-error Setting `null` is intentional for rendering an empty action
                  actions: [null],
                  // @ts-expect-error Setting `null` is intentional for rendering an empty condition
                  conditions: [null],
                },
              ],
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
    optionsConfig: RuleEngineContextType["optionsConfig"]
  }
}): React.JSX.Element {
  const [state, dispatch] = useReducer(ruleEngineReducer, {
    value: initialValue.value,
    renderOptions: {},
    selectedRuleIndex: 0,
  })

  const setPath = useCallback(
    (path: string, value: unknown, allowNullValue: boolean = false) => {
      dispatch({ type: "SET_PATH", path, value, allowNullValue })
    },
    [],
  )

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

  const setRenderOption = useCallback((path: string, value: unknown | null) => {
    dispatch({ type: "SET_RENDER_OPTION", path, value })
  }, [])

  const contextValue = useMemo(
    () => ({
      state,
      setPath,
      setSelectedRuleIndex,
      setValue,
      setRenderOption,
      schemaType: initialValue.schemaType,
      optionsConfig: initialValue.optionsConfig,
    }),
    [
      state,
      setPath,
      setSelectedRuleIndex,
      setValue,
      setRenderOption,
      initialValue.schemaType,
      initialValue.optionsConfig,
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
