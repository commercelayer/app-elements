import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { InputWrapper } from '#ui/internals/InputWrapper'
import cn from 'classnames'
import { useEffect, useState, type ReactNode } from 'react'

export interface OptionItem {
  /**
   * Item identifier, must be unique and will be used for the onChange callback
   */
  value: string
  /**
   * Item content to be displayed in the central section of the row
   */
  content: ReactNode
}

export interface InputRadioGroupProps {
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
  viewMode?: 'list' | 'inline'
}

export const InputRadioGroup = withSkeletonTemplate<InputRadioGroupProps>(
  ({
    name,
    options,
    defaultValue,
    title,
    onChange = () => {},
    showInput = true,
    viewMode = 'list'
  }: InputRadioGroupProps) => {
    const [selectedValue, setSelectedValue] = useState(defaultValue)

    useEffect(
      function handleOnChange() {
        onChange(selectedValue)
      },
      [selectedValue]
    )

    return (
      <InputWrapper fieldset label={title}>
        <div
          className={cn('flex gap-2 wrap', {
            'flex-col': viewMode === 'list',
            'flex-row [&>*]:flex-shrink [&>*]:flex-grow [&>*]:basis-0':
              viewMode === 'inline'
          })}
        >
          {options.map((optionItem, index) => {
            const isSelected = optionItem.value === selectedValue

            return (
              <Card
                key={optionItem.value}
                className={cn({
                  '!p-1': !isSelected,
                  'border-primary-500 border-2 !p-[calc(theme(space.1)-1px)]':
                    isSelected
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
                    'rounded-md cursor-pointer hover:bg-gray-50 flex items-center gap-4 p-4 h-full'
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
