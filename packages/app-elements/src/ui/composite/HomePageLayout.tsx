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

export function HomePageLayout({
  title,
  children
}: HomePageLayoutProps): JSX.Element {
  const {
    settings: { mode, dashboardUrl, onAppClose }
  } = useTokenProvider()
  return (
    <PageLayout
      title={title}
      mode={mode}
      gap='only-top'
      scrollToTop
      navigationButton={{
        label: onAppClose != null ? 'Apps' : 'Hub',
        onClick: () => {
          if (onAppClose != null) {
            onAppClose()
          } else {
            window.location.href =
              dashboardUrl != null ? `${dashboardUrl}/hub` : '/'
          }
        }
      }}
    >
      {children}
    </PageLayout>
  )
}

HomePageLayout.displayName = 'HomePageLayout'
