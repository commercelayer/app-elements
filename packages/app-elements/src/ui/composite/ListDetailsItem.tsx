import classNames from "classnames"
import { Children, type JSX, type ReactNode } from "react"
import { Skeleton, SkeletonItem } from "#ui/atoms/Skeleton"
import { Text } from "#ui/atoms/Text"
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
}

export function ListDetailsItem({
  label,
  children,
  isLoading,
  border,
  gutter,
  childrenAlign = "left",
  ...rest
}: ListDetailsItemProps): JSX.Element {
  const childrenHaveInternalPadding = (
    Children.map(children, (child) =>
      isSpecificReactComponent(child, [/^CopyToClipboard$/]),
    ) ?? []
  ).some(Boolean)

  return (
    <div
      data-testid={`list-details-item-${label}`}
      className={classNames(
        "border-gray-100 md:gap-4! py-2 md:py-0 grid md:grid-cols-[1fr_1.4fr]!",
        {
          "px-4": gutter !== "none",
          "border-b py-4 md:py-2!": border !== "none",
        },
      )}
      {...rest}
    >
      <div className="text-gray-500 font-medium flex-none w-full md:py-2! min-w-0">
        {label}
      </div>
      <div
        data-testid={`list-details-item-${label}-value`}
        // keep `min-w-0` to avoid grid overflow when grid-item content is too long
        className={classNames("font-semibold min-w-0", {
          "py-2": !childrenHaveInternalPadding,
          "md:text-right": childrenAlign === "right",
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
