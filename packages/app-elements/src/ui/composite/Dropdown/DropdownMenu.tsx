import cn from 'classnames'
import { type FC } from 'react'
import { DropdownDivider } from './DropdownDivider'

export interface DropdownMenuProps extends React.HTMLAttributes<HTMLElement> {
  /** Menu content */
  children?: React.ReactNode
  /** Set to `none` to hide the top arrow */
  arrow?: 'none'
  /** Optional header for the dropdown menu */
  menuHeader?: string
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  arrow,
  menuHeader,
  ...rest
}) => {
  const showArrow = arrow === undefined
  const showArrowMenuCss = showArrow && 'mt-[5px]'

  // const arrowHeight = 5
  // const arrowWidth = 12

  const menuLabelSizeCss: Record<number, string[]> = {
    32: [
      'w-0 h-0',
      `absolute top-[-5px] right-[10px]`, // arrowHeight / 2 & (menuLabelSize - arrowWidth) / 2
      `border-b-[5px] border-b-black`, // arrowHeight / 2
      `border-l-[6px] border-l-transparent`, // arrowWidth / 2
      `border-r-[6px] border-r-transparent` // arrowWidth / 2
    ]
  }

  const arrowCss = cn(menuLabelSizeCss[32])

  return (
    <div className='relative'>
      {showArrow && <span className={arrowCss} />}
      <div
        {...rest}
        className={cn([
          'bg-black text-white rounded min-w-[150px] overflow-hidden py-1 sm:max-w-[250px]',
          showArrowMenuCss
        ])}
      >
        {menuHeader != null && (
          <>
            <div
              className='py-2 px-4 text-gray-400 text-xs font-semibold text-ellipsis overflow-hidden whitespace-nowrap'
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

DropdownMenu.displayName = 'DropdownMenu'
