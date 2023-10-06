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
  'secondary-solid': 'text-white bg-gray-500',
  'success-solid': 'text-white bg-green',
  'teal-solid': 'text-white bg-teal',
  'warning-solid': 'text-white bg-orange',
  danger: 'text-red bg-red/10',
  primary: 'text-primary bg-primary/10',
  secondary: 'text-gray-500 bg-gray-500/10',
  success: 'text-green bg-green/10',
  teal: 'text-teal-800 bg-teal-800/10',
  warning: 'text-orange bg-orange/10'
}
