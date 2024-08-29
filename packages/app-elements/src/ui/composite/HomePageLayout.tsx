import { useTokenProvider } from '#providers/TokenProvider'
import { type PageHeadingProps } from '#ui/atoms/PageHeading'
import { type PageHeadingToolbarProps } from '#ui/atoms/PageHeading/PageHeadingToolbar'
import { type ReactNode } from 'react'
import { PageLayout } from './PageLayout'

export interface HomePageLayoutProps extends Pick<PageHeadingProps, 'title'> {
  /**
   * Page content
   */
  children: ReactNode
  /**
   * When set, it will render a proper toolbar on the right side of the first row
   */
  toolbar?: PageHeadingToolbarProps
}

/**
 * This component renders a standard `PageLayout` but holds some logic
 * to define some default behavior for the home page, such as the navigation button label and action.
 */
export function HomePageLayout({
  title,
  children,
  toolbar
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
              label: 'Apps',
              onClick: () => {
                if (onAppClose != null) {
                  onAppClose()
                } else {
                  window.location.href = `${dashboardUrl}/hub`
                }
              }
            }
      }
      toolbar={toolbar}
    >
      {children}
    </PageLayout>
  )
}

HomePageLayout.displayName = 'HomePageLayout'
