import { ReactNode } from 'react'
import cn from 'classnames'
import { Stack, Upload, Download, CloudArrowUp } from 'phosphor-react'

interface Props {
  title: string
  description?: ReactNode
  action?: ReactNode
  className?: string
  icon?: 'stack' | 'download' | 'upload' | 'cloud' | 'none'
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
      <div className='flex p-6 md:!p-14 relative'>
        <div className='flex-1 z-10'>
          <h4 className='text-black font-semibold text-2xl mb-4'>{title}</h4>

          {description != null ? (
            <div className='font-medium text-gray-500 text-lg'>
              {description}
            </div>
          ) : null}

          {action != null ? <div className='mt-14'>{action}</div> : null}
        </div>
        <div className='absolute -bottom-2.5 -right-2'>
          {icon != null ? (
            <div className='text-10xl text-gray-100 mt-auto'>
              {(() => {
                switch (icon) {
                  case 'stack':
                    return <Stack />
                  case 'upload':
                    return <Upload />
                  case 'download':
                    return <Download />
                  case 'cloud':
                    return <CloudArrowUp />
                  default:
                    return null
                }
              })()}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}

EmptyState.displayName = 'EmptyState'
export { EmptyState }
