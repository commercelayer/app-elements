import type { ContainerProps } from '#ui/atoms/Container'
import { Container } from '#ui/atoms/Container'
import { PageHeading, type PageHeadingProps } from '#ui/atoms/PageHeading'
import { type ReactNode } from 'react'

export interface PageLayoutProps
  extends Pick<
      PageHeadingProps,
      'title' | 'description' | 'onGoBack' | 'actionButton' | 'gap'
    >,
    Pick<ContainerProps, 'minHeight'> {
  /**
   * Page content
   */
  children: ReactNode
  /**
   * When mode is `test`, it will render a `TEST DATA` Badge to inform user api is working in test mode.
   */
  mode?: 'test' | 'live'
}

function PageLayout({
  title,
  description,
  onGoBack,
  children,
  actionButton,
  mode,
  gap,
  minHeight,
  ...rest
}: PageLayoutProps): JSX.Element {
  return (
    <Container minHeight={minHeight} {...rest}>
      <PageHeading
        title={title}
        description={description}
        onGoBack={onGoBack}
        actionButton={actionButton}
        badgeLabel={mode === 'test' ? 'TEST DATA' : undefined}
        badgeVariant={mode === 'test' ? 'warning-solid' : undefined}
        gap={gap}
      />
      {children}
    </Container>
  )
}

PageLayout.displayName = 'PageLayout'
export { PageLayout }
