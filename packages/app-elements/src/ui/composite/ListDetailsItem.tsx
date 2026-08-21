import classNames from "classnames"
import { Children, type JSX, type ReactNode } from "react"
import { Skeleton, SkeletonItem } from "#ui/atoms/Skeleton"
import { Text } from "#ui/atoms/Text"
import { useSurfaceVariant } from "#ui/internals/overlayContext"
import { isSpecificReactComponent } from "#utils/children"

export interface ListDetailsItemProps {
  /**
   * label to show on the left side. In a key/value pair, this is the `key`
   */
  label: string
  /**
   * content to show on the right side.
   * It represent the value.
   * Most of the time it should be a `<CopyToClipboard>` component
   */
  children?: ReactNode
  /**
   * To show the skeleton item while `children` ar not yet. Label is always rendered
   */
  isLoading?: boolean
  /**
   * Specify `none` to remove border
   */
  border?: "none"
  /**
   * Text alignment for children on the right side.
   */
  childrenAlign?: "left" | "right"
  /**
   * Specify `none` to remove side gutter
   */
  gutter?: "none"
  /**
   * Where the row is rendered, which sets how it uses the width it has.
   *
   * - `"default"` — stacked on a phone, label and value side by side from `md` up.
   * - `"sidebar"` — the narrow column: from `lg` up (where `PageLayout` splits into
   *   two columns) the row stays stacked and drops its divider, since 380px is not
   *   enough for two columns and the gaps read better than lines. Below that it is a
   *   full-width row like any other, so it renders as `"default"`.
   *
   * Inferred from where the row sits — `PageLayout`'s sidebar slot reports
   * `"sidebar"` — so pass it only to force the other rendering.
   */
  surface?: "default" | "sidebar"
}

export function ListDetailsItem({
  label,
  children,
  isLoading,
  border,
  gutter,
  childrenAlign = "left",
  surface,
  ...rest
}: ListDetailsItemProps): JSX.Element {
  // the hook runs unconditionally; the prop only wins afterwards
  const inferredSurface = useSurfaceVariant()
  const resolvedSurface = surface ?? inferredSurface

  const childrenHaveInternalPadding = (
    Children.map(children, (child) =>
      isSpecificReactComponent(child, [/^CopyToClipboard$/]),
    ) ?? []
  ).some(Boolean)

  return (
    <div
      data-testid={`list-details-item-${label}`}
      className={classNames(
        "border-gray-100 md:gap-4! py-2 md:py-0 grid md:grid-cols-[1fr_1.4fr]! print:inline-grid",
        {
          "px-4": gutter !== "none",
          "border-b py-4 md:py-4!": border !== "none",
          // Back to one column once the sidebar becomes a 380px column, and no
          // divider there: the vertical gaps do that job — which only works if a
          // value sits closer to its own label than to the next row. Stacked, the
          // two-column gap of `16px` applied in both directions and made every gap
          // equal, so nothing read as a pair.
          "lg:grid-cols-1! lg:border-b-0 lg:gap-y-0! lg:pt-0! first:lg:pt-4! last:lg:pb-0!":
            resolvedSurface === "sidebar",
        },
      )}
      {...rest}
    >
      <div
        className={classNames(
          "text-gray-500 text-sm font-medium flex-none w-full",
          { "lg:py-0!": resolvedSurface === "sidebar" },
        )}
      >
        {label}
      </div>
      <div
        data-testid={`list-details-item-${label}-value`}
        // keep `min-w-0` to avoid grid overflow when grid-item content is too long
        className={classNames("font-medium min-w-0 text-sm", {
          "py-0!": !childrenHaveInternalPadding,
          "lg:pt-0!": resolvedSurface === "sidebar",
          "md:text-right": childrenAlign === "right",
          // stacked under its label, a value reads from the left again
          "lg:text-left":
            childrenAlign === "right" && resolvedSurface === "sidebar",
          truncate: typeof children === "string",
        })}
      >
        {isLoading === true ? (
          <Skeleton>
            <SkeletonItem className="w-28 h-6" />
          </Skeleton>
        ) : (
          (children ?? <Text variant="disabled">&#8212;</Text>)
        )}
      </div>
    </div>
  )
}

ListDetailsItem.displayName = "ListDetailsItem"
