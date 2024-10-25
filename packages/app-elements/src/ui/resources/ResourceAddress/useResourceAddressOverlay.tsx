import { useOverlay } from '#hooks/useOverlay'
import { useTokenProvider } from '#providers/TokenProvider'
import { PageLayout } from '#ui/composite/PageLayout'
import { type Address } from '@commercelayer/sdk'
import { useCallback } from 'react'
import { ResourceAddressForm } from './ResourceAddressForm'

export const useResourceAddressOverlay = ({
  title,
  address,
  showBillingInfo,
  showNotes,
  onUpdate,
  onCreate
}: {
  title?: string
  address?: Address | null | undefined
  showBillingInfo?: boolean
  showNotes?: boolean
  onUpdate?: (updatedAddress: Address) => void
  onCreate?: (createdAddress: Address) => void
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}) => {
  const { canUser } = useTokenProvider()
  const { Overlay, open, close } = useOverlay()

  const openAddressOverlay = useCallback(() => {
    if (canUser('update', 'addresses')) {
      open()
    }
  }, [open, canUser])

  const ResourceAddressOverlay = useCallback(() => {
    return (
      canUser('update', 'addresses') && (
        <Overlay>
          <PageLayout
            title={title ?? `${address == null ? 'New' : 'Edit'} address`}
            minHeight={false}
            navigationButton={{
              label: 'Back',
              onClick: () => {
                close()
              }
            }}
          >
            <ResourceAddressForm
              address={address}
              showBillingInfo={showBillingInfo}
              showNotes={showNotes}
              onChange={(updatedAddress: Address) => {
                onUpdate?.(updatedAddress)
                close()
              }}
              onCreate={(updatedAddress: Address) => {
                onCreate?.(updatedAddress)
                close()
              }}
            />
          </PageLayout>
        </Overlay>
      )
    )
  }, [
    Overlay,
    close,
    canUser,
    address,
    showBillingInfo,
    showNotes,
    onUpdate,
    onCreate
  ])
  return { ResourceAddressOverlay, openAddressOverlay }
}
