import { LightbulbFilament } from 'phosphor-react'
import cn from 'classnames'

export type HintIcon = 'bulb'

export interface HintProps {
  icon?: HintIcon
  children: ElementChildren
  className?: string
}

function Hint({ icon, className, children, ...rest }: HintProps): JSX.Element {
  const icons: Record<HintIcon, JSX.Element> = {
    bulb: <LightbulbFilament size={24} data-test-id='icon-bulb' />
  }

  return (
    <div className={cn('flex gap-2 items-center', className)} {...rest}>
      {icon != null && icons[icon]}
      <div className='text-sm font-medium text-gray-500'>{children}</div>
    </div>
  )
}

Hint.displayName = 'Hint'
export { Hint }
