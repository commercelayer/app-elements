import cn from "classnames"
import type { ReactNode } from "react"
import { Badge, type BadgeProps } from "../Badge"
import { Button } from "../Button"
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
    /**
     * How the button looks: `inline` is a bare icon with its label next to it,
     * `button` is a standalone secondary button, as the drawers use.
     * @default inline
     */
    variant?: "inline" | "button"
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
          <div
            className={cn(
              {
                // the standalone button carries its own box, so it needs more air
                // below it — the spacing the drawer panels are designed with
                "mb-8": navigationButton.variant === "button",
                "mb-4": navigationButton.variant !== "button",
              },
              "flex items-center justify-between print:hidden",
            )}
          >
            {navigationButton.variant === "button" ? (
              <Button
                variant="secondary"
                size="small"
                alignItems="center"
                // the drawers render it icon-only, which would otherwise leave
                // the button with no accessible name
                aria-label={navigationButton.label === "" ? "Close" : undefined}
                onClick={() => {
                  navigationButton.onClick()
                }}
              >
                {/* icon-only when there is no label, and as its *single* child:
                    `Button` drops its horizontal padding for a lone `Icon`, which
                    is what makes it square like the toolbar buttons beside it.
                    `size={16}` matches those too. */}
                {navigationButton.label === "" ? (
                  <Icon name={navigationButton.icon ?? "arrowLeft"} size={16} />
                ) : (
                  <>
                    <Icon
                      name={navigationButton.icon ?? "arrowLeft"}
                      size={16}
                    />
                    {navigationButton.label}
                  </>
                )}
              </Button>
            ) : (
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
            )}
            {toolbar != null ? <PageHeadingToolbar {...toolbar} /> : null}
          </div>
        )}
        {badge != null && (
          <div
            className="flex mb-4 md:mt-0! print:hidden"
            data-testid="page-heading-badge"
          >
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
        {/* `!= null`, so an omitted description renders nothing at all: `!== null`
            let `undefined` through and left an empty div carrying its `mt-2` */}
        {description != null && (
          <div className="text-gray-500 leading-6 mt-2">{description}</div>
        )}
      </div>
    )
  },
)

PageHeading.displayName = "PageHeading"

export { PageHeading }
