import { t } from '#providers/I18NProvider'
import { Button } from '#ui/atoms/Button'
import {
  getFeedbackStyle,
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import { UploadSimple } from '@phosphor-icons/react'
import cn from 'classnames'
import { forwardRef, type JSX } from 'react'
import invariant from 'ts-invariant'

export interface InputFileProps
  extends InputWrapperBaseProps,
    Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type'> {
  /**
   * The title is shown within the input.
   */
  title: string
  /**
   * If defined, it shows a progress bar at the bottom. It must be between 0 and 100.
   */
  progress?: number
}

export const InputFile = forwardRef<HTMLInputElement, InputFileProps>(
  (
    { className, progress, label, hint, feedback, inline, title, ...rest },
    ref
  ): JSX.Element => {
    invariant(
      progress === undefined || (progress >= 0 && progress <= 100),
      'When set, progress must be between 0 and 100 range'
    )
    return (
      <InputWrapper
        label={label}
        inline={inline}
        hint={hint}
        feedback={feedback}
      >
        <div
          className={cn(
            'h-52 w-full p-4 text-center relative border bg-white rounded-md flex flex-col justify-center items-center hover:bg-gray-50 transition-bg group overflow-hidden',
            className,
            getFeedbackStyle(feedback)
          )}
        >
          <input
            type='file'
            {...rest}
            ref={ref}
            className='inset-0 absolute opacity-0 z-10 cursor-pointer'
          />
          <UploadSimple className='mb-2' size={32} />
          <div className='font-semibold text-sm text-gray-800'>{title}</div>
          <div className='text-sm'>
            {t('common.forms.drag_here_or')}{' '}
            <Button variant='link'>{t('common.forms.browse_files')}</Button>
          </div>
          {progress != null ? (
            <div
              className='absolute bg-primary h-1 bottom-0 left-0 transition-all'
              style={{ width: `${progress}%` }}
            />
          ) : null}
        </div>
      </InputWrapper>
    )
  }
)

InputFile.displayName = 'InputFile'
