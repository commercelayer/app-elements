import { DotsThreeCircle } from 'phosphor-react'
import { DropdownMenu } from '#ui/atoms/dropdown'
import { useClickAway } from '#hooks/useClickAway'
import { useState } from 'react'

interface Props {
  menuLabel?: React.ReactNode
  menuItems: React.ReactNode
}

function ContextMenu({
  menuLabel = <DotsThreeCircle className='text-2.5xl' />,
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
        className='cursor-pointer select-none m-0 p-0 mr-[2px] block'
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

ContextMenu.displayName = 'ContextMenu'
export { ContextMenu }
