import { useOverlay } from '#hooks/useOverlay'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Section } from '#ui/atoms/Section'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { PageLayout } from '#ui/composite/PageLayout'
import { humanizeString } from '#utils/text'
import { type ListableResourceType } from '@commercelayer/sdk/lib/cjs/api'
import { useState } from 'react'
import { ResourceMetadataForm } from './ResourceMetadataForm'

interface ResourceMetadataOverlay {
  /**
   * Title shown as first line in edit overlay heading
   */
  title: string
  /**
   * Optional description shown as second line in edit overlay heading
   */
  description?: string
}

interface ResourceMetadataProps {
  resourceType: ListableResourceType
  resourceId: string
  /**
   * Edit overlay configuration
   */
  overlay: ResourceMetadataOverlay
}

/**
 * This component generates an all-in-one visualization and editing interface for managing metadata object values of requested resource.
 */
export const ResourceMetadata = withSkeletonTemplate<ResourceMetadataProps>(
  ({ resourceType, resourceId, overlay }) => {
    const { Overlay, open, close } = useOverlay({ queryParam: 'edit-metadata' })

    const [isSubmitting, setIsSubmitting] = useState(false)
    const [apiError, setApiError] = useState<any>(undefined)

    const { sdkClient } = useCoreSdkProvider()
    const { canUser } = useTokenProvider()

    const {
      data: resourceData,
      isLoading,
      mutate: mutateResource
    } = useCoreApi(resourceType, 'retrieve', [
      resourceId,
      {
        fields: ['metadata']
      }
    ])

    if (
      resourceData?.metadata == null ||
      Object.keys(resourceData?.metadata).length === 0 ||
      isLoading
    )
      return <></>

    return (
      <div>
        <Section
          title='Metadata'
          actionButton={
            canUser('update', resourceType) && (
              <div className='pr-4'>
                <Button
                  variant='link'
                  onClick={() => {
                    open()
                  }}
                >
                  Edit
                </Button>
              </div>
            )
          }
        >
          {Object.entries(resourceData?.metadata).map(
            ([metadataKey, metadataValue], idx) => {
              if (typeof metadataValue !== 'string') return null

              return (
                <ListItem
                  tag='div'
                  key={idx}
                  data-testid={`ResourceMetadata-item-${metadataKey}`}
                >
                  <Text variant='info'>{humanizeString(metadataKey)}</Text>
                  <Text
                    weight='semibold'
                    data-testid={`ResourceMetadata-value-${metadataKey}`}
                  >
                    {metadataValue}
                  </Text>
                </ListItem>
              )
            }
          )}
        </Section>
        {canUser('update', resourceType) && (
          <Overlay>
            <PageLayout
              title={overlay.title}
              description={overlay.description}
              minHeight={false}
              onGoBack={() => {
                close()
              }}
            >
              <ResourceMetadataForm
                defaultValues={{ metadata: resourceData?.metadata }}
                onSubmit={(formValues) => {
                  setIsSubmitting(true)
                  void sdkClient[resourceType]
                    .update(
                      {
                        id: resourceId,
                        metadata: formValues.metadata
                      },
                      {
                        fields: ['metadata']
                      }
                    )
                    .then((updatedResource) => {
                      void mutateResource(updatedResource).then(() => {
                        setIsSubmitting(false)
                        close()
                      })
                    })
                    .catch((error) => {
                      setApiError(error)
                      setIsSubmitting(false)
                    })
                }}
                isSubmitting={isSubmitting}
                apiError={apiError}
              />
            </PageLayout>
          </Overlay>
        )}
      </div>
    )
  }
)
