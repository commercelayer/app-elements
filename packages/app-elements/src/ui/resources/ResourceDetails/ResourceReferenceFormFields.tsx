import { z } from "zod"
import { t } from "#providers/I18NProvider"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { HookedInput } from "#ui/forms/Input"

export const resourceReferenceFormFieldsSchema = z.object({
  reference: z.string().nullish(),
  reference_origin: z.string().nullish(),
})

/**
 * The `reference` and `reference_origin` inputs of a resource. Reads the form
 * through context, so it can sit anywhere inside the `FormProvider` set up by
 * `useResourceReferenceForm`.
 */
export const ResourceReferenceFormFields = withSkeletonTemplate(() => {
  return (
    <div className="flex flex-col gap-6">
      <HookedInput name="reference" label={t("common.reference")} />
      <HookedInput
        name="reference_origin"
        label={t("common.reference_origin")}
      />
    </div>
  )
})

ResourceReferenceFormFields.displayName = "ResourceReferenceFormFields"
