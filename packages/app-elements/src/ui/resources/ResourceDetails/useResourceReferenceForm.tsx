import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactNode, useEffect, useState } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { getResourceEndpoint } from "#helpers/resources"
import { useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { HookedValidationApiError } from "#ui/forms/ReactHookForm"
import type { ResourceDetailsProps } from "./ResourceDetails"
import {
  ResourceReferenceFormFields,
  resourceReferenceFormFieldsSchema,
} from "./ResourceReferenceFormFields"

export interface UseResourceReferenceFormProps {
  resource: ResourceDetailsProps["resource"]
  /**
   * Whether the form is currently visible. The form starts over whenever this
   * flips to `true`, so a container that keeps it mounted across openings still
   * shows the reference as it is now rather than what was last typed.
   */
  isOpen?: boolean
  /** Called once the resource has been updated */
  onSubmitted?: () => void | Promise<void>
  /**
   * Called when the user gives up on the edit. Leaving it out drops the cancel
   * control, for a container that has a way out of its own.
   */
  onCancel?: () => void
}

interface ResourceReferenceFormHook {
  /** `react-hook-form` context, to be spread on a `FormProvider` around both slots */
  methods: UseFormReturn<any>
  /** Submit handler for the `<form>` hosting the fields (e.g. `Modal`'s `onSubmit`) */
  onSubmit: React.FormEventHandler<HTMLFormElement>
  /** The reference inputs, to be rendered in the scrollable area */
  fields: ReactNode
  /**
   * The controls that stay put while the fields scroll — cancel, submit — plus
   * the API error. To be rendered in the pinned area.
   */
  footer: ReactNode
}

/**
 * Builds the pieces of a `reference` / `reference_origin` update form, leaving
 * their placement to the caller: `fields` and `footer` can go in separate
 * containers — such as a `Modal`'s `Body` and `Footer` — as long as a
 * `FormProvider` spread with `methods` wraps both and the enclosing `<form>` is
 * given `onSubmit`.
 */
export function useResourceReferenceForm({
  resource,
  isOpen = true,
  onSubmitted,
  onCancel,
}: UseResourceReferenceFormProps): ResourceReferenceFormHook {
  const [apiError, setApiError] = useState<any>(undefined)
  const { sdkClient } = useCoreSdkProvider()

  const toFormValues = (): {
    reference: string | null | undefined
    reference_origin: string | null | undefined
  } => ({
    reference: resource.reference,
    reference_origin: resource.reference_origin,
  })

  const methods = useForm({
    defaultValues: toFormValues(),
    resolver: zodResolver(resourceReferenceFormFieldsSchema),
  })

  useEffect(() => {
    if (isOpen) {
      methods.reset(toFormValues())
      setApiError(undefined)
    }
  }, [isOpen])

  const handleSubmit = methods.handleSubmit(async (formValues) => {
    await sdkClient[getResourceEndpoint(resource.type)]
      .update({
        id: resource.id,
        reference: formValues.reference,
        reference_origin: formValues.reference_origin,
      })
      .then(async () => {
        await onSubmitted?.()
      })
      .catch((error: any) => {
        setApiError(error)
      })
  })

  return {
    methods,
    onSubmit: (event) => {
      void handleSubmit(event)
    },
    fields: <ResourceReferenceFormFields />,
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
            {`${t("common.update")} ${t("common.reference").toLowerCase()}`}
          </Button>
        </div>
        <HookedValidationApiError apiError={apiError} />
      </>
    ),
  }
}
