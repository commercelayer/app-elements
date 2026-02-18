import classNames from "classnames"
import type React from "react"

export const OptionRow: React.FC<{
  className?: string
  label: React.ReactNode
  children: React.ReactNode
}> = ({ children, label, className }) => {
  return (
    <div className={classNames("flex gap-4 first-of-type:mt-0", className)}>
      <div className="basis-45 shrink-0 h-11 flex items-center">{label}</div>
      <div className="grow flex flex-col gap-2">{children}</div>
    </div>
  )
}
