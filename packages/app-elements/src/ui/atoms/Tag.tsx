import cn from "classnames"
import type { FC, JSX } from "react"
import { Children, isValidElement } from "react"
import { Tooltip } from "#ui/atoms/Tooltip"
import type { FlexRowProps } from "#ui/internals/FlexRow"
import { removeUnwantedProps } from "#utils/htmltags"

type Props = Pick<FlexRowProps, "children"> & {
  /**
   * Icon component
   * Example: `<StatusIcon>` or `<RadialProgress>` or `<Avatar>`
   */
  icon?: JSX.Element
}

export type TagProps = React.HTMLAttributes<HTMLElement> &
  Pick<React.AnchorHTMLAttributes<HTMLAnchorElement>, "onClick" | "href"> &
  Props

/**
 * Recursively walks the ReactNode tree.
 * When it finds the FIRST string node, it wraps it into a <span> element with CSS classNames to truncate the content.
 * Returns: { node, truncated }
 *  - node: the updated ReactNode
 *  - truncated: boolean indicating whether truncation has already happened
 */
function truncateFirstText(node: React.ReactNode): {
  node: React.ReactNode
  truncated: boolean
} {
  const truncateClassNames =
    "text-ellipsis overflow-hidden whitespace-nowrap max-w-[90px]"

  // ---- CASE 1: string ----
  if (typeof node === "string") {
    const shouldModify = node.length > 15
    return {
      node: shouldModify ? (
        <span className={cn({ [truncateClassNames]: shouldModify })}>
          {node}
        </span>
      ) : (
        node
      ),
      truncated: shouldModify,
    }
  }

  // ---- CASE 2: number ----
  if (typeof node === "number") {
    return { node, truncated: false }
  }

  // ---- CASE 3: array of children ----
  if (Array.isArray(node)) {
    let truncated = false

    const truncatedChildren: React.ReactNode[] = []

    for (const child of node) {
      if (!truncated) {
        const res = truncateFirstText(child)
        truncatedChildren.push(res.node)
        truncated = res.truncated
      } else {
        // after modifying the first string, leave rest as-is
        truncatedChildren.push(child)
      }
    }

    return {
      node: truncatedChildren,
      truncated,
    }
  }

  // ---- CASE 4: React element ----
  if (isValidElement<React.PropsWithChildren>(node)) {
    const { children } = node.props

    return truncateFirstText(children)
  }

  // ---- CASE 5: null, undefined, boolean ----
  return { node, truncated: false }
}

export const Tag: FC<TagProps> = ({ icon, children, className, ...rest }) => {
  const wantedProps =
    "overflow" in rest ? removeUnwantedProps(rest, ["overflow"]) : rest
  const JsxTag =
    rest.href != null ? "a" : rest.onClick != null ? "button" : "div"
  const hasHover = rest.onClick != null || rest.href != null

  const childrenArray = Children.toArray(children)
  const { node: truncatedFirstChild, truncated: isFirstChildTruncated } =
    truncateFirstText(childrenArray[0])

  const finalChildren = [truncatedFirstChild, ...childrenArray.slice(1)]

  const tagElement = (
    <JsxTag
      className={cn([
        className,
        "flex gap-2 items-center select-none",
        "text-xs font-bold",
        "py-[3px] px-2 rounded text-gray bg-gray-200",
        {
          "cursor-pointer hover:bg-gray-100  outline-primary-light": hasHover,
        },
      ])}
      type={JsxTag === "button" ? "button" : undefined}
      // we don't want `tag` and eventually `buttonStyle` props to be present as attribute on html tag
      // still we need to be part of `rest` to discriminate the union type
      {...wantedProps}
    >
      {icon != null && <div className="shrink-0">{icon}</div>}
      {finalChildren}
    </JsxTag>
  )

  return isFirstChildTruncated ? (
    <Tooltip label={tagElement} content={childrenArray[0]} />
  ) : (
    tagElement
  )
}

Tag.displayName = "Tag"
