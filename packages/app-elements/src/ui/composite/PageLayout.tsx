import type { ReactNode } from "react"
import { useTokenProvider } from "#providers/TokenProvider"
import type { ContainerProps } from "#ui/atoms/Container"
import { Container } from "#ui/atoms/Container"
import { PageHeading, type PageHeadingProps } from "#ui/atoms/PageHeading"
import { ScrollToTop } from "#ui/atoms/ScrollToTop"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { Overlay, type OverlayProps } from "#ui/internals/Overlay"
import { OverlayContext } from "#ui/internals/overlayContext"

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
     * Page-level notices, rendered full width between the heading and the content.
     *
     * For what is true of the resource as a whole — "generated via API", "pending
     * because it has no usable payment method", a failed purchase — rather than of
     * one section. Read before anything else, and spanning the sidebar too, since
     * they are about the page and not about its main column.
     *
     * Pass the `Alert`s themselves: the spacing around them belongs here, so the
     * gap stays the same whether a page shows one, two or none.
     *
     * @example
     * ```jsx
     * <PageLayout
     *   title='Promotion'
     *   alert={viaApi && <Alert status='info'>Generated via API.</Alert>}
     * >
     * ```
     */
    alert?: ReactNode
    /**
     * Secondary content, rendered in a column beside `children` on large screens
     * and stacked below it on smaller ones.
     *
     * Meant for details pages, where the supporting information of a resource
     * (customer, addresses, tags, metadata, …) sits next to its main content.
     * Pass one `Section` per block: the column's card is drawn here, so the slot
     * takes the blocks themselves and no wrapper of its own.
     *
     * Best paired with `fullWidth`, since the default content width leaves too
     * little room for two columns.
     *
     * Pair it with `gap="only-top"` and open `children` with a `Spacer top="14"`:
     * the card is aligned to that spacer, and the heading's default bottom gap
     * would otherwise be added on top of it.
     *
     * @example
     * ```jsx
     * <PageLayout
     *   title='Order #1234'
     *   fullWidth
     *   gap='only-top'
     *   sidebar={
     *     <>
     *       <Section title='Customer'>...</Section>
     *       <Spacer top='10'>
     *         <Section title='Addresses'>...</Section>
     *       </Spacer>
     *     </>
     *   }
     * >
     *   <Spacer top='14'>
     *     <OrderSummary />
     *   </Spacer>
     * </PageLayout>
     * ```
     */
    sidebar?: ReactNode
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
    alert,
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
        {/* `false` is what a `condition && <Alert />` evaluates to, which is the
            common way to pass this: nothing to show means no wrapper and no gap */}
        {alert != null && alert !== false && (
          <div className="pt-6 empty:hidden print:hidden">{alert}</div>
        )}
        {sidebar == null ? (
          children
        ) : (
          // A grid rather than two flex columns, for the `minmax(0,1fr)` that stops
          // wide content (tables, code blocks) in the main column from pushing the
          // sidebar out of the viewport. Stacked, the source order reads
          // children → sidebar, so the sidebar lands below the main content.
          <div className="grid lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-x-16 print:block mt-14">
            <main>{children}</main>
            <aside>
              {/* The sidebar's box lives here rather than in each page: from `lg` up
                  — the width at which this grid splits in two — the column is a card,
                  and below it is just another full-width row of the page, so the box
                  goes away. A plain element and not `Card`, whose chrome is not
                  responsive and which would clip the menus inside.

                  The context tells the blocks inside which surface they are on, so
                  they can match. Innermost wins: a sidebar inside a drawer reports
                  itself as a sidebar. */}
              <OverlayContext.Provider value={{ surface: "sidebar" }}>
                {/* `[&>*:first-child]:mt-0` because the blocks in the slot space
                    themselves with a top `Spacer`: when the block that was meant to
                    come first renders nothing (a customer with no addresses, say),
                    that spacer would open the column with an empty band. */}
                <div className="mt-14 lg:mt-0 lg:border lg:border-gray-200 lg:rounded lg:bg-white lg:p-6">
                  {sidebar}
                </div>
              </OverlayContext.Provider>
            </aside>
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
