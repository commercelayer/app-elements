import { isSpecificReactComponent } from '#utils/children'
import cn from 'classnames'

type Variant = 'primary' | 'secondary' | 'danger' | 'link'
type Size = 'small' | 'regular' | 'large'

export interface InteractiveElementProps {
  children: React.ReactNode
  /**
   * Render a different variant
   */
  variant?: Variant
  /**
   * Set _button size_. It only works when the `variant` prop is different from `link`.
   */
  size?: Size
  /**
   * Set the _button width_ to 100%. It only works when the `variant` prop is different from `link`.
   */
  fullWidth?: boolean
  /**
   * Flex content alignment with a standard gap
   */
  alignItems?: 'center'
  /**
   * When element is disabled, the user cannot interact with it
   */
  disabled?: boolean | undefined
}

// eslint-disable-next-line @typescript-eslint/explicit-function-return-type
export function getInteractiveElementClassName({
  alignItems,
  children,
  disabled,
  fullWidth,
  size,
  variant
}: InteractiveElementProps) {
  return cn([
    'rounded focus:outline-none whitespace-nowrap leading-5',
    {
      'opacity-50 pointer-events-none touch-none': disabled,
      'w-full': fullWidth === true && variant !== 'link',
      'flex gap-1': alignItems != null,
      'items-center justify-center': alignItems === 'center',
      'inline w-fit': variant === 'link',
      [`inline-block text-center text-sm transition-opacity duration-500 ${getSizeCss(size)}`]:
        variant !== 'link',
      '!p-[10px]': isSpecificReactComponent(children, [/^Icon$/])
    },
    getVariantCss(variant)
  ])
}

function getSizeCss(size: InteractiveElementProps['size']): string | undefined {
  if (size == null) {
    return undefined
  }

  const mapping = {
    small: 'px-4 py-2',
    regular: 'px-6 py-3',
    large: 'px-8 py-4'
  } satisfies Record<NonNullable<InteractiveElementProps['size']>, string>

  return mapping[size]
}

function getVariantCss(
  variant: InteractiveElementProps['variant']
): string | undefined {
  if (variant == null) {
    return undefined
  }

  const mapping = {
    primary:
      'font-bold bg-black border border-black text-white hover:opacity-80',
    secondary:
      'font-semibold bg-white border border-black text-black hover:opacity-80 hover:bg-gray-50',
    danger: 'font-bold bg-white border border-red text-red hover:bg-red/10',
    link: 'text-primary font-bold outline-0 focus-visible:outline-2 focus-visible:rounded outline-offset-4 outline-primary hover:text-primary-light border-primary-light cursor-pointer'
  } satisfies Record<NonNullable<InteractiveElementProps['variant']>, string>

  return mapping[variant]
}
