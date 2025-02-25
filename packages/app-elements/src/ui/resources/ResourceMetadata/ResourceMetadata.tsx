import {
  type EditMetadataOverlayProps,
  useEditMetadataOverlay
} from '#hooks/useEditMetadataOverlay'
import { useCoreApi } from '#providers/CoreSdkProvider'
import { t } from '#providers/I18NProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Icon } from '#ui/atoms/Icon'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { type ListableResourceType } from '@commercelayer/sdk'

interface MetadataOverlay
  extends Omit<EditMetadataOverlayProps, 'resourceId' | 'resourceType'> {}

export interface ResourceMetadataProps {
  resourceType: ListableResourceType
  resourceId: string
  /**
   * Edit overlay configuration
   */
  overlay?: MetadataOverlay
}

export const updatableTypes = ['string', 'number', 'boolean'] as const
export type UpdatableType = (typeof updatableTypes)[number]

export const isUpdatableType = (value: any): value is UpdatableType => {
  return updatableTypes.includes(typeof value as UpdatableType)
}

/**
 * This component provides an all-in-one visualization and editing interface for the `metadata` attribute of a given resource.
 * More in detail the `metadata` attribute is a JSON object, customizable for several purposes, and this component will allow to show and manage its keys with a simple (string kind) values.
 */
export const ResourceMetadata = withSkeletonTemplate<ResourceMetadataProps>(
  ({ resourceType, resourceId, overlay }) => {
    const { Overlay: EditMetadataOverlay, show } = useEditMetadataOverlay()

    const { canUser } = useTokenProvider()

    const { data: resourceData, isLoading } = useCoreApi(
      resourceType,
      'retrieve',
      [
        resourceId,
        {
          fields: ['metadata']
        }
      ]
    )

    const isUpdatable =
      Object.entries(resourceData?.metadata ?? []).filter(([, metadataValue]) =>
        isUpdatableType(metadataValue)
      ).length > 0

    if (isLoading) return <></>

    return (
      <div>
        <Section
          title='Metadata'
          actionButton={
            canUser('update', resourceType) && (
              <Button
                variant='secondary'
                size='mini'
                alignItems='center'
                aria-label={t('common.edit_resource', {
                  resource: t('common.metadata').toLowerCase()
                })}
                onClick={() => {
                  show()
                }}
              >
                <Icon name='pencilSimple' size='16' />
                {t('common.edit')}
              </Button>
            )
          }
        >
          {isUpdatable ? (
            Object.entries(resourceData?.metadata ?? []).map(
              ([metadataKey, metadataValue], idx) => {
                if (!isUpdatableType(metadataValue)) return null

                return (
                  <div
                    key={idx}
                    className='grid grid-cols-2 py-4 border-b border-gray-100'
                    data-testid={`ResourceMetadata-item-${metadataKey}`}
                  >
                    <Text variant='info'>{metadataKey}</Text>
                    <Text
                      weight='semibold'
                      data-testid={`ResourceMetadata-value-${metadataKey}`}
                    >
                      {metadataValue.toString()}
                    </Text>
                  </div>
                )
              }
            )
          ) : (
            <Spacer top='4'>
              <Text variant='info'>{t('common.no_metadata')}.</Text>
            </Spacer>
          )}
        </Section>
        <EditMetadataOverlay
          title={overlay?.title}
          resourceId={resourceId}
          resourceType={resourceType}
        />
      </div>
    )
  }
)
