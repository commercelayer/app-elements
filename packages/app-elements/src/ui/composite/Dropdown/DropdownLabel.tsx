import type { FC } from "react"

export interface DropdownLabelProps extends React.HTMLAttributes<HTMLElement> {
  /** The section title. */
  label: string
}

/**
 * A title for a group of items inside a `Dropdown`, such as "Sort by".
 *
 * Unlike `menuHeader`, which titles the whole menu, a label can open any section:
 * combine it with `DropdownDivider` to split a menu into titled groups. It is
 * aligned with the labels of items that have an icon (or `checked`), which is
 * what a section of checkable items looks like.
 */
export const DropdownLabel: FC<DropdownLabelProps> = ({ label, ...rest }) => {
  return (
    <div
      {...rest}
      className="py-1.5 pl-[2.625rem] pr-6 text-gray-500 text-xs font-semibold text-ellipsis overflow-hidden whitespace-nowrap"
      title={label}
    >
      {label}
    </div>
  )
}

DropdownLabel.displayName = "DropdownLabel"
