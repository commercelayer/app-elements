import type { DisplayStatus } from '#dictionaries/types'
import { formatDate } from '#helpers/date'
import { useTokenProvider } from '#providers/TokenProvider'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'

interface ListItemDescriptionConfig {
  displayStatus: DisplayStatus
  date: string
  additionalInfos?: string
}

export const ListItemDescription =
  withSkeletonTemplate<ListItemDescriptionConfig>(
    ({ displayStatus, date, additionalInfos }) => {
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
  )

export const ListItemIcon = withSkeletonTemplate<
  Pick<DisplayStatus, 'icon' | 'color'>
>(({ icon, color }) => (
  <StatusIcon name={icon} background={color} gap='large' />
))
