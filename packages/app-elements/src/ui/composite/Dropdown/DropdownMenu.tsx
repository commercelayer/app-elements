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
  /**
   * Opening position of the dropdown menu
   * @default bottom-right
   */
  menuPosition?: 'bottom-left' | 'bottom-right' | 'top-left' | 'top-right'
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  arrow,
  menuHeader,
  menuPosition = 'bottom-right',
  ...rest
}) => {
  return (
    <div
      className={cn('flex', {
        'flex-col items-end': menuPosition === 'bottom-right',
        'flex-col items-start': menuPosition === 'bottom-left',
        'flex-col-reverse items-end': menuPosition === 'top-right',
        'flex-col-reverse items-start': menuPosition === 'top-left'
      })}
    >
      {arrow === 'none' ? null : (
        <Arrow menuPosition={menuPosition} centerForWidth={32} />
      )}
      <div
        {...rest}
        className='bg-black text-white rounded min-w-[150px] overflow-hidden py-1 sm:max-w-[250px]'
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

const Arrow: FC<{
  menuPosition: DropdownMenuProps['menuPosition']
  centerForWidth: number
}> = ({ menuPosition = 'bottom-right', centerForWidth }) => {
  const arrowHeight = 5
  const arrowWidth = 12
  const centeringOffset = centerForWidth / 2 - arrowWidth / 2

  const alignProp = menuPosition.includes('right') ? 'right' : 'left'
  const arrowDirection =
    menuPosition === 'bottom-right' || menuPosition === 'bottom-left'
      ? 'top'
      : 'bottom'
  const cssForPointingDirection =
    arrowDirection === 'top'
      ? {
          borderBottomWidth: arrowHeight,
          borderTopColor: 'transparent'
        }
      : {
          borderTopWidth: arrowHeight,
          borderBottomColor: 'transparent'
        }

  return (
    <span
      className='relative border-black border-l-transparent border-r-transparent'
      style={{
        // base styles
        borderLeftWidth: arrowWidth / 2,
        borderRightWidth: arrowWidth / 2,
        ...cssForPointingDirection,
        // keep the arrow centered on the dropdown button
        [alignProp]: centeringOffset
      }}
    />
  )
}
