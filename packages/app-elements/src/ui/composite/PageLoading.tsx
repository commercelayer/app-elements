import { useEffect, useState } from "react"
import { PageLayout } from "#ui/composite/PageLayout"

/**
 * One turn of `animate-spin`, whose duration is 1s and whose timing is linear.
 * Kept here because the spinner's phase is derived from it below.
 */
const SPIN_DURATION_MS = 1000

/**
 * When the start of the current loading sequence was first seen.
 *
 * Loading a page in the dashboard hands over between several of these: the one the
 * dashboard shows while it mounts the app, the one the app shows while its token is
 * validated, the one its router shows while the route chunk arrives. Each is a fresh
 * mount, so a per-instance delay would hide the spinner again on every handoff — the
 * spinner appearing, vanishing and reappearing. Sharing the start of the sequence
 * means the delay is paid once, by whoever is on screen first.
 *
 * It lives on `window`, not in this module: the dashboard mounts each app as a
 * separate bundle with its own copy of app-elements, so module scope is not shared
 * across the very handoff this exists for.
 */
const SEQUENCE_KEY = "__clPageLoadingSequenceStartedAt"
const RESET_KEY = "__clPageLoadingSequenceResetTimeout"

interface LoadingSequenceWindow {
  [SEQUENCE_KEY]?: number | null
  [RESET_KEY]?: number | null
}

function sequenceWindow(): LoadingSequenceWindow {
  return window as unknown as LoadingSequenceWindow
}

function getSequenceStart(): number | null {
  return sequenceWindow()[SEQUENCE_KEY] ?? null
}

function joinLoadingSequence(): number {
  const shared = sequenceWindow()
  const pendingReset = shared[RESET_KEY]

  if (pendingReset != null) {
    window.clearTimeout(pendingReset)
    shared[RESET_KEY] = null
  }
  shared[SEQUENCE_KEY] ??= Date.now()
  return shared[SEQUENCE_KEY]
}

function leaveLoadingSequence(): void {
  const shared = sequenceWindow()
  // a handoff unmounts one and mounts the next within the same commit, so the
  // sequence has only really ended when nobody has taken over shortly after
  shared[RESET_KEY] = window.setTimeout(() => {
    shared[SEQUENCE_KEY] = null
    shared[RESET_KEY] = null
  }, 500)
}

export interface PageLoadingProps {
  /**
   * Milliseconds to wait before the spinner appears. A page that resolves faster
   * than this shows no indicator at all, instead of a flash.
   * @default 400
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
  delayMs = 400,
  fullWidth = false,
  mode,
}: PageLoadingProps): React.JSX.Element {
  const [isSpinnerVisible, setIsSpinnerVisible] = useState(() => {
    const startedAt = getSequenceStart()
    return (
      delayMs === 0 ||
      // taking over from another one that already waited: show it straight away
      (startedAt != null && Date.now() - startedAt >= delayMs)
    )
  })

  useEffect(
    function showSpinnerAfterRemainingDelay() {
      const startedAt = joinLoadingSequence()
      const remaining = delayMs - (Date.now() - startedAt)

      if (remaining <= 0) {
        setIsSpinnerVisible(true)
        return leaveLoadingSequence
      }

      const timeout = window.setTimeout(() => {
        setIsSpinnerVisible(true)
      }, remaining)
      return () => {
        window.clearTimeout(timeout)
        leaveLoadingSequence()
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
            className="w-6 h-6 rounded-full border-2 border-gray-200 border-t-gray-400 animate-spin"
            // A CSS animation starts from its first frame on every mount, so each
            // handoff would snap the spinner back to 0°. Offsetting it into the
            // rotation by where the wall clock currently sits puts every instance in
            // the same phase — the next one carries on from the angle the previous
            // one had reached. No shared state needed, which matters across the
            // dashboard/app bundle boundary, and `animate-spin` is linear so the
            // seam is not visible.
            style={{
              animationDelay: `-${Date.now() % SPIN_DURATION_MS}ms`,
            }}
            data-testid="page-loading-spinner"
          />
        )}
        <span className="sr-only">Loading page</span>
      </div>
    </PageLayout>
  )
}

PageLoading.displayName = "PageLoading"
