import React, { type JSX, useEffect, useState } from "react"
import { useFormContext } from "react-hook-form"
import { z } from "zod"
import { t } from "#providers/I18NProvider"
import { Grid } from "#ui/atoms/Grid"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { Spacer } from "#ui/atoms/Spacer"
import { HookedInput } from "#ui/forms/Input/HookedInput"
import type { InputSelectValue } from "#ui/forms/InputSelect"
import { HookedInputSelect } from "#ui/forms/InputSelect/HookedInputSelect"
import { HookedInputTextArea } from "#ui/forms/InputTextArea"
import { useCountryList } from "#ui/internals/useCountryList"
import type { ResourceAddressProps } from "./ResourceAddress"

const zodRequiredField = z
  .string({
    error: (iss) =>
      iss.input === undefined ? "Required field" : "Invalid format",
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
      phone: zodRequiredField,
      billing_info: z.string().nullish(),
      notes: z.string().nullish(),
    })
    .superRefine((data, ctx) => {
      if (requiresBillingInfo) {
        if (data.billing_info == null || data.billing_info.length === 0) {
          ctx.addIssue({
            code: "custom",
            path: ["billing_info"],
            message: t("common.forms.required_field"),
          })
        }
      }
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
}

export const ResourceAddressFormFields =
  withSkeletonTemplate<ResourceAddressFormFieldsProps>(
    ({
      name,
      showBillingInfo = false,
      showNotes = true,
      showNameOrCompany = false,
    }) => {
      const namePrefix = name == null ? "" : `${name}.`
      const { watch } = useFormContext()

      const business = watch(`${namePrefix}business`) ?? false

      const isNameVisible =
        !showNameOrCompany || (showNameOrCompany && business === false)
      const isCompanyVisible =
        !showNameOrCompany || (showNameOrCompany && business === true)

      return (
        <>
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
            <SelectCountry namePrefix={namePrefix} />
          </FieldRow>

          <FieldRow columns="1">
            <HookedInput
              name={`${namePrefix}city`}
              label={t("resources.addresses.attributes.city")}
            />
          </FieldRow>

          <FieldRow columns="1">
            <div className="grid grid-cols-[2fr_1fr] gap-4">
              <SelectStates namePrefix={namePrefix} />
              <HookedInput
                name={`${namePrefix}zip_code`}
                label={t("resources.addresses.attributes.zip_code")}
              />
            </div>
          </FieldRow>

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
        </>
      )
    },
  )

const FieldRow = ({
  children,
  columns,
}: {
  children: React.ReactNode
  columns: "1" | "2"
}): JSX.Element => {
  return (
    <Spacer bottom="8">
      <Grid columns={columns}>{children}</Grid>
    </Spacer>
  )
}

const SelectCountry: React.FC<{ namePrefix: string }> = ({ namePrefix }) => {
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
        name={`${namePrefix}country_code`}
        label={t("resources.addresses.attributes.country_code")}
      />
    )
  }

  return (
    <HookedInputSelect
      name={`${namePrefix}country_code`}
      label={t("resources.addresses.attributes.country_code")}
      key={countries?.length}
      initialValues={countries ?? []}
      pathToValue="value"
      isLoading={isLoading || countries == null}
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

  const countryCode = watch("country_code")
  const stateCode = watch("state_code")
  const countryWithStates = ["US", "IT"]

  useEffect(() => {
    if (countryCode != null && countryWithStates.includes(countryCode)) {
      void fetch(
        `https://data.commercelayer.app/assets/lists/states/${countryCode}.json`,
      )
        .then<InputSelectValue[]>(async (res) => await res.json())
        .then((data) => {
          setStates(data)
          if (data.find(({ value }) => value === stateCode) == null) {
            // reset state_code if not found in the list
            setValue("state_code", "")
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
    return (
      <HookedInput
        name={`${namePrefix}state_code`}
        label={t("resources.addresses.attributes.state_code")}
      />
    )
  }

  return (
    <HookedInputSelect
      name={`${namePrefix}state_code`}
      label={t("resources.addresses.attributes.state_code")}
      key={`${countryCode}_${states?.length}`}
      initialValues={states ?? []}
      pathToValue="value"
      isLoading={states == null}
    />
  )
}
