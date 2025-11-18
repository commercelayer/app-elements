import { CheckIcon, CopyIcon } from "@phosphor-icons/react"
import cn from "classnames"
import isEmpty from "lodash-es/isEmpty"
import { useCallback, useEffect, useState } from "react"
import invariant from "ts-invariant"
import { Text } from "#ui/atoms/Text"

export interface CopyToClipboardProps {
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

/** CopyToClipboard can copy a provided value to the clipboard. You can use the `showValue` prop to decide whether to render or not the provided value. */
export const CopyToClipboard: React.FC<CopyToClipboardProps> = ({
  value,
  className,
  showValue = true,
  ...rest
}) => {
  const [copied, setCopied] = useState<boolean>(false)

  invariant(
    feedbackDurationMs > transitionMs,
    "feedbackDurationMs must be greater than transitionMs",
  )

  const handleCopy = useCallback(
    async (v: string): Promise<void> => {
      await navigator.clipboard.writeText(v)
      setCopied(true)
    },
    [value],
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
    [copied],
  )

  if (value == null || isEmpty(value)) {
    return (
      <div
        className={cn(
          "border-b border-gray-500 last:border-b-0 py-2",
          className,
        )}
        {...rest}
      >
        <Text data-testid="empty-string" variant="disabled">
          &#8212;
        </Text>
      </div>
    )
  }

  return (
    <div
      className={cn(
        "break-normal overflow-hidden font-medium text-sm flex justify-between items-center gap-3 border-b border-gray-100 last:border-b-0",
        className,
      )}
      {...rest}
    >
      {showValue && (
        <div className="overflow-x-auto py-2">
          {isJsonString(value) ? (
            <div className="whitespace-pre max-h-[200px] font-mono font-medium">
              {JSON.stringify(JSON.parse(value), null, 2)}
            </div>
          ) : (
            value
          )}
        </div>
      )}
      <button
        type="button"
        onClick={() => {
          void handleCopy(value)
        }}
        className="flex items-center text-xl cursor-pointer text-gray-500 hover:text-gray-300 relative"
        data-testid="copy-value-button"
      >
        {!copied ? (
          <CopyIcon />
        ) : (
          <span className="block w-5 h-5">
            <CopyIcon className="absolute">
              <animate
                attributeName="opacity"
                values="1;0"
                dur={`${transitionMs}ms`}
                fill="freeze"
                repeatCount="1"
              />
              <animate
                attributeName="opacity"
                values="0;1"
                begin={`${feedbackDurationMs}ms`}
                dur={`${transitionMs}ms`}
                fill="freeze"
                repeatCount="1"
              />
            </CopyIcon>
            <CheckIcon className="text-green opacity-0 absolute">
              <animate
                attributeName="opacity"
                values="0;1"
                begin={`${transitionMs}ms`}
                dur={`${transitionMs}ms`}
                fill="freeze"
                repeatCount="1"
              />
              <animate
                attributeName="opacity"
                values="1;0"
                begin={`${feedbackDurationMs - transitionMs}ms`}
                dur={`${transitionMs}ms`}
                fill="freeze"
                repeatCount="1"
              />
            </CheckIcon>
          </span>
        )}
      </button>
    </div>
  )
}

/** check if a string can be considered as stringified JSON object */
function isJsonString(str: string): boolean {
  try {
    JSON.parse(str)
  } catch (_e) {
    return false
  }
  return true
}

CopyToClipboard.displayName = "CopyToClipboard"
