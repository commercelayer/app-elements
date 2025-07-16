import cn from "classnames"
import { type JSX, useState } from "react"
import { presets } from "./Avatar.utils"

type SrcPreset = keyof typeof presets
type SrcUrl = `https://${string}` | `data:image/${string}`

export interface AvatarProps {
  /**
   * Image URL
   */
  src: SrcPreset | SrcUrl
  /**
   * Alt text
   */
  alt: string
  /**
   * Specify `none` to remove border
   */
  border?: "none"
  /**
   * Image shape
   * @default "rounded"
   */
  shape?: "rounded" | "circle"
  /**
   * Image size
   * (x-small: 32px, small: 48px, normal: 58px, large: 72px)
   * @default "normal"
   */
  size?: "x-small" | "small" | "normal" | "large"
  /**
   * Image class
   */
  className?: string
}

/**
 * This component renders as `<img>` using different shapes and sizes. It is mostly used to show an SKU image or a 3rd-party icon.
 */
export function Avatar({
  src,
  alt,
  border,
  shape = "rounded",
  size = "normal",
  className,
  ...rest
}: AvatarProps): JSX.Element {
  const [hasOnLoadError, setHasOnLoadError] = useState<boolean>(false)
  const hasError =
    hasOnLoadError || (!srcIsValidUrl(src) && !srcIsValidPreset(src))

  return (
    <img
      {...rest}
      onError={() => {
        setHasOnLoadError(true)
      }}
      src={
        srcIsValidPreset(src)
          ? presets[src]
          : srcIsValidUrl(src) && !hasOnLoadError
            ? src
            : placeholderSvg
      }
      alt={alt}
      className={cn(
        "border object-contain object-center",
        {
          // size
          "min-w-[72px] min-h-[72px] w-[72px] h-[72px]": size === "large",
          "min-w-[58px] min-h-[58px] w-[58px] h-[58px]": size === "normal",
          "min-w-[42px] min-h-[42px] w-[42px] h-[42px]": size === "small",
          "min-w-8 min-h-8 w-8 h-8": size === "x-small",
          // shape
          rounded: shape === "rounded",
          "rounded-full": shape === "circle",
          // border
          "border-gray-100": border == null,
          "border-transparent":
            border === "none" || (srcIsValidPreset(src) && src !== "gift_card"),
          // placeholder
          "p-1": hasError && (size === "normal" || size === "large"),
          "p-0.5": hasError && size !== "normal",
        },
        className,
      )}
    />
  )
}

function srcIsValidPreset(src: AvatarProps["src"]): src is SrcPreset {
  return Object.keys(presets).includes(src)
}

function srcIsValidUrl(
  src: AvatarProps["src"] | undefined | null,
): src is SrcUrl {
  return (
    src != null && (src.startsWith("https://") || src.startsWith("data:image/"))
  )
}

const placeholderSvg =
  "https://data.commercelayer.app/assets/images/icons/items/placeholder.svg"

Avatar.displayName = "Avatar"
