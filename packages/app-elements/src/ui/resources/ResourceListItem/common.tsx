import type { DisplayStatus } from '#dictionaries/types'
import { formatDate } from '#helpers/date'
import { useTokenProvider } from '#providers/TokenProvider'
import { Icon } from '#ui/atoms/Icon'
import { Text } from '#ui/atoms/Text'

interface ListItemDescriptionConfig {
  displayStatus: DisplayStatus
  date: string
  additionalInfos?: string
}

export const ListItemDescription = ({
  displayStatus,
  date,
  additionalInfos
}: ListItemDescriptionConfig): JSX.Element => {
  const { user } = useTokenProvider()
  return (
    <>
      {formatDate({
        format: 'date',
        isoDate: date,
        timezone: user?.timezone
      })}
      {additionalInfos != null ? ` · ${additionalInfos}` : undefined}
      {' · '}
      {displayStatus.task != null ? (
        <Text weight='semibold' size='small' variant='warning'>
          {displayStatus.task}
        </Text>
      ) : (
        displayStatus.label
      )}
    </>
  )
}

export const ListItemIcon = ({
  icon,
  color
}: Pick<DisplayStatus, 'icon' | 'color'>): JSX.Element => (
  <Icon name={icon} background={color} gap='large' />
)
