import cn from 'classnames'
import { useEffect, useState, type FC } from 'react'
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
  /**
   * If set, the arrow will be centered when trigger button is smaller than 50px
   * Otherwise it will fallback to a default centering based on 32px trigger button
   */
  parentElementRef?: React.RefObject<HTMLDivElement>
}

export const DropdownMenu: FC<DropdownMenuProps> = ({
  children,
  arrow,
  menuHeader,
  menuPosition = 'bottom-right',
  parentElementRef,
  ...rest
}) => {
  const [centerToWidth, setCenterToWidth] = useState<number>()
  useEffect(() => {
    setCenterToWidth(parentElementRef?.current?.clientWidth)
  }, [parentElementRef])

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
        <Arrow menuPosition={menuPosition} centerToWidth={centerToWidth} />
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
  centerToWidth?: number
}> = ({ menuPosition = 'bottom-right', centerToWidth }) => {
  const arrowHeight = 5
  const arrowWidth = 12

  const centeringOffset = calculateArrowCenteringOffset({
    arrowWidth,
    centerToWidth
  })

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

// Calculate the offset for centering the arrow on the dropdown button when this does not excide 50px
// This means that for smaller buttons (up to 50px) the arrow will be centered on the button
// otherwise it will 10px from the left or right as design system
function calculateArrowCenteringOffset({
  arrowWidth,
  centerToWidth
}: {
  arrowWidth: number
  centerToWidth?: number
}): number {
  if (centerToWidth == null || centerToWidth > 50) {
    return 10 // default offset calculated on a base of 32px button width
  }

  const centeringOffset = centerToWidth / 2 - arrowWidth / 2
  return centeringOffset
}
