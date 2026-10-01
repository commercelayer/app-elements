import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactNode, useEffect, useState } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { HookedValidationApiError } from "#ui/forms/ReactHookForm/HookedValidationApiError"
import type { ResourceAddressProps } from "./ResourceAddress"
import {
  getResourceAddressFormFieldsSchema,
  ResourceAddressFormFields,
  type ResourceAddressFormFieldsProps,
} from "./ResourceAddressFormFields"

interface UseResourceAddressFormProps
  extends Omit<ResourceAddressFormFieldsProps, "name">,
    Pick<
      ResourceAddressProps,
      "address" | "onCreate" | "onUpdate" | "requiresBillingInfo"
    > {
  /**
   * Whether the form is currently visible. The form starts over whenever this
   * flips to `true`, so a container that keeps it mounted across openings still
   * shows the address as it is now rather than what was last typed.
   */
  isOpen?: boolean
  /**
   * Called when the user gives up on the edit. Leaving it out drops the cancel
   * control, for a container that has a way out of its own.
   */
  onCancel?: () => void
}

interface ResourceAddressFormHook {
  /** `react-hook-form` context, to be spread on a `FormProvider` around both slots */
  methods: UseFormReturn<any>
  /** Submit handler for the `<form>` hosting the fields (e.g. `Modal`'s `onSubmit`) */
  onSubmit: React.FormEventHandler<HTMLFormElement>
  /** The address fields, to be rendered in the scrollable area */
  fields: ReactNode
  /**
   * The controls that stay put while the fields scroll — cancel, submit — plus
   * the API error. To be rendered in the pinned area.
   */
  footer: ReactNode
}

/**
 * Builds the pieces of an address create/update form, leaving their placement to
 * the caller: `fields` and `footer` can go in separate containers — such as
 * a `Modal`'s `Body` and `Footer` — as long as a `FormProvider` spread with
 * `methods` wraps both and the enclosing `<form>` is given `onSubmit`.
 */
export function useResourceAddressForm({
  address,
  showBillingInfo = false,
  requiresBillingInfo = false,
  showNotes = true,
  onUpdate,
  onCreate,
  isOpen = true,
  onCancel,
}: UseResourceAddressFormProps): ResourceAddressFormHook {
  const methods = useForm({
    defaultValues: address ?? undefined,
    resolver: zodResolver(
      getResourceAddressFormFieldsSchema({ requiresBillingInfo }),
    ),
  })

  const [apiError, setApiError] = useState<any>()

  const { sdkClient } = useCoreSdkProvider()

  useEffect(() => {
    if (isOpen) {
      methods.reset(address ?? undefined)
      setApiError(undefined)
    }
  }, [isOpen])

  const handleSubmit = methods.handleSubmit(async (formValues) => {
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
  })

  return {
    methods,
    onSubmit: (event) => {
      void handleSubmit(event)
    },
    fields: (
      <ResourceAddressFormFields
        showBillingInfo={showBillingInfo}
        showNotes={showNotes}
      />
    ),
    footer: (
      <>
        <div className="flex items-center justify-end gap-2">
          {onCancel != null && (
            <Button
              variant="secondary"
              type="button"
              size="small"
              onClick={onCancel}
            >
              {t("common.cancel")}
            </Button>
          )}
          <Button
            type="submit"
            disabled={methods.formState.isSubmitting}
            size="small"
          >
            {address == null ? t("common.create") : t("common.update")}{" "}
            {t("resources.addresses.name")}
          </Button>
        </div>
        <HookedValidationApiError apiError={apiError} />
      </>
    ),
  }
}
