import React, { type JSX, useEffect, useRef, useState } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { t } from "#providers/I18NProvider"
import { Grid } from "#ui/atoms/Grid"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { HookedInput } from "#ui/forms/Input/HookedInput"
import type { InputSelectValue } from "#ui/forms/InputSelect"
import { HookedInputSelect } from "#ui/forms/InputSelect/HookedInputSelect"
import { HookedInputTextArea } from "#ui/forms/InputTextArea"
import { useCountryList } from "#ui/internals/useCountryList"
import type { ResourceAddressProps } from "./ResourceAddress"

const zodRequiredField = z
  .string({
    required_error: "Required field",
    invalid_type_error: "Invalid format",
  })
  .min(1, {
    message: "Required field",
  })

export const getResourceAddressFormFieldsSchema = ({
  requiresBillingInfo = false,
}: Pick<ResourceAddressProps, "requiresBillingInfo"> = {}) =>
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
      email: z.string().email().nullish(),
      phone: zodRequiredField,
      billing_info: requiresBillingInfo
        ? zodRequiredField
        : z.string().nullish(),
      notes: z.string().nullish(),
    })
    .superRefine((data, ctx) => {
      if (data.business === true) {
        if (data.company == null || data.company.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["company"],
            message: t("common.forms.required_field"),
          })
        }
      } else {
        if (data.first_name == null || data.first_name.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["first_name"],
            message: t("common.forms.required_field"),
          })
        }

        if (data.last_name == null || data.last_name.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["last_name"],
            message: t("common.forms.required_field"),
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
  /**
   * Optional setting to define if given `Address` `email` data is editable.
   * @default false
   */
  showEmail?: boolean
}

export const ResourceAddressFormFields =
  withSkeletonTemplate<ResourceAddressFormFieldsProps>(
    ({
      name,
      showBillingInfo = false,
      showNotes = true,
      showNameOrCompany = false,
      showEmail = false,
    }) => {
      const namePrefix = name == null ? "" : `${name}.`
      const { watch } = useFormContext()

      const business = watch(`${namePrefix}business`) ?? false

      const isNameVisible =
        !showNameOrCompany || (showNameOrCompany && business === false)
      const isCompanyVisible =
        !showNameOrCompany || (showNameOrCompany && business === true)

      return (
        <div className="flex flex-col gap-8">
          {isNameVisible && (
            <FieldRow columns="2">
              <HookedInput
                name={`${namePrefix}first_name`}
                label={t("resources.addresses.attributes.first_name")}
              />
              <HookedInput
                name={`${namePrefix}last_name`}
                label={t("resources.addresses.attributes.last_name")}
              />
            </FieldRow>
          )}

          {isCompanyVisible && (
            <FieldRow columns="1">
              <HookedInput
                name={`${namePrefix}company`}
                label={t("resources.addresses.attributes.company")}
              />
            </FieldRow>
          )}

          <FieldRow columns="1">
            <div className="flex flex-col gap-2">
              <HookedInput
                name={`${namePrefix}line_1`}
                label={t("resources.addresses.attributes.line_1")}
              />
              <HookedInput name={`${namePrefix}line_2`} />
            </div>
          </FieldRow>

          <FieldRow columns="1">
            <SelectCountry countryCodeName={`${namePrefix}country_code`} />
          </FieldRow>

          <FieldRow columns="1">
            <HookedInput
              name={`${namePrefix}city`}
              label={t("resources.addresses.attributes.city")}
            />
          </FieldRow>

          <FieldRow columns="1">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <SelectStates
                stateCodeName={`${namePrefix}state_code`}
                countryCodeName={`${namePrefix}country_code`}
              />
              <HookedInput
                name={`${namePrefix}zip_code`}
                label={t("resources.addresses.attributes.zip_code")}
              />
            </div>
          </FieldRow>

          {showEmail && (
            <FieldRow columns="1">
              <HookedInput name={`${namePrefix}email`} label={"Email"} />
            </FieldRow>
          )}

          <FieldRow columns="1">
            <HookedInput
              name={`${namePrefix}phone`}
              label={t("resources.addresses.attributes.phone")}
            />
          </FieldRow>

          {showBillingInfo && (
            <FieldRow columns="1">
              <HookedInput
                name={`${namePrefix}billing_info`}
                label={t("resources.addresses.attributes.billing_info")}
              />
            </FieldRow>
          )}

          {showNotes && (
            <FieldRow columns="1">
              <HookedInputTextArea
                name={`${namePrefix}notes`}
                label={t("resources.addresses.attributes.notes")}
                rows={2}
              />
            </FieldRow>
          )}
        </div>
      )
    },
  )

