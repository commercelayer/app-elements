import { SkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { ListItem } from '#ui/composite/ListItem'
import { InputCheckbox, type InputCheckboxProps } from '#ui/forms/InputCheckbox'
import { InputSpinner } from '#ui/forms/InputSpinner'

export interface InputCheckboxGroupOption
  extends Pick<InputCheckboxProps, 'icon' | 'checked'> {
  /**
   * Input name, will be used to set the html name for checkbox and the quantity inputs.
   * If not provided, the value will be used instead.
   */
  name?: string
  /**
   * Item identifier, must be unique and will be used for the onChange callback.
   */
  value: string
  /**
   * Item content to be displayed in the central section of the row.
   */
  content: React.ReactNode
  /**
   * Quantity range to be used in the InputSpinner.
   * If not provided the quantity input spinner will not be displayed.
   */
  quantity?: {
    min: number
    max: number
  }
}

export interface InputCheckboxGroupItemProps extends InputCheckboxGroupOption {
  /**
   * Callback triggered when the user checks/unchecks an option or changes the quantity.
   * New quantity is returned only if `quantity` is part of the option (`InputCheckboxGroupOption`).
   */
  onChange: (value: string, newQuantity?: number) => void
  /**
   * Quantity to be used as default value for the InputSpinner.
   */
  defaultQuantity?: number
  /**
   * Shows a loading skeleton instead of the real content.
   */
  isLoading?: boolean
}

/**
 * Internal component to render the single item of the InputCheckboxGroup.
 */
export const InputCheckboxGroupItem: React.FC<InputCheckboxGroupItemProps> = ({
  checked,
  name,
  value,
  onChange,
  content,
  quantity,
  defaultQuantity,
  isLoading,
  icon
}) => {
  const inputName = name ?? value
  return (
    <SkeletonTemplate isLoading={isLoading} delayMs={0}>
      <ListItem
        alignItems='center'
        alignIcon='center'
        borderStyle='none'
        tag='div'
        padding='none'
        className='rounded flex items-center gap-3 p-3'
        onClick={() => {
          onChange(value)
        }}
        data-testid='InputCheckboxGroupItem'
      >
        <InputCheckbox
          name={inputName}
          checked={checked}
          icon={icon}
          onChange={() => {
            onChange(value)
          }}
        >
          <div>{content}</div>
        </InputCheckbox>

        {quantity != null && (
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <InputSpinner
              name={`${inputName}_quantity`}
              defaultValue={defaultQuantity}
              min={quantity.min}
              max={quantity.max}
              disableKeyboard
              disabled={checked === false}
              onChange={(newQuantity) => {
                onChange(value, newQuantity)
              }}
            />
          </div>
        )}
      </ListItem>
    </SkeletonTemplate>
  )
}
