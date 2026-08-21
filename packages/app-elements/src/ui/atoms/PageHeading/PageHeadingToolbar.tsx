import type { DropdownItemProps } from "#ui/composite/Dropdown/DropdownItem"
import {
  Toolbar,
  type ToolbarItem,
  type ToolbarProps,
} from "#ui/composite/Toolbar"
import { withSkeletonTemplate } from "../SkeletonTemplate"

type ToolbarButton = Omit<ToolbarItem, "dropdownItems">

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
    // A lone button is kept as a button at every size: there is nothing to
    // reorganize, and moving a single action into a dropdown only hides it
    const isSingleButton = buttons.length === 1

    // Initialize the toolbar items list with the buttons
    const toolbarItems: ToolbarProps["items"] = buttons.map((button, idx) => {
      const isShown =
        isSingleButton ||
        ((button.variant == null || button.variant === "primary") && idx === 0)
      return {
        ...button,
        // On mobile devices only the first primary button is shown outside the dropdown.
        // `max-md:hidden` rather than `hidden md:flex`: a `Button` always carries
        // `inline-flex`, which is declared after `hidden` in the stylesheet and would
        // win over it — only a media query can hide it.
        className: !isShown ? "max-md:hidden" : "",
      }
    })

    // Calculate the list of buttons that will be shown as dropdown items in the dropdown
    const buttonsForDropdown: DropdownItemProps[] = buttons
      .filter(
        (button, idx) =>
          !isSingleButton &&
          ((button.variant != null && button.variant !== "primary") || idx > 0),
      )
      .map((button) => {
        return {
          ...button,
          label: button.label ?? "",
          className: "md:hidden",
        }
      })
    const [firstDropdownItemsGroup = [], ...otherDropdownItems] = dropdownItems
    // Calculate the flat array of all dropdown items made of buttons and dropdown items
    const combinedDropdownItems = [
      buttonsForDropdown.concat(firstDropdownItemsGroup),
    ].concat(otherDropdownItems)

    // Add dropdown to toolbar items
    if (combinedDropdownItems.flat().length > 0) {
      toolbarItems.push({
        icon: "dotsThree",
        size: "small",
        variant: "secondary",
        // same reason as above: the base `flex` is redundant and `md:hidden` is what
        // actually takes the dropdown away once the buttons themselves fit
        className: dropdownItems.flat().length > 0 ? "" : "md:hidden",
        dropdownItems: combinedDropdownItems,
      })
    }

    if (toolbarItems.length > 0) {
      return <Toolbar items={toolbarItems} />
    }
  },
)
