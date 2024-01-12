import { removeUnwantedProps } from '#utils/htmltags'
import cn from 'classnames'
import { withSkeletonTemplate } from './SkeletonTemplate'

export type CardProps = React.HTMLAttributes<HTMLDivElement> & {
  /**
   * Footer will render in a dedicated section below the main content.
   */
  footer?: React.ReactNode
  /**
   * Set a gray background color
   */
  backgroundColor?: 'light'
} & (
    | {
        /**
         * Possible values are:
         * - `"1"`: 0.25rem, 4px
         * - `"4"`: 1rem, 16px
         * - `"6"`: 1.5rem, 24px
         *
         * @default 6
         */
        gap?: '1' | '4' | '6'
        /**
         * Set the overflow behavior. In most of the cases you might want to keep overflow visible,
         * but when you have inner content with hover effects you might want to set overflow to hidden.
         */
        overflow: 'visible' | 'hidden'
      }
    | {
        /**
         * When card is rendered with no gap, overflow is always intended as hidden and cannot be controlled via props,
         * otherwise inner content will overlap the rounded corners of the card.
         */
        gap: 'none'
      }
  )

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
    ...rest
  }) => {
    const overflow = 'overflow' in rest ? rest.overflow : 'hidden'
    const divProps =
      'overflow' in rest ? removeUnwantedProps(rest, ['overflow']) : rest

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
        {...divProps}
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
