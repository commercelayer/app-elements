import { useOverlay } from '#hooks/useOverlay'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import { type Address } from '@commercelayer/sdk'
import cn from 'classnames'
import { useState } from 'react'
import { ResourceAddressForm } from './ResourceAddressForm'

type ResourceAddressEditPosition = 'side' | 'bottom'

interface ResourceAddressProps {
  resource: Address
  title?: string
  editable?: boolean
  editPosition?: ResourceAddressEditPosition
  showBillingInfo?: boolean
}

export const ResourceAddress = withSkeletonTemplate<ResourceAddressProps>(
  ({
    resource,
    title,
    editable = false,
    editPosition = 'side',
    showBillingInfo = false
  }) => {
    const { Overlay, open, close } = useOverlay({ queryParam: 'edit-address' })

    const [address, setAddress] = useState<Address>(resource)

    return (
      <>
        <div
          className={cn(['w-full flex gap-4 space-between'], {
            'flex-col': editPosition === 'bottom'
          })}
        >
          <div className='w-full'>
            {title != null && (
              <Spacer bottom='2'>
                <Text tag='div' weight='bold'>
                  {title}
                </Text>
              </Spacer>
            )}
            <Text
              tag='div'
              weight={title == null ? 'bold' : undefined}
              variant={title != null ? 'info' : undefined}
            >
              {address.full_name}
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
            <div>
              <a
                onClick={() => {
                  open()
                }}
              >
                Edit
              </a>
            </div>
          )}
        </div>
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
