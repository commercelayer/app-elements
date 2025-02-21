import { formatDateWithPredicate } from '#helpers/date'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { useTranslation } from '#providers/I18NProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { StatusIcon } from '#ui/atoms/StatusIcon'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { type ListableResourceType } from '@commercelayer/sdk'
import isEmpty from 'lodash/isEmpty'

type ResourceType = ListableResourceType

export interface ResourceAttachmentsProps {
  resourceType: ResourceType
  resourceId: string
}

export const ResourceAttachments =
  withSkeletonTemplate<ResourceAttachmentsProps>(
    ({ resourceType, resourceId }) => {
      const { t } = useTranslation()
      const { user } = useTokenProvider()
      const { data: resource } = useCoreApi(
        resourceType,
        'retrieve',
        resourceId == null || isEmpty(resourceId)
          ? null
          : [
              resourceId,
              {
                include: ['attachments']
              }
            ]
      )

      const attachments =
        resource != null && 'attachments' in resource
          ? resource.attachments
          : []
      const attachmentsWithUrl = attachments?.filter(
        (attachment) => attachment.url != null
      )

      if (isEmpty(attachmentsWithUrl)) {
        return null
      }

      return (
        <div>
          <Section title={t('resources.attachments.name_other')}>
            {attachmentsWithUrl?.map((attachment) => (
              <ListItem
                key={attachment.id}
                icon={
                  <StatusIcon name='download' background='black' gap='large' />
                }
                alignIcon='center'
              >
                <a href={attachment.url ?? ''} target='_blank' rel='noreferrer'>
                  <div className='flex flex-col'>
                    <Text
                      tag='div'
                      weight='semibold'
                      data-testid='ResourceListItem-number'
                    >
                      {attachment.name}
                    </Text>
                    <Text
                      tag='div'
                      weight='medium'
                      size='small'
                      variant='info'
                      data-testid='ResourceListItem-content'
                    >
                      {formatDateWithPredicate({
                        predicate: t('common.updated'),
                        format: 'full',
                        isoDate: attachment.updated_at,
                        timezone: user?.timezone,
                        locale: user?.locale
                      })}
                      {attachment.description != null
                        ? ` · ${attachment.description}`
                        : ''}
                    </Text>
                  </div>
                </a>
              </ListItem>
            ))}
          </Section>
        </div>
      )
    }
  )
