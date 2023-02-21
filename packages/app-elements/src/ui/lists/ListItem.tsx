import cn from 'classnames'
import { Icon } from '#ui/atoms/Icon'

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: React.ReactNode
  icon?: React.ReactNode
  noHover?: boolean
}

function ListItem({
  label,
  description,
  icon,
  className,
  noHover,
  ...rest
}: ListItemProps): JSX.Element {
  return (
    <div
      {...rest}
      className={cn(
        'flex justify-between items-center p-4 border-b border-gray-100',
        { 'cursor-pointer hover:bg-gray-50': noHover !== true },
        className
      )}
    >
      <div className='flex gap-4 items-center'>
        {icon != null && <div data-test-id='list-simple-item-icon'>{icon}</div>}
        <div>
          <div className='text-gray-800 font-semibold'>{label}</div>
          {description != null && (
            <div
              className='text-sm text-gray-500 leading-[22px]'
              data-test-id='list-simple-item-description'
            >
              {description}
            </div>
          )}
        </div>
      </div>
      <Icon name='caretRight' />
    </div>
  )
}

ListItem.displayName = 'ListItem'
export { ListItem }
