import { useCoreSdkProvider } from '#providers/CoreSdkProvider'
import { Button } from '#ui/atoms/Button'
import { Grid } from '#ui/atoms/Grid'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedForm } from '#ui/forms/Form/HookedForm'
import { HookedInput } from '#ui/forms/Input/HookedInput'
import { type InputSelectValue } from '#ui/forms/InputSelect'
import { HookedInputSelect } from '#ui/forms/InputSelect/HookedInputSelect'
import { HookedInputTextArea } from '#ui/forms/InputTextArea'
import { HookedValidationApiError } from '#ui/forms/ReactHookForm/HookedValidationApiError'
import { type Address } from '@commercelayer/sdk'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm, useFormContext } from 'react-hook-form'
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
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  company: z.string().nullish(),
  line_1: zodString,
  line_2: z.string().nullish(),
  city: zodString,
  zip_code: z.string().nullish(),
  state_code: zodString,
  country_code: zodString,
  phone: zodString,
  billing_info: z.string().nullish(),
  notes: z.string().nullish()
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

          <FieldRow columns='1'>
            <SelectCountry />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name='city' label='City' />
          </FieldRow>

          <FieldRow columns='1'>
            <div className='grid grid-cols-[2fr_1fr] gap-4'>
              <SelectStates />
              <HookedInput name='zip_code' label='ZIP code' />
            </div>
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name='phone' label='Phone' />
          </FieldRow>

          {showBillingInfo && (
            <FieldRow columns='1'>
              <HookedInput name='billing_info' label='Billing info' />
            </FieldRow>
          )}

          <FieldRow columns='1'>
            <HookedInputTextArea name='notes' label='Notes' rows={2} />
          </FieldRow>

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

const SelectCountry: React.FC = () => {
  const [countries, setCountries] = useState<InputSelectValue[] | undefined>()
  const [forceTextInput, setForceTextInput] = useState(false)

  useEffect(() => {
    void fetch('https://data.commercelayer.app/assets/lists/countries.json')
      .then(async (res) => await res.json())
      .then((data) => {
        setCountries(data)
      })
      .catch(() => {
        // error fetching states, fallback to text input
        setForceTextInput(true)
      })
  }, [])

  if (forceTextInput) {
    return <HookedInput name='country_code' label='Country' />
  }

  return (
    <HookedInputSelect
      name='country_code'
      label='Country'
      key={countries?.length}
      initialValues={countries ?? []}
      pathToValue='value'
      isLoading={countries == null}
    />
  )
}

const SelectStates: React.FC = () => {
  const [states, setStates] = useState<InputSelectValue[] | undefined>()
  const { watch, setValue } = useFormContext<ResourceAddressFormValues>()
  const [forceTextInput, setForceTextInput] = useState(false)

  const countryCode = watch('country_code')
  const stateCode = watch('state_code')
  const countryWithStates = ['US', 'IT']

  useEffect(() => {
    if (countryCode != null && countryWithStates.includes(countryCode)) {
      void fetch(
        `https://data.commercelayer.app/assets/lists/states/${countryCode}.json`
      )
        .then(async (res) => await res.json())
        .then((data) => {
          setStates(data)
          if (
            data.find(
              ({ value }: { value: string; label: string }) =>
                value === stateCode
            ) == null
          ) {
            // reset state_code if not found in the list
            setValue('state_code', '')
          }
        })
        .catch(() => {
          // error fetching states, fallback to text input
          setForceTextInput(true)
        })
    }
  }, [countryCode])

  if (
    !countryWithStates.includes(countryCode) ||
    states?.length === 0 ||
    forceTextInput
  ) {
    return <HookedInput name='state_code' label='State code' />
  }

  return (
    <HookedInputSelect
      name='state_code'
      label='State'
      key={`${countryCode}_${states?.length}`}
      initialValues={states ?? []}
      pathToValue='value'
      isLoading={states == null}
    />
  )
}
