import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'
import {
  Fragment,
  useEffect,
  useState,
  type ComponentProps,
  type ReactNode
} from 'react'

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
   * Additional `Element` to be rendered when the input is checked
   */
  checkedElement?: JSX.Element
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
  viewMode?: 'list' | 'inline' | 'grid' | 'simple'
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
            'flex-col': ['list', 'simple'].includes(viewMode),
            'gap-4': ['inline', 'grid'].includes(viewMode),
            'flex-row [&>*]:flex-shrink [&>*]:flex-grow [&>*]:basis-0':
              viewMode === 'inline',
            'grid grid-cols-2': viewMode === 'grid'
          })}
        >
          {options.map((optionItem) => {
            const isSelected = optionItem.value === selectedValue

            const option = (
              <div>
                <label
                  className={cn('flex gap-4 cursor-pointer h-full', {
                    'rounded-md px-4 py-4': viewMode !== 'simple',
                    'items-center': ['list', 'simple'].includes(viewMode)
                  })}
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
                {optionItem.checkedElement != null && isSelected && (
                  <div className='my-2 ml-[18px] pl-4'>
                    {optionItem.checkedElement}
                  </div>
                )}
              </div>
            )

            if (viewMode === 'simple') {
              return <Fragment key={optionItem.value}>{option}</Fragment>
            }

            return (
              <Card
                key={optionItem.value}
                overflow='hidden'
                className={cn(optionItem.className, {
                  '!p-1 hover:border-black hover:border-2 hover:!p-[calc(theme(space.1)-1px)]':
                    !isSelected,
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
                {option}
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
