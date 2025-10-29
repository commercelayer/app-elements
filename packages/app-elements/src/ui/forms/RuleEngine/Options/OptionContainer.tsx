import type React from "react"

export const OptionContainer: React.FC<{
  children: React.ReactNode
}> = ({ children }) => {
  return (
    <div className="bg-white rounded-md p-4 shadow-xs flex flex-col gap-2">
      {children}
    </div>
  )
}
