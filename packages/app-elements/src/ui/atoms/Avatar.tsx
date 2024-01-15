import cn from 'classnames'
import { presets } from './Avatar.utils'

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
  border?: 'none'
  /**
   * Image shape
   * @default "rounded"
   */
  shape?: 'rounded' | 'circle'
  /**
   * Image size
   * (small: 48px, normal: 58px)
   * @default "normal"
   */
  size?: 'small' | 'normal' | 'x-small' | 'large'
  /**
   * Image class
   */
  className?: string
}

/**
 * This component renders as `<img>` using different shapes and sizes. It is mostly used to show an SKU image or a 3rd-party icon.
 */
function Avatar({
  src,
  alt,
  border,
  shape = 'rounded',
  size = 'normal',
  className,
  ...rest
}: AvatarProps): JSX.Element {
  return (
    <img
      {...rest}
      src={
        srcIsValidPreset(src)
          ? presets[src]
          : srcIsValidUrl(src)
            ? src
            : placeholderSvg
      }
      alt={alt}
      className={cn(
        'border object-contain object-center',
        {
          // size
          'min-w-[96px] min-h-[96px] w-[96px] h-[96px]': size === 'large',
          'min-w-[58px] min-h-[58px] w-[58px] h-[58px]': size === 'normal',
          'min-w-[42px] min-h-[42px] w-[42px] h-[42px]': size === 'small',
          'min-w-8 min-h-8 w-8 h-8': size === 'x-small',
          // shape
          rounded: shape === 'rounded',
          'rounded-full': shape === 'circle',
          // border
          'border-gray-100': border == null,
          'border-transparent': border === 'none',
          // placeholder
          'p-1':
            !srcIsValidPreset(src) &&
            !srcIsValidUrl(src) &&
            (size === 'normal' || size === 'large'),
          'p-0.5':
            !srcIsValidPreset(src) && !srcIsValidUrl(src) && size !== 'normal'
        },
        className
      )}
    />
  )
}

function srcIsValidPreset(src: AvatarProps['src']): src is SrcPreset {
  return Object.keys(presets).includes(src)
}

function srcIsValidUrl(
  src: AvatarProps['src'] | undefined | null
): src is SrcUrl {
  return (
    src != null && (src.startsWith('https://') || src.startsWith('data:image/'))
  )
}

const placeholderSvg =
  'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIHZpZXdCb3g9IjAgMCA0OCA0OCIgZmlsbD0ibm9uZSIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KPGcgY2xpcC1wYXRoPSJ1cmwoI2NsaXAwXzEwOF8xNSkiPgo8cmVjdCB3aWR0aD0iNDgiIGhlaWdodD0iNDgiIGZpbGw9IiNFREVFRUUiLz4KPHBhdGggZD0iTTAgMEw0OCA0OCIgc3Ryb2tlPSIjRDFENURCIiBzdHJva2Utb3BhY2l0eT0iMC40IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTQ4IDBMMCA0OCIgc3Ryb2tlPSIjRDFENURCIiBzdHJva2Utb3BhY2l0eT0iMC40IiBzdHJva2UtbGluZWNhcD0icm91bmQiLz4KPHBhdGggZD0iTTMyIDE1SDE2QzE1LjQ0NzcgMTUgMTUgMTUuNDQ3NyAxNSAxNlYzMkMxNSAzMi41NTIzIDE1LjQ0NzcgMzMgMTYgMzNIMzJDMzIuNTUyMyAzMyAzMyAzMi41NTIzIDMzIDMyVjE2QzMzIDE1LjQ0NzcgMzIuNTUyMyAxNSAzMiAxNVoiIGZpbGw9IiNFREVFRUUiLz4KPHBhdGggZD0iTTI5LjYyNSAxNy4yNUgxOC4zNzVDMTguMDc2NiAxNy4yNSAxNy43OTA1IDE3LjM2ODUgMTcuNTc5NSAxNy41Nzk1QzE3LjM2ODUgMTcuNzkwNSAxNy4yNSAxOC4wNzY2IDE3LjI1IDE4LjM3NVYyOS42MjVDMTcuMjUgMjkuOTIzNCAxNy4zNjg1IDMwLjIwOTUgMTcuNTc5NSAzMC40MjA1QzE3Ljc5MDUgMzAuNjMxNSAxOC4wNzY2IDMwLjc1IDE4LjM3NSAzMC43NUgyOS42MjVDMjkuOTIzNCAzMC43NSAzMC4yMDk1IDMwLjYzMTUgMzAuNDIwNSAzMC40MjA1QzMwLjYzMTUgMzAuMjA5NSAzMC43NSAyOS45MjM0IDMwLjc1IDI5LjYyNVYxOC4zNzVDMzAuNzUgMTguMDc2NiAzMC42MzE1IDE3Ljc5MDUgMzAuNDIwNSAxNy41Nzk1QzMwLjIwOTUgMTcuMzY4NSAyOS45MjM0IDE3LjI1IDI5LjYyNSAxNy4yNVpNMTguMzc1IDE4LjM3NUgyOS42MjVWMjMuODE1OEwyNy44ODkgMjIuMDc5MUMyNy42NzggMjEuODY4MiAyNy4zOTIgMjEuNzQ5OCAyNy4wOTM4IDIxLjc0OThDMjYuNzk1NSAyMS43NDk4IDI2LjUwOTUgMjEuODY4MiAyNi4yOTg1IDIyLjA3OTFMMTguNzUyNiAyOS42MjVIMTguMzc1VjE4LjM3NVpNMjAuNjI1IDIxLjc1QzIwLjYyNSAyMS41Mjc1IDIwLjY5MSAyMS4zMSAyMC44MTQ2IDIxLjEyNUMyMC45MzgyIDIwLjk0IDIxLjExMzkgMjAuNzk1OCAyMS4zMTk1IDIwLjcxMDZDMjEuNTI1IDIwLjYyNTUgMjEuNzUxMiAyMC42MDMyIDIxLjk2OTUgMjAuNjQ2NkMyMi4xODc3IDIwLjY5IDIyLjM4ODIgMjAuNzk3MiAyMi41NDU1IDIwLjk1NDVDMjIuNzAyOCAyMS4xMTE4IDIyLjgxIDIxLjMxMjMgMjIuODUzNCAyMS41MzA1QzIyLjg5NjggMjEuNzQ4OCAyMi44NzQ1IDIxLjk3NSAyMi43ODk0IDIyLjE4MDVDMjIuNzA0MiAyMi4zODYxIDIyLjU2IDIyLjU2MTggMjIuMzc1IDIyLjY4NTRDMjIuMTkgMjIuODA5IDIxLjk3MjUgMjIuODc1IDIxLjc1IDIyLjg3NUMyMS40NTE2IDIyLjg3NSAyMS4xNjU1IDIyLjc1NjUgMjAuOTU0NSAyMi41NDU1QzIwLjc0MzUgMjIuMzM0NSAyMC42MjUgMjIuMDQ4NCAyMC42MjUgMjEuNzVaIiBmaWxsPSIjQkJCRUJFIi8+CjwvZz4KPGRlZnM+CjxjbGlwUGF0aCBpZD0iY2xpcDBfMTA4XzE1Ij4KPHJlY3Qgd2lkdGg9IjQ4IiBoZWlnaHQ9IjQ4IiByeD0iMyIgZmlsbD0id2hpdGUiLz4KPC9jbGlwUGF0aD4KPC9kZWZzPgo8L3N2Zz4K'

Avatar.displayName = 'Avatar'
export { Avatar }
