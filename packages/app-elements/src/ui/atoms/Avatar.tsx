import cn from 'classnames'
import { presets } from './Avatar.utils'

export interface AvatarProps {
  /**
   * Image URL
   */
  src: keyof typeof presets | `https://${string}` | `data:image/${string}`
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
  size?: 'small' | 'normal' | 'x-small'
  /**
   * Image class
   */
  className?: string
}

function srcIsValidPreset(
  src: AvatarProps['src']
): src is keyof typeof presets {
  return Object.keys(presets).includes(src)
}

/**
 * This component renders as `<img>` using different shapes and sizes. It is mostly used to show an sku image or a 3rd-party icon.
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
      src={srcIsValidPreset(src) ? presets[src] : src}
      alt={alt}
      className={cn(
        'border object-contain object-center',
        {
          // size
          'min-w-[58px] min-h-[58px] w-[58px] h-[58px]': size === 'normal',
          'min-w-[42px] min-h-[42px] w-[42px] h-[42px]': size === 'small',
          'min-w-8 min-h-8 w-8 h-8': size === 'x-small',
          // shape
          rounded: shape === 'rounded',
          'rounded-full': shape === 'circle',
          // border
          'border-gray-100': border == null,
          'border-transparent': border === 'none'
        },
        className
      )}
    />
  )
}

Avatar.displayName = 'Avatar'
export { Avatar }
