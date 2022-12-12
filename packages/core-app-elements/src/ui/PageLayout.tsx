import { ReactNode } from 'react'
import { Container } from './Container'
import { PageHeading, PageHeadingProps } from './PageHeading'

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
  ...rest
}: PageLayoutProps): JSX.Element {
  return (
    <Container {...rest}>
      <PageHeading
        title={title}
        description={description}
        onGoBack={onGoBack}
      />
      {children}
    </Container>
  )
}

export default PageLayout
