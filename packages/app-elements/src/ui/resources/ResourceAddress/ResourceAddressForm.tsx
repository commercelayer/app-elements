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
  address: Address
  onChange: (updatedAddress: Address) => void
}

export const ResourceAddressForm =
  withSkeletonTemplate<ResourceAddressFormProps>(
    ({ address, showBillingInfo = false, onChange }) => {
      const methods = useForm({
        defaultValues: address,
        resolver: zodResolver(resourceAddressFormFieldsSchema)
      })

      const [apiError, setApiError] = useState<any>()
      const [isSubmitting, setIsSubmitting] = useState(false)

      const { sdkClient } = useCoreSdkProvider()

      return (
        <HookedForm
          {...methods}
          onSubmit={(formValues) => {
            setIsSubmitting(true)
            void sdkClient.addresses
              .update({ ...formValues, id: address.id })
              .then((updatedAddress) => {
                onChange(updatedAddress)
                setIsSubmitting(false)
              })
              .catch((error) => {
                setApiError(error)
                setIsSubmitting(false)
              })
          }}
        >
          <ResourceAddressFormFields showBillingInfo={showBillingInfo} />

          <Spacer top='14'>
            <Button type='submit' disabled={isSubmitting} className='w-full'>
              Update address
            </Button>
            <HookedValidationApiError apiError={apiError} />
          </Spacer>
        </HookedForm>
      )
    }
  )
