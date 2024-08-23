import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Icon } from '#ui/atoms/Icon'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import {
  InputWrapper,
  type InputWrapperBaseProps
} from '#ui/internals/InputWrapper'
import cn from 'classnames'
import { useState } from 'react'

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
  /**
   * Show an icon to hide/show content. Content starts hidden if `secret` is true.
   */
  secret?: boolean
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
    secret = false,
    ...rest
  }) => {
    const cssBase =
      'block w-full rounded bg-gray-50 text-teal text-sm font-mono font-medium marker:font-bold border-none break-all'

    const [hideValue, setHideValue] = useState(secret)

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
                inputClassName,
                'px-4 h-[44px] outline-0 !ring-0',
                { 'pr-12': !secret, 'pr-20': secret }
              )}
              value={
                isLoading === true
                  ? ''
                  : hideValue
                    ? randomHiddenValue()
                    : value
              }
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
                <span key={idx}>{hideValue ? randomHiddenValue() : line}</span>
              ))}
            </div>
          )}
          {showCopyAction || secret ? (
            <div
              className={cn('absolute right-4 flex gap-4 items-center', {
                'top-[2px] bottom-[2px] items-center': children == null,
                'top-2': children != null
              })}
            >
              {secret && (
                <button
                  onClick={() => {
                    setHideValue(!hideValue)
                  }}
                  data-testid='toggle-secret'
                >
                  <Icon
                    name={hideValue ? 'eye' : 'eyeSlash'}
                    className='text-gray-500 hover:text-gray-300'
                    size={20}
                  />
                </button>
              )}
              {showCopyAction && (
                <CopyToClipboard
                  value={value ?? children?.trim()}
                  showValue={false}
                />
              )}
            </div>
          ) : null}
        </div>
      </InputWrapper>
    )
  }
)

InputReadonly.displayName = 'InputReadonly'

function randomHiddenValue(): string {
  return '*'.repeat(Math.floor(Math.random() * 7) + 10)
}
