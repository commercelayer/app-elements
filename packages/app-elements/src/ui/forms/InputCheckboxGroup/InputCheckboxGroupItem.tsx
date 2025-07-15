import type { ComponentProps } from "react"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { ListItem } from "#ui/composite/ListItem"
import { InputCheckbox, type InputCheckboxProps } from "#ui/forms/InputCheckbox"
import { InputSpinner } from "#ui/forms/InputSpinner"

export interface InputCheckboxGroupOption
  extends Pick<InputCheckboxProps, "icon" | "checked" | "hideIconOnDesktop"> {
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

export interface Props extends InputCheckboxGroupOption {
  /**
   * Callback triggered when the user checks/unchecks an option or changes the quantity.
   * New quantity is returned only if `quantity` is part of the option (`InputCheckboxGroupOption`).
   */
  onChange: (value: string, newQuantity?: number) => void
  /**
   * Quantity to be used as default value for the InputSpinner.
   */
  defaultQuantity?: number
}

/**
 * Internal component to render the single item of the InputCheckboxGroup.
 */
export const InputCheckboxGroupItem = withSkeletonTemplate<Props>(
  ({
    checked,
    value,
    name = value,
    onChange,
    content,
    quantity,
    defaultQuantity,
    hideIconOnDesktop,
    icon,
  }) => {
    return (
      <ListItem
        alignItems="center"
        alignIcon="center"
        borderStyle="none"
        padding="none"
        className="rounded flex items-center gap-3 p-3"
        onClick={() => {
          onChange(value)
        }}
        data-testid="InputCheckboxGroupItem"
      >
        <InputCheckbox
          name={name}
          checked={checked}
          icon={icon}
          hideIconOnDesktop={hideIconOnDesktop}
          onChange={() => {
            onChange(value)
          }}
        >
          <div>{content}</div>
        </InputCheckbox>

        {quantity != null && (
          // biome-ignore lint/a11y/noStaticElementInteractions: I need to prevent the click event from propagating to the ListItem.
          // biome-ignore lint/a11y/useKeyWithClickEvents: I need to prevent the click event from propagating to the ListItem.
          <div
            onClick={(e) => {
              e.stopPropagation()
            }}
          >
            <InputSpinner
              name={`${name}_quantity`}
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
    )
  },
)

export type InputCheckboxGroupItemProps = ComponentProps<
  typeof InputCheckboxGroupItem
>
