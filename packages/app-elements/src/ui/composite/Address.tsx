import { t } from '#providers/I18NProvider'
import { Button } from '#ui/atoms/Button'
import { Hr } from '#ui/atoms/Hr'
import {
  SkeletonTemplate,
  withSkeletonTemplate
} from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { Text } from '#ui/atoms/Text'
import { useCountryList } from '#ui/internals/useCountryList'
import { type Address as AddressType } from '@commercelayer/sdk'
import { Note, PencilSimple, Phone } from '@phosphor-icons/react'
import isEmpty from 'lodash-es/isEmpty'
import { useMemo } from 'react'

export interface AddressProps {
  /**
   * The address to be visualized
   */
  address?: Pick<
    AddressType,
    | 'first_name'
    | 'last_name'
    | 'company'
    | 'line_1'
    | 'line_2'
    | 'city'
    | 'state_code'
    | 'zip_code'
    | 'country_code'
    | 'billing_info'
    | 'phone'
    | 'notes'
  > | null
  /**
   * Optional address title (if added it will be shown in bold on top of address infos)
   */
  title?: string
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
   * When set, the component will render an edit button on the right side of the address.
   * The implemented method get triggered every time the edit button is clicked.
   */
  onEdit?: () => void
}

/**
 * Renders an all-in-one visualization to deal with a given address
 */
export const Address = withSkeletonTemplate<AddressProps>(
  ({ address, title, showBillingInfo = false, showNotes = true, onEdit }) => {
    const { countries, isLoading } = useCountryList()
    const countryCode = address?.country_code
    const countryName = useMemo(
      () => countries?.find((c) => c.value === countryCode)?.label,
      [countries, countryCode]
    )

    return (
      <>
        <div className='w-full flex gap-4 space-between'>
          <div className='w-full' data-testid='Address'>
            {title != null && (
              <Spacer bottom='2' data-testid='Address-title'>
                <Text tag='div' weight='bold'>
                  {title}
                </Text>
              </Spacer>
            )}
            {address != null ? (
              <>
                {address.first_name != null && address.last_name != null && (
                  <Text
                    tag='div'
                    data-testid='Address-firstLastName'
                    weight={title == null ? 'bold' : undefined}
                    variant={title != null ? 'info' : undefined}
                  >
                    {address.first_name} {address.last_name}
                  </Text>
                )}
                {address.company != null && (
                  <Text
                    tag='div'
                    data-testid='Address-company'
                    weight={title == null ? 'bold' : undefined}
                    variant={title != null ? 'info' : undefined}
                  >
                    {address.company}
                  </Text>
                )}
                <Text tag='div' variant='info' data-testid='Address-address'>
                  {address.line_1} {address.line_2}
                  <br />
                  {address.city} {address.state_code} {address.zip_code} (
                  <SkeletonTemplate isLoading={isLoading}>
                    {countryName ?? countryCode}
                  </SkeletonTemplate>
                  )
                </Text>

                {address.billing_info != null && showBillingInfo ? (
                  <Text
                    tag='div'
                    variant='info'
                    data-testid='Address-billingInfo'
                  >
                    {address.billing_info}
                  </Text>
                ) : null}

                {!isEmpty(address.phone) ||
                (showNotes && !isEmpty(address.notes)) ? (
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
                      {showNotes && !isEmpty(address.notes) && (
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
              </>
            ) : (
              <Text
                tag='div'
                data-testid='Address-noAddress'
                weight={title == null ? 'bold' : undefined}
                variant={title != null ? 'info' : undefined}
              >
                {t('common.no_address')}
              </Text>
            )}
          </div>
          {onEdit != null && (
            <div>
              <Button
                variant='link'
                onClick={() => {
                  onEdit()
                }}
                data-testid='Address-editButton'
              >
                <PencilSimple weight='bold' />
              </Button>
            </div>
          )}
        </div>
      </>
    )
  }
)

Address.displayName = 'Address'
