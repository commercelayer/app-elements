import cn from "classnames"
import { type FC, useMemo } from "react"
import { Icon, type IconProps } from "#ui/atoms/Icon/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { enforceAllowedTags } from "#utils/htmltags"

export type DropdownItemProps = React.HTMLAttributes<HTMLElement> & {
  label: string
  info?: string
  icon?: IconProps["name"] | "keep-space"
} & (
    | {
        /**
         * render the component as anchor tag
         */
        href: string
        target?: string
      }
    | {
        href?: never
        disabled?: boolean
      }
  )

/**
 * Render a dropdown item to be used inside a `Dropdown` component.
 * By default the component renders as a `button` tag, but you can provide an `href` prop to render it as an `a` tag.
 * When no `href` or `onClick` is provided, the component still renders as `button` tag to prevent the dropdown to be closed when clicked.
 */
export const DropdownItem = withSkeletonTemplate<DropdownItemProps>(
  ({
    label,
    info,
    icon,
    isLoading,
    delayMs,
    href,
    className,
    onClick,
    ...rest
  }) => {
    const JsxTag = useMemo(
      () =>
        enforceAllowedTags({
          tag: href != null ? "a" : "button",
          allowedTags: ["a", "button"],
          defaultTag: "button",
        }),
      [href, onClick],
    )

    const isDisabled = Boolean("disabled" in rest && rest.disabled)

    return (
      <JsxTag
        {...rest}
        onClick={(e) => {
          if (!isDisabled) {
            onClick?.(e)
          }
        }}
        href={href}
        className={cn(
          "w-full bg-black text-white! py-1.5 pl-4 text-sm font-medium flex items-center focus:outline-hidden!",
          {
            "pr-8": info == null,
            "min-w-[250px] pr-6": info != null,
          },
          className,
          {
            "hover:bg-gray-600 cursor-pointer focus:bg-gray-600 group":
              onClick != null || href != null,
            "cursor-default": onClick == null && href == null,
            "opacity-50 pointer-events-none": isDisabled,
          },
        )}
        aria-label={label}
      >
        {icon != null ? (
          <div className="mr-2">
            {icon === "keep-space" ? (
              <FakeIcon /> // keep the gap as if there was an icon
            ) : (
              <Icon name={icon} size={16} weight="regular" />
            )}
          </div>
        ) : null}

        <span
          className="text-ellipsis overflow-hidden whitespace-nowrap"
          title={label}
        >
          {label}
        </span>
        {info != null && (
          <span className="ml-auto pl-1 text-xs text-gray-500 font-semibold group-hover:text-white">
            {info}
          </span>
        )}
      </JsxTag>
    )
  },
)
DropdownItem.displayName = "DropdownItem"

const FakeIcon: FC = () => {
  return <div className="w-[16px]" />
}
