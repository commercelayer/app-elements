import cn from "classnames"
import { Icon } from "./Icon"
import type { iconMapping } from "./Icon/icons"

export interface StatusIconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Name of the icon to display
   */
  name: keyof typeof iconMapping
  /**
   * Background color, `none` for no background
   */
  background?:
    | "green"
    | "orange"
    | "red"
    | "gray"
    | "lightGray"
    | "teal"
    | "white"
    | "black"
    | "none"
  /**
   * padding around the icon can bne: 'none' | 'small' | 'large'
   */
  gap?: "none" | "small" | "medium" | "large" | "x-large"
  /**
   * Optional alignment of the component
   */
  align?: "center"
}

export const StatusIcon: React.FC<StatusIconProps> = ({
  name,
  className,
  background = "none",
  gap = "none",
  align,
  ...rest
}) => {
  const iconSize = (gap?: StatusIconProps["gap"]): string | undefined => {
    switch (gap) {
      case "x-large":
        return "1.65rem"
      case "large":
        return "1.25rem"
      default:
        return undefined
    }
  }

  return (
    <div
      className={cn([
        // alignment
        { "mx-auto block": align === "center" },
        { "inline-block": align !== "center" },
        "align-middle",
        "w-fit",
        // padding
        { "p-[14px]": gap === "x-large" },
        { "p-[10px]": gap === "large" },
        { "p-[6px]": gap === "medium" },
        { "p-[3px]": gap === "small" },
        // variants
        { "border rounded-full": background !== "none" },
        { "bg-green border-green text-white": background === "green" },
        { "bg-red border-red text-white": background === "red" },
        { "bg-gray-300 border-gray-300 text-white": background === "gray" },
        {
          "bg-gray-200 border-gray-200 text-white": background === "lightGray",
        },
        { "bg-orange border-orange text-white": background === "orange" },
        { "bg-teal border-teal text-white": background === "teal" },
        { "bg-white border-gray-200": background === "white" },
        { "bg-gray-800 border-gray-800 text-white": background === "black" },

        // className
        className,
      ])}
      {...rest}
    >
      <Icon
        name={name}
        size={iconSize(gap)}
        weight={background !== "none" ? "bold" : undefined}
      />
    </div>
  )
}

StatusIcon.displayName = "StatusIcon"
