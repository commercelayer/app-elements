import { Avatar } from '#ui/atoms/Avatar'
import { Card } from '#ui/atoms/Card'
import { Spacer } from '#ui/atoms/Spacer'
import { InputCheckbox } from '#ui/forms/InputCheckbox'
import { InputSpinner } from '#ui/forms/InputSpinner'
import cn from 'classnames'
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ReactNode
} from 'react'

export interface OptionItem {
  /**
   * Item identifier, must be unique and will be used for the onChange callback
   */
  value: string
  /**
   * Item content to be displayed in the central section of the row
   */
  content: ReactNode
  /**
   * If present, will be displayed the image thumbnail next to the checkbox
   */
  image?: {
    url: `https://${string}`
    alt: string
  }
  /**
   * Quantity range to be used in the InputSpinner
   */
  quantity: {
    min: number
    max: number
  }
}

export interface SelectedItem {
  /**
   * Item identifier, should be one of the options
   */
  value: string
  /**
   * Selected quantity for the checked item
   */
  quantity: number
}

export interface CheckboxListProps {
  /**
   * Text to be displayed on top of the list
   */
  title?: string
  /**
   * list of options to render as checkboxes with quantity input
   */
  options: OptionItem[]
  /**
   * pre-selected options
   */
  defaultValues?: SelectedItem[]
  /**
   * Callback triggered when the user checks/unchecks an option or changes the quantity
   */
  onChange: (selected: SelectedItem[]) => void
}

function CheckboxList({
  options,
  defaultValues = [],
  onChange,
  title,
  ...rest
}: CheckboxListProps): JSX.Element {
  const [_state, dispatch] = useReducer(
    reducer,
    makeInitialState({ options, defaultValues })
  )

  const prepareSelected = useCallback(
    (state: InternalState) =>
      state
        .filter(({ isSelected }) => isSelected)
        .map(({ value, quantity }) => ({ value, quantity })),
    []
  )

  const totalSelected = useMemo(
    () =>
      prepareSelected(_state).reduce((total, item) => total + item.quantity, 0),
    [_state]
  )

  const isFirstRender = useRef(true)
  useEffect(
    function syncWhenChanges() {
      if (isFirstRender.current) {
        isFirstRender.current = false
        return
      }

      onChange(prepareSelected(_state))
    },
    [_state, isFirstRender]
  )

  return (
    <fieldset {...rest}>
      {title != null && (
        <Spacer bottom='2'>
          <legend className='font-semibold'>
            {title} · {totalSelected}
          </legend>
        </Spacer>
      )}
      <Card gap='1'>
        {options.map((optionItem) => {
          const isSelected = Boolean(
            _state.find(({ value }) => value === optionItem.value)?.isSelected
          )

          return (
            <div
              key={optionItem.value}
              className='rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-4 p-4'
              onClick={() => {
                dispatch({
                  type: 'toggleSelection',
                  payload: {
                    value: optionItem.value
                  }
                })
              }}
              role='checkbox'
              aria-checked={isSelected}
              aria-aria-label={optionItem.image?.alt}
              data-test-id='CheckboxList-item'
            >
              <InputCheckbox checked={isSelected} />

              <div
                className={cn(
                  'flex gap-4 items-center flex-1 justify-between',
                  {
                    'opacity-50 pointer-events-none': !isSelected
                  }
                )}
              >
                {optionItem.image != null && (
                  <Avatar
                    size='small'
                    alt={optionItem.image.alt}
                    src={optionItem.image.url}
                  />
                )}

                <div className='flex-1'>{optionItem.content}</div>

                <div
                  onClick={(e) => {
                    e.stopPropagation()
                  }}
                >
                  <InputSpinner
                    defaultValue={
                      _state.find(({ value }) => value === optionItem.value)
                        ?.quantity
                    }
                    min={optionItem.quantity.min}
                    max={optionItem.quantity.max}
                    disableKeyboard
                    disabled={!isSelected}
                    onChange={(newQty) => {
                      dispatch({
                        type: 'updateQuantity',
                        payload: { value: optionItem.value, quantity: newQty }
                      })
                    }}
                  />
                </div>
              </div>
            </div>
          )
        })}
      </Card>
    </fieldset>
  )
}

type InternalState = Array<{
  value: string
  quantity: number
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
const reducer = (state: InternalState, action: Action): InternalState => {
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
      return state.map((item) => ({
        ...item,
        isSelected:
          item.value === action.payload.value
            ? !item.isSelected
            : item.isSelected
      }))
  }
}

function makeInitialState({
  options,
  defaultValues
}: {
  options: OptionItem[]
  defaultValues: SelectedItem[]
}): InternalState {
  return options.reduce<InternalState>((acc, item) => {
    const defaultItem = defaultValues.find((d) => d.value === item.value)
    return [
      ...acc,
      {
        value: item.value,
        quantity: defaultItem?.quantity ?? item.quantity.max,
        isSelected: Boolean(defaultItem != null)
      }
    ]
  }, [])
}

CheckboxList.displayName = 'CheckboxList'
export { CheckboxList }
