import cn from 'classnames'
import { withSkeletonTemplate } from './SkeletonTemplate'

export interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Possible values are:
   * - `none`: 0rem, 0px
   * - `"1"`: 0.25rem, 4px
   * - `"4"`: 1rem, 16px
   * - `"6"`: 1.5rem, 24px
   *
   * @default 6
   */
  gap?: 'none' | '1' | '4' | '6'
  /**
   * Footer will render in a dedicated section below the main content.
   */
  footer?: React.ReactNode
  /**
   * Set the overflow behavior. In most of the cases you might want to keep overflow visible,
   * but when you have inner content with hover effects you might want to set overflow to hidden.
   */
  overflow: 'visible' | 'hidden'
  /**
   * Set a gray background color
   */
  backgroundColor?: 'light'
}

/** Card is a flexible component used to group and display content in a clear and concise format. */
export const Card = withSkeletonTemplate<CardProps>(
  ({
    className,
    children,
    gap = '6',
    isLoading,
    delayMs,
    footer,
    backgroundColor,
    overflow,
    ...rest
  }) => {
    return (
      <div
        className={cn([
          className,
          'border border-solid rounded-md',
          {
            'overflow-hidden': overflow === 'hidden',
            'border-gray-200 bg-white': backgroundColor == null,
            'bg-gray-50 border-gray-50': backgroundColor === 'light',
            'p-1': gap === '1',
            'p-4': gap === '4',
            'p-6': gap === '6'
          }
        ])}
        {...rest}
      >
        <div
          className={cn('rounded h-full', {
            'overflow-hidden': overflow === 'hidden'
          })}
        >
          {children}
        </div>
        {footer != null && (
          <div
            className={cn([
              'py-4 border-t',
              {
                '-mt-[1px]': gap === 'none',
                'mt-8': gap !== 'none',
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
