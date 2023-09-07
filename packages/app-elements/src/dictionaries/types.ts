import { type IconProps } from '#ui/atoms/Icon'

export interface DisplayStatus {
  label: string
  icon: IconProps['name']
  color: IconProps['background']
  task?: string
}
