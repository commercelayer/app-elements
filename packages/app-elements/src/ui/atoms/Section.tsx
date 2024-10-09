import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { getInnerText } from '#utils/children'
import cn from 'classnames'
import React, { type ReactNode } from 'react'

export interface SectionProps {
  /** The content of the section. */
  children: React.ReactNode
  /**
   * Main section title.
   * When defined the component will render as a `<section>` HTML element; if **not** defined it will render as a `<div>` HTML element.
   */
  title?: ReactNode
  /** Size for the title prop. */
  titleSize?: 'normal' | 'small'
  /** Specify `none` to remove border. */
  border?: 'none'
  /** This will render a button on the right side of the row. */
  actionButton?: ReactNode
  /** CSS classes. */
  className?: string
}

/**
 * The Section component represents a section of the application. It can have a title and an action button.
 */
export const Section = withSkeletonTemplate<SectionProps>(
  ({
    children,
    title,
    titleSize = 'normal',
    actionButton,
    border,
    isLoading,
    delayMs,
    ...rest
  }) => {
    const Tag = title != null ? 'section' : 'div'
    return (
      <Tag
        {...rest}
        aria-label={title != null ? getInnerText(title) : undefined}
      >
        {(title != null || actionButton != null) && (
          <header
            className={cn('border-b pb-4 flex justify-between items-center', {
              'border-gray-100': border == null,
              'border-transparent': border === 'none'
            })}
          >
            {title != null && (
              <h2
                className={cn({
                  // titleSize
                  'text-gray-600 font-medium': titleSize === 'small',
                  'text-lg font-semibold': titleSize === 'normal'
                })}
              >
                {title}
              </h2>
            )}
            {actionButton != null && (
              <nav className='flex-grow text-right flex justify-end gap-2'>
                {actionButton}
              </nav>
            )}
          </header>
        )}
        <div>{children}</div>
      </Tag>
    )
  }
)

Section.displayName = 'Section'
