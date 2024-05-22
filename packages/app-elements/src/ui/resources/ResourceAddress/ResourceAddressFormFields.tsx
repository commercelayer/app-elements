import { Grid } from '#ui/atoms/Grid'
import { withSkeletonTemplate } from '#ui/atoms/SkeletonTemplate'
import { Spacer } from '#ui/atoms/Spacer'
import { HookedInput } from '#ui/forms/Input/HookedInput'
import { type InputSelectValue } from '#ui/forms/InputSelect'
import { HookedInputSelect } from '#ui/forms/InputSelect/HookedInputSelect'
import { HookedInputTextArea } from '#ui/forms/InputTextArea'
import React, { useEffect, useState } from 'react'
import { useFormContext } from 'react-hook-form'
import { z } from 'zod'

const zodRequiredField = z
  .string({
    required_error: 'Required field',
    invalid_type_error: 'Invalid format'
  })
  .min(1, {
    message: 'Required field'
  })

export const resourceAddressFormFieldsSchema = z.object({
  first_name: z.string().nullish(),
  last_name: z.string().nullish(),
  company: z.string().nullish(),
  line_1: zodRequiredField,
  line_2: z.string().nullish(),
  city: zodRequiredField,
  zip_code: z.string().nullish(),
  state_code: zodRequiredField,
  country_code: zodRequiredField,
  phone: zodRequiredField,
  billing_info: z.string().nullish(),
  notes: z.string().nullish()
})

export interface ResourceAddressFormFieldsProps {
  name?: string
  showBillingInfo?: boolean
  showNotes?: boolean
}

export const ResourceAddressFormFields =
  withSkeletonTemplate<ResourceAddressFormFieldsProps>(
    ({ name, showBillingInfo = false, showNotes = true }) => {
      const namePrefix = name == null ? '' : `${name}.`

      return (
        <>
          <FieldRow columns='2'>
            <HookedInput name={`${namePrefix}first_name`} label='First name' />
            <HookedInput name={`${namePrefix}last_name`} label='Last name' />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name={`${namePrefix}company`} label='Company' />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name={`${namePrefix}line_1`} label='Address line 1' />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name={`${namePrefix}line_2`} label='Address line 2' />
          </FieldRow>

          <FieldRow columns='1'>
            <SelectCountry namePrefix={namePrefix} />
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name={`${namePrefix}city`} label='City' />
          </FieldRow>

          <FieldRow columns='1'>
            <div className='grid grid-cols-[2fr_1fr] gap-4'>
              <SelectStates namePrefix={namePrefix} />
              <HookedInput name={`${namePrefix}zip_code`} label='ZIP code' />
            </div>
          </FieldRow>

          <FieldRow columns='1'>
            <HookedInput name={`${namePrefix}phone`} label='Phone' />
          </FieldRow>

          {showBillingInfo && (
            <FieldRow columns='1'>
              <HookedInput
                name={`${namePrefix}billing_info`}
                label='Billing info'
              />
            </FieldRow>
          )}

          {showNotes && (
            <FieldRow columns='1'>
              <HookedInputTextArea
                name={`${namePrefix}notes`}
                label='Notes'
                rows={2}
              />
            </FieldRow>
          )}
        </>
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

const SelectCountry: React.FC<{ namePrefix: string }> = ({ namePrefix }) => {
  const [countries, setCountries] = useState<InputSelectValue[] | undefined>()
  const [forceTextInput, setForceTextInput] = useState(false)

  useEffect(() => {
    void fetch('https://data.commercelayer.app/assets/lists/countries.json')
      .then<InputSelectValue[]>(async (res) => await res.json())
      .then((data) => {
        setCountries(data)
      })
      .catch(() => {
        // error fetching states, fallback to text input
        setForceTextInput(true)
      })
  }, [])

  if (forceTextInput) {
    return <HookedInput name={`${namePrefix}country_code`} label='Country' />
  }

  return (
    <HookedInputSelect
      name={`${namePrefix}country_code`}
      label='Country'
      key={countries?.length}
      initialValues={countries ?? []}
      pathToValue='value'
      isLoading={countries == null}
    />
  )
}

const SelectStates: React.FC<{ namePrefix: string }> = ({ namePrefix }) => {
  const [states, setStates] = useState<InputSelectValue[] | undefined>()
  const { watch, setValue } =
    useFormContext<z.infer<typeof resourceAddressFormFieldsSchema>>()
  const [forceTextInput, setForceTextInput] = useState(false)

  const countryCode = watch('country_code')
  const stateCode = watch('state_code')
  const countryWithStates = ['US', 'IT']

  useEffect(() => {
    if (countryCode != null && countryWithStates.includes(countryCode)) {
      void fetch(
        `https://data.commercelayer.app/assets/lists/states/${countryCode}.json`
      )
        .then<InputSelectValue[]>(async (res) => await res.json())
        .then((data) => {
          setStates(data)
          if (data.find(({ value }) => value === stateCode) == null) {
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
    return <HookedInput name={`${namePrefix}state_code`} label='State code' />
  }

  return (
    <HookedInputSelect
      name={`${namePrefix}state_code`}
      label='State'
      key={`${countryCode}_${states?.length}`}
      initialValues={states ?? []}
      pathToValue='value'
      isLoading={states == null}
    />
  )
}
