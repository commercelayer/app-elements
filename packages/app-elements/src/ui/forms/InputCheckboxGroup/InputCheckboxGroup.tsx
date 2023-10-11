import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'
import {
  useCallback,
  useEffect,
  useMemo,
  useReducer,
  useRef,
  type ComponentProps
} from 'react'
import {
  InputCheckboxGroupItem,
  type InputCheckboxGroupOption
} from './InputCheckboxGroupItem'
import { makeInitialState, reducer, type InternalState } from './reducer'

export interface SelectedItem {
  /**
   * Item identifier, should be one of the options
   */
  value: string
  /**
   * Selected quantity for the checked item
   */
  quantity?: number
}

interface Props extends Pick<InputWrapperBaseProps, 'feedback'> {
  /**
   * Text to be displayed on top of the list
   */
  title?: string
  /**
   * list of options to render as checkboxes with quantity input
   */
  options: InputCheckboxGroupOption[]
  /**
   * pre-selected options
   */
  defaultValues?: SelectedItem[]
  /**
   * Callback triggered when the user checks/unchecks an option or changes the quantity
   */
  onChange: (selected: SelectedItem[]) => void
}

/**
 * Renders a group of checkbox items. Each item can be selected/unselected.
 * The title will be automatically computed with the number of selected items.
 *
 * Each item can also be associated with a quantity input, when quantity is changed the new value
 * will be available in the onChange callback.
 * The total number of select items in the title will be automatically computed with the sum of all selected quantities.
 * <span type="info">Quantity for each option item has a min/max range, to prevent selecting less or more than the allowed number.</span>
 */
export const InputCheckboxGroup = withSkeletonTemplate<Props>(
  ({ options, defaultValues = [], onChange, title, isLoading, feedback }) => {
    const [_state, dispatch] = useReducer(
      reducer,
      makeInitialState({ options, defaultValues })
    )

    const prepareSelected = useCallback(
      (state: InternalState) =>
        state
          .filter(({ isSelected }) => isSelected)
          .map(({ value, quantity }) =>
            quantity != null ? { value, quantity } : { value }
          ),
      []
    )

    const totalSelected = useMemo(
      () =>
        prepareSelected(_state).reduce(
          (total, item) => total + (item.quantity ?? 1),
          0
        ),
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
      <InputWrapper
        fieldset
        label={`${title} · ${totalSelected}`}
        feedback={feedback}
      >
        <Card gap='1' className={cn(getFeedbackStyle(feedback))}>
          {options.map((optionItem) => {
            const currentItem = _state.find(
              ({ value }) => value === optionItem.value
            )

            return (
              <InputCheckboxGroupItem
                {...optionItem}
                key={optionItem.value}
                isLoading={isLoading}
                checked={Boolean(currentItem?.isSelected)}
                defaultQuantity={currentItem?.quantity}
                onChange={(value, newQty) => {
                  if (newQty != null) {
                    dispatch({
                      type: 'updateQuantity',
                      payload: { value, quantity: newQty }
                    })
                  } else {
                    dispatch({
                      type: 'toggleSelection',
                      payload: { value }
                    })
                  }
                }}
              />
            )
          })}
        </Card>
      </InputWrapper>
    )
  }
)

InputCheckboxGroup.displayName = 'InputCheckboxGroup'

export type InputCheckboxGroupProps = ComponentProps<typeof InputCheckboxGroup>
