import { Container } from '#ui/atoms/Container'
import { EmptyState } from '#ui/atoms/EmptyState'
import { PageHeading, type PageHeadingProps } from '#ui/atoms/PageHeading'
import { type JSX } from 'react'

export interface PageErrorProps
  extends Pick<PageHeadingProps, 'navigationButton'> {
  /**
   * Main page title wrapped in a h1 element
   */
  pageTitle?: string

  /**
   * The name of the error to be show above the detailed message text.
   * Example: 'Not Found'
   */
  errorName: string
  /**
   * Detailed message that explains the error better.
   * Example: 'We could not find the page you are looking for.'
   */
  errorDescription: string
  /**
   * Any element that can be used as CTA to help the user to navigate away from this error page
   */
  actionButton?: JSX.Element
}

export function PageError({
  pageTitle = 'Commerce Layer',
  navigationButton,
  errorName,
  errorDescription,
  actionButton,
  ...rest
}: PageErrorProps): JSX.Element {
  return (
    <Container {...rest}>
      <PageHeading title={pageTitle} navigationButton={navigationButton} />
      <EmptyState
        title={errorName}
        description={errorDescription}
        action={actionButton}
      />
    </Container>
  )
}

PageError.displayName = 'PageError'
