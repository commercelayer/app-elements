import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  InputWrapper,
  getFeedbackStyle,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'
import { useEffect, useState, type ComponentProps, type ReactNode } from 'react'

interface OptionItem {
  /**
   * Item identifier, must be unique and will be used for the onChange callback
   */
  value: string
  /**
   * Item content to be displayed in the central section of the row
   */
  content: ReactNode
  /**
   * Optional CSS class name to be applied to the card item
   */
  className?: string
}

interface Props extends Pick<InputWrapperBaseProps, 'feedback' | 'hint'> {
  /**
   * Text to be displayed on top of the list
   */
  title?: string
  /**
   * Input name, will be used to set the html name for all radios
   */
  name: string
  /**
   * List of options to render as radio
   */
  options: OptionItem[]
  /**
   * Default value
   */
  defaultValue?: string
  /**
   * Callback triggered when the user update the selection
   */
  onChange?: (selected: string | undefined) => void
  /**
   * Show input element
   */
  showInput?: boolean
  /**
   * Define how the item options are rendered
   * @default list
   */
  viewMode?: 'list' | 'inline' | 'grid'
}

export const InputRadioGroup = withSkeletonTemplate<Props>(
  ({
    name,
    options,
    defaultValue,
    title,
    onChange = () => {},
    showInput = true,
    viewMode = 'list',
    feedback,
    hint
  }) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue)

    useEffect(
      function handleOnChange() {
        onChange(selectedValue)
      },
      [selectedValue]
    )

    return (
      <InputWrapper fieldset label={title} feedback={feedback} hint={hint}>
        <div
          className={cn('flex gap-2 wrap', {
            'flex-col': viewMode === 'list',
            'flex-row [&>*]:flex-shrink [&>*]:flex-grow [&>*]:basis-0':
              viewMode === 'inline',
            'grid grid-cols-2': viewMode === 'grid'
          })}
        >
          {options.map((optionItem) => {
            const isSelected = optionItem.value === selectedValue

            return (
              <Card
                key={optionItem.value}
                overflow='hidden'
                className={cn(optionItem.className, {
                  '!p-1': !isSelected,
                  'border-primary-500 border-2 !p-[calc(theme(space.1)-1px)]':
                    isSelected,
                  ...getFeedbackStyle(feedback)
                })}
                tabIndex={showInput ? undefined : 0}
                onKeyDown={
                  showInput
                    ? undefined
                    : (event) => {
                        if (event.code === 'Enter' || event.code === 'Space') {
                          setSelectedValue(optionItem.value)
                        }
                      }
                }
                role='radio'
                aria-checked={isSelected}
              >
                <label
                  className={cn(
                    'rounded-md cursor-pointer hover:bg-gray-50 flex gap-4 p-4 h-full',
                    {
                      'items-center': viewMode === 'list'
                    }
                  )}
                  data-testid='InputRadioGroup-item'
                >
                  <input
                    type='radio'
                    checked={isSelected}
                    name={name}
                    value={optionItem.value}
                    onChange={(event) => {
                      setSelectedValue(event.currentTarget.value)
                    }}
                    className={cn(
                      'border border-gray-300 rounded-full w-[18px] h-[18px] text-primary focus:ring-primary',
                      { hidden: !showInput }
                    )}
                  />

                  <div className='flex-1'>{optionItem.content}</div>
                </label>
              </Card>
            )
          })}
        </div>
      </InputWrapper>
    )
  }
)

InputRadioGroup.displayName = 'InputRadioGroup'

export type InputRadioGroupProps = ComponentProps<typeof InputRadioGroup>
