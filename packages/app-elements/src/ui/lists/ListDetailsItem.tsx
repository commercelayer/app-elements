import { Children, ReactNode } from 'react'
import { Skeleton, SkeletonItem } from '#ui/atoms/Skeleton'
import classNames from 'classnames'
import { isSpecificReactComponent } from '#utils/children'

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
}

function ListDetailsItem({
  label,
  children,
  isLoading,
  ...rest
}: ListDetailsItemProps): JSX.Element {
  const childrenHaveInternalPadding = (
    Children.map(children, (child) =>
      isSpecificReactComponent(child, 'CopyToClipboard')
    ) ?? []
  ).some(Boolean)

  return (
    <div
      className='border-t last-of-type:border-b border-gray-100 overflow-hidden flex flex-col md:!flex-row px-4 py-4 md:!py-2 md:!gap-4'
      {...rest}
    >
      <div className='text-gray-500 font-medium flex-none w-5/12 md:!py-2'>
        {label}
      </div>
      <div
        className={classNames('w-full overflow-x-auto font-semibold', {
          'py-2': !childrenHaveInternalPadding
        })}
      >
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

ListDetailsItem.displayName = 'ListDetailsItem'
export { ListDetailsItem }
