import { type IconProps as PhosphorIconProps } from '@phosphor-icons/react'
import { useMemo } from 'react'
import { iconMapping } from './icons'

export interface IconProps extends PhosphorIconProps {
  /**
   * Name of the icon to display
   */
  name: keyof typeof iconMapping
}

/** `app-elements` provides a subset of [Phosphor Icons](https://phosphoricons.com/) out-of-the-box. */
export const Icon: React.FC<IconProps> = ({ name, ...rest }) => {
  const IconSvg = useMemo(() => iconMapping[name], [iconMapping, name])

  return <IconSvg {...rest} />
}

Icon.displayName = 'Icon'
