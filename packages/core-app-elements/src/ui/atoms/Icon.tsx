import cn from 'classnames'
import {
  X,
  CaretRight,
  Check,
  ArrowDown,
  Warning,
  ArrowClockwise,
  Eye
} from 'phosphor-react'

const IconSvg = {
  x: <X />,
  caretRight: <CaretRight />,
  check: <Check />,
  arrowDown: <ArrowDown />,
  warning: <Warning />,
  arrowClockwise: <ArrowClockwise />,
  eye: <Eye />
}

interface IconProps extends React.HTMLAttributes<HTMLDivElement> {
  name: keyof typeof IconSvg
  background?: 'green' | 'orange' | 'red' | 'gray' | 'teal' | 'white' | 'none'
  gap?: 'none' | 'small' | 'large'
}

function Icon({
  name,
  background = 'none',
  gap = 'none',
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
      {IconSvg[name]}
    </div>
  )
}

export default Icon
