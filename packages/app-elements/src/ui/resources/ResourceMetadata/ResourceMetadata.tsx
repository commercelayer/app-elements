import { useOverlay } from '#hooks/useOverlay'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
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

    if (resourceData?.metadata == null || isLoading) return <></>

    return (
      <div>
        <Section
          title='Metadata'
          actionButton={
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
          }
        >
          {Object.entries(resourceData?.metadata).map(
            ([metadataKey, metadataValue], idx) => {
              if (typeof metadataValue !== 'string') return null

              return (
                <ListItem
                  tag='div'
                  key={idx}
                  data-testid={`ListItemsMetadata-item-${metadataKey}`}
                >
                  <Text variant='info'>{humanizeString(metadataKey)}</Text>
                  <Text
                    weight='semibold'
                    data-testid={`ListItemsMetadata-value-${metadataKey}`}
                  >
                    {metadataValue}
                  </Text>
                </ListItem>
              )
            }
          )}
        </Section>
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
      </div>
    )
  }
)
