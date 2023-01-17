import { ReactNode } from 'react'
import { Container } from '#ui/atoms/Container'
import { PageHeading, PageHeadingProps } from '#ui/atoms/PageHeading'

interface PageLayoutProps
  extends Omit<PageHeadingProps, 'badgeVariant' | 'badgeLabel'> {
  /**
   * Page content
   */
  children: ReactNode
  /**
   * When `true` it will render a `TEST DATA` Badge to inform user test mode is on.
   */
  isTestMode?: boolean
}

export function PageLayout({
  title,
  description,
  onGoBack,
  children,
  actionButton,
  isTestMode,
  ...rest
}: PageLayoutProps): JSX.Element {
  return (
    <Container {...rest}>
      <PageHeading
        title={title}
        description={description}
        onGoBack={onGoBack}
        actionButton={actionButton}
        badgeLabel={isTestMode === true ? 'TEST DATA' : undefined}
        badgeVariant={isTestMode === true ? 'warning-solid' : undefined}
      />
      {children}
    </Container>
  )
}

export default PageLayout
