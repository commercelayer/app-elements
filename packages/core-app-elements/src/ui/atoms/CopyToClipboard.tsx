import cn from 'classnames'
import isEmpty from 'lodash/isEmpty'
import { Check, Copy } from 'phosphor-react'
import { useCallback, useEffect, useState } from 'react'
import invariant from 'ts-invariant'

interface CopyToClipboardProps {
  /**
   * text to display that will be copied on button click
   */
  value?: string
  /**
   * css classes
   */
  className?: string
  /**
   * conditional prop to show a preview string containing the defined value before the copy button
   */
  showValue?: boolean
}

const transitionMs = 300
const feedbackDurationMs = 3000

function CopyToClipboard({
  value,
  className,
  showValue = true,
  ...rest
}: CopyToClipboardProps): JSX.Element {
  const [copied, setCopied] = useState<boolean>(false)

  invariant(
    feedbackDurationMs > transitionMs,
    'feedbackDurationMs must be greater than transitionMs'
  )

  const handleCopy = useCallback(
    async (v: string): Promise<void> => {
      await navigator.clipboard.writeText(v)
      setCopied(true)
    },
    [value]
  )

  useEffect(
    function resetStateAfterFeedbackAnimated() {
      if (copied === null || !copied) {
        return
      }

      setTimeout(() => {
        setCopied(false)
      }, feedbackDurationMs + transitionMs)
    },
    [copied]
  )

  if (value == null || isEmpty(value)) {
    return (
      <div
        className={cn(
          'border-b border-gray-500 last:border-b-0 py-2',
          className
        )}
        {...rest}
      >
        -
      </div>
    )
  }

  return (
    <div
      className={cn(
        'break-normal overflow-hidden font-semibold flex justify-between items-center gap-3 border-b border-gray-100 last:border-b-0',
        className
      )}
      {...rest}
    >
      {showValue && <p className='overflow-x-auto py-2'>{value}</p>}
      <button
        onClick={() => {
          void handleCopy(value)
        }}
        className='text-xl cursor-pointer text-gray-300 hover:text-gray-500 relative'
        data-test-id='copy-value-button'
      >
        {!copied ? (
          <Copy />
        ) : (
          <span className='block w-5 h-5'>
            <Copy className='absolute'>
              <animate
                attributeName='opacity'
                values='1;0'
                dur={`${transitionMs}ms`}
                fill='freeze'
                repeatCount='1'
              />
              <animate
                attributeName='opacity'
                values='0;1'
                begin={`${feedbackDurationMs}ms`}
                dur={`${transitionMs}ms`}
                fill='freeze'
                repeatCount='1'
              />
            </Copy>
            <Check className='text-green opacity-0 absolute'>
              <animate
                attributeName='opacity'
                values='0;1'
                begin={`${transitionMs}ms`}
                dur={`${transitionMs}ms`}
                fill='freeze'
                repeatCount='1'
              />
              <animate
                attributeName='opacity'
                values='1;0'
                begin={`${feedbackDurationMs - transitionMs}ms`}
                dur={`${transitionMs}ms`}
                fill='freeze'
                repeatCount='1'
              />
            </Check>
          </span>
        )}
      </button>
    </div>
  )
}

CopyToClipboard.displayName = 'CopyToClipboard'

export { CopyToClipboard }
