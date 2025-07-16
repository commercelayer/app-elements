import cn from "classnames"
import type { JSX } from "react"
import { Icon } from "./Icon"

interface ButtonImage {
  src: string
  alt: string
}

export interface ButtonImageSelectProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  img?: ButtonImage
}

/**
 * This component renders as `<button>` showing an `Avatar` image, if given, or a camera icon to choose one.
 */
export function ButtonImageSelect({
  img,
  ...rest
}: ButtonImageSelectProps): JSX.Element {
  return (
    <button
      type="button"
      data-testid="ButtonImageSelect-main"
      className={cn(
        "flex items-center justify-center rounded p-[2px] text-primary",
        "min-w-[96px] min-h-[96px] w-[96px] h-[96px]",
        "border border-gray-200 hover:border-primary hover:border-solid hover:ring-inset hover:ring-1 hover:ring-primary",
        img != null ? "border-solid" : "border-dashed",
      )}
      {...rest}
    >
      {img != null ? (
        <img
          src={img.src}
          alt={img.alt}
          data-testid="ButtonImageSelect-image"
          className="max-w-full max-h-full"
        />
      ) : (
        <Icon name="camera" size={32} />
      )}
    </button>
  )
}

ButtonImageSelect.displayName = "ButtonImageSelect"
