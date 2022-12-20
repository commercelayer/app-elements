import { CaretRight } from 'phosphor-react'
import cn from 'classnames'

export interface ListItemProps extends React.HTMLAttributes<HTMLDivElement> {
  label: string
  description?: React.ReactNode
  icon?: React.ReactNode
}

export function ListItem({
  label,
  description,
  icon,
  className,
  ...rest
}: ListItemProps): JSX.Element {
  return (
    <div
      {...rest}
      className={cn(
        'flex justify-between items-center p-4 border-b border-gray-100',
        { 'cursor-pointer hover:bg-gray-50': rest.onClick != null },
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
      <CaretRight />
    </div>
  )
}

export default ListItem
