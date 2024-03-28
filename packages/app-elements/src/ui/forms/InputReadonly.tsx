import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'

export type InputReadonlyProps = InputWrapperBaseProps & {
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
  /**
   * Value to be rendered as simple input text
   */
  value?: string
  /**
   * Multi-line content to be rendered as textarea like.
   * It only accepts a string and will respect new lines when passing a template literal (backticks).
   */
  children?: string
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
    children,
    ...rest
  }) => {
    const cssBase =
      'block w-full rounded bg-gray-50 text-teal text-sm font-mono font-medium marker:font-bold border-none'

    return (
      <InputWrapper
        {...rest}
        className={wrapperClassName}
        feedback={feedback}
        label={label}
        hint={hint}
      >
        <div className='relative w-full group'>
          {children == null ? (
            <input
              className={cn(
                cssBase,
                'px-4 h-[44px] outline-0 !ring-0',
                inputClassName
              )}
              value={isLoading === true ? '' : value}
              readOnly
            />
          ) : (
            <div
              tabIndex={0}
              role='textbox'
              aria-label={label}
              className={cn(
                cssBase,
                'flex flex-col px-4 py-[11px]',
                inputClassName
              )}
            >
              {children.split('\n').map((line, idx) => (
                <span key={idx}>{line}</span>
              ))}
            </div>
          )}
          {showCopyAction && (
            <div
              className={cn('absolute right-4  flex', {
                'top-[2px] items-center': children == null,
                'top-2': children != null
              })}
            >
              <CopyToClipboard
                value={value ?? children?.trim()}
                showValue={false}
              />
            </div>
          )}
        </div>
      </InputWrapper>
    )
  }
)

InputReadonly.displayName = 'InputReadonly'
