import cn from 'classnames'
import { Children, type JSX, type ReactNode } from 'react'

export type FlexRowAlignItems = 'top' | 'bottom' | 'center'
export interface FlexRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ReactNode
  /**
   * Flex item alignment
   */
  alignItems?: FlexRowAlignItems
}

function FlexRow({
  children,
  className,
  alignItems = 'top',
  ...rest
}: FlexRowProps): JSX.Element {
  const childrenCount = Children.count(children)
  return (
    <div
      className={cn(
        'flex justify-between w-full gap-4',
        {
          'items-center': alignItems === 'center',
          'items-start': alignItems === 'top',
          'items-end': alignItems === 'bottom'
        },
        className
      )}
      {...rest}
    >
      {Children.map(children, (child, index) => (
        <div
          className={cn({
            'flex-grow': !isLastOfMultipleChildren(index, childrenCount),
            'text-right': isLastOfMultipleChildren(index, childrenCount)
          })}
        >
          {child}
        </div>
      ))}
    </div>
  )
}

FlexRow.displayName = 'FlexRow'
export { FlexRow }

function isLastOfMultipleChildren(index: number, count: number): boolean {
  return count > 1 && index === count - 1
}
