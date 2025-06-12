import { Icon } from '#ui/atoms/Icon'
import React from 'react'
import {
  type Id,
  ToastContainer as OriginalToastContainer,
  type ToastContent,
  type ToastOptions,
  toast as originalToast
} from 'react-toastify'

export const ToastContainer = (): React.JSX.Element => {
  return (
    <OriginalToastContainer
      newestOnTop
      position='bottom-right'
      hideProgressBar={false}
      autoClose={5000}
      closeOnClick={false}
      pauseOnHover
      closeButton={({ closeToast }) => {
        return (
          <Icon
            name='x'
            className='absolute top-2 right-2 cursor-pointer'
            onClick={() => {
              closeToast()
            }}
          />
        )
      }}
    />
  )
}

export function toast<TData = unknown>(
  content: ToastContent<TData>,
  options?: Options<TData>
): Id {
  return originalToast(content, {
    icon: options?.icon ?? false,
    type: options?.type ?? 'info',
    ...options
  })
}

type Options<Data = unknown> = Pick<ToastOptions<Data>, 'icon'> & {
  type?: Exclude<
    Pick<ToastOptions<Data>, 'type'>['type'],
    'default' | 'warning'
  >
}
