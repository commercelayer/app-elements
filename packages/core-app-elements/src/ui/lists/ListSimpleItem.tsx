import { CaretRight } from 'phosphor-react'

export interface ListSimpleItemProps {
  label: string
  description?: React.ReactNode
  icon?: React.ReactNode
}

export function ListSimpleItem({
  label,
  description,
  icon,
  ...rest
}: ListSimpleItemProps): JSX.Element {
  return (
    <div
      {...rest}
      className='flex justify-between items-center p-4 border-b border-gray-100  hover:bg-gray-50'
    >
      <div className='flex gap-4'>
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

export default ListSimpleItem
