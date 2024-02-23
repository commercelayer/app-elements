import { useTokenProvider } from '#providers/TokenProvider'
import { type PageHeadingProps } from '#ui/atoms/PageHeading'
import { type ReactNode } from 'react'
import { PageLayout } from './PageLayout'

export interface HomePageLayoutProps extends Pick<PageHeadingProps, 'title'> {
  /**
   * Page content
   */
  children: ReactNode
}

/**
 * This component renders a standard `PageLayout` but holds some logic
 * to define some default behavior for the home page, such as the navigation button label and action.
 */
export function HomePageLayout({
  title,
  children
}: HomePageLayoutProps): JSX.Element {
  const {
    settings: { mode, dashboardUrl, isInDashboard, onAppClose }
  } = useTokenProvider()

  return (
    <PageLayout
      title={title}
      mode={mode}
      gap='only-top'
      scrollToTop
      navigationButton={
        isInDashboard && onAppClose == null
          ? undefined
          : {
              // TODO: can we use only Apps (rename current dashboard)
              label: onAppClose != null ? 'Apps' : 'Hub',
              onClick: () => {
                if (onAppClose != null) {
                  onAppClose()
                } else {
                  window.location.href = `${dashboardUrl}/hub`
                }
              }
            }
      }
    >
      {children}
    </PageLayout>
  )
}

HomePageLayout.displayName = 'HomePageLayout'
