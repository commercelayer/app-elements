import cn from "classnames"
import { useEffect, useState } from "react"
import type { JsonObject } from "type-fest"
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
   * A smaller font, 12px, for a block set inside dense content such as a
   * details panel.
   * @default "regular"
   */
  size?: "regular" | "small"
  /**
   * Content to be rendered.
   * Accepts a string (respects new lines with template literals) or a JSON object.
   * JSON objects are formatted with 2-space indentation.
   */
  children: string | JsonObject
}

/** JSON keeps its indentation and is set smaller than plain text. */
function getContentClassName(
  children: CodeBlockProps["children"],
  size: NonNullable<CodeBlockProps["size"]>,
): string {
  if (typeof children === "string") {
    return getFontSizeClassName(size, "text-sm")
  }

  return cn("whitespace-pre-wrap", getFontSizeClassName(size, "text-xs"))
}

/** The small size is the same 12px whatever the content. */
function getFontSizeClassName(
  size: NonNullable<CodeBlockProps["size"]>,
  regular: string,
): string {
  if (size === "small") {
    return "text-2xs"
  }

  return regular
}

export const CodeBlock = withSkeletonTemplate<CodeBlockProps>(
  ({
    showCopyAction = false,
    showSecretAction = false,
    size = "regular",
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

    const contentString =
      typeof children === "string"
        ? children
        : JSON.stringify(children, null, 2)

    return (
      <InputWrapper {...rest} label={label} hint={hint}>
        {/* A shade darker only on a gray overlay, where `bg-gray-50` would
            disappear into the surface. A white overlay — every drawer, unless it
            asks for `backgroundColor="light"` — keeps the page's own shade. */}
        <div className="flex group w-full rounded bg-gray-50 in-[.overlay-container-light]:bg-gray-200">
          <div
            className={cn(
              "flex flex-col w-full px-4 py-2.5 text-primary font-mono font-medium marker:font-semibold leading-5 border-none break-all",
              getContentClassName(children, size),
            )}
            data-testid="codeblock-content"
          >
            {isLoading === true
              ? ""
              : contentString.split("\n").map((line, idx) => (
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
                <CopyToClipboard
                  value={contentString.trim()}
                  showValue={false}
                />
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
