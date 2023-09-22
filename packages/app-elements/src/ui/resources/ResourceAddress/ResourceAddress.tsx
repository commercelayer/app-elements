import { useOverlay } from '#hooks/useOverlay'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Text } from '#ui/atoms/Text'
import { ListItem } from '#ui/composite/ListItem'
import { PageLayout } from '#ui/composite/PageLayout'
import { type Address } from '@commercelayer/sdk'
import { useState } from 'react'
import { ResourceAddressForm } from './ResourceAddressForm'

interface ResourceAddressProps {
  resource: Address
  title?: string
  editable?: boolean
  showBillingInfo?: boolean
}

export const ResourceAddress = withSkeletonTemplate<ResourceAddressProps>(
  ({ resource, title, editable = false, showBillingInfo = false }) => {
    const { Overlay, open, close } = useOverlay({ queryParam: 'edit-address' })

    const [address, setAddress] = useState<Address>(resource)

    const label =
      address.company ?? `${address.first_name} ${address.last_name}`

    return (
      <>
        <ListItem tag='div' alignItems='top'>
          <div>
            <Text tag='div' weight='bold'>
              {label}
            </Text>
            <Text tag='div' variant='info'>
              {address.line_1} {address.line_2}
              <br />
              {address.city} {address.state_code} {address.zip_code} (
              {address.country_code})
            </Text>
            <Text tag='div' variant='info'>
              {address.phone}
            </Text>
            {address.billing_info != null && showBillingInfo ? (
              <Text tag='div' variant='info'>
                {address.billing_info}
              </Text>
            ) : null}
          </div>
          {editable && (
            <a
              onClick={() => {
                open()
              }}
            >
              Edit
            </a>
          )}
        </ListItem>
        {editable && (
          <Overlay>
            <PageLayout
              title='Edit address'
              minHeight={false}
              onGoBack={() => {
                close()
              }}
            >
              <ResourceAddressForm
                address={address}
                showBillingInfo={showBillingInfo}
                onChange={(updatedAddress: Address) => {
                  setAddress(updatedAddress)
                  close()
                }}
              />
            </PageLayout>
          </Overlay>
        )}
      </>
    )
  }
)
