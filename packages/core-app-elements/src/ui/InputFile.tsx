import cn from 'classnames'
import { UploadSimple } from 'phosphor-react'
import invariant from 'ts-invariant'

interface Props
  extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * If defined, it shows a progress bar at the bottom. It must be between 0 and 100.
   */
  progress?: number
  /**
   * Text to be shown in the file drop area. Example: "Select an image to upload"
   */
  label: string
}

export function InputFile({
  className,
  progress,
  label,
  ...rest
}: Props): JSX.Element {
  invariant(
    progress === undefined || (progress >= 0 && progress <= 100),
    'When set, progress must be between 0 and 100 range'
  )
  return (
    <div
      className={cn(
        'h-52 w-full relative border border-gray-200 bg-white rounded-md flex flex-col justify-center items-center hover:bg-gray-50 transition-bg group overflow-hidden',
        className
      )}
    >
      <input
        type='file'
        {...rest}
        className='inset-0 absolute opacity-0 z-10 cursor-pointer'
      />
      <UploadSimple className='mb-2' size={32} />
      <div className='font-semibold text-sm text-gray-800'>{label}</div>
      <div className='text-sm'>
        drag and drop it here or{' '}
        <span className='text-primary font-semibold group-hover:underline'>
          browse files
        </span>
      </div>
      {progress != null ? (
        <div
          className='absolute bg-primary h-1 bottom-0 left-0 transition-all'
          style={{ width: `${progress}%` }}
        />
      ) : null}
    </div>
  )
}

export default InputFile
