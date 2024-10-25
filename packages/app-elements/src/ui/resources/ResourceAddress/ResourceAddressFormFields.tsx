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
import { type ResourceAddressProps } from './ResourceAddress'

const zodRequiredField = z
  .string({
    required_error: 'Required field',
    invalid_type_error: 'Invalid format'
  })
  .min(1, {
    message: 'Required field'
  })

export const getResourceAddressFormFieldsSchema = ({
  requiresBillingInfo = false
  // eslint-disable-next-line @typescript-eslint/explicit-function-return-type
}: Pick<ResourceAddressProps, 'requiresBillingInfo'> = {}) =>
  z
    .object({
      business: z.boolean().nullish().default(false),
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
      billing_info: requiresBillingInfo
        ? zodRequiredField
        : z.string().nullish(),
      notes: z.string().nullish()
    })
    .superRefine((data, ctx) => {
      if (data.business === true) {
        if (data.company == null || data.company.length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['company'],
            message: 'Required field'
          })
        }
      } else {
        if (data.first_name == null || data.first_name.length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['first_name'],
            message: 'Required field'
          })
        }

        if (data.last_name == null || data.last_name.length === 0) {
          ctx.addIssue({
            code: 'custom',
            path: ['last_name'],
            message: 'Required field'
          })
        }
      }
    })

export interface ResourceAddressFormFieldsProps {
  /**
   * Optional namespace.
   * @example If you set `name="address"` then all input names will be prepended by `address.` (e.g. `address.first_name`).
   */
  name?: string
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
   * Determines whether to show only business fields (`company`) or non-business fields (`first_name` and `last_name`).
   *
   * When `business` is set to **`true`** the `first_name` and `last_name` fields are hidden.
   * When `business` is set to **`false`** the `company` field is hidden.
   *
   * @default false
   */
  showNameOrCompany?: boolean
}

export const ResourceAddressFormFields =
  withSkeletonTemplate<ResourceAddressFormFieldsProps>(
    ({
      name,
      showBillingInfo = false,
      showNotes = true,
      showNameOrCompany = false
    }) => {
      const namePrefix = name == null ? '' : `${name}.`
      const { watch } = useFormContext()

      const business = watch(`${namePrefix}business`) ?? false

      const isNameVisible =
        !showNameOrCompany || (showNameOrCompany && business === false)
      const isCompanyVisible =
        !showNameOrCompany || (showNameOrCompany && business === true)

      return (
        <>
          {isNameVisible && (
            <FieldRow columns='2'>
              <HookedInput
                name={`${namePrefix}first_name`}
                label='First name'
              />
              <HookedInput name={`${namePrefix}last_name`} label='Last name' />
            </FieldRow>
          )}

          {isCompanyVisible && (
            <FieldRow columns='1'>
              <HookedInput name={`${namePrefix}company`} label='Company' />
            </FieldRow>
          )}

          <FieldRow columns='1'>
            <div className='flex flex-col gap-2'>
              <HookedInput name={`${namePrefix}line_1`} label='Address' />
              <HookedInput name={`${namePrefix}line_2`} />
            </div>
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
    useFormContext<
      z.infer<ReturnType<typeof getResourceAddressFormFieldsSchema>>
    >()
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
