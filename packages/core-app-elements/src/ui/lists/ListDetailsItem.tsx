import { ReactNode } from 'react'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
import classNames from 'classnames'

interface ListDetailsItemProps {
  /**
   * label to show on the left side. In a key/value pair, this is the `key`
   */
  label: string
  /**
   * content to show on the right side.
   * It represent the value.
   * Most of the type it should be a `<CopyToClipboard>` component
   */
  children: ReactNode
  /**
   * To show the skeleton item while `children` ar not yet. Label is always rendered
   */
  isLoading?: boolean
  /**
   * add extra padding to the right column (the value)
   */
  hasGutter?: boolean
}

export function ListDetailsItem({
  label,
  children,
  hasGutter,
  isLoading,
  ...rest
}: ListDetailsItemProps): JSX.Element {
  return (
    <div
      className='border-t last-of-type:border-b border-gray-100 overflow-hidden flex flex-col md:!items-center md:!flex-row py-2'
      {...rest}
    >
      <div className='text-gray-500 text-sm flex-none w-5/12'>{label}</div>
      <div
        className={classNames('w-full overflow-x-auto font-bold text-sm', {
          'md:!px-4 py-2.5': hasGutter
        })}
      >
        {isLoading === true ? (
          <Skeleton>
            <SkeletonItem className='w-28 h-[21px]' />
          </Skeleton>
        ) : (
          children
        )}
      </div>
    </div>
  )
}

export default ListDetailsItem
