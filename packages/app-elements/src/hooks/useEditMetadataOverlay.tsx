import { useOverlay } from '#hooks/useOverlay'
import { useCoreApi, useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { PageLayout } from '#ui/composite/PageLayout'
import { type ResourceMetadataProps } from '#ui/resources/ResourceMetadata'
import { ResourceMetadataForm } from '#ui/resources/ResourceMetadata/ResourceMetadataForm'
import { useState } from 'react'

export interface EditMetadataOverlayProps {
  /**
   * Title shown as first line in edit overlay heading
   */
  title: string
  /**
   * Optional description shown as second line in edit overlay heading
   */
  description?: string
  resourceId: ResourceMetadataProps['resourceId']
  resourceType: ResourceMetadataProps['resourceType']
  mode?: ResourceMetadataProps['mode']
}

interface MetadataOverlayHook {
  show: () => void
  Overlay: React.FC<EditMetadataOverlayProps>
}

export function useEditMetadataOverlay(): MetadataOverlayHook {
  const { Overlay: OverlayElement, open, close } = useOverlay()

  return {
    show: open,
    Overlay: ({
      title,
      description,
      resourceId,
      resourceType,
      mode = 'advanced'
    }) => {
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

      if (
        (mode === 'simple' &&
          (resourceData?.metadata == null ||
            Object.keys(resourceData?.metadata).length === 0)) ||
        isLoading
      )
        return <></>

      return (
        <OverlayElement backgroundColor='light'>
          <PageLayout
            title={title}
            description={description}
            minHeight={false}
            navigationButton={{
              label: 'Close',
              icon: 'x',
              onClick: () => {
                close()
              }
            }}
          >
            <ResourceMetadataForm
              resourceId={resourceId}
              defaultValues={{
                metadata: resourceData?.metadata ?? []
              }}
              mode={mode}
              onSubmit={(formValues) => {
                setIsSubmitting(true)
                void sdkClient[resourceType]
                  .update(
                    {
                      id: resourceId,
                      metadata: Object.fromEntries(
                        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
                        Object.entries(formValues.metadata).filter(
                          ([k]) => k.toString().length > 0
                        )
                      )
                    },
                    {
                      // @ts-expect-error "Expression produces a union type that is too complex to represent"
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
        </OverlayElement>
      )
    }
  }
}
