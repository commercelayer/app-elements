import { useOverlay } from '#hooks/useOverlay'
import { useTokenProvider } from '#providers/TokenProvider'
import { PageLayout } from '#ui/composite/PageLayout'
import { type Address } from '@commercelayer/sdk'
import { useCallback } from 'react'
import { ResourceAddressForm } from './ResourceAddressForm'

export const useResourceAddressOverlay = ({
  title = 'Edit address',
  address,
  showBillingInfo,
  onUpdate
}: {
  title?: string
  address: Address
  showBillingInfo?: boolean
  onUpdate?: (updatedAddress: Address) => void
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
            title={title}
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
              onChange={(updatedAddress: Address) => {
                onUpdate?.(updatedAddress)
                close()
              }}
            />
          </PageLayout>
        </Overlay>
      )
    )
  }, [Overlay, close, canUser, address, showBillingInfo, onUpdate])

  return { ResourceAddressOverlay, openAddressOverlay }
}
