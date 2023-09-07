import cn from 'classnames'
import { forwardRef } from 'react'

export interface InputToggleBoxProps
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'value'> {
  id: string
  label: string
  description?: React.ReactNode
  className?: string
}

export const InputToggleBox = forwardRef<HTMLInputElement, InputToggleBoxProps>(
  ({ id, className, label, description, ...rest }, ref): JSX.Element => {
    return (
      <div
        className={cn(
          'px-4 first:border-t border-b b-gray-100 py-4',
          className
        )}
      >
        <div className='flex justify-between items-start gap-5'>
          <div>
            <label htmlFor={id} className='font-semibold'>
              {label}
            </label>
            {description != null ? (
              <p className='text-sm font-medium text-gray-500'>{description}</p>
            ) : null}
          </div>
          <div className='relative '>
            <input
              id={id}
              type='checkbox'
              className='absolute cursor-pointer top-0 left-0 w-full h-full peer appearance-none opacity-0 z-10'
              {...rest}
              ref={ref}
            />
            <span className='w-8 h-5 flex items-center flex-shrink-0 p-[2px] bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-primary after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3' />
          </div>
        </div>
      </div>
    )
  }
)

InputToggleBox.displayName = 'InputToggleBox'