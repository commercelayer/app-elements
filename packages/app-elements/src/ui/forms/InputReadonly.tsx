import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'

export interface InputReadonlyProps extends InputWrapperBaseProps {
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

export const InputReadonly = withSkeletonTemplate<InputReadonlyProps>(
  ({
    value,
    wrapperClassName,
    inputClassName,
    showCopyAction = false,
    label,
    hint,
    feedback,
    isLoading,
    delayMs,
    ...rest
  }) => {
    return (
      <InputWrapper
        {...rest}
        className={wrapperClassName}
        feedback={feedback}
        label={label}
        hint={hint}
      >
        <div className='relative w-full select-none group'>
          <input
            className={cn(
              'block w-full bg-gray-50 px-4 h-[44px] text-teal text-sm font-mono font-medium marker:font-bold border-none',
              'rounded outline-0 !ring-0 group-hover:bg-gray-100',
              inputClassName
            )}
            value={isLoading === true ? '' : value}
            readOnly
          />
          {showCopyAction && (
            <div className='absolute top-[2px] bottom-[2px] right-4 group-hover:bg-gray-100 flex items-center opacity-0 group-hover:opacity-100'>
              <CopyToClipboard value={value} showValue={false} />
            </div>
          )}
        </div>
      </InputWrapper>
    )
  }
)

InputReadonly.displayName = 'InputReadonly'
