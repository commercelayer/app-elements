import cn from 'classnames'
import { FlexRow, FlexRowProps } from '#ui/atoms/FlexRow'
import { Icon, IconProps } from '#ui/atoms/Icon'

type IconPreset = Pick<IconProps, 'name' | 'background'>
type IconCustom = React.ReactElement

export interface ListItemFlexProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    Pick<FlexRowProps, 'alignItems' | 'children'> {
  icon?: IconPreset | IconCustom
  gutter?: 'none'
  /**
   * Border style to render
   */
  borderStyle?: 'dashed' | 'solid'
}

function ListItemFlex({
  icon,
  children,
  className,
  onClick,
  gutter,
  alignItems = 'center',
  borderStyle = 'solid',
  ...rest
}: ListItemFlexProps): JSX.Element {
  return (
    <div
      {...rest}
      onClick={onClick}
      className={cn(
        'flex gap-4 py-4 border-b border-gray-100',
        {
          'px-4': gutter !== 'none',
          'border-dashed': borderStyle === 'dashed',
          'cursor-pointer hover:bg-gray-50': onClick != null
        },
        className
      )}
    >
      <div className='flex gap-4 flex-1'>
        {icon != null && (
          <div data-test-id='list-simple-item-icon'>
            {isDefaultIcon(icon) ? (
              <Icon name={icon.name} background={icon.background} gap='large' />
            ) : (
              <>{icon}</>
            )}
          </div>
        )}
        <FlexRow alignItems={alignItems}>{children}</FlexRow>
      </div>
    </div>
  )
}

ListItemFlex.displayName = 'ListItemFlex'
export { ListItemFlex }

function isDefaultIcon(
  element: ListItemFlexProps['icon']
): element is IconPreset {
  return (
    typeof element === 'object' && 'name' in element && 'background' in element
  )
}
