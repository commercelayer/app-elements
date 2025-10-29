import classNames from "classnames"
import type React from "react"

export const OptionRow: React.FC<{
  className?: string
  label: React.ReactNode
  children: React.ReactNode
}> = ({ children, label, className }) => {
  return (
    <div
      className={classNames(
        "flex items-center gap-4 mt-2 first-of-type:mt-0",
        className,
      )}
    >
      <div className="basis-[180px] shrink-0">{label}</div>
      <div className="grow">{children}</div>
    </div>
  )
}
