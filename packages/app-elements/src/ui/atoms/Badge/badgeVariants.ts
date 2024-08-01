type BadgeVariant =
  | 'danger-solid'
  | 'danger'
  | 'primary-solid'
  | 'primary'
  | 'secondary-solid'
  | 'secondary'
  | 'success-solid'
  | 'success'
  | 'teal-solid'
  | 'teal'
  | 'warning-solid'
  | 'warning'

export const variantCss: Record<BadgeVariant, string> = {
  'danger-solid': 'text-white bg-red',
  'primary-solid': 'text-white bg-primary',
  'secondary-solid': 'text-gray bg-gray-200',
  'success-solid': 'text-white bg-green',
  'teal-solid': 'text-white bg-teal-800',
  'warning-solid': 'text-white bg-orange',
  danger: 'text-red bg-red-50',
  primary: 'text-primary bg-primary-50',
  secondary: 'text-gray-500 bg-gray-50',
  success: 'text-green-600 bg-green-50',
  teal: 'text-teal-800 bg-teal-50',
  warning: 'text-orange-600 bg-orange-50'
}
