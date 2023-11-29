import cn from 'classnames'
import { type FC } from 'react'

export interface SwitchModeProps {
  mode: 'test' | 'live'
  onChange: (newMode: 'test' | 'live') => void
}

export const SwitchMode: FC<SwitchModeProps> = ({ mode, onChange }) => {
  return (
    <div
      className={cn(
        'flex items-center gap-2 w-fit',
        'focus-within:rounded focus-within:outline focus-within:outline-2 focus-within:!outline-orange-700 focus-within:outline-offset-2'
      )}
    >
      <div className={cn('relative flex')}>
        <input
          id='mode-switch'
          type='checkbox'
          checked={mode === 'test'}
          className={cn(
            'absolute cursor-pointer top-0 left-0 w-full h-full peer appearance-none opacity-0 z-10'
          )}
          onChange={() => {
            onChange(mode === 'test' ? 'live' : 'test')
          }}
          data-testid='switch-mode'
        />
        <span
          className={cn(
            'w-8 h-5 flex items-center flex-shrink-0 p-[1px] bg-gray-300 rounded-full duration-300 ease-in-out peer-checked:bg-orange-700 after:w-4 after:h-4 after:bg-white after:rounded-full after:shadow-md after:duration-300 peer-checked:after:translate-x-3'
          )}
        />
      </div>
      <label
        htmlFor='mode-switch'
        className={cn('font-bold cursor-pointer select-none duration-300', {
          'text-orange-700': mode === 'test',
          'text-gray-300': mode === 'live'
        })}
      >
        Test mode
      </label>
    </div>
  )
}
