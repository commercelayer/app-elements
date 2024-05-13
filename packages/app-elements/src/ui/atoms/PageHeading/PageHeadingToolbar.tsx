import { withSkeletonTemplate } from '../SkeletonTemplate'
import {
  Toolbar,
  type ToolbarProps,
  type ToolbarItem
} from '#ui/composite/Toolbar'

import { type DropdownItemProps } from '#ui/composite/Dropdown/DropdownItem'

type ToolbarButton = Omit<ToolbarItem, 'dropdownItems'>

export interface PageHeadingToolbarProps {
  /**
   * Toolbar first level `Button`s.
   */
  buttons?: ToolbarButton[]
  /**
   * Toolbar dropdown items sets. They are rendered in a generated `Dropdown`.
   */
  dropdownItems?: DropdownItemProps[][]
}

/**
 * This component renders a simple top right bar with just `buttons` and `dropdownItems` optional props.
 * It will use the `Toolbar` component UI to render properly the given items providing automated responsive behaviors to reorganize them.
 */
export const PageHeadingToolbar = withSkeletonTemplate<PageHeadingToolbarProps>(
  ({ buttons, dropdownItems }) => {
    const toolbarItems: ToolbarProps['items'] = []
    const dropdownItemsToAdd: DropdownItemProps[] = []

    buttons?.forEach((button) => {
      // Desktop only button is pushed to the first level of the toolbar
      toolbarItems.push({
        ...button,
        className: 'hidden md:flex'
      })

      // Mobile only dropdown item is pushed to a list that will be merged at the beginning of first dropdown items group of the toolbar
      const dropdownItemWithCss = {
        ...button,
        className: 'flex md:hidden'
      }
      dropdownItemsToAdd.push(dropdownItemWithCss as DropdownItemProps)
    })

    const toolbarDropDown: ToolbarItem = {
      icon: 'dotsThree',
      size: 'small',
      variant: 'secondary'
    }
    const toolbarDropDownItems: DropdownItemProps[][] = []
    if (dropdownItems != null && dropdownItems.length > 0) {
      // If `dropdownItems` are set we need to insert `dropdownItemsToAdd` items at the beginning of the first group
      dropdownItems.forEach((group, index) => {
        if (index === 0 && dropdownItemsToAdd.length > 0) {
          toolbarDropDownItems.push(dropdownItemsToAdd.concat(group))
        } else {
          toolbarDropDownItems.push(group)
        }
      })
    } else {
      // If `dropdownItems` are not set we will have a mobile only dropdown showing `dropdownItemsToAdd` items
      if (dropdownItemsToAdd.length > 0) {
        toolbarDropDownItems.push(dropdownItemsToAdd)
      }
      toolbarDropDown.className = 'flex md:hidden'
    }
    toolbarDropDown.dropdownItems = toolbarDropDownItems
    if (toolbarDropDownItems.length > 0) {
      toolbarItems.push(toolbarDropDown)
    }

    if (toolbarItems.length > 0) {
      return <Toolbar items={toolbarItems} />
    }
  }
)
