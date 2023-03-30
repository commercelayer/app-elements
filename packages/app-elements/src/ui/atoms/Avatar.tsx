import cn from 'classnames'

export interface AvatarProps extends React.HTMLAttributes<HTMLImageElement> {
  /**
   * Image URL
   */
  src: string
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
  size?: 'small' | 'normal'
}

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
      src={src}
      alt={alt}
      className={cn(
        'border object-contain object-center',
        {
          // size
          'min-w-[58px] min-h-[58px] w-[58px] h-[58px]': size === 'normal',
          'min-w-[42px] min-h-[42px] w-[42px] h-[42px]': size === 'small',
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
