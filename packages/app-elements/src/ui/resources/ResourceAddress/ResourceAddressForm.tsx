import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { t } from '#providers/I18NProvider'
import { Button } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form/HookedForm'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm/HookedValidationApiError'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { type ResourceAddressProps } from './ResourceAddress'
import {
  ResourceAddressFormFields,
  getResourceAddressFormFieldsSchema,
  type ResourceAddressFormFieldsProps
} from './ResourceAddressFormFields'

interface ResourceAddressFormProps
  extends Omit<ResourceAddressFormFieldsProps, 'name'>,
    Pick<
      ResourceAddressProps,
      'address' | 'onCreate' | 'onUpdate' | 'requiresBillingInfo'
    > {}

export const ResourceAddressForm =
  withSkeletonTemplate<ResourceAddressFormProps>(
    ({
      address,
      showBillingInfo = false,
      requiresBillingInfo = false,
      showNotes = true,
      onUpdate,
      onCreate
    }) => {
      const methods = useForm({
        defaultValues: address ?? undefined,
        resolver: zodResolver(
          getResourceAddressFormFieldsSchema({ requiresBillingInfo })
        )
      })

      const [apiError, setApiError] = useState<any>()

      const { sdkClient } = useCoreSdkProvider()

      return (
        <HookedForm
          {...methods}
          onSubmit={async (formValues) => {
            if (address != null) {
              await sdkClient.addresses
                .update({ ...formValues, id: address.id })
                .then((address) => {
                  onUpdate?.(address)
                })
                .catch((error) => {
                  setApiError(error)
                })
            } else {
              await sdkClient.addresses
                .create({ ...formValues })
                .then((address) => {
                  onCreate?.(address)
                })
                .catch((error) => {
                  setApiError(error)
                })
            }
          }}
        >
          <ResourceAddressFormFields
            showBillingInfo={showBillingInfo}
            showNotes={showNotes}
          />

          <Spacer top='14'>
            <Button
              type='submit'
              disabled={methods.formState.isSubmitting}
              className='w-full'
            >
              {address == null ? t('common.create') : t('common.update')}{' '}
              {t('resources.addresses.name')}
            </Button>
            <Spacer top='2'>
              <HookedValidationApiError apiError={apiError} />
            </Spacer>
          </Spacer>
        </HookedForm>
      )
    }
  )
