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
    const dropdownMobileButtons: DropdownItemProps[] = buttons.map(
      (button) => ({
        ...button,
        label: button.label ?? '',
        className: 'flex md:hidden'
      })
    )

    const [firstDropdownItemsGroup = [], ...otherDropdownItems] = dropdownItems

    const combinedDropdownItems = [
      dropdownMobileButtons.concat(firstDropdownItemsGroup)
    ].concat(otherDropdownItems)

    const toolbarItems: ToolbarProps['items'] = buttons.map((button) => ({
      ...button,
      className: 'hidden md:flex'
    }))

    if (combinedDropdownItems.flat().length > 0) {
      toolbarItems.push({
        icon: 'dotsThree',
        size: 'small',
        variant: 'secondary',
        className: dropdownItems.length > 0 ? '' : 'flex md:hidden',
        dropdownItems: combinedDropdownItems
      })
    }

    if (toolbarItems.length > 0) {
      return <Toolbar items={toolbarItems} />
    }
  }
)
