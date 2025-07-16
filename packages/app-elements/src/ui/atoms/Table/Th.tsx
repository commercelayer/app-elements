import cn from "classnames"
import type { JSX } from "react"

export interface ThProps extends React.ThHTMLAttributes<HTMLElement> {
  children?: React.ReactNode
}

function Th({ children, className, ...rest }: ThProps): JSX.Element {
  return (
    <th
      className={cn(
        className,
        "p-4 text-xs uppercase border-b border-gray-100 bg-gray-50 text-gray-400 first-of-type:rounded-ss last-of-type:rounded-se",
        {
          "text-left": rest.align !== "right" && rest.align !== "center",
        },
      )}
      {...rest}
    >
      {children}
    </th>
  )
}

Th.displayName = "Th"
export { Th }
