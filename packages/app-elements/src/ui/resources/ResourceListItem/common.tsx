import type { DisplayStatus } from '#dictionaries/types'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'

interface ListItemDescriptionConfig {
  displayStatus: DisplayStatus
  date: string
  additionalInfos?: string
  additionalSuffix?: string
}

export const ListItemDescription =
  withSkeletonTemplate<ListItemDescriptionConfig>(
    ({ displayStatus, date, additionalInfos, additionalSuffix }) => {
      return (
        <>
          {date}
          {additionalInfos != null ? ` · ${additionalInfos}` : undefined}
          {' · '}
          {displayStatus.task != null ? (
            <Text weight='semibold' size='small' variant='warning'>
              {displayStatus.task}
            </Text>
          ) : (
            displayStatus.label
          )}
          {additionalSuffix != null ? ` · ${additionalSuffix}` : undefined}
        </>
      )
    }
  )

export const ListItemIcon = withSkeletonTemplate<
  Pick<DisplayStatus, 'icon' | 'color'>
>(({ icon, color }) => (
  <StatusIcon name={icon} background={color} gap='large' />
))
