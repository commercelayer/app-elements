import cn from "classnames"
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
  Pick<ContainerProps, "minHeight" | "fullWidth"> & {
    /**
     * Page content
     */
    children: ReactNode
    /**
     * Secondary content, rendered in a column beside `children` on large screens
     * and stacked below it on smaller ones.
     *
     * Meant for details pages, where the supporting information of a resource
     * (customer, addresses, tags, metadata, …) sits next to its main content.
     * Only the structure is provided: wrap the content in a `Card` with a
     * `Section` per block to get the look used by the dashboard.
     *
     * Best paired with `fullWidth`, since the default content width leaves too
     * little room for two columns.
     *
     * @example
     * ```jsx
     * <PageLayout
     *   title='Order #1234'
     *   fullWidth
     *   sidebar={
     *     <Card>
     *       <Section title='Customer'>...</Section>
     *       <Section title='Addresses'>...</Section>
     *     </Card>
     *   }
     * >
     *   <OrderSummary />
     * </PageLayout>
     * ```
     */
    sidebar?: ReactNode
    /**
     * Tail of the main content, rendered below `children` on large screens and
     * below the `sidebar` once the layout collapses to a single column.
     *
     * Use it for sections that should stay last no matter the width, such as a
     * timeline: `children` and `sidebar` alone would push the sidebar to the very
     * bottom of the page when stacked.
     *
     * @example
     * ```jsx
     * <PageLayout sidebar={<Card>…</Card>} afterSidebar={<Timeline />}>
     *   <OrderSummary />
     * </PageLayout>
     * ```
     */
    afterSidebar?: ReactNode
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
    sidebar,
    afterSidebar,
    toolbar,
    mode,
    gap,
    minHeight,
    fullWidth,
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

    // `false` is what a `condition && <Section />` prop evaluates to, which is
    // common while a resource is still loading: treat it as no content, so no
    // empty grid row is created.
    const hasAfterSidebar = afterSidebar != null && afterSidebar !== false

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
        {sidebar == null ? (
          <>
            {children}
            {afterSidebar}
          </>
        ) : (
          // A grid rather than two flex columns, so that `afterSidebar` can be
          // placed under `children` on the left while the sidebar keeps its own
          // column: stacked, the natural source order then reads
          // children → sidebar → afterSidebar.
          // `min-w-0` stops wide content (tables, code blocks) in the main column
          // from pushing the sidebar out of the viewport.
          <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-16 print:block">
            <div className="min-w-0 lg:col-start-1 lg:row-start-1">
              {children}
            </div>
            <aside
              className={cn("self-start lg:col-start-2 lg:row-start-1", {
                "lg:row-span-2": hasAfterSidebar,
              })}
            >
              {sidebar}
            </aside>
            {hasAfterSidebar && (
              <div className="min-w-0 lg:col-start-1 lg:row-start-2">
                {afterSidebar}
              </div>
            )}
          </div>
        )}
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
      <Container
        minHeight={minHeight}
        fullWidth={fullWidth}
        // Inside the dashboard the horizontal breathing room comes from the
        // dashboard layout; standalone there is nothing else to provide it.
        className={fullWidth === true && !isInDashboard ? "md:px-8" : undefined}
        {...rest}
      >
        <Spacer bottom="14">{component}</Spacer>
      </Container>
    )
  },
)

PageLayout.displayName = "PageLayout"
