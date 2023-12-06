import { StatusIcon } from '#ui/atoms/StatusIcon'
import cn from 'classnames'
import React, { useMemo, type FC, type ReactNode } from 'react'

export interface OrganizationMenuItemProps
  extends Omit<
    React.AnchorHTMLAttributes<HTMLAnchorElement>,
    'children' | 'type'
  > {
  /**
   * the type will be used to render the icon and the label
   */
  type: 'home' | 'apps' | 'resources' | 'credentials' | 'team' | 'settings'
  /**
   * set the active status of the menu item
   */
  isActive?: boolean
}

/**
 * Render the wrapper for the OrganizationMenuItem
 */
export const OrganizationMenuItem: FC<OrganizationMenuItemProps> = ({
  type,
  href,
  onClick,
  isActive
}) => {
  const label = useMemo(() => {
    switch (type) {
      case 'home':
        return 'Home'
      case 'apps':
        return 'Apps'
      case 'resources':
        return 'Resources'
      case 'credentials':
        return 'API credentials'
      case 'team':
        return 'Team'
      case 'settings':
        return 'Settings'
    }
  }, [type])

  return (
    <a
      href={href}
      onClick={onClick}
      className={cn(
        'flex items-center gap-3 p-2 font-semibold rounded text-gray-700 hover:bg-gray-100 hover:text-black',
        { 'bg-gray-100 text-black': isActive === true }
      )}
    >
      <StatusIcon name={type} className='text-2xl' />
      {label}
    </a>
  )
}
OrganizationMenuItem.displayName = 'OrganizationMenuItem'

/**
 * Render the wrapper for the OrganizationMenuItem
 */
export const OrganizationMenu: FC<{ children: ReactNode }> = ({ children }) => {
  return <nav className='flex flex-col gap-1'>{children}</nav>
}
OrganizationMenu.displayName = 'OrganizationMenu'
