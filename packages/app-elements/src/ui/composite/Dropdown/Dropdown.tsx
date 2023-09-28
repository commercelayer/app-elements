import { useClickAway } from '#hooks/useClickAway'
import { Button } from '#ui/atoms/Button'
import { CaretDown, DotsThreeCircle } from '@phosphor-icons/react'
import cn from 'classnames'
import { useState } from 'react'
import { DropdownMenu } from './DropdownMenu'

interface DropdownProps {
  /** The trigger for the dropdown menu. Can be a JSX Element or simply a `string`. */
  dropdownLabel?: React.ReactNode
  /** List of links and actions. You can use a combination of `DropdownItem` and `DropdownDivider` components. */
  dropdownItems: React.ReactNode
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
  dropdownItems
}) => {
  const [showDropdownMenu, setShowDropdownMenu] = useState(false)

  function toggleDropdownMenu(): void {
    setShowDropdownMenu(!showDropdownMenu)
  }

  function closeDropdownMenu(): void {
    setShowDropdownMenu(false)
  }

  const clickAwayRef = useClickAway(closeDropdownMenu)

  const closeDropdownMenuIfButtonClicked = (
    e: React.MouseEvent<HTMLElement>
  ): void => {
    if ((e.target as any).nodeName === 'BUTTON') {
      closeDropdownMenu()
    }
  }

  return (
    <div ref={showDropdownMenu ? clickAwayRef : undefined}>
      <Button
        variant='link'
        className={cn('m-0 p-0 block', {
          '!text-black': typeof dropdownLabel !== 'string'
        })}
        onClick={() => {
          toggleDropdownMenu()
        }}
      >
        {dropdownLabel}
        {typeof dropdownLabel === 'string' ? (
          <CaretDown className='inline-block ml-1 -mt-0.5' weight='bold' />
        ) : null}
      </Button>
      {showDropdownMenu && (
        <div className='relative'>
          <div
            className='absolute top-0 right-0'
            onClick={closeDropdownMenuIfButtonClicked}
          >
            <DropdownMenu>{dropdownItems}</DropdownMenu>
          </div>
        </div>
      )}
    </div>
  )
}

Dropdown.displayName = 'Dropdown'
