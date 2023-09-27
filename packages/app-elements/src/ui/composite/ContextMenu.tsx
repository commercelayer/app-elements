import { useClickAway } from '#hooks/useClickAway'
import { Button } from '#ui/atoms/Button'
import { DropdownMenu } from '#ui/atoms/dropdown'
import { CaretDown, DotsThreeCircle } from '@phosphor-icons/react'
import cn from 'classnames'
import { useState } from 'react'

interface Props {
  menuLabel?: React.ReactNode
  menuItems: React.ReactNode
}

export const ContextMenu: React.FC<Props> = ({
  menuLabel = <DotsThreeCircle size={32} />,
  menuItems,
  ...rest
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
    <div {...rest} ref={showDropdownMenu ? clickAwayRef : undefined}>
      <Button
        variant='link'
        className={cn('m-0 p-0 block', {
          '!text-black': typeof menuLabel !== 'string'
        })}
        onClick={() => {
          toggleDropdownMenu()
        }}
      >
        {menuLabel}
        {typeof menuLabel === 'string' ? (
          <CaretDown className='inline-block ml-1 -mt-0.5' weight='bold' />
        ) : null}
      </Button>
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
