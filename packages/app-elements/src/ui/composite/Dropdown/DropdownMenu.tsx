import cn from "classnames"
import type { FC } from "react"
import { DropdownDivider } from "./DropdownDivider"

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Menu content */
  children?: React.ReactNode
  /**
   * Set to `none` to hide the top arrow
   * @deprecated We decided to remove the arrow from the dropdown menu
   */
  arrow?: "none"
  /** Optional header for the dropdown menu */
  menuHeader?: string
  /**
   * Opening position of the dropdown menu
   * @default bottom-right
   */
  menuPosition?: "bottom-left" | "bottom-right" | "top-left" | "top-right"
  /**
   * If set, the arrow will be centered when trigger button is smaller than 50px
   * Otherwise it will fallback to a default centering based on 32px trigger button
   */
  parentElementRef?: React.RefObject<HTMLDivElement>
  /**
   * Set a wider menu, fixed to 280px.
   * By default, when no width is set, the menu adjusts its width dynamically to accommodate content, within a range of 150px to 250px.
   **/
  menuWidth?: "wide"
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  menuHeader,
  menuPosition = "bottom-right",
  parentElementRef,
  menuWidth,
  ...rest
}) => {
  return (
    <div
      className={cn("flex", {
        "flex-col items-end": menuPosition === "bottom-right",
        "flex-col items-start": menuPosition === "bottom-left",
        "flex-col-reverse items-end": menuPosition === "top-right",
        "flex-col-reverse items-start": menuPosition === "top-left",
      })}
    >
      <div
        {...rest}
        className={cn(
          "bg-black text-white rounded overflow-x-hidden overflow-y-auto max-h-[450px] py-2",
          {
            "min-w-[150px] md:max-w-[250px]": menuWidth == null, // default width
            "w-[280px]": menuWidth === "wide",
          },
        )}
      >
        {menuHeader != null && (
          <>
            <div
              className="py-2 px-4 text-gray-400 text-xs font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
              title={menuHeader}
            >
              {menuHeader}
            </div>
            <DropdownDivider />
          </>
        )}
        {children}
      </div>
    </div>
  )
}

DropdownMenu.displayName = "DropdownMenu"
