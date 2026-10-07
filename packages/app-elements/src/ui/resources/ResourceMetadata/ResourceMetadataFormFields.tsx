import { Fragment, type JSX } from "react"
import { useFormContext, useWatch } from "react-hook-form"
import { z } from "zod"
import { t } from "#providers/I18NProvider"
import { Button } from "#ui/atoms/Button"
import { Icon } from "#ui/atoms/Icon"
import { withSkeletonTemplate } from "#ui/atoms/SkeletonTemplate"
import { ListItem } from "#ui/composite/ListItem"
import { HookedInput } from "#ui/forms/Input"
import { HookedInputCheckbox } from "#ui/forms/InputCheckbox"
import { groupMetadataKeys, type UpdatableType, updatableTypes } from "./utils"

export const resourceMetadataFormFieldsSchema = z
  .object({
    metadata: z
      .object({
        key: z.string(),
        value: z.unknown(),
        /**
         * The type the value had when the resource was read, carried on the row
         * itself rather than looked up by position in the original entries:
         * removing a row shifts every row after it, so a lookup by index would
         * hand the survivors the type of the entry that used to sit there.
         *
         * `"other"` marks an entry this form cannot edit (an object, an array);
         * its row stays in the array, hidden, so the value survives the update.
         */
        valueType: z.enum([...updatableTypes, "other"]),
      })
      .array(),
  })
  .superRefine((data, ctx) => {
    const grouped = groupMetadataKeys(data.metadata)

    Object.entries(grouped).forEach(([_key, group]) => {
      if (group.count > 1) {
        group.indexes.forEach((index) => {
          ctx.addIssue({
            code: z.ZodIssueCode.custom,
            path: [`metadata.${index}.key`],
            message: "Key already used",
          })
        })
      }
    })
  })

export type KeyedMetadata = z.infer<
  typeof resourceMetadataFormFieldsSchema
>["metadata"][number]

/** Builds a form row out of a `metadata` entry, tagging it with its type */
export const toKeyedMetadata = (key: string, value: unknown): KeyedMetadata => {
  const valueType = typeof value

  return {
    key,
    value,
    valueType: updatableTypes.includes(valueType as UpdatableType)
      ? (valueType as UpdatableType)
      : "other",
  }
}

const editInputComponent = (
  metadata: KeyedMetadata,
  idx: number,
): JSX.Element | undefined => {
  switch (metadata.valueType) {
    case "string":
      return <HookedInput name={`metadata.${idx}.value`} />
    case "number":
      return (
        <HookedInput type="number" name={`metadata.${idx}.value`} step="any" />
      )
    case "boolean":
      return <HookedInputCheckbox name={`metadata.${idx}.value`} />
    default:
      return undefined
  }
}

/**
 * Appends an empty row to the `metadata` form values and focuses its key input.
 * Lives outside the rows so the control can be rendered apart from them — the
 * modal keeps it pinned in the footer while the rows scroll.
 */
function useAddMetadataRow(): () => void {
  const { control, setValue, setFocus } = useFormContext()
  const watchedMetadata: KeyedMetadata[] =
    useWatch({ control, name: "metadata" }) ?? []

  return () => {
    // A new array: `setValue` given the very same reference leaves the watch
    // returning what it already returned, so the row would never show up.
    const nextMetadata = [...watchedMetadata, toKeyedMetadata("", "")]
    setValue("metadata", nextMetadata)
    setTimeout(() => {
      setFocus(`metadata.${nextMetadata.length - 1}.key`, {
        shouldSelect: true,
      })
    }, 200)
  }
}

/**
 * The control that appends an empty `metadata` row. Reads the form through
 * context, so it can sit anywhere inside the `FormProvider` set up by
 * `useResourceMetadataForm` — in particular in a container of its own, away from
 * the rows it adds to.
 */
export const ResourceMetadataAddRowButton = withSkeletonTemplate(() => {
  const addNewRow = useAddMetadataRow()

  return (
    <Button
      variant="secondary"
      type="button"
      onClick={() => {
        addNewRow()
      }}
      size="small"
      alignItems="center"
    >
      <Icon name="plus" /> {t("common.add_another")}
    </Button>
  )
})

ResourceMetadataAddRowButton.displayName = "ResourceMetadataAddRowButton"

/**
 * The editable rows of a resource's `metadata`. Reads the form through context,
 * so it can sit anywhere inside the `FormProvider` set up by
 * `useResourceMetadataForm`.
 */
export const ResourceMetadataFormFields = withSkeletonTemplate(() => {
  const { control, setValue } = useFormContext()
  // `useWatch` rather than `methods.watch`: the subscription then belongs to
  // this component, so typing in a row re-renders the rows and not the whole
  // page hosting the modal
  const watchedMetadata: KeyedMetadata[] =
    useWatch({ control, name: "metadata" }) ?? []

  return (
    // the rows space themselves out here rather than through each `ListItem`'s
    // own padding, so the gap stays the same between any two of them
    <div className="flex flex-col gap-4">
      {watchedMetadata.map((metadata, idx) => {
        if (metadata.valueType === "other") {
          // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
          return <Fragment key={idx} />
        }

        return (
          <ListItem
            // biome-ignore lint/suspicious/noArrayIndexKey: Using index as key is acceptable here since items are static
            key={`metadata.${idx}`}
            alignItems="center"
            padding="none"
            borderStyle="none"
          >
            <div className="flex items-center justify-between gap-4">
              <HookedInput name={`metadata.${idx}.key`} />
              <div className="md:w-3/5">
                {editInputComponent(metadata, idx)}
              </div>
            </div>
            <Button
              aria-label={t("common.remove")}
              variant="secondary"
              type="button"
              // square, and as tall as the inputs it sits beside: `Button`'s own
              // `regular` size is 40px while an `Input` comes out at 44, which is
              // what `h-11` stands for throughout — the suffix slot inside
              // `Input`, the skeletons standing in for one. Forced, so it beats
              // the size class rather than depending on which of the two the
              // stylesheet happens to emit last.
              className="h-11! w-11!"
              onClick={() => {
                setValue(
                  "metadata",
                  watchedMetadata.filter((_, i) => i !== idx),
                )
              }}
            >
              <Icon name="trash" size={18} />
            </Button>
          </ListItem>
        )
      })}
    </div>
  )
})

ResourceMetadataFormFields.displayName = "ResourceMetadataFormFields"
