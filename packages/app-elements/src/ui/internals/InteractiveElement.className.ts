import cn from "classnames"
import { Children } from "react"
import { isSpecificReactComponent } from "#utils/children"

// The `relationship` variant is temporary to cover the old dashed `ButtonCard` behavior until there will be an updated design proof solution
type Variant =
  | "primary"
  | "secondary"
  | "danger"
  | "link"
  | "circle"
  | "relationship"
  | "input"
type Size = "mini" | "small" | "regular"

export interface InteractiveElementProps {
  children: React.ReactNode
  /**
   * Render a different variant
   */
  variant?: Variant
  /**
   * Set _button size_. It only works when the `variant` prop is different from `link`.
   */
  size?: Size
  /**
   * Set the _button width_ to 100%. It only works when the `variant` prop is different from `link`.
   */
  fullWidth?: boolean
  /**
   * Flex content alignment with a standard gap
   * @deprecated This prop is actually useless as we always have centered items inside buttons.
   */
  alignItems?: "center"
  /**
   * When element is disabled, the user cannot interact with it
   */
  disabled?: boolean | undefined
}

export function getInteractiveElementClassName({
  children,
  disabled,
  fullWidth,
  size,
  variant,
}: InteractiveElementProps) {
  /*
   * A button holding nothing but icons is icon-only: it loses its horizontal padding
   * and comes out square. That covers one icon and, as `PageHeading` does, one per
   * breakpoint. Anything else in there — a label beside the icon — makes it a normal
   * button.
   */
  const childrenAsArray = Children.toArray(children)
  const isIcon =
    childrenAsArray.length > 0 &&
    childrenAsArray.every((child) =>
      isSpecificReactComponent(child, [/^Icon$/]),
    )

  return cn([
    "font-medium whitespace-nowrap leading-5",
    "inline-flex items-center gap-1",
    {
      // Button-like behaviors (non links)
      "justify-center": variant !== "link" && variant !== "input",
      "!justify-start": variant === "input",
      "transition-opacity duration-500": variant !== "link",
      button: variant !== "link",
      [`${getSizeCss(size)}`]: variant !== "link",
      [`${getFontSizeCss(size)}`]: variant !== "link",
      [`${getPaddingCss(size)}`]: !isIcon && variant !== "link",
      // Link-like behaviors
      "inline w-fit underline": variant === "link",
      // Shared behaviors
      rounded: variant !== "circle" && variant !== "input",
      "opacity-50 pointer-events-none touch-none": disabled,
      "w-full lg:w-auto": fullWidth === true && variant !== "link",
    },
    getVariantCss(variant),
  ])
}

function getPaddingCss(
  size: InteractiveElementProps["size"],
): string | undefined {
  if (size == null) {
    return undefined
  }

  const mapping = {
    mini: "px-2.5",
    small: "px-4",
    regular: "px-4",
  } satisfies Record<NonNullable<InteractiveElementProps["size"]>, string>

  return mapping[size]
}

function getSizeCss(size: InteractiveElementProps["size"]): string | undefined {
  if (size == null) {
    return undefined
  }

  const mapping = {
    mini: "h-[30px] min-w-[30px]",
    small: "h-9 min-w-9",
    regular: "h-10 min-w-10",
  } satisfies Record<NonNullable<InteractiveElementProps["size"]>, string>

  return mapping[size]
}

function getFontSizeCss(
  size: InteractiveElementProps["size"],
): string | undefined {
  if (size == null) {
    return undefined
  }

  const mapping = {
    mini: "text-[13px]",
    small: "text-sm",
    regular: "text-[15px]",
  } satisfies Record<NonNullable<InteractiveElementProps["size"]>, string>

  return mapping[size]
}

function getVariantCss(
  variant: InteractiveElementProps["variant"],
): string | undefined {
  if (variant == null) {
    return undefined
  }

  const mapping = {
    primary: "bg-black border border-black text-white hover:opacity-80",
    secondary:
      "bg-white border border-gray-200 text-black hover:opacity-80 hover:bg-gray-50",
    circle:
      "bg-white text-black hover:opacity-80 hover:bg-gray-50 rounded-full",
    danger:
      "font-medium bg-red border border-red text-white hover:bg-red-300 hover:border-red-300",
    link: "font-semibold text-primary hover:text-primary-light border-primary-light cursor-pointer",
    relationship: "text-primary border border-gray-300 border-dashed",
    input:
      "font-normal form-input block w-full px-4! py-2.5! rounded outline-0 text-left! leading-6! text-gray-500",
  } satisfies Record<NonNullable<InteractiveElementProps["variant"]>, string>

  return mapping[variant]
}
