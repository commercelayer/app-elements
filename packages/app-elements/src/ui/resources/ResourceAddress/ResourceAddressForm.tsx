import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form/HookedForm'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm/HookedValidationApiError'
import { type Address } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import {
  ResourceAddressFormFields,
  resourceAddressFormFieldsSchema,
  type ResourceAddressFormFieldsProps
} from './ResourceAddressFormFields'

interface ResourceAddressFormProps
  extends Omit<ResourceAddressFormFieldsProps, 'name'> {
  address?: Address | null | undefined
  onChange: (updatedAddress: Address) => void
  onCreate: (createdAddress: Address) => void
}

export const ResourceAddressForm =
  withSkeletonTemplate<ResourceAddressFormProps>(
    ({
      address,
      showBillingInfo = false,
      showNotes = true,
      onChange,
      onCreate
    }) => {
      const methods = useForm({
        defaultValues: address ?? undefined,
        resolver: zodResolver(resourceAddressFormFieldsSchema)
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
                  onChange(address)
                })
                .catch((error) => {
                  setApiError(error)
                })
            } else {
              await sdkClient.addresses
                .create({ ...formValues })
                .then((address) => {
                  onCreate(address)
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
              {address == null ? 'Create' : 'Update'} address
            </Button>
            <Spacer top='2'>
              <HookedValidationApiError apiError={apiError} />
            </Spacer>
          </Spacer>
        </HookedForm>
      )
    }
  )
