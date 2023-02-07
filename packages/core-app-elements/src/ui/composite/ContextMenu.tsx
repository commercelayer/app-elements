import { DropdownMenu } from '#ui/atoms/dropdown'
import { useClickAway } from '#hooks/useClickAway'
import { useState } from 'react'

interface Props {
  menuLabel: React.ReactNode
  menuItems: React.ReactNode
}

export function ContextMenu({
  menuLabel,
  menuItems,
  ...rest
}: Props): JSX.Element {
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
    <div {...rest} ref={showDropdownMenu ? clickAwayRef : undefined}>
      <button
        className='cursor-pointer select-none'
        onClick={() => {
          toggleDropdownMenu()
        }}
      >
        {menuLabel}
      </button>
      {showDropdownMenu && (
        <div className='relative'>
          <div
            className='absolute top-0 right-0'
            onClick={closeDropdownMenuIfButtonClicked}
          >
            <DropdownMenu>{menuItems}</DropdownMenu>
          </div>
        </div>
      )}
    </div>
  )
}

export default ContextMenu
