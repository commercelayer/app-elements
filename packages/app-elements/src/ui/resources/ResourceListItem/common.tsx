import type { DisplayStatus } from '#dictionaries/types'
import { formatDate } from '#helpers/date'
import type { TokenProviderAuthUser } from '#providers/TokenProvider/types'
import { Icon } from '#ui/atoms/Icon'
import { Text } from '#ui/atoms/Text'

interface ListItemDescriptionConfig {
  displayStatus: DisplayStatus
  date: string
  user: TokenProviderAuthUser | null
  additionalInfos?: string
}

export const getListItemDescription = ({
  displayStatus,
  date,
  user,
  additionalInfos
}: ListItemDescriptionConfig): JSX.Element => {
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

export const getListItemIcon = (displayStatus: DisplayStatus): JSX.Element => (
  <Icon
    name={displayStatus.icon}
    background={displayStatus.color}
    gap='large'
  />
)
