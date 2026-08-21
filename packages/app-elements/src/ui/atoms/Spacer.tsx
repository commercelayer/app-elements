import cn from "classnames"
import type { ReactNode } from "react"

export interface SpacerProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Value to be applied as `margin-top`.
   *
   * Takes a single value, or one per breakpoint when the spacing has to change
   * with the width: `top={{ base: "14", lg: "10" }}`.
   */
  top?: ResponsiveSpacerValue
  /**
   * Value to be applied as `margin-bottom`.
   *
   * Takes a single value, or one per breakpoint (see `top`).
   */
  bottom?: ResponsiveSpacerValue
  /**
   * Value to be applied as `margin-left`.
   */
  left?: SpacerValues
  /**
   * Value to be applied as `margin-right`.
   */
  right?: SpacerValues
  children?: ReactNode
}

/**
 * Possible values are:
 * 2: 0.5rem, 8px
 * 4: 1rem, 16px
 * 6: 1.5rem, 24px
 * 8: 2rem, 32px
 * 12: 3rem, 48px
 * 14: 3.5rem, 56px
 */
type SpacerValues = "1" | "2" | "3" | "4" | "6" | "8" | "10" | "12" | "14"

/**
 * A single value, or one per breakpoint.
 *
 * Vertical spacing only: it is the rhythm of a page that changes with the width,
 * while `left`/`right` are gutters that do not.
 *
 * The class strings live in the maps below rather than in the calling app: app
 * code is not scanned by Tailwind, so a class written there exists only if
 * app-elements happens to use it too — `lg:mt-10` in an app is silently nothing.
 */
type ResponsiveSpacerValue =
  | SpacerValues
  | {
      /** Below `md`, and the fallback for the breakpoints left unset. */
      base?: SpacerValues
      /** From 768px up. */
      md?: SpacerValues
      /** From 992px up. */
      lg?: SpacerValues
      /** From 1280px up. */
      xl?: SpacerValues
    }

const marginTopCss: Record<SpacerValues | "none", string> = {
  none: "",
  "1": "mt-1",
  "2": "mt-2",
  "3": "mt-3",
  "4": "mt-4",
  "6": "mt-6",
  "8": "mt-8",
  "10": "mt-10",
  "12": "mt-12",
  "14": "mt-14",
}

const marginBottomCss: Record<SpacerValues | "none", string> = {
  none: "",
  "1": "mb-1",
  "2": "mb-2",
  "3": "mb-3",
  "4": "mb-4",
  "6": "mb-6",
  "8": "mb-8",
  "10": "mb-10",
  "12": "mb-12",
  "14": "mb-14",
}

const marginLeftCss: Record<SpacerValues | "none", string> = {
  none: "",
  "1": "ml-1",
  "2": "ml-2",
  "3": "ml-3",
  "4": "ml-4",
  "6": "ml-6",
  "8": "ml-8",
  "10": "ml-10",
  "12": "ml-12",
  "14": "ml-14",
}

const marginRightCss: Record<SpacerValues | "none", string> = {
  none: "",
  "1": "mr-1",
  "2": "mr-2",
  "3": "mr-3",
  "4": "mr-4",
  "6": "mr-6",
  "8": "mr-8",
  "10": "mr-10",
  "12": "mr-12",
  "14": "mr-14",
}

const marginTopMdCss: Record<SpacerValues, string> = {
  "1": "md:mt-1",
  "2": "md:mt-2",
  "3": "md:mt-3",
  "4": "md:mt-4",
  "6": "md:mt-6",
  "8": "md:mt-8",
  "10": "md:mt-10",
  "12": "md:mt-12",
  "14": "md:mt-14",
}

const marginTopLgCss: Record<SpacerValues, string> = {
  "1": "lg:mt-1",
  "2": "lg:mt-2",
  "3": "lg:mt-3",
  "4": "lg:mt-4",
  "6": "lg:mt-6",
  "8": "lg:mt-8",
  "10": "lg:mt-10",
  "12": "lg:mt-12",
  "14": "lg:mt-14",
}

const marginTopXlCss: Record<SpacerValues, string> = {
  "1": "xl:mt-1",
  "2": "xl:mt-2",
  "3": "xl:mt-3",
  "4": "xl:mt-4",
  "6": "xl:mt-6",
  "8": "xl:mt-8",
  "10": "xl:mt-10",
  "12": "xl:mt-12",
  "14": "xl:mt-14",
}

const marginBottomMdCss: Record<SpacerValues, string> = {
  "1": "md:mb-1",
  "2": "md:mb-2",
  "3": "md:mb-3",
  "4": "md:mb-4",
  "6": "md:mb-6",
  "8": "md:mb-8",
  "10": "md:mb-10",
  "12": "md:mb-12",
  "14": "md:mb-14",
}

const marginBottomLgCss: Record<SpacerValues, string> = {
  "1": "lg:mb-1",
  "2": "lg:mb-2",
  "3": "lg:mb-3",
  "4": "lg:mb-4",
  "6": "lg:mb-6",
  "8": "lg:mb-8",
  "10": "lg:mb-10",
  "12": "lg:mb-12",
  "14": "lg:mb-14",
}

const marginBottomXlCss: Record<SpacerValues, string> = {
  "1": "xl:mb-1",
  "2": "xl:mb-2",
  "3": "xl:mb-3",
  "4": "xl:mb-4",
  "6": "xl:mb-6",
  "8": "xl:mb-8",
  "10": "xl:mb-10",
  "12": "xl:mb-12",
  "14": "xl:mb-14",
}

/** Resolves a value that may carry one entry per breakpoint into class names. */
function responsiveMarginCss(
  value: ResponsiveSpacerValue | undefined,
  base: Record<SpacerValues | "none", string>,
  md: Record<SpacerValues, string>,
  lg: Record<SpacerValues, string>,
  xl: Record<SpacerValues, string>,
): string {
  if (value == null) {
    return ""
  }
  if (typeof value === "string") {
    return base[value]
  }
  return cn(
    value.base != null && base[value.base],
    value.md != null && md[value.md],
    value.lg != null && lg[value.lg],
    value.xl != null && xl[value.xl],
  )
}

function Spacer({
  top,
  bottom,
  left,
  right,
  children,
  className,
  ...rest
}: SpacerProps): React.ReactNode {
  const valueLeft = left ?? "none"
  const valueRight = right ?? "none"

  if (children == null) {
    return null
  }

  return (
    <div
      className={cn([
        // A child that renders nothing — a section with no data to show — would
        // otherwise leave this div behind with its margins, as a block of blank
        // space. `children == null` above only catches a literal null child, not
        // a component that returns one.
        "empty:hidden",
        responsiveMarginCss(
          top,
          marginTopCss,
          marginTopMdCss,
          marginTopLgCss,
          marginTopXlCss,
        ),
        responsiveMarginCss(
          bottom,
          marginBottomCss,
          marginBottomMdCss,
          marginBottomLgCss,
          marginBottomXlCss,
        ),
        marginLeftCss[valueLeft],
        marginRightCss[valueRight],
        // merged rather than spread with `rest`, which would have replaced the
        // margins with whatever the caller passed
        className,
      ])}
      {...rest}
    >
      {children}
    </div>
  )
}

Spacer.displayName = "Spacer"

export { Spacer }
