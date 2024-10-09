import { useOverlay } from '#hooks/useOverlay'
import { PageLayout } from '#ui/composite/PageLayout'
import { type ResourceMetadataProps } from '#ui/resources/ResourceMetadata'
import { ResourceMetadataForm } from '#ui/resources/ResourceMetadata/ResourceMetadataForm'

export interface EditMetadataOverlayProps {
  /**
   * Optional title shown as first line in edit overlay heading
   */
  title?: string
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
      title = 'Back',
      resourceId,
      resourceType,
      mode = 'advanced'
    }) => {
      return (
        <OverlayElement backgroundColor='light'>
          <PageLayout
            title='Edit metadata'
            minHeight={false}
            navigationButton={{
              label: title,
              icon: 'arrowLeft',
              onClick: () => {
                close()
              }
            }}
          >
            <ResourceMetadataForm
              resourceId={resourceId}
              resourceType={resourceType}
              mode={mode}
              onSubmitted={() => {
                close()
              }}
            />
          </PageLayout>
        </OverlayElement>
      )
    }
  }
}
