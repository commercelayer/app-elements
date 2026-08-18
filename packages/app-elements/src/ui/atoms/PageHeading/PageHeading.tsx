import cn from "classnames"
import type { ReactNode } from "react"
import { useIsInDrawer } from "#ui/internals/overlayContext"
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
     * Button icon.
     *
     * `x` becomes a left arrow on mobile: a drawer there fills the screen rather
     * than sitting beside the list behind it, so dismissing it reads as going back.
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
    // A close button reads as "back" on a phone, where the panel it closes is the
    // whole screen. Same button, same action — only the glyph changes.
    const desktopIcon = navigationButton?.icon ?? "arrowLeft"
    const mobileIcon = "arrowLeft" as const
    const iconsDiffer = desktopIcon !== mobileIcon

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
              <NavigationButton
                {...navigationButton}
                mobileIcon={mobileIcon}
                desktopIcon={iconsDiffer ? desktopIcon : undefined}
              />
            ) : (
              <button
                type="button"
                className="flex items-center gap-1"
                onClick={() => {
                  navigationButton.onClick()
                }}
              >
                {/* the inline variant has a label beside the icon, so there is no
                    lone-child rule to respect: the glyphs can swap in place */}
                <Icon
                  name={mobileIcon}
                  size={24}
                  className={iconsDiffer ? "md:hidden" : undefined}
                />
                {iconsDiffer && (
                  <Icon
                    name={desktopIcon}
                    size={24}
                    className="hidden md:block"
                  />
                )}{" "}
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
          {/* A flex row, so a status badge passed alongside the text sits centred
              against it. Inline, a badge aligns its own text baseline to the
              title's and hangs below it by its bottom padding. `flex-wrap` lets
              the badge drop to its own line rather than being squeezed when the
              title is long. */}
          <h1 className="font-semibold text-2xl md:text-title leading-title break-all [[data-drawer]_&]:md:text-2xl flex flex-wrap items-center gap-3">
            {title}
          </h1>
          {navigationButton == null && toolbar != null ? (
            <PageHeadingToolbar {...toolbar} />
          ) : null}
        </div>
        {/* `!= null`, so an omitted description renders nothing at all: `!== null`
            let `undefined` through and left an empty div carrying its `mt-2` */}
        {description != null && (
          <div className="text-sm text-gray-500 leading-6 mt-2">
            {description}
          </div>
        )}
      </div>
    )
  },
)

/**
 * The standalone navigation button the drawers use, as one component so the mobile
 * and desktop variants cannot drift apart.
 */
const NavigationButton: React.FC<{
  label: string
  onClick: () => void
  /** The glyph shown on a phone. */
  mobileIcon: "x" | "arrowLeft"
  /** The glyph shown from `md` up, when it differs from the mobile one. */
  desktopIcon?: "x" | "arrowLeft"
}> = ({ label, onClick, mobileIcon, desktopIcon }) => {
  const isInDrawer = useIsInDrawer()
  return (
    <Button
      variant="secondary"
      size="small"
      alignItems="center"
      // rendered icon-only, the button would otherwise have no accessible name.
      // What it is called follows the surface, not the glyph: inside a drawer the
      // button dismisses the panel, on a page it returns to where the page came
      // from — and a drawer shows the arrow on mobile while still closing
      aria-label={label === "" ? (isInDrawer ? "Close" : "Go back") : undefined}
      onClick={onClick}
    >
      {/* Icons only when there is no label, which is what keeps the button square like
        the toolbar buttons beside it (`Button` drops its horizontal padding when it
        holds nothing else). `size={16}` matches those too. One button rather than one
        per breakpoint, so the accessibility tree holds a single control. */}
      <Icon
        name={mobileIcon}
        size={16}
        className={desktopIcon != null ? "md:hidden" : undefined}
      />
      {desktopIcon != null && (
        <Icon name={desktopIcon} size={16} className="hidden md:block" />
      )}
      {label !== "" && label}
    </Button>
  )
}

PageHeading.displayName = "PageHeading"

export { PageHeading }
