import { useEffect, useState } from "react"
import { PageLayout } from "#ui/composite/PageLayout"

export interface PageLoadingProps {
  /**
   * Milliseconds to wait before the spinner appears. A page that resolves faster
   * than this shows no indicator at all, instead of a flash.
   * @default 200
   */
  delayMs?: number
  /**
   * Match the page being waited for, so its content does not shift sideways once
   * it arrives.
   * @default false
   */
  fullWidth?: boolean
  /**
   * Renders the test/live banner of the page being waited for, when it is known.
   */
  mode?: "test" | "live"
}

/**
 * Placeholder for a page that has not loaded yet.
 *
 * It draws only what is true before the page is known: the frame and the band the
 * title will occupy, so nothing jumps when the real page arrives, plus a spinner.
 * Deliberately no fake rows, cards or search bars —
 * a placeholder that mimics content has to be kept in step with every screen it
 * stands in for, and silently starts lying the moment one of them changes.
 *
 * For loading *within* a page, where the shape is known, use `SkeletonTemplate`
 * around the real components instead: it renders the actual markup, so it cannot
 * drift.
 */
export function PageLoading({
  delayMs = 200,
  fullWidth = false,
  mode,
}: PageLoadingProps): React.JSX.Element {
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(delayMs === 0)

  useEffect(
    function showSpinnerAfterDelay() {
      if (delayMs === 0) {
        return
      }
      const timeout = window.setTimeout(() => {
        setIsSpinnerVisible(true)
      }, delayMs)
      return () => {
        window.clearTimeout(timeout)
      }
    },
    [delayMs],
  )

  return (
    // the real layout, with an invisible title: exact geometry, no invented
    // content. `visibility: hidden` also keeps it out of the a11y tree
    <PageLayout
      title={<span className="invisible">Loading</span>}
      mode={mode}
      gap="only-top"
      fullWidth={fullWidth}
      minHeight={false}
      data-testid="page-loading"
    >
      <div className="flex justify-center py-14" role="status">
        {isSpinnerVisible && (
          <div
            className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-black animate-spin"
            data-testid="page-loading-spinner"
          />
        )}
        <span className="sr-only">Loading page</span>
      </div>
    </PageLayout>
  )
}

PageLoading.displayName = "PageLoading"
