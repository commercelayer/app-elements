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
}

function Avatar({
  src,
  alt,
  border,
  shape = 'rounded',
  className,
  ...rest
}: AvatarProps): JSX.Element {
  return (
    <img
      {...rest}
      src={src}
      alt={alt}
      className={cn(
        className,
        'border object-contain object-center w-[58px] h-[58px]',
        {
          // shape
          rounded: shape === 'rounded',
          'rounded-full': shape === 'circle',
          // border
          'border-gray-100': border == null,
          'border-transparent': border === 'none'
        }
      )}
    />
  )
}

Avatar.displayName = 'Avatar'
export { Avatar }
