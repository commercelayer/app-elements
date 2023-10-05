import { Container } from '#ui/atoms/Container'
import { EmptyState } from '#ui/atoms/EmptyState'
import { PageHeading } from '#ui/atoms/PageHeading'

export interface PageErrorProps {
  /**
   * Main page title wrapped in a h1 element
   */
  pageTitle?: string
  /**
   * Optional callback that will be called when "go back" button is pressed
   * If missing, the "go back" button will not be shown
   */
  onGoBack?: () => void
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
  onGoBack,
  errorName,
  errorDescription,
  actionButton,
  ...rest
}: PageErrorProps): JSX.Element {
  return (
    <Container {...rest}>
      <PageHeading title={pageTitle} onGoBack={onGoBack} />
      <EmptyState
        title={errorName}
        description={errorDescription}
        action={actionButton}
      />
    </Container>
  )
}

PageError.displayName = 'PageError'
