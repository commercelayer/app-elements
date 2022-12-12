import { LightbulbFilament } from 'phosphor-react'
import { ReactNode } from 'react'
import cn from 'classnames'

type HelperIcon = 'bulb'

export interface InputHelperTextProps {
  icon?: HelperIcon
  children: ReactNode
  className?: string
}

export function InputHelperText({
  icon,
  className,
  children,
  ...rest
}: InputHelperTextProps): JSX.Element {
  const icons: Record<HelperIcon, JSX.Element> = {
    bulb: <LightbulbFilament size={24} data-test-id='icon-bulb' />
  }

  return (
    <div className={cn('flex gap-2 items-center', className)} {...rest}>
      {icon != null && icons[icon]}
      <div className='text-sm'>{children}</div>
    </div>
  )
}

export default InputHelperText
