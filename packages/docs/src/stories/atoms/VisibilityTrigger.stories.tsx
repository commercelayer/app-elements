import type { Meta, StoryFn } from "@storybook/react-vite"
import { useState } from "react"
import { Card } from "#ui/atoms/Card"
import { Spacer } from "#ui/atoms/Spacer"
import { Text } from "#ui/atoms/Text"
import { VisibilityTrigger } from "#ui/atoms/VisibilityTrigger"

/**
 * Renders an empty element and reports when it scrolls into view, so you can
 * load the next page of a long list as the user approaches the end of it.
 *
 * Place it after the last item you have rendered, and keep `enabled` tied to
 * whether there is anything left to load. It renders nothing visible, so it
 * does not affect layout.
 *
 * ```tsx
 * <VisibilityTrigger
 *   enabled={hasMorePages}
 *   callback={(entry) => {
 *     if (entry.isIntersecting) {
 *       void fetchNextPage()
 *     }
 *   }}
 * />
 * ```
 */
const setup: Meta<typeof VisibilityTrigger> = {
  title: "Atoms/VisibilityTrigger",
  component: VisibilityTrigger,
  parameters: {
    layout: "padded",
  },
}
export default setup

const PAGE_SIZE = 8
const TOTAL = 40

const makePage = (from: number, to: number): number[] =>
  Array.from(
    { length: Math.max(0, to - from) },
    (_, offset) => from + offset + 1,
  )

/** A scrollable list that appends a page whenever the trigger comes into view. */
const InfiniteList = ({
  rootMargin,
  stopAt = TOTAL,
}: {
  rootMargin?: string
  stopAt?: number
}) => {
  const [items, setItems] = useState(() =>
    makePage(0, Math.min(PAGE_SIZE, stopAt)),
  )
  const [loadedPages, setLoadedPages] = useState(0)
  const hasMore = items.length < stopAt

  return (
    <div>
      <Spacer bottom="4">
        <Text variant="info" size="small">
          Showing {items.length} of {stopAt}. Pages loaded by scrolling:{" "}
          {loadedPages}.
        </Text>
      </Spacer>

      <div
        style={{
          height: "300px",
          overflowY: "auto",
          border: "1px solid #e5e5e5",
          borderRadius: "6px",
          padding: "12px",
        }}
      >
        {items.map((item) => (
          <Spacer key={item} bottom="2">
            <Card gap="4" overflow="visible">
              Item #{item}
            </Card>
          </Spacer>
        ))}

        {hasMore ? (
          <Text variant="info" size="small">
            Loading more…
          </Text>
        ) : (
          <Text variant="info" size="small">
            End of the list.
          </Text>
        )}

        <VisibilityTrigger
          rootMargin={rootMargin}
          enabled={hasMore}
          callback={(entry) => {
            if (entry.isIntersecting) {
              setItems((current) =>
                current.concat(
                  makePage(
                    current.length,
                    Math.min(current.length + PAGE_SIZE, stopAt),
                  ),
                ),
              )
              setLoadedPages((current) => current + 1)
            }
          }}
        />
      </div>
    </div>
  )
}

/**
 * Scroll the list to the bottom: each time the trigger becomes visible another
 * page is appended, until there is nothing left to load and `enabled` turns
 * `false`.
 */
export const Default: StoryFn = () => <InfiniteList />

/**
 * `rootMargin` grows the area that counts as visible, so the next page starts
 * loading before the trigger actually reaches the viewport. Useful to hide the
 * request behind the scroll, at the cost of fetching sooner than strictly
 * needed.
 */
export const LoadingAhead: StoryFn = () => <InfiniteList rootMargin="150px" />

/**
 * With `enabled={false}` the element still renders but is never observed, so
 * scrolling to the bottom does nothing. This is the state to use once every
 * page has been loaded.
 */
export const Disabled: StoryFn = () => <InfiniteList stopAt={PAGE_SIZE} />
