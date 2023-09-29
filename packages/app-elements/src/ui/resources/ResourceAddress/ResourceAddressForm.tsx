import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Countries } from '@ac-dev/countries-service'

import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Grid } from '#ui/atoms/Grid'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form/HookedForm'
import { HookedInput } from '#ui/forms/Input/HookedInput'
import { HookedInputSelect } from '#ui/forms/InputSelect/HookedInputSelect'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm/HookedValidationApiError'
import { type Address } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const zodString = z
  .string({
    required_error: 'Required field',
    invalid_type_error: 'Invalid format'
  })
  .min(1, {
    message: 'Required field'
  })

const addressFormSchema = z.object({
  first_name: zodString,
  last_name: zodString,
  company: z.optional(z.string()),
  line_1: zodString,
  line_2: z.optional(z.string()),
  city: zodString,
  zip_code: z.optional(z.string()),
  state_code: zodString,
  country_code: zodString,
  phone: zodString,
  billing_info: z.optional(z.string())
})

export type ResourceAddressFormValues = z.infer<typeof addressFormSchema>

interface ResourceAddressFormProps {
  address: Address
  showBillingInfo?: boolean
  onChange: (updatedAddress: Address) => void
}

export const ResourceAddressForm =
  withSkeletonTemplate<ResourceAddressFormProps>(
    ({ address, showBillingInfo = false, onChange }) => {
      const methods = useForm({
        defaultValues: address,
        resolver: zodResolver(addressFormSchema)
      })

      const [apiError, setApiError] = useState<any>()
      const [isSubmitting, setIsSubmitting] = useState(false)

      const { sdkClient } = useCoreSdkProvider()

      const countries = Countries.getCountries().map((country) => ({
        value: country.iso2,
        label: country.name
      }))

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
          <FieldRow columns='2'>
            <HookedInput name='first_name' label='First name' />
            <HookedInput name='last_name' label='Last name' />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name='company' label='Company' />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name='line_1' label='Address line 1' />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name='line_2' label='Address line 2' />
          </FieldRow>

          <FieldRow columns='2'>
            <HookedInput name='city' label='City' />
            <Grid columns='2'>
              <HookedInput name='zip_code' label='ZIP code' />
              <HookedInput name='state_code' label='State code' />
            </Grid>
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInputSelect
              name='country_code'
              label='Country'
              initialValues={countries}
              pathToValue='value'
            />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name='phone' label='Phone' />
          </FieldRow>

          {showBillingInfo && (
            <FieldRow columns='1'>
              <HookedInput name='billing_info' label='Billing info' />
            </FieldRow>
          )}

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

const FieldRow = ({
  children,
  columns
}: {
  children: React.ReactNode
  columns: '1' | '2'
}): JSX.Element => {
  return (
    <Spacer bottom='8'>
      <Grid columns={columns}>{children}</Grid>
    </Spacer>
  )
}
