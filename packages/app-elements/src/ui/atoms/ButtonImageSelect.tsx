import cn from 'classnames'
import { Icon } from './Icon'

export interface ButtonImageSelectProps
  extends React.HTMLAttributes<HTMLButtonElement> {
  /**
   * Image URL
   */
  src?: HTMLImageElement['src']
}

/**
 * This component renders as `<button>` showing an `Avatar` image, if given, or a camera icon to choose one.
 */
export function ButtonImageSelect({
  src,
  ...rest
}: ButtonImageSelectProps): JSX.Element {
  return (
    <button
      type='button'
      data-testid='ButtonImageSelect-main'
      className={cn(
        'flex items-center justify-center rounded p-[2px] text-primary',
        'min-w-[96px] min-h-[96px] w-[96px] h-[96px]',
        'border border-gray-300 hover:border-primary hover:border-solid hover:ring-inset hover:ring-1 hover:ring-primary',
        src != null ? 'border-solid' : 'border-dashed'
      )}
      {...rest}
    >
      {src != null ? (
        <img src={src} data-testid='ButtonImageSelect-image' />
      ) : (
        <Icon name='camera' size={32} />
      )}
    </button>
  )
}

ButtonImageSelect.displayName = 'ButtonImageSelect'
