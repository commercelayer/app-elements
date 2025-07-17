import {
  CheckCircle,
  type Icon,
  Info,
  Warning,
  XCircle,
} from "@phosphor-icons/react"
import classNames from "classnames"

export interface AlertProps {
  /** Alert status. This affects the color scheme and icon used. */
  status: "error" | "success" | "warning" | "info"
  children: React.ReactNode
}

/**
 * Alerts are visual representations used to communicate a state that affects the page or the interactive element.
 */
export const Alert: React.FC<AlertProps> = ({ children, status }) => {
  const Icon = icons[status]

  return (
    <div
      role="alert"
      className={classNames("border p-6 rounded-md", {
        "border-orange-200 bg-orange-50 text-orange-700": status === "warning",
        "border-red-200 bg-red-50 text-red-700": status === "error",
        "border-gray-200 bg-gray-50 text-gray-700": status === "info",
        "border-green-200 bg-green-50 text-green-700": status === "success",
      })}
    >
      <div className="flex gap-3">
        <Icon className="flex-shrink-0" focusable={false} size={24} />
        <div>{children}</div>
      </div>
    </div>
  )
}

Alert.displayName = "Alert"

const icons: Record<AlertProps["status"], Icon> = {
  warning: Warning,
  error: XCircle,
  info: Info,
  success: CheckCircle,
}
