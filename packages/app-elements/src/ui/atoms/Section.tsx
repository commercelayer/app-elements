import cn from "classnames"
import type React from "react"
import type { ReactNode } from "react"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { useSurfaceVariant } from "#ui/internals/overlayContext"
import { getInnerText } from "#utils/children"

export interface SectionProps {
  /** The content of the section. */
  children: React.ReactNode
  /**
   * Main section title.
   * When defined the component will render as a `<section>` HTML element; if **not** defined it will render as a `<div>` HTML element.
   */
  title?: ReactNode
  /** Size for the title prop. */
  titleSize?: "normal" | "small"
  /**
   * Where the section is rendered, which sets how compact its header is.
   *
   * - `"default"` — a page or a drawer: the title at its full size, with room
   *   between it and its rule.
   * - `"sidebar"` — the narrow column: from `lg` up (where `PageLayout` actually
   *   splits into two columns) the title shrinks and its rule moves closer.
   *   Below that the section is on its own full-width row, so it renders exactly
   *   as `"default"` does.
   *
   * Only the `lg:`-prefixed classes differ between the two, which is what keeps
   * them identical on a phone with no JavaScript involved.
   *
   * Inferred from where the section sits — `PageLayout`'s sidebar slot reports
   * `"sidebar"` — so pass it only to force the other rendering.
   */
  surface?: "default" | "sidebar"
  /** Specify `none` to remove border. */
  border?: "none"
  /** This will render a button on the right side of the row. */
  actionButton?: ReactNode
  /** CSS classes. */
  className?: string
  /** Ref forwarded to the root element (`<section>` or `<div>`). */
  ref?: React.Ref<HTMLDivElement>
}

/**
 * The Section component represents a section of the application. It can have a title and an action button.
 */
export const Section = withSkeletonTemplate<SectionProps>(
  ({
    children,
    title,
    titleSize = "normal",
    surface,
    actionButton,
    border,
    isLoading,
    delayMs,
    ref,
    ...rest
  }) => {
    // the hook runs unconditionally; the prop only wins afterwards
    const inferredSurface = useSurfaceVariant()
    const resolvedSurface = surface ?? inferredSurface
    const Tag = title != null ? "section" : "div"
    return (
      <Tag
        {...rest}
        ref={ref}
        aria-label={title != null ? getInnerText(title) : undefined}
      >
        {(title != null || actionButton != null) && (
          <header
            className={cn(
              "font-semibold border-b pb-4 flex justify-between items-center",
              {
                "border-gray-100": border == null,
                "border-transparent": border === "none",
                // closer once the sidebar is its own column, where vertical space
                // is scarcer; `pb-4` still applies below that
                "lg:pb-2": resolvedSurface === "sidebar",
              },
            )}
          >
            {title != null && (
              <h2
                className={cn({
                  // titleSize
                  "text-gray-600": titleSize === "small",
                  "text-lg":
                    titleSize === "normal" && resolvedSurface === "default",
                  // full size until the sidebar becomes its own column
                  "text-lg lg:text-base":
                    titleSize === "normal" && resolvedSurface === "sidebar",
                })}
              >
                {title}
              </h2>
            )}
            {actionButton != null && (
              <nav className="grow text-right flex justify-end gap-2">
                {actionButton}
              </nav>
            )}
          </header>
        )}
        <div>{children}</div>
      </Tag>
    )
  },
)

Section.displayName = "Section"
