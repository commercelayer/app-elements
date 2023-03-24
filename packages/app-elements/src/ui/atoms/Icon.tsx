import cn from 'classnames'
import * as phosphor from 'phosphor-react'
import { useMemo } from 'react'

export interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  /**
   * Name of the icon to display
   */
  name: keyof typeof iconMapping
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
   */
  size?: string | number
  /**
   * Icon weight.
   * @default bold
   */
  weight?: phosphor.IconWeight
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
  size,
  weight = 'bold',
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
        // className
        className
      ])}
      {...rest}
    >
      <IconSvg size={getIconSize({ size, gap })} weight={weight} />
    </div>
  )
}

Icon.displayName = 'Icon'
export { Icon }

const iconMapping = {
  arrowClockwise: phosphor.ArrowClockwise,
  arrowDown: phosphor.ArrowDown,
  arrowLeft: phosphor.ArrowLeft,
  arrowCircleDown: phosphor.ArrowCircleDown,
  caretRight: phosphor.CaretRight,
  check: phosphor.Check,
  cloud: phosphor.CloudArrowUp,
  creditCard: phosphor.CreditCard,
  download: phosphor.Download,
  eye: phosphor.Eye,
  minus: phosphor.Minus,
  stack: phosphor.Stack,
  upload: phosphor.Upload,
  user: phosphor.User,
  warning: phosphor.Warning,
  x: phosphor.X
}

function getIconSize({
  size,
  gap
}: Pick<IconProps, 'size' | 'gap'>): string | number | undefined {
  if (size != null) {
    return size
  }

  return gap === 'large' ? '1.25rem' : undefined
}
