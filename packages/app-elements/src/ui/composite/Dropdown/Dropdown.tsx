import { useClickAway } from '#hooks/useClickAway'
import { useOnBlurFromContainer } from '#hooks/useOnBlurFromContainer'
import { Button } from '#ui/atoms/Button'
import { type DropdownMenuProps } from '#ui/composite/Dropdown/DropdownMenu'
import { isSpecificJsxTag, isSpecificReactComponent } from '#utils/children'
import { CaretDown, DotsThreeCircle } from '@phosphor-icons/react'
import cn from 'classnames'
import { Children, cloneElement, useMemo, useState } from 'react'
import { DropdownMenu } from './DropdownMenu'

export interface DropdownProps
  extends Pick<DropdownMenuProps, 'menuHeader' | 'menuPosition' | 'menuWidth'> {
  /** The trigger for the dropdown menu. Can be a JSX Element or simply a `string`. */
  dropdownLabel?: React.ReactNode
  /** List of links and actions. You can use a combination of `DropdownItem` and `DropdownDivider` components. */
  dropdownItems: React.ReactNode
  /** Additional class name for the dropdown container. */
  className?: string
}

/**
 * Dropdown is toggleable, contextual overlay for displaying lists of links and actions.
 *
 * There are 2 components for rendering the list you can pass to the `dropdownItems` prop:
 * - `DropdownItem`: The trigger that handles dropdown selection.
 * - `DropdownDivider`: A visual separator for dropdown items.
 */
export const Dropdown: React.FC<DropdownProps> = ({
  dropdownLabel = <DotsThreeCircle size={32} />,
  menuHeader,
  dropdownItems,
  menuPosition = 'bottom-right',
  menuWidth,
  className
}) => {
  const [isExpanded, setIsExpanded] = useState(false)

  function toggle(): void {
    setIsExpanded(!isExpanded)
  }

  function close(): void {
    setIsExpanded(false)
  }

  const clickAwayRef = useClickAway(close)

  const closeDropdownMenuIfButtonClicked = (
    e: React.MouseEvent<HTMLElement>
  ): void => {
    if ((e.target as any).nodeName === 'BUTTON') {
      close()
    }
  }

  const handleBlur = useOnBlurFromContainer(close)

  if (Children.count(dropdownItems) === 0) {
    return null
  }

  const dropdownButton = useMemo(() => {
    if (
      isSpecificReactComponent(dropdownLabel, [/^Button$/]) ||
      isSpecificJsxTag(dropdownLabel, ['button'])
    ) {
      return cloneElement(dropdownLabel, {
        'aria-haspopup': true,
        'aria-expanded': isExpanded,
        onClick: () => {
          toggle()
        }
      })
    }

    return (
      <Button
        variant='link'
        aria-haspopup
        aria-expanded={isExpanded}
        className={cn('m-0 p-0 align-top', {
          '!text-black': typeof dropdownLabel !== 'string',
          '!no-underline hover:!underline': typeof dropdownLabel === 'string'
        })}
        onClick={() => {
          toggle()
        }}
      >
        {dropdownLabel}
        {typeof dropdownLabel === 'string' ? (
          <CaretDown className='inline-block ml-1 -mt-0.5' weight='bold' />
        ) : null}
      </Button>
    )
  }, [dropdownLabel, isExpanded])

  return (
    <div
      ref={isExpanded ? clickAwayRef : undefined}
      onBlur={handleBlur}
      className={cn('relative', className)}
    >
      {dropdownButton}
      {isExpanded && (
        <div
          className={cn('absolute z-30', {
            'top-full mt-[5px] right-0': menuPosition === 'bottom-right',
            'top-full mt-[5px] left-0': menuPosition === 'bottom-left',
            'bottom-full mb-[5px] right-0': menuPosition === 'top-right',
            'bottom-full mb-[5px] left-0': menuPosition === 'top-left'
          })}
          onClick={closeDropdownMenuIfButtonClicked}
        >
          <DropdownMenu
            menuHeader={menuHeader}
            menuPosition={menuPosition}
            parentElementRef={clickAwayRef}
            menuWidth={menuWidth}
          >
            {dropdownItems}
          </DropdownMenu>
        </div>
      )}
    </div>
  )
}

Dropdown.displayName = 'Dropdown'
