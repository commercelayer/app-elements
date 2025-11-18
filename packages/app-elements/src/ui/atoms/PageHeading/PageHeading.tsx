import cn from "classnames"
import type { ReactNode } from "react"
import { Badge, type BadgeProps } from "../Badge"
import { Icon } from "../Icon"
import { withSkeletonTemplate } from "../SkeletonTemplate"
import { Text } from "../Text"
import {
  PageHeadingToolbar,
  type PageHeadingToolbarProps,
} from "./PageHeadingToolbar"

export interface PageHeadingProps {
  /**
   * Main page title wrapped in a h1 element
   */
  title: ReactNode
  /**
   * A short text that helps to describe the page
   */
  description?: ReactNode
  /**
   * If `true` removes element vertical paddings
   */
  gap?: "none" | "only-top" | "only-bottom" | "both"
  /**
   * When set, it will render a badge (default as warning variant)
   */
  badge?: {
    label: string
    /**  @default warning-solid  */
    variant?: BadgeProps["variant"]
  }
  /**
   * When set, it will render a navigation (eg: go back) button on the left side of the first row
   */
  navigationButton?: {
    /* Button label */
    label: string
    /* Button callback */
    onClick: () => void
    /**
     * Button icon
     * @default arrowLeft
     */
    icon?: "x" | "arrowLeft"
  }
  /**
   * When set, it will render a proper toolbar on the right side of the first row
   */
  toolbar?: PageHeadingToolbarProps
}

const PageHeading = withSkeletonTemplate<PageHeadingProps>(
  ({
    gap = "both",
    badge,
    navigationButton,
    title,
    description,
    toolbar,
    isLoading,
    delayMs,
    ...rest
  }) => {
    return (
      <div
        className={cn([
          "w-full",
          {
            "pt-5 md:pt-10 pb-6 md:pb-14": gap === "both",
            "pt-5 md:pt-10": gap === "only-top",
            "pb-6 md:pb-14": gap === "only-bottom",
          },
        ])}
        {...rest}
      >
        {navigationButton != null && (
          <div className={cn("mb-4 flex items-center justify-between")}>
            <button
              type="button"
              className="flex items-center gap-1"
              onClick={() => {
                navigationButton.onClick()
              }}
            >
              <Icon name={navigationButton.icon ?? "arrowLeft"} size={24} />{" "}
              <Text weight="medium" size="small">
                {navigationButton.label}
              </Text>
            </button>
            {toolbar != null ? <PageHeadingToolbar {...toolbar} /> : null}
          </div>
        )}
        {badge != null && (
          <div className="flex mb-4 md:mt-0!" data-testid="page-heading-badge">
            <Badge variant={badge.variant ?? "warning-solid"}>
              {badge.label}
            </Badge>
          </div>
        )}
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-2xl md:text-title leading-title break-all">
            {title}
          </h1>
          {navigationButton == null && toolbar != null ? (
            <PageHeadingToolbar {...toolbar} />
          ) : null}
        </div>
        {description !== null && (
          <div className="text-gray-500 leading-6 mt-2">{description}</div>
        )}
      </div>
    )
  },
)

PageHeading.displayName = "PageHeading"
export { PageHeading }
