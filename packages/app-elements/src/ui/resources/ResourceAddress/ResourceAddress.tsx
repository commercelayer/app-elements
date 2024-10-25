import { useTokenProvider } from '#providers/TokenProvider'
import { Button } from '#ui/atoms/Button'
import { Hr } from '#ui/atoms/Hr'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { type Address } from '@commercelayer/sdk'
import { Note, PencilSimple, Phone } from '@phosphor-icons/react'
import isEmpty from 'lodash/isEmpty'
import { useCallback, useEffect, useState } from 'react'
import { useResourceAddressOverlay } from './useResourceAddressOverlay'

export interface ResourceAddressProps {
  /**
   * Resource of type `Address`
   */
  address?: Address | null
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
   * @default false
   */
  showBillingInfo?: boolean
  /**
   * Optional setting to define if given `Address` `billing_info` data is visible.
   * @default true
   */
  showNotes?: boolean
  /**
   * Get triggered as soon as the new address is created.
   */
  onCreate?: (createdAddress: Address) => void
  /**
   * Get triggered every time the address is updated.
   */
  onUpdate?: (updatedAddress: Address) => void
}

/**
 * Renders an all-in-one visualization and editing solution to deal with a given resource of type `Address`
 */
export const ResourceAddress = withSkeletonTemplate<ResourceAddressProps>(
  ({
    address,
    title,
    editable = false,
    showBillingInfo = false,
    showNotes = true,
    onCreate,
    onUpdate
  }) => {
    const [stateAddress, setStateAddress] = useState<
      Address | null | undefined
    >(address)
    const { canUser } = useTokenProvider()

    const handleOnUpdate = useCallback<
      NonNullable<ResourceAddressProps['onUpdate']>
    >(
      (address) => {
        onUpdate?.(address)
        setStateAddress(address)
      },
      [onUpdate, setStateAddress]
    )

    const handleOnCreate = useCallback<
      NonNullable<ResourceAddressProps['onCreate']>
    >(
      (address) => {
        onCreate?.(address)
        setStateAddress(address)
      },
      [onUpdate, setStateAddress]
    )

    const { ResourceAddressOverlay, openAddressOverlay } =
      useResourceAddressOverlay({
        address: stateAddress,
        showBillingInfo,
        showNotes,
        onCreate: handleOnCreate,
        onUpdate: handleOnUpdate
      })

    useEffect(() => {
      setStateAddress(address)
    }, [address?.id])

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
            {stateAddress != null ? (
              <>
                <Text
                  tag='div'
                  data-testid='ResourceAddress-fullName'
                  weight={title == null ? 'bold' : undefined}
                  variant={title != null ? 'info' : undefined}
                >
                  {stateAddress.full_name}
                </Text>
                <Text
                  tag='div'
                  variant='info'
                  data-testid='ResourceAddress-address'
                >
                  {stateAddress.line_1} {stateAddress.line_2}
                  <br />
                  {stateAddress.city} {stateAddress.state_code}{' '}
                  {stateAddress.zip_code} ({stateAddress.country_code})
                </Text>

                {stateAddress.billing_info != null && showBillingInfo ? (
                  <Text
                    tag='div'
                    variant='info'
                    data-testid='ResourceAddress-billingInfo'
                  >
                    {stateAddress.billing_info}
                  </Text>
                ) : null}

                {!isEmpty(stateAddress.phone) ||
                (showNotes && !isEmpty(stateAddress.notes)) ? (
                  <>
                    <Spacer top='4' bottom='4'>
                      <Hr variant='dashed' />
                    </Spacer>
                    <div className='grid gap-1'>
                      {!isEmpty(stateAddress.phone) && (
                        <div className='flex gap-2 '>
                          {/* mt-[2px] to keep icon aligned with text  */}
                          <Text tag='div' variant='info' className='mt-[2px]'>
                            <Phone weight='bold' />
                          </Text>
                          <Text tag='div' size='small' variant='info'>
                            {stateAddress.phone}
                          </Text>
                        </div>
                      )}
                      {showNotes && !isEmpty(stateAddress.notes) && (
                        <div className='flex gap-2'>
                          <Text tag='div' variant='info' className='mt-[2px]'>
                            <Note weight='bold' />
                          </Text>
                          <Text tag='div' size='small' variant='info'>
                            {stateAddress.notes}
                          </Text>
                        </div>
                      )}
                    </div>
                  </>
                ) : null}
              </>
            ) : (
              <Text
                tag='div'
                data-testid='ResourceAddress-noAddress'
                weight={title == null ? 'bold' : undefined}
                variant={title != null ? 'info' : undefined}
              >
                no address
              </Text>
            )}
          </div>
          {editable && canUser('update', 'addresses') && (
            <div>
              <Button
                variant='link'
                onClick={() => {
                  openAddressOverlay()
                }}
                data-testid='ResourceAddress-editButton'
              >
                <PencilSimple weight='bold' />
              </Button>
            </div>
          )}
        </div>
        {editable && <ResourceAddressOverlay />}
      </>
    )
  }
)

ResourceAddress.displayName = 'ResourceAddress'
