import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { X } from '@phosphor-icons/react'
import cn from 'classnames'
import { Children } from 'react'

export interface CardDialogProps {
  /**
   * Card title
   */
  title: string
  /**
   * Card subtible
   */
  subtitle?: string
  /**
   * This text is displayed in the card header on the right
   */
  rightContent?: React.ReactNode
  /**
   * Card icon
   */
  icon?: JSX.Element
  /**
   * When defined, this will show a close button on the right
   */
  onClose?: () => void
  /**
   * The content of the card dialog.
   **/
  children?: React.ReactNode
  /**
   * Card footer
   */
  footer?: React.ReactNode
}

const CloseButton: React.FC<{
  onClick: React.EventHandler<any>
}> = ({ onClick }) => (
  <button
    onClick={onClick}
    className='bg-gray-100 text-gray-400 rounded-full p-1.5'
  >
    <X size={12} />
  </button>
)

export const CardDialog = withSkeletonTemplate<CardDialogProps>(
  ({
    icon,
    title,
    subtitle,
    onClose,
    rightContent,
    children,
    footer,
    ...rest
  }) => {
    const hasChildren = Children.toArray(children).length > 0
    return (
      <Card {...rest} overflow='visible' footer={footer}>
        <ListItem
          tag='div'
          alignItems='top'
          padding='y'
          borderStyle='none'
          className='!py-0'
          icon={icon}
        >
          <div>
            <ListItem
              borderStyle={hasChildren ? undefined : 'none'}
              tag='div'
              padding='y'
              className={cn('pt-0', { 'pb-0': !hasChildren })}
              alignItems='top'
            >
              <div>
                <Text size='regular' weight='bold'>
                  {title}
                </Text>
                {subtitle != null && (
                  <Text size='small' tag='div' variant='info' weight='medium'>
                    {subtitle}
                  </Text>
                )}
              </div>
              {rightContent != null && rightContent}
            </ListItem>
            {children}
          </div>
          {onClose != null && <CloseButton onClick={onClose} />}
        </ListItem>
      </Card>
    )
  }
)

CardDialog.displayName = 'CardDialog'
