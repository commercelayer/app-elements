import cn from 'classnames'
import {
  X,
  CaretRight,
  Check,
  ArrowLeft,
  ArrowDown,
  Warning,
  ArrowClockwise,
  Eye
} from 'phosphor-react'

interface IconProps extends React.HTMLAttributes<HTMLDivElement>, IconSvgProps {
  /**
   * Name of the icon to display
   */
  name: keyof typeof IconSvg
  /**
   * Background color, `none` for no background
   */
  background?: 'green' | 'orange' | 'red' | 'gray' | 'teal' | 'white' | 'none'
  /**
   * padding around the icon can bne: 'none' | 'small' | 'large'
   */
  gap?: 'none' | 'small' | 'large'
  /**
   * Icon size as css unit (eg: 32px, 4rem) or number as pixels value.
   * Works only when background is `none`
   */
  size?: string | number
}

function Icon({
  name,
  background = 'none',
  gap = 'none',
  size,
  ...rest
}: IconProps): JSX.Element {
  return (
    <div
      className={cn([
        // padding
        { 'p-3': gap === 'large' },
        { 'p-[3px]': gap === 'small' },
        // variants
        { 'border rounded-full': background !== 'none' },
        { 'bg-green border-green text-white': background === 'green' },
        { 'bg-red border-red text-white': background === 'red' },
        { 'bg-gray-300 border-gray-300 text-white': background === 'gray' },
        { 'bg-orange border-orange text-white': background === 'orange' },
        { 'bg-teal border-teal text-white': background === 'teal' },
        { 'bg-white border-gray-200': background === 'white' }
      ])}
      {...rest}
    >
      {IconSvg[name]({ size: background === 'none' ? size : '1rem' })}
    </div>
  )
}

Icon.displayName = 'Icon'
export { Icon }

interface IconSvgProps extends Pick<IconProps, 'size'> {}
const IconSvg = {
  x: ({ size }: IconSvgProps) => <X size={size} />,
  caretRight: ({ size }: IconSvgProps) => <CaretRight size={size} />,
  check: ({ size }: IconSvgProps) => <Check size={size} />,
  arrowDown: ({ size }: IconSvgProps) => <ArrowDown size={size} />,
  arrowLeft: ({ size }: IconSvgProps) => <ArrowLeft size={size} />,
  warning: ({ size }: IconSvgProps) => <Warning size={size} />,
  arrowClockwise: ({ size }: IconSvgProps) => <ArrowClockwise size={size} />,
  eye: ({ size }: IconSvgProps) => <Eye size={size} />
}
