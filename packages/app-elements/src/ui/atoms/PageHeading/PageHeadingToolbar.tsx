import {
  Toolbar,
  type ToolbarItem,
  type ToolbarProps
} from '#ui/composite/Toolbar'
import { withSkeletonTemplate } from '../SkeletonTemplate'

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
  ({ buttons = [], dropdownItems = [] }) => {
    // Initialize the toolbar items list with the buttons
    const toolbarItems: ToolbarProps['items'] = buttons.map((button, idx) => {
      const isShown =
        (button.variant == null || button.variant === 'primary') && idx === 0
      return {
        ...button,
        // On mobile devices only the first primary button is shown outside the dropdown
        className: !isShown ? 'hidden md:flex' : ''
      }
    })

    // Calculate the list of buttons that will be shown as dropdown items in the dropdown
    const buttonsForDropdown: DropdownItemProps[] = buttons
      .filter(
        (button, idx) =>
          (button.variant != null && button.variant !== 'primary') || idx > 0
      )
      .map((button) => {
        return {
          ...button,
          label: button.label ?? '',
          className: 'md:hidden'
        }
      })
    const [firstDropdownItemsGroup = [], ...otherDropdownItems] = dropdownItems
    // Calculate the flat array of all dropdown items made of buttons and dropdown items
    const combinedDropdownItems = [
      buttonsForDropdown.concat(firstDropdownItemsGroup)
    ].concat(otherDropdownItems)

    // Add dropdown to toolbar items
    if (combinedDropdownItems.flat().length > 0) {
      toolbarItems.push({
        icon: 'dotsThree',
        size: 'small',
        variant: 'secondary',
        className: dropdownItems.flat().length > 0 ? '' : 'flex md:hidden',
        dropdownItems: combinedDropdownItems
      })
    }

    if (toolbarItems.length > 0) {
      return <Toolbar items={toolbarItems} />
    }
  }
)
