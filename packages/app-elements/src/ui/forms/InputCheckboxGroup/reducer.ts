import { type SelectedItem } from './InputCheckboxGroup'
import { type InputCheckboxGroupOption } from './InputCheckboxGroupItem'

export type InternalState = Array<{
  value: string
  quantity?: number
  isSelected: boolean
}>

type Action =
  | {
      type: 'updateQuantity'
      payload: {
        value: string
        quantity: number
      }
    }
  | {
      type: 'toggleSelection'
      payload: {
        value: string
      }
    }

export const reducer = (
  state: InternalState,
  action: Action
): InternalState => {
  switch (action.type) {
    case 'updateQuantity':
      return state.map((item) => ({
        ...item,
        quantity:
          item.value === action.payload.value
            ? action.payload.quantity
            : item.quantity
      }))
    case 'toggleSelection':
      return state.find((item) => item.value === action.payload.value) != null
        ? state.map((item) => ({
            ...item,
            isSelected:
              item.value === action.payload.value
                ? !item.isSelected
                : item.isSelected
          }))
        : [...state, { value: action.payload.value, isSelected: true }]
  }
}

export function makeInitialState({
  options,
  defaultValues
}: {
  options: InputCheckboxGroupOption[]
  defaultValues: SelectedItem[]
}): InternalState {
  return options.reduce<InternalState>((acc, item) => {
    const defaultItem = defaultValues.find((d) => d.value === item.value)

    return [
      ...acc,
      {
        value: item.value,
        quantity: defaultItem?.quantity ?? item.quantity?.max,
        isSelected: Boolean(defaultItem != null)
      }
    ]
  }, [])
}
