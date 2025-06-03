import { isEqual, set, unset } from 'lodash-es'
import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useReducer
} from 'react'
import { type Schema } from './utils'

interface State {
  value: Schema
  selectedRuleIndex: number
}

type Action =
  | { type: 'SET_PATH'; path: string; value: unknown }
  | { type: 'SET_SELECTED_RULE_INDEX'; index: number }
  | { type: 'SET_VALUE'; value: Schema }

interface RuleEngineContextType {
  state: State
  setPath: (path: string, value: unknown) => void
  setSelectedRuleIndex: (index: number) => void
  setValue: (value: Schema) => void
}

const RuleEngineContext = createContext<RuleEngineContextType | undefined>(
  undefined
)

function ruleEngineReducer(state: State, action: Action): State {
  switch (action.type) {
    case 'SET_PATH': {
      const newValue = { ...state.value }
      if (action.value == null) {
        unset(newValue, action.path)
      } else {
        set(newValue, action.path, action.value)
      }
      return {
        ...state,
        value: newValue
      }
    }
    case 'SET_SELECTED_RULE_INDEX':
      return {
        ...state,
        selectedRuleIndex: action.index
      }
    case 'SET_VALUE':
      if (!isEqual(state.value, action.value)) {
        return {
          ...state,
          value: action.value
        }
      }
      return state
    default:
      return state
  }
}

export function RuleEngineProvider({
  children,
  initialValue
}: {
  children: React.ReactNode
  initialValue: Schema
}): React.JSX.Element {
  const [state, dispatch] = useReducer(ruleEngineReducer, {
    value: initialValue,
    selectedRuleIndex: 0
  })

  const setPath = useCallback((path: string, value: unknown) => {
    dispatch({ type: 'SET_PATH', path, value })
  }, [])

  const setSelectedRuleIndex = useCallback((index: number) => {
    dispatch({ type: 'SET_SELECTED_RULE_INDEX', index })
  }, [])

  const setValue = useCallback((value: Schema) => {
    dispatch({ type: 'SET_VALUE', value })
  }, [])

  const contextValue = useMemo(
    () => ({
      state,
      setPath,
      setSelectedRuleIndex,
      setValue
    }),
    [state, setPath, setSelectedRuleIndex, setValue]
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
    throw new Error('useRuleEngine must be used within a RuleEngineProvider')
  }
  return context
}
