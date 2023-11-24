import { useOverlay } from '#hooks/useOverlay'
import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Hr } from '#ui/atoms/Hr'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { PageLayout } from '#ui/composite/PageLayout'
import { type Address } from '@commercelayer/sdk'
import { Note, PencilSimple, Phone } from '@phosphor-icons/react'
import isEmpty from 'lodash/isEmpty'
import { useEffect, useState } from 'react'
import { ResourceAddressForm } from './ResourceAddressForm'

export interface ResourceAddressProps {
  /**
   * Resource of type `Address`
   */
  resource: Address
  /**
   * Optional address title (if added it will be shown in bold on top of address infos)
   */
  title?: string
  /**
   * Optional setting to define if given address is editable (if set the Edit button and Overlay will be enabled).
   * Given the setting the component will also verify user abilities to ensure if he is enabled to update the
   * requested resource before to render editable related functionalities.
   */
  editable?: boolean
  /**
   * Optional setting to define if given `Address` `billing_info` data is visible.
   */
  showBillingInfo?: boolean
}

/**
 * Renders an all-in-one visualization and editing solution to deal with a given resource of type `Address`
 */
export const ResourceAddress = withSkeletonTemplate<ResourceAddressProps>(
  ({ resource, title, editable = false, showBillingInfo = false }) => {
    const { Overlay, open, close } = useOverlay()
    const { canUser } = useTokenProvider()

    const [address, setAddress] = useState<Address>(resource)

    useEffect(() => {
      setAddress(resource)
    }, [resource.id])

    return (
      <>
        <div className='w-full flex gap-4 space-between'>
          <div className='w-full' data-testid='ResourceAddress'>
            {title != null && (
              <Spacer bottom='2' data-testid='ResourceAddress-title'>
                <Text tag='div' weight='bold'>
                  {title}
                </Text>
              </Spacer>
            )}
            <Text
              tag='div'
              data-testid='ResourceAddress-fullName'
              weight={title == null ? 'bold' : undefined}
              variant={title != null ? 'info' : undefined}
            >
              {address.full_name}
            </Text>
            <Text
              tag='div'
              variant='info'
              data-testid='ResourceAddress-address'
            >
              {address.line_1} {address.line_2}
              <br />
              {address.city} {address.state_code} {address.zip_code} (
              {address.country_code})
            </Text>

            {address.billing_info != null && showBillingInfo ? (
              <Text
                tag='div'
                variant='info'
                data-testid='ResourceAddress-billingInfo'
              >
                {address.billing_info}
              </Text>
            ) : null}

            {!isEmpty(address.phone) || !isEmpty(address.notes) ? (
              <>
                <Spacer top='4' bottom='4'>
                  <Hr variant='dashed' />
                </Spacer>
                <div className='grid gap-1'>
                  {!isEmpty(address.phone) && (
                    <div className='flex gap-2 '>
                      {/* mt-[2px] to keep icon aligned with text  */}
                      <Text tag='div' variant='info' className='mt-[2px]'>
                        <Phone weight='bold' />
                      </Text>
                      <Text tag='div' size='small' variant='info'>
                        {address.phone}
                      </Text>
                    </div>
                  )}
                  {!isEmpty(address.notes) && (
                    <div className='flex gap-2'>
                      <Text tag='div' variant='info' className='mt-[2px]'>
                        <Note weight='bold' />
                      </Text>
                      <Text tag='div' size='small' variant='info'>
                        {address.notes}
                      </Text>
                    </div>
                  )}
                </div>
              </>
            ) : null}
          </div>
          {editable && canUser('update', 'addresses') && (
            <div>
              <Button
                variant='link'
                onClick={() => {
                  open()
                }}
                data-testid='ResourceAddress-editButton'
              >
                <PencilSimple weight='bold' />
              </Button>
            </div>
          )}
        </div>
        {editable && canUser('update', 'addresses') && (
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

ResourceAddress.displayName = 'ResourceAddress'
