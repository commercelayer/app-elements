import cn from 'classnames'
import { withSkeletonTemplate } from './SkeletonTemplate'

interface Props extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Possible values are:
   * 1: 0.25rem, 4px
   * 4: 1rem, 16px
   * 6: 1.5rem, 24px
   *
   * @default '6'
   */
  gap?: '1' | '4' | '6'
}

export const Card = withSkeletonTemplate<Props>(
  ({ className, children, gap = '6', isLoading, delayMs, ...rest }) => {
    return (
      <div
        className={cn([
          className,
          'border border-solid border-gray-200 rounded-md overflow-hidden',
          {
            'p-1': gap === '1',
            'p-4': gap === '4',
            'p-6': gap === '6'
          }
        ])}
        {...rest}
      >
        <div className='rounded overflow-hidden'>{children}</div>
      </div>
    )
  }
)

Card.displayName = 'Card'
