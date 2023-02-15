import cn from 'classnames'
import { Children } from 'react'

export interface FlexProps extends React.HTMLAttributes<HTMLDivElement> {
  children: React.ReactElement[]
}

function Flex({ children, className, ...rest }: FlexProps): JSX.Element {
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

Flex.displayName = 'Flex'
export { Flex }

function isLastOfMultipleChildren(index: number, count: number): boolean {
  return count > 1 && index === count - 1
}
