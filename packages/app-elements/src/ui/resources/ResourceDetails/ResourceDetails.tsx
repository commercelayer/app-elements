import { formatDate } from '#helpers/date'
import { useTokenProvider } from '#providers/TokenProvider'
import { CopyToClipboard } from '#ui/atoms/CopyToClipboard'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListDetailsItem } from '#ui/composite/ListDetailsItem'
import { type Resource } from '@commercelayer/sdk'

export interface ResourceDetailsProps {
  resource: Resource
}

/**
 * This component provides a listed visualization of details attributes of a given resource.
 */
export const ResourceDetails = withSkeletonTemplate<ResourceDetailsProps>(
  ({ resource }) => {
    const { user } = useTokenProvider()

    return (
      <div>
        <Section title='Details'>
          <ListDetailsItem label='ID' gutter='none'>
            <CopyToClipboard value={resource?.id} />
          </ListDetailsItem>
          <ListDetailsItem label='Reference' gutter='none'>
            <CopyToClipboard value={resource?.reference ?? undefined} />
          </ListDetailsItem>
          <ListDetailsItem label='Reference origin' gutter='none'>
            <CopyToClipboard value={resource?.reference_origin ?? undefined} />
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
      </div>
    )
  }
)
