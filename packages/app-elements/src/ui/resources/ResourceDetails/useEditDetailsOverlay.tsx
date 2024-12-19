import { useOverlay } from '#hooks/useOverlay'
import { t } from '#providers/I18NProvider'
import { PageLayout } from '#ui/composite/PageLayout'
import { type FC, useCallback } from 'react'
import { type ResourceDetailsProps } from './ResourceDetails'
import { ResourceDetailsForm } from './ResourceDetailsForm'

export interface EditDetailsOverlayProps {
  /**
   * Optional title shown as first line in edit overlay heading
   */
  title?: string
  resource: ResourceDetailsProps['resource']
  onUpdated: ResourceDetailsProps['onUpdated']
}

interface DetailsOverlayHook {
  show: () => void
  Overlay: FC<EditDetailsOverlayProps>
}

export function useEditDetailsOverlay(): DetailsOverlayHook {
  const { Overlay: OverlayElement, open, close } = useOverlay()

  const OverlayComponent = useCallback<FC<EditDetailsOverlayProps>>(
    ({ title = t('common.back'), resource, onUpdated }) => {
      return (
        <OverlayElement backgroundColor='light'>
          <PageLayout
            title={t('common.edit_details')}
            minHeight={false}
            navigationButton={{
              label: title,
              icon: 'arrowLeft',
              onClick: () => {
                close()
              }
            }}
          >
            <ResourceDetailsForm
              resource={resource}
              onUpdated={async () => {
                await onUpdated().then(() => {
                  close()
                })
              }}
            />
          </PageLayout>
        </OverlayElement>
      )
    },
    [OverlayElement]
  )

  return {
    show: open,
    Overlay: OverlayComponent
  }
}
