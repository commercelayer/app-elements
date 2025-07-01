import { useMemo, type ComponentPropsWithRef } from 'react'
import { iconMapping } from './icons'

type IconWeight = 'regular' | 'bold' | 'light' | 'fill'

export interface IconProps extends ComponentPropsWithRef<'svg'> {
  /**
   * Name of the icon to display
   */
  name: keyof typeof iconMapping
  /**
   * Size in CSS units or a number of pixels.
   */
  size?: string | number
  /**
   * Weight of the icon
   */
  weight?: IconWeight
}

/** `app-elements` provides a subset of [Phosphor Icons](https://phosphoricons.com/) out-of-the-box. */
export const Icon: React.FC<IconProps> = ({ name, ...rest }) => {
  const IconSvg = useMemo(() => iconMapping[name], [iconMapping, name])

  return <IconSvg {...rest} />
}

Icon.displayName = 'Icon'
