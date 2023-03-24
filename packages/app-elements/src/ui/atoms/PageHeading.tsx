import cn from 'classnames'
import { ReactNode } from 'react'
import { ArrowLeft } from 'phosphor-react'
import { Badge, BadgeVariant } from './Badge'

export interface PageHeadingProps {
  /**
   * Main page title wrapped in a h1 element
   */
  title: ReactNode
  /**
   * A short text that helps to describe the page
   */
  description?: ReactNode
  /**
   * Optional callback that will be called when "go back" button is pressed
   * If missing, the "go back" button will not be shown
   */
  onGoBack?: () => void
  /**
   * If `true` removes element vertical paddings
   */
  noGap?: boolean
  /**
   * When set, it will render a badge (warning variant)
   */
  badgeLabel?: string
  /**
   * When set, it will render a badge (default as warning variant) above the title
   */
  badgeVariant?: BadgeVariant
  /**
   * When set, it will render a button on the right side of the first row
   */
  actionButton?: React.ReactNode
}

function PageHeading({
  noGap = false,
  badgeLabel,
  onGoBack,
  title,
  description,
  badgeVariant = 'warning-solid',
  actionButton,
  ...rest
}: PageHeadingProps): JSX.Element {
  return (
    <div className={cn(['w-full', { 'pt-10 pb-14': !noGap }])} {...rest}>
      {(onGoBack != null || actionButton != null) && (
        <div
          className={cn(
            {
              'mb-4': badgeLabel == null,
              'mb-2': badgeLabel != null
            },
            'flex items-center justify-between'
          )}
        >
          {onGoBack != null ? (
            <button onClick={onGoBack}>
              <ArrowLeft className='text-2.5xl' />
            </button>
          ) : null}
          {actionButton != null ? <div>{actionButton}</div> : null}
        </div>
      )}
      {badgeLabel != null && (
        <div className='my-4 md:!mt-0' data-test-id='page-heading-badge'>
          <Badge variant={badgeVariant} label={badgeLabel} />
        </div>
      )}
      <h1 className='font-semibold text-title leading-title'>{title}</h1>
      {description !== null && (
        <div className='text-gray-500 leading-6 pt-2'>{description}</div>
      )}
    </div>
  )
}

PageHeading.displayName = 'PageHeading'
export { PageHeading }
