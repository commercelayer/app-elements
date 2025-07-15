import type { JSX } from "react"
import { Button, type ButtonProps } from "#ui/atoms/Button"
import { Icon, type IconProps } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  type DropdownItemProps,
} from "#ui/composite/Dropdown"

export interface ToolbarItem {
  label?: string
  icon?: IconProps["name"]
  size?: ButtonProps["size"]
  variant?: ButtonProps["variant"]
  className?: ButtonProps["className"]
  onClick?: ButtonProps["onClick"]
  disabled?: ButtonProps["disabled"]
  /**
   * Dropdown items nested into current item.
   * If they are set, the current item will be rendered as a `Dropdown` that can be opened by clicking the `Button` configure using current item's props.
   */
  dropdownItems?: DropdownItemProps[][]
}

export interface ToolbarProps {
  /**
   * Toolbar menu items.
   * They are rendered as `Button`s as default behavior. They could behave as a `Dropdown` if they have `dropdownItems`.
   */
  items: ToolbarItem[]
}

/**
 * This component renders a horizontal navigation menu made of `Button`s and `Dropdown`s.
 */
export const Toolbar = withSkeletonTemplate<ToolbarProps>(({ items }) => {
  const itemsHtml = items.map((item, idx) => {
    const handleClick = item.onClick
    if (item.dropdownItems != null) {
      const dropdownItemsHtml = item.dropdownItems.map((group, gidx) => {
        const dropdownGroup: JSX.Element[] = []
        if (gidx > 0) {
          dropdownGroup.push(
            <DropdownDivider
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
              key={`divider-${gidx}-${idx}`}
              data-testid="toolbar-dropdown-divider"
            />,
          )
        }

        group.forEach((dropdownItem, idx) => {
          const dropdownItemHandleClick = dropdownItem.onClick
          dropdownGroup.push(
            <DropdownItem
              // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
              key={`dropdown-${gidx}-${idx}`}
              label={dropdownItem.label}
              className={dropdownItem.className}
              onClick={dropdownItemHandleClick}
              data-testid="toolbar-dropdown-item"
              disabled={dropdownItem.href == null && dropdownItem.disabled}
            />,
          )
        })

        return dropdownGroup
      })
      return (
        dropdownItemsHtml.length > 0 && (
          <Dropdown
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
            key={`dropdown-${idx}`}
            dropdownLabel={
              <Button
                // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
                key={`button-${idx}`}
                size={item.size}
                variant={item.variant}
                disabled={item.disabled}
                onClick={handleClick}
                alignItems="center"
                className={item.className}
                data-testid="toolbar-dropdown-button"
              >
                {item.icon != null && (
                  <Icon name={item.icon} size={16} weight="bold" />
                )}
                {item.label}
              </Button>
            }
            dropdownItems={dropdownItemsHtml}
            className={item.className}
            data-testid="toolbar-dropdown"
          />
        )
      )
    } else {
      return (
        <Button
          // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the list is static and does not change.
          key={`button-${idx}`}
          size={item.size}
          variant={item.variant}
          disabled={item.disabled}
          onClick={handleClick}
          alignItems="center"
          className={item.className}
          data-testid="toolbar-button"
        >
          {item.icon != null && <Icon name={item.icon} size={16} />}
          {item.label}
        </Button>
      )
    }
  })

  if (itemsHtml.length === 0) {
    return null
  }

  return (
    <div className="flex items-center gap-2" data-testid="toolbar">
      {itemsHtml}
    </div>
  )
})
