import type { DisplayStatus } from '#dictionaries/types'
import { formatDate } from '#helpers/date'
import { useTokenProvider } from '#providers/TokenProvider'
import { Icon } from '#ui/atoms/Icon'
import { Text } from '#ui/atoms/Text'

interface ListItemDescriptionConfig {
  resource: any // TODO: vincolare a tutte le risorse di Commerce Layer
  displayStatus: DisplayStatus
  date?: string
  additionalInfos?: string
}

export const getListItemDescription = ({
  resource,
  displayStatus,
  date = resource.updated_at,
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
      {additionalInfos}
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
