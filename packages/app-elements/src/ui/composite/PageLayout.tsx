import type { ReactNode } from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import type { ContainerProps } from "#ui/atoms/Container"
import { Container } from "#ui/atoms/Container"
import { PageHeading, type PageHeadingProps } from "#ui/atoms/PageHeading"
import { ScrollToTop } from "#ui/atoms/ScrollToTop"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Overlay, type OverlayProps } from "#ui/internals/Overlay"

export type PageLayoutProps = Pick<
  PageHeadingProps,
  "title" | "description" | "navigationButton" | "toolbar" | "gap"
> &
  Pick<ContainerProps, "minHeight"> & {
    /**
     * Page content
     */
    children: ReactNode
    /**
     * When mode is `test`, it will render a `TEST DATA` Badge to inform user api is working in test mode.
     * Only if app is standalone mode.
     */
    mode?: "test" | "live"
    /**
     * Optional prop to enable scroll to top behavior on location change
     */
    scrollToTop?: boolean
  } & (
    | {
        overlay?: false
      }
    | {
        /**
         * Renders as overlay
         */
        overlay: true
        /**
         * Footer element to be rendered at the bottom of the overlay.
         **/
        overlayFooter?: OverlayProps["footer"]
      }
  )

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
    ...props
  }) => {
    const {
      settings: { isInDashboard },
    } = useTokenProvider()

    const { overlayFooter, ...rest } =
      "overlayFooter" in props ? props : { ...props, overlayFooter: undefined }

    const component = (
      <>
        <PageHeading
          title={title}
          description={description}
          navigationButton={navigationButton}
          toolbar={toolbar}
          badge={
            mode === "test" && !isInDashboard
              ? {
                  label: "TEST DATA",
                  variant: "warning-solid",
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
      return (
        <Overlay backgroundColor="light" footer={overlayFooter}>
          {component}
        </Overlay>
      )
    }

    return (
      <Container minHeight={minHeight} {...rest}>
        <Spacer bottom="14">{component}</Spacer>
      </Container>
    )
  },
)

PageLayout.displayName = "PageLayout"
