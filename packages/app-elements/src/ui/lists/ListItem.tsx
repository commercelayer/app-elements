import cn from 'classnames'
import { FlexRow, FlexRowProps } from '#ui/atoms/FlexRow'

export interface ListItemProps
  extends Omit<React.HTMLAttributes<HTMLDivElement>, 'children'>,
    Pick<FlexRowProps, 'alignItems' | 'children'> {
  /**
   * Icon component
   * Example: `<Icon>` or `<StatusIcon>` or `<Avatar>`
   */
  icon?: JSX.Element
  /**
   * Specify `none` to remove side gutter
   */
  gutter?: 'none'
  /**
   * Border style to render
   */
  borderStyle?: 'dashed' | 'solid'
}

function ListItem({
  icon,
  children,
  className,
  onClick,
  gutter,
  alignItems = 'center',
  borderStyle = 'solid',
  ...rest
}: ListItemProps): JSX.Element {
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
        {icon != null && <div>{icon}</div>}
        <FlexRow alignItems={alignItems}>{children}</FlexRow>
      </div>
    </div>
  )
}

ListItem.displayName = 'ListItem'
export { ListItem }
