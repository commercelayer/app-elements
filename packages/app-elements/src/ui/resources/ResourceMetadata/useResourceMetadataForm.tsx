import type { Metadata } from "@commercelayer/sdk"
import { zodResolver } from "@hookform/resolvers/zod"
import { type ReactNode, useEffect, useMemo, useState } from "react"
import { type UseFormReturn, useForm } from "react-hook-form"
import { useCoreApi, useCoreSdkProvider } from "#providers/CoreSdkProvider"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { HookedValidationApiError } from "#ui/forms/ReactHookForm"
import type { ResourceMetadataProps } from "./ResourceMetadata"
import {
  type KeyedMetadata,
  ResourceMetadataAddRowButton,
  ResourceMetadataFormFields,
  resourceMetadataFormFieldsSchema,
  toKeyedMetadata,
} from "./ResourceMetadataFormFields"

export interface UseResourceMetadataFormProps {
  resourceId: ResourceMetadataProps["resourceId"]
  resourceType: ResourceMetadataProps["resourceType"]
  /**
   * Whether the form is currently visible. The form starts over whenever this
   * flips to `true`, so a container that keeps it mounted across openings still
   * shows the metadata as they are now rather than what was last typed.
   */
  isOpen?: boolean
  /** Called once the resource has been updated */
  onSubmitted?: () => void
  /**
   * Called when the user gives up on the edit. Leaving it out drops the cancel
   * control, for a container that has a way out of its own.
   */
  onCancel?: () => void
}

interface ResourceMetadataFormHook {
  /** `react-hook-form` context, to be spread on a `FormProvider` around both slots */
  methods: UseFormReturn<any>
  /** Submit handler for the `<form>` hosting the fields (e.g. `Modal`'s `onSubmit`) */
  onSubmit: React.FormEventHandler<HTMLFormElement>
  /** The metadata rows, to be rendered in the scrollable area */
  fields: ReactNode
  /**
   * The controls that stay put while the rows scroll — add a row, cancel,
   * submit — plus the API error. To be rendered in the pinned area.
   */
  footer: ReactNode
}

/**
 * Builds the pieces of a `metadata` update form, leaving their placement to the
 * caller: `fields` and `footer` can go in separate containers — such as a
 * `Modal`'s `Body` and `Footer` — as long as a `FormProvider` spread with
 * `methods` wraps both and the enclosing `<form>` is given `onSubmit`.
 */
export function useResourceMetadataForm({
  resourceId,
  resourceType,
  isOpen = true,
  onSubmitted,
  onCancel,
}: UseResourceMetadataFormProps): ResourceMetadataFormHook {
  const {
    data: resourceData,
    isLoading,
    mutate: mutateResource,
  } = useCoreApi(resourceType, "retrieve", [
    resourceId,
    {
      fields: ["metadata"],
    },
  ])

  const [apiError, setApiError] = useState<any>(undefined)
  const { sdkClient } = useCoreSdkProvider()

  const keyedMetadata: KeyedMetadata[] = useMemo(() => {
    if (resourceData?.metadata != null) {
      const result = Object.entries(resourceData.metadata).map(
        ([metadataKey, metadataValue]) =>
          toKeyedMetadata(metadataKey, metadataValue),
      )

      if (result.length === 0) {
        result.push(toKeyedMetadata("", ""))
      }

      return result
    }
    return []
  }, [resourceData?.metadata])

  const methods = useForm({
    defaultValues: { metadata: keyedMetadata },
    resolver: zodResolver(resourceMetadataFormFieldsSchema),
  })

  // The resource is fetched while the form is already mounted, so the rows are
  // filled in by a reset rather than by `defaultValues` alone.
  useEffect(() => {
    if (isOpen) {
      methods.reset({ metadata: keyedMetadata })
      setApiError(undefined)
    }
  }, [isOpen, keyedMetadata])

  const handleSubmit = methods.handleSubmit(async (formValues) => {
    const sdkMetadata: Metadata = {}
    formValues.metadata?.forEach((m: KeyedMetadata) => {
      // a number input hands back a string, so an entry that came in as a number
      // is parsed back into one. The type is read off the row rather than off the
      // entries as they were read, which rows removed in the meantime would have
      // shifted out of step.
      if (m.valueType === "number") {
        sdkMetadata[m.key] = parseFloat(m.value as string)
      } else {
        sdkMetadata[m.key] = m.value
      }
    })

    await sdkClient[resourceType]
      .update(
        {
          id: resourceId,
          metadata: sdkMetadata,
        },
        {
          // @ts-expect-error "Expression produces a union type that is too complex to represent"
          fields: ["metadata"],
        },
      )
      .then(async (updatedResource) => {
        await mutateResource(updatedResource)
        onSubmitted?.()
      })
      .catch((error) => {
        setApiError(error)
      })
  })

  return {
    methods,
    onSubmit: (event) => {
      void handleSubmit(event)
    },
    fields: <ResourceMetadataFormFields isLoading={isLoading} />,
    footer: (
      <>
        <HookedValidationApiError apiError={apiError} />
        <div className="flex items-center justify-between gap-4">
          <ResourceMetadataAddRowButton isLoading={isLoading} />
          <div className="flex items-center gap-2">
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
              {`${t("common.update")} ${t("common.metadata").toLowerCase()}`}
            </Button>
          </div>
        </div>
      </>
    ),
  }
}
