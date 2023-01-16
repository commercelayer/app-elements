import { ReactNode } from 'react'
import { Container } from '#ui/atoms/Container'
import { PageHeading, PageHeadingProps } from '#ui/atoms/PageHeading'

interface PageLayoutProps extends PageHeadingProps {
  /**
   * Page content
   */
  children: ReactNode
}

export function PageLayout({
  title,
  description,
  onGoBack,
  children,
  actionButton,
  ...rest
}: PageLayoutProps): JSX.Element {
  return (
    <Container {...rest}>
      <PageHeading
        title={title}
        description={description}
        onGoBack={onGoBack}
        actionButton={actionButton}
      />
      {children}
    </Container>
  )
}

export default PageLayout
