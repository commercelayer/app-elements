import type { JSX, ReactNode } from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import type { PageHeadingProps } from "#ui/atoms/PageHeading"
import type { PageHeadingToolbarProps } from "#ui/atoms/PageHeading/PageHeadingToolbar"
import { PageLayout, type PageLayoutProps } from "./PageLayout"

export interface HomePageLayoutProps
  extends Pick<PageHeadingProps, "title">,
    Pick<PageLayoutProps, "fullWidth"> {
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
  toolbar,
  fullWidth,
}: HomePageLayoutProps): JSX.Element {
  const {
    settings: { mode, dashboardUrl, isInDashboard, onAppClose },
  } = useTokenProvider()

  return (
    <PageLayout
      title={title}
      mode={mode}
      gap="only-top"
      scrollToTop
      fullWidth={fullWidth}
      navigationButton={
        isInDashboard && onAppClose == null
          ? undefined
          : {
              label: "Apps",
              onClick: () => {
                if (onAppClose != null) {
                  onAppClose()
                } else {
                  window.location.href = `${dashboardUrl}/hub`
                }
              },
            }
      }
      toolbar={toolbar}
    >
      {children}
    </PageLayout>
  )
}

HomePageLayout.displayName = "HomePageLayout"
