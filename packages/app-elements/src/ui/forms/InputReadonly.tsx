import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'

interface InputReadonlyProps extends InputWrapperBaseProps {
  /**
   * Controlled value
   */
  value?: string
  /**
   * Optional CSS class names used for the outer wrapper/container element
   */
  wrapperClassName?: string
  /**
   * Optional CSS class names used for the input element
   */
  inputClassName?: string
  /**
   * Optional prop to define whether to show or not the Copy to clipboard button
   */
  showCopyAction?: boolean
}

export function InputReadonly({
  value,
  wrapperClassName,
  inputClassName,
  showCopyAction = false,
  label,
  hint,
  feedback,
  ...rest
}: InputReadonlyProps): JSX.Element {
  return (
    <InputWrapper
      {...rest}
      className={wrapperClassName}
      feedback={feedback}
      label={label}
      hint={hint}
    >
      <div className='relative w-full select-none'>
        <input
          className={cn(
            'block w-full bg-gray-50 px-4 h-10 text-teal font-bold border-none',
            'rounded outline-0',
            inputClassName
          )}
          value={value}
          readOnly
        />
        {showCopyAction && (
          <div className='absolute top-0 bottom-0 right-4 flex items-center'>
            <CopyToClipboard value={value} showValue={false} />
          </div>
        )}
      </div>
    </InputWrapper>
  )
}

InputReadonly.displayName = 'InputReadonly'
