import { ReactNode } from 'react'
import { Skeleton, SkeletonItem } from './Skeleton'

interface Props {
  label: string
  children: ReactNode
  isLoading?: boolean
}

export function DetailsRow({
  label,
  children,
  isLoading,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      className='border-t last-of-type:border-b border-gray-100 py-4 px-3 flex gap-6'
      {...rest}
    >
      <div className='w-1/3 font-medium text-gray-500 text-[15px]'>{label}</div>
      <div className='flex-1 font-semibold'>
        {isLoading === true ? (
          <Skeleton>
            <SkeletonItem className='w-28 h-6' />
          </Skeleton>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default DetailsRow
