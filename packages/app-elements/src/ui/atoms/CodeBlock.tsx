import cn from "classnames"
import { useEffect, useState } from "react"
import { CopyToClipboard } from "#ui/atoms/CopyToClipboard"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import {
  InputWrapper,
  type InputWrapperBaseProps,
} from "#ui/internals/InputWrapper"

export type CodeBlockProps = Pick<InputWrapperBaseProps, "label" | "hint"> & {
  /**
   * Show a Copy to clipboard button.
   */
  showCopyAction?: boolean
  /**
   * Show a button to hide/show content. Content starts hidden if `showSecretAction` is true.
   */
  showSecretAction?: boolean
  /**
   * Content to be rendered.
   * It only accepts a string and will respect new lines when passing a template literal (backticks).
   */
  children: string
}

export const CodeBlock = withSkeletonTemplate<CodeBlockProps>(
  ({
    showCopyAction = false,
    showSecretAction = false,
    label,
    hint,
    isLoading,
    delayMs,
    children,
    ...rest
  }) => {
    const [hideValue, setHideValue] = useState(showSecretAction)

    useEffect(() => {
      setHideValue(showSecretAction)
    }, [showSecretAction])

    return (
      <InputWrapper {...rest} label={label} hint={hint}>
        <div className="flex group w-full rounded bg-gray-50 [.overlay-container_&]:bg-gray-200">
          <div
            className="flex flex-col w-full px-4 py-2.5 text-teal text-sm font-mono font-medium marker:font-bold border-none break-all"
            data-testid="codeblock-content"
          >
            {isLoading === true
              ? ""
              : children.split("\n").map((line, idx) => (
                  // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since the content is static and does not change and the lines are not reordered or filtered.
                  <span key={idx}>
                    {hideValue ? randomHiddenValue() : line}
                  </span>
                ))}
          </div>
          {showCopyAction || showSecretAction ? (
            <div className={cn("flex gap-4 items-start pr-4 py-2.5 pl-0")}>
              {showSecretAction && (
                <button
                  type="button"
                  onClick={() => {
                    setHideValue(!hideValue)
                  }}
                  data-testid="toggle-secret"
                >
                  <Icon
                    name={hideValue ? "eye" : "eyeSlash"}
                    className="text-gray-500 hover:text-gray-300"
                    size={20}
                  />
                </button>
              )}
              {showCopyAction && (
                <CopyToClipboard value={children?.trim()} showValue={false} />
              )}
            </div>
          ) : null}
        </div>
      </InputWrapper>
    )
  },
)

CodeBlock.displayName = "CodeBlock"

function randomHiddenValue(): string {
  return "*".repeat(Math.floor(Math.random() * 7) + 10)
}
