import { Card } from '#ui/atoms/Card'
import {
  CheckCircle,
  Info,
  Warning,
  XCircle,
  type Icon
} from '@phosphor-icons/react'
import classNames from 'classnames'

export interface AlertProps {
  /** Alert status. This affects the color scheme and icon used. */
  status: 'error' | 'success' | 'warning' | 'info'
  children: React.ReactNode
}

/**
 * Alerts are visual representations used to communicate a state that affects the page or the interactive element.
 */
export const Alert: React.FC<AlertProps> = ({ children, status }) => {
  const Icon = icons[status]

  return (
    <Card
      role='alert'
      className={classNames('border-0', {
        'bg-orange-50 text-orange-700': status === 'warning',
        'bg-red-50 text-red-700': status === 'error',
        'bg-gray-50 text-gray-700': status === 'info',
        'bg-green-50 text-green-700': status === 'success'
      })}
    >
      <div className='flex gap-3'>
        <Icon focusable={false} size={24} />
        <div>{children}</div>
      </div>
    </Card>
  )
}

Alert.displayName = 'Alert'

const icons: Record<AlertProps['status'], Icon> = {
  warning: Warning,
  error: XCircle,
  info: Info,
  success: CheckCircle
}
