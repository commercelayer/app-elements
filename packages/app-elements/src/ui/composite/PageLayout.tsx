import { useTokenProvider } from '#providers/TokenProvider'
import type { ContainerProps } from '#ui/atoms/Container'
import { Container } from '#ui/atoms/Container'
import { PageHeading, type PageHeadingProps } from '#ui/atoms/PageHeading'
import { ScrollToTop } from '#ui/atoms/ScrollToTop'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Overlay } from '#ui/internals/Overlay'
import { type ReactNode } from 'react'

export interface PageLayoutProps
  extends Pick<
      PageHeadingProps,
      'title' | 'description' | 'navigationButton' | 'toolbar' | 'gap'
    >,
    Pick<ContainerProps, 'minHeight'> {
  /**
   * Page content
   */
  children: ReactNode
  /**
   * When mode is `test`, it will render a `TEST DATA` Badge to inform user api is working in test mode.
   * Only if app is standalone mode.
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

export const PageLayout = withSkeletonTemplate<PageLayoutProps>(
  ({
    title,
    description,
    navigationButton,
    children,
    toolbar,
    mode,
    gap,
    minHeight,
    scrollToTop,
    overlay = false,
    isLoading,
    delayMs,
    ...rest
  }) => {
    const {
      settings: { isInDashboard }
    } = useTokenProvider()

    const component = (
      <>
        <PageHeading
          title={title}
          description={description}
          navigationButton={navigationButton}
          toolbar={toolbar}
          badge={
            mode === 'test' && !isInDashboard
              ? {
                  label: 'TEST DATA',
                  variant: 'warning-solid'
                }
              : undefined
          }
          gap={gap}
          isLoading={isLoading}
          delayMs={delayMs}
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
)

PageLayout.displayName = 'PageLayout'
