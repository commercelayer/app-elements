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
  footer?: React.ReactNode
}

export const Card = withSkeletonTemplate<Props>(
  ({ className, children, gap = '6', isLoading, delayMs, footer, ...rest }) => {
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
        {footer != null && (
          <div
            className={cn([
              'mt-8 py-4 border-t',
              {
                '-m-4 px-4': gap === '4',
                '-m-6 px-6': gap === '6'
              }
            ])}
          >
            {footer}
          </div>
        )}
      </div>
    )
  }
)

Card.displayName = 'Card'
