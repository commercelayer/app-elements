import { Card } from '#ui/atoms/Card'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/lists/ListItem'
import { X } from '@phosphor-icons/react'

interface Props {
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
  children: React.ReactNode
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

export const CardDialog = withSkeletonTemplate<Props>(
  ({ icon, title, subtitle, onClose, rightContent, children }) => (
    <Spacer top='2'>
      <Card>
        <ListItem
          tag='div'
          alignItems='top'
          gutter='none'
          borderStyle='none'
          icon={icon}
        >
          <div>
            <ListItem tag='div' gutter='none' className='pt-0' alignItems='top'>
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
    </Spacer>
  )
)

CardDialog.displayName = 'CardDialog'
