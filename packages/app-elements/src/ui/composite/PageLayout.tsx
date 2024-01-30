import type { ContainerProps } from '#ui/atoms/Container'
import { Container } from '#ui/atoms/Container'
import { PageHeading, type PageHeadingProps } from '#ui/atoms/PageHeading'
import { ScrollToTop } from '#ui/atoms/ScrollToTop'
import { Spacer } from '#ui/atoms/Spacer'
import { Overlay } from '#ui/internals/Overlay'
import { type ReactNode } from 'react'

export interface PageLayoutProps
  extends Pick<
      PageHeadingProps,
      'title' | 'description' | 'navigationButton' | 'actionButton' | 'gap'
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
  /**
   * Renders as overlay
   */
  overlay?: boolean
  /**
   * Optional prop to enable scroll to top behavior on location change
   */
  scrollToTop?: boolean
}

export function PageLayout({
  title,
  description,
  navigationButton,
  children,
  actionButton,
  mode,
  gap,
  minHeight,
  scrollToTop,
  overlay = false,
  ...rest
}: PageLayoutProps): JSX.Element {
  const component = (
    <>
      <PageHeading
        title={title}
        description={description}
        navigationButton={navigationButton}
        actionButton={actionButton}
        badgeLabel={mode === 'test' ? 'TEST DATA' : undefined}
        badgeVariant={mode === 'test' ? 'warning-solid' : undefined}
        gap={gap}
      />
      {children}
      {scrollToTop === true && <ScrollToTop />}
    </>
  )

  if (overlay) {
    return <Overlay backgroundColor='light'>{component}</Overlay>
  }

  return (
    <Container minHeight={minHeight} {...rest}>
      <Spacer bottom='14'>{component}</Spacer>
    </Container>
  )
}

PageLayout.displayName = 'PageLayout'
