import { formatDate } from '#helpers/date'
import { useTokenProvider } from '#providers/TokenProvider'
import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListDetailsItem } from '#ui/composite/ListDetailsItem'
import { FlexRow } from '#ui/internals/FlexRow'
import { type ListableResourceType, type Resource } from '@commercelayer/sdk'
import { useEditDetailsOverlay } from './useEditDetailsOverlay'

export interface ResourceDetailsProps {
  resource: Resource
  onUpdated: () => Promise<void>
}

/**
 * This component provides a listed visualization of details attributes of a given resource.
 */
export const ResourceDetails = withSkeletonTemplate<ResourceDetailsProps>(
  ({ resource, onUpdated }) => {
    const { user, canUser } = useTokenProvider()
    const { Overlay: EditDetailsOverlay, show } = useEditDetailsOverlay()

    const reference = `${resource?.reference ?? ''}${resource?.reference != null && resource?.reference_origin != null ? ' · ' : ''}${resource?.reference_origin ?? ''}`

    return (
      <>
        <Section title='Details'>
          <ListDetailsItem label='ID' gutter='none'>
            <CopyToClipboard value={resource?.id} />
          </ListDetailsItem>
          <ListDetailsItem label='Reference' gutter='none'>
            <FlexRow alignItems='center'>
              <Text weight='semibold'>{reference}</Text>
              {canUser('update', resource.type as ListableResourceType) && (
                <button
                  onClick={() => {
                    show()
                  }}
                >
                  <Icon name='pencilSimple' size={16} />
                </button>
              )}
            </FlexRow>
          </ListDetailsItem>
          <ListDetailsItem label='Updated' gutter='none'>
            <Text weight='semibold'>
              {formatDate({
                isoDate: resource?.updated_at,
                timezone: user?.timezone,
                format: 'fullWithSeconds',
                showCurrentYear: true
              })}
            </Text>
          </ListDetailsItem>
          <ListDetailsItem label='Created' gutter='none'>
            <Text weight='semibold'>
              {formatDate({
                isoDate: resource?.created_at,
                timezone: user?.timezone,
                format: 'fullWithSeconds',
                showCurrentYear: true
              })}
            </Text>
          </ListDetailsItem>
        </Section>
        <EditDetailsOverlay resource={resource} onUpdated={onUpdated} />
      </>
    )
  }
)
