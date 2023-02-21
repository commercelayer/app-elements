import { ReactNode } from 'react'
import cn from 'classnames'
import { Stack } from 'phosphor-react'

interface Props {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
  icon?: 'stack' | 'none'
}

function EmptyState({
  title,
  description,
  action,
  icon,
  className,
  ...rest
}: Props): JSX.Element {
  return (
    <div
      className={cn(
        'bg-gray-50 border-gray-50 rounded-md overflow-hidden w-full',
        className
      )}
      {...rest}
    >
      <div className='flex'>
        <div className='flex-1 py-6 pl-6 md:!p-14 md:!pr-0'>
          <h4 className='text-black font-semibold text-2xl mb-4'>{title}</h4>

          {description != null ? (
            <div className='font-medium text-gray-500 text-lg'>
              {description}
            </div>
          ) : null}

          {action !== null ? <div className='mt-16'>{action}</div> : null}

          <div className='pt-20' />
        </div>
        <div className='relative w-[102px] flex flex-col pb-3'>
          {icon === 'stack' ? (
            <Stack className='text-10xl text-gray-100 mt-auto' />
          ) : null}
        </div>
      </div>
    </div>
  )
}

EmptyState.displayName = 'EmptyState'
export { EmptyState }