// Rows carry no spacing of their own: the gap lives on the container, so it
// only ever falls *between* rows — whichever ones the flags leave visible — and
// the last field sits flush with the bottom of whatever hosts the fields.
const FieldRow = ({
  children,
  columns,
}: {
  children: React.ReactNode
  columns: "1" | "2"
}): JSX.Element => {
  return <Grid columns={columns}>{children}</Grid>
}

// The two selects take their field paths already resolved, rather than a prefix
// to reapply: a path is then built in exactly one place, and no string inside
// these components can quietly miss the namespace the way `state_code` once did.
const SelectCountry: React.FC<{ countryCodeName: string }> = ({
  countryCodeName,
}) => {
  const [forceTextInput, setForceTextInput] = useState(false)
  const { countries, isLoading, error } = useCountryList()

  useEffect(() => {
    if (error != null) {
      // error fetching countries, fallback to text input
      setForceTextInput(true)
    }
  }, [error])

  if (forceTextInput) {
    return (
      <HookedInput
        name={countryCodeName}
        label={t("resources.addresses.attributes.country_code")}
      />
    )
  }

  return (
    <HookedInputSelect
      name={countryCodeName}
      label={t("resources.addresses.attributes.country_code")}
      key={countries?.length}
      initialValues={countries ?? []}
      pathToValue="value"
      isLoading={isLoading || countries == null}
    />
  )
}

const SelectStates: React.FC<{
  stateCodeName: string
  countryCodeName: string
}> = ({ stateCodeName, countryCodeName }) => {
  const [states, setStates] = useState<InputSelectValue[] | undefined>()
  const { watch, setValue, getValues } = useFormContext()
  const [forceTextInput, setForceTextInput] = useState(false)

  const countryCode: string | undefined = watch(countryCodeName)
  const stateCode: string | undefined = watch(stateCodeName)
  const countryWithStates = ["US", "IT"]
  // The country the form opened on: a state that isn't in its list is a custom
  // one the address already carries, not a leftover to be wiped.
  const initialCountryCode = useRef(countryCode)

  useEffect(() => {
    if (countryCode != null && countryWithStates.includes(countryCode)) {
      void fetch(
        `https://data.commercelayer.app/assets/lists/states/${countryCode}.json`,
      )
        .then<InputSelectValue[]>(async (res) => await res.json())
        .then((data) => {
          setStates(data)
          // read at response time: the effect's closure predates whatever the
          // user may have typed while the list was in flight
          const currentStateCode: string | undefined = getValues(stateCodeName)
          if (
            countryCode !== initialCountryCode.current &&
            data.find(({ value }) => value === currentStateCode) == null
          ) {
            // the country changed under it, so the previous state no longer applies
            setValue(stateCodeName, "")
          }
        })
        .catch(() => {
          // error fetching states, fallback to text input
          setForceTextInput(true)
        })
    }
  }, [countryCode])

  if (
    countryCode == null ||
    !countryWithStates.includes(countryCode) ||
    states?.length === 0 ||
    forceTextInput
  ) {
    return (
      <HookedInput
        name={stateCodeName}
        label={t("resources.addresses.attributes.state_code")}
      />
    )
  }

  // A custom state keeps its place in the list, so it shows as the selected
  // value and stays selectable after the user browses the other options.
  const options =
    states != null &&
    stateCode != null &&
    stateCode !== "" &&
    states.find(({ value }) => value === stateCode) == null
      ? [{ value: stateCode, label: stateCode }, ...states]
      : (states ?? [])

  return (
    <HookedInputSelect
      name={stateCodeName}
      label={t("resources.addresses.attributes.state_code")}
      key={`${countryCode}_${states?.length}`}
      initialValues={options}
      pathToValue="value"
      isCreatable
      isLoading={states == null}
    />
  )
}
