import { Button, type ButtonProps } from '#ui/atoms/Button'
import { Icon, type IconProps } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  Dropdown,
  DropdownDivider,
  DropdownItem,
  type DropdownItemProps
} from '#ui/composite/Dropdown'

interface ToolbarAction {
  label?: string
  icon?: IconProps['name']
  size?: ButtonProps['size']
  variant?: ButtonProps['variant']
  onClick?: ButtonProps['onClick']
  dropdownItems?: DropdownItemProps[][]
}

export interface ToolbarProps {
  actions: ToolbarAction[]
}

export const Toolbar = withSkeletonTemplate<ToolbarProps>(({ actions }) => {
  const actionsHtml = actions.map((action, idx) => {
    const children = action.dropdownItems
    const hasChildren = children != null && children.length > 0
    const handleClick = action.onClick
    if (hasChildren) {
      const dropdownItemsHtml = children.map((group, gidx) => {
        const dropdownGroup: JSX.Element[] = []
        if (gidx > 0) {
          dropdownGroup.push(<DropdownDivider key={`divider-${gidx}-${idx}`} />)
        }

        group.forEach((dropdownItem, idx) => {
          const dropdownItemHandleClick = dropdownItem.onClick
          dropdownGroup.push(
            <DropdownItem
              key={`dropdown-${gidx}-${idx}`}
              label={dropdownItem.label}
              onClick={dropdownItemHandleClick}
            />
          )
        })

        return dropdownGroup
      })
      return (
        dropdownItemsHtml.length > 0 && (
          <Dropdown
            key={`dropdown-${idx}`}
            dropdownLabel={
              <Button
                key={`button-${idx}`}
                size={action.size}
                variant={action.variant}
                onClick={handleClick}
                alignItems='center'
              >
                {action.icon != null && (
                  <Icon name={action.icon} size={16} weight='bold' />
                )}
                {action.label}
              </Button>
            }
            dropdownItems={dropdownItemsHtml}
          />
        )
      )
    } else {
      return (
        <Button
          key={`button-${idx}`}
          size={action.size}
          variant={action.variant}
          onClick={handleClick}
          alignItems='center'
        >
          {action.icon != null && (
            <Icon name={action.icon} size={16} weight='bold' />
          )}
          {action.label}
        </Button>
      )
    }
  })
  return <div className='flex items-center gap-2'>{actionsHtml}</div>
})
