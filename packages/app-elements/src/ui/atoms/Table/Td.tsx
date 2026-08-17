import cn from "classnames"
import { isJsonPrimitive } from "#utils/text"
import {
  SkeletonTemplate,
  type SkeletonTemplateProps,
} from "../SkeletonTemplate"

export interface TdProps
  extends React.TdHTMLAttributes<HTMLElement>,
    SkeletonTemplateProps {
  children?: Awaited<React.ReactNode>
  textEllipsis?: number
}

export const Td: React.FC<TdProps> = ({
  children,
  className,
  textEllipsis,
  isLoading,
  delayMs,
  ...rest
}) => {
  return (
    <td
      className={cn(
        // `py-4` on mobile, where the row runs edge to edge and the cell's own
        // horizontal inset would sit on top of the page's; the full `p-4` returns
        // with the columns at `md`
        "py-4 md:p-4 text-sm border-b border-gray-100 bg-white",
        className,
      )}
      {...rest}
    >
      <SkeletonTemplate isLoading={isLoading} delayMs={delayMs}>
        {textEllipsis !== undefined ? (
          <div
            title={
              isJsonPrimitive(children) &&
              children !== null &&
              children.toString().length > textEllipsis
                ? children.toString()
                : undefined
            }
            className="overflow-hidden text-ellipsis whitespace-nowrap"
            style={{ maxWidth: `${textEllipsis}ch` }}
          >
            {children}
          </div>
        ) : (
          children
        )}
      </SkeletonTemplate>
    </td>
  )
}

Td.displayName = "Td"
