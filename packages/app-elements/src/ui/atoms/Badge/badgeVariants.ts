type BadgeVariant =
  | "brand"
  | "brand-solid"
  | "danger-solid"
  | "danger"
  | "primary-solid"
  | "primary"
  | "secondary-solid"
  | "secondary"
  | "success-solid"
  | "success"
  | "teal-solid"
  | "teal"
  | "warning-solid"
  | "warning"

export const variantCss: Record<BadgeVariant, string> = {
  "danger-solid": "text-white bg-red",
  "primary-solid": "text-white bg-primary",
  "secondary-solid": "text-white bg-gray-400",
  "success-solid": "text-white bg-green-500",
  "teal-solid": "text-white bg-teal-600",
  "warning-solid": "text-white bg-orange-500",
  "brand-solid": "text-white bg-brand",
  danger: "text-red-700 bg-red-100",
  primary: "text-primary bg-primary-100",
  secondary: "text-gray-600 bg-gray-100",
  success: "text-green-700 bg-green-100",
  teal: "text-teal-800 bg-teal-100",
  warning: "text-orange-700 bg-orange-100",
  brand: "text-brand bg-brand-50",
}
