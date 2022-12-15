import { ReactNode } from 'react'
import cn from 'classnames'

interface Props {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
}

export function EmptyState({
  title,
  description,
  action,
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      className={cn(
        'flex flex-col p-6 lg:p-14 bg-gray-50 border-gray-50 rounded-md',
        className
      )}
      {...rest}
    >
      <h4 className='text-black font-semibold text-2xl mb-4'>{title}</h4>

      {description != null ? (
        <div className='font-medium text-gray-500 text-lg'>{description}</div>
      ) : null}

      {action !== null ? <div className='mt-16'>{action}</div> : null}

      <div className='pt-20' />
    </div>
  )
}

export default EmptyState
