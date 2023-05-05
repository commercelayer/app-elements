import cn from 'classnames'
import * as phosphor from '@phosphor-icons/react'
import { useMemo } from 'react'

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Name of the icon to display
   */
  name: keyof typeof iconMapping
  /**
   * Background color, `none` for no background
   */
  background?:
    | 'green'
    | 'orange'
    | 'red'
    | 'gray'
    | 'teal'
    | 'white'
    | 'black'
    | 'none'
  /**
   * padding around the icon can bne: 'none' | 'small' | 'large'
   */
  gap?: 'none' | 'small' | 'large'
  /**
   * CSS classes
   */
  className?: string
}

function Icon({
  name,
  className,
  background = 'none',
  gap = 'none',
  ...rest
}: IconProps): JSX.Element {
  const IconSvg = useMemo(() => iconMapping[name], [iconMapping, name])

  return (
    <div
      className={cn([
        'w-fit',
        // padding
        { 'p-[10px]': gap === 'large' },
        { 'p-[3px]': gap === 'small' },
        // variants
        { 'border rounded-full': background !== 'none' },
        { 'bg-green border-green text-white': background === 'green' },
        { 'bg-red border-red text-white': background === 'red' },
        { 'bg-gray-300 border-gray-300 text-white': background === 'gray' },
        { 'bg-orange border-orange text-white': background === 'orange' },
        { 'bg-teal border-teal text-white': background === 'teal' },
        { 'bg-white border-gray-200': background === 'white' },
        { 'bg-gray-800 border-gray-800 text-white': background === 'black' },
        // className
        className
      ])}
      {...rest}
    >
      <IconSvg
        size={gap === 'large' ? '1.25rem' : undefined}
        weight={background !== 'none' ? 'bold' : undefined}
      />
    </div>
  )
}

Icon.displayName = 'Icon'
export { Icon }

const iconMapping = {
  arrowBendDownRight: phosphor.ArrowBendDownRight,
  arrowCircleDown: phosphor.ArrowCircleDown,
  arrowClockwise: phosphor.ArrowClockwise,
  arrowDown: phosphor.ArrowDown,
  arrowLeft: phosphor.ArrowLeft,
  asterisk: phosphor.AsteriskSimple,
  caretRight: phosphor.CaretRight,
  chatCircle: phosphor.ChatCircle,
  check: phosphor.Check,
  cloud: phosphor.CloudArrowUp,
  creditCard: phosphor.CreditCard,
  download: phosphor.Download,
  eye: phosphor.Eye,
  flag: phosphor.Flag,
  funnel: phosphor.FunnelSimple,
  magnifyingGlass: phosphor.MagnifyingGlass,
  minus: phosphor.Minus,
  package: phosphor.Package,
  stack: phosphor.Stack,
  upload: phosphor.Upload,
  user: phosphor.User,
  warning: phosphor.Warning,
  x: phosphor.X
}
