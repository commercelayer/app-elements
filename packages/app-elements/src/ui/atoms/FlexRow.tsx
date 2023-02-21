import cn from 'classnames'
import { Children } from 'react'

export interface FlexRowProps extends React.HTMLAttributes<HTMLDivElement> {
  children: ElementChildren
}

function FlexRow({ children, className, ...rest }: FlexRowProps): JSX.Element {
  const childrenCount = Children.count(children)
  return (
    <div
      className={cn('flex items-start justify-between w-full gap-4', className)}
      {...rest}
    >
      {Children.map(children, (child, index) => (
        <div
          className={cn({
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
